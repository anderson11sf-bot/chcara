/**
 * FrameLayer.js — Camada de Animação de Sequência de Imagens em Canvas
 * 
 * Funcionalidades:
 * - Suporta Modo 'section' (scroll local) e Modo 'global' (ping-pong contínuo)
 * - Carregamento em 2 passadas: Grosso (de 10 em 10) e Fino (vizinhos prioritários)
 * - Decodificação acelerada: fetch -> blob -> createImageBitmap (fallback Image.decode)
 * - Gerenciamento de memória: janela de ±40 frames no mobile com liberação de bitmaps
 * - Desenho cover pré-calculado no resize, sem layout thrashing
 * - Tolerância a falhas: busca o frame vizinho mais próximo se o desejado ainda não baixou
 */

export class FrameLayer {
  /**
   * @param {Object} opts
   * @param {string} opts.id - ID da animação no manifest ('hero', 'pomar', 'porteira', 'global')
   * @param {'section'|'global'} opts.mode - Modo de scroll
   * @param {HTMLCanvasElement} opts.canvas - Elemento canvas
   * @param {HTMLElement} [opts.wrapper] - Elemento wrapper (para modo section)
   * @param {number} [opts.wrapperHeightVh=350] - Altura do wrapper em vh (modo section)
   * @param {number} [opts.globalPassVh=200] - Distância em vh para uma ida completa (modo global)
   * @param {Object} [opts.manifestEntry] - Configurações do manifest (totalFrames, desktop, mobile)
   * @param {HTMLImageElement} [opts.fallbackImg] - Elemento img para fallback / LCP
   * @param {(progress: number, frameIndex: number, layer: FrameLayer) => void} [opts.onUpdate] - Callback de estado
   */
  constructor(opts) {
    this.id = opts.id;
    this.mode = opts.mode || 'section';
    this.canvas = opts.canvas;
    this.wrapper = opts.wrapper || null;
    this.wrapperHeightVh = opts.wrapperHeightVh || 350;
    this.globalPassVh = opts.globalPassVh || 200;
    this.manifest = opts.manifestEntry || null;
    this.fallbackImg = opts.fallbackImg || null;
    this.onUpdate = opts.onUpdate || null;

    this.ctx = null;
    this.totalFrames = this.manifest ? this.manifest.totalFrames : 100;
    this.frames = new Array(this.totalFrames).fill(null);
    this.loading = new Set();
    this.failed = new Set();
    this.retried = new Set();

    this.frameIndex = 0;
    this.lastDrawnIndex = -1;
    this.progress = 0;
    this.needsDraw = true;
    this.visible = false;
    this.isFullyCovering = false;
    this.occluded = false;
    this.wasOccluded = false;

    // Cache de layout
    this.top = 0;
    this.height = 0;

    // Parâmetros de desenho cover
    this.drawParams = { dx: 0, dy: 0, drawW: 0, drawH: 0 };
    this.isMobile = false;
    this.isReducedMotion = false;

    // Fila de carregamento fino
    this.fetchQueue = [];
    this.activeFetches = 0;
    this.maxConcurrentFetches = 5;
    this.coarseLoaded = false;
    this.initialLoadStarted = false;

    // Contadores para debug
    this.loadedCount = 0;
  }

  /**
   * Inicialização do contexto e verificação de acessibilidade
   */
  init() {
    if (!this.canvas) return;

    try {
      this.ctx = this.canvas.getContext('2d', {
        alpha: false,
        desynchronized: true
      });
      if (this.ctx) {
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
      }
    } catch (e) {
      console.warn(`[FrameLayer:${this.id}] Fallback para 2d padrão:`, e);
      this.ctx = this.canvas.getContext('2d');
    }

    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.isReducedMotion = mq.matches;
      mq.addEventListener?.('change', (e) => {
        this.isReducedMotion = e.matches;
        this.needsDraw = true;
      });
    }

    // Carregamento imediato do frame 0 (LCP crítico)
    this.loadSingleFrame(0, true).then(() => {
      this.draw();
    });

    // Se for Hero ou Global, inicia o pré-carregamento grosso imediatamente
    if (this.mode === 'global' || this.id === 'hero') {
      this.startInitialLoad();
    }
  }

  /**
   * Define o manifest da animação caso carregado assincronamente
   */
  setManifest(entry) {
    this.manifest = entry;
    if (entry && entry.totalFrames) {
      if (this.totalFrames !== entry.totalFrames) {
        this.totalFrames = entry.totalFrames;
        const oldFrames = this.frames;
        this.frames = new Array(this.totalFrames).fill(null);
        for (let i = 0; i < Math.min(oldFrames.length, this.totalFrames); i++) {
          this.frames[i] = oldFrames[i];
        }
      }
    }
    this.needsDraw = true;
  }

  /**
   * Inicia o carregamento de 2 passadas: Grosso (a cada 10) e depois Fino
   */
  startInitialLoad() {
    if (this.initialLoadStarted) return;
    this.initialLoadStarted = true;

    // Passada 1: Coarse (0, 10, 20, 30...)
    const coarseIndices = [];
    for (let i = 0; i < this.totalFrames; i += 10) {
      coarseIndices.push(i);
    }
    if ((this.totalFrames - 1) % 10 !== 0) {
      coarseIndices.push(this.totalFrames - 1);
    }

    // Enfileira coarse com prioridade máxima
    for (const idx of coarseIndices) {
      this.enqueueFrame(idx, true);
    }

    // Passada 2: restante dos frames
    for (let i = 0; i < this.totalFrames; i++) {
      if (i % 10 !== 0 && i !== this.totalFrames - 1) {
        this.enqueueFrame(i, false);
      }
    }

    this.processQueue();
  }

  /**
   * Constrói a URL do frame baseado em breakpoint mobile/desktop
   */
  getFrameUrl(index) {
    if (!this.manifest) {
      const pad = String(index + 1).padStart(4, '0');
      const folder = this.isMobile ? `${this.id}-m` : this.id;
      return `/frames/${folder}/f_${pad}.webp`;
    }

    const config = this.isMobile ? this.manifest.mobile : this.manifest.desktop;
    const pad = String(index + 1).padStart(4, '0');
    return config.path.replace('%04d', pad).replace('{index}', pad);
  }

  /**
   * Adiciona frame à fila de download
   */
  enqueueFrame(index, isPriority = false) {
    if (index < 0 || index >= this.totalFrames) return;
    if (this.frames[index] || this.loading.has(index)) return;

    const exists = this.fetchQueue.indexOf(index);
    if (exists !== -1) {
      if (isPriority) {
        this.fetchQueue.splice(exists, 1);
        this.fetchQueue.unshift(index);
      }
      return;
    }

    if (isPriority) {
      this.fetchQueue.unshift(index);
    } else {
      this.fetchQueue.push(index);
    }
  }

  /**
   * Reordena a fila priorizando os frames mais próximos ao frame atual
   */
  prioritizeNearFrames(centerIndex) {
    if (this.fetchQueue.length === 0) return;
    this.fetchQueue.sort((a, b) => {
      const distA = Math.abs(a - centerIndex);
      const distB = Math.abs(b - centerIndex);
      return distA - distB;
    });
    this.processQueue();
  }

  /**
   * Processa a fila de downloads com concorrência limitada (4-6)
   */
  processQueue() {
    while (this.activeFetches < this.maxConcurrentFetches && this.fetchQueue.length > 0) {
      const nextIdx = this.fetchQueue.shift();
      if (this.frames[nextIdx] || this.loading.has(nextIdx)) continue;
      this.activeFetches++;
      this.loadSingleFrame(nextIdx).finally(() => {
        this.activeFetches--;
        this.processQueue();
      });
    }
  }

  /**
   * Carrega e decodifica um único frame (fetch -> blob -> createImageBitmap)
   */
  async loadSingleFrame(index, immediate = false) {
    if (index < 0 || index >= this.totalFrames) return null;
    if (this.frames[index]) return this.frames[index];
    if (this.loading.has(index)) return null;

    this.loading.add(index);
    const url = this.getFrameUrl(index);

    try {
      let bitmap = null;
      if (typeof window !== 'undefined' && 'createImageBitmap' in window && typeof fetch === 'function') {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        bitmap = await createImageBitmap(blob);
      } else {
        bitmap = await new Promise((resolve, reject) => {
          const img = new Image();
          img.decoding = 'async';
          img.src = url;
          img.onload = () => resolve(img);
          img.onerror = reject;
        });
      }

      this.frames[index] = bitmap;
      this.loading.delete(index);
      this.loadedCount++;

      // Atualiza o desenho se este frame é o atual ou o mais próximo disponível
      if (this.frameIndex === index || this.lastDrawnIndex === -1) {
        this.needsDraw = true;
      }

      return bitmap;
    } catch (err) {
      this.loading.delete(index);

      // Tenta novamente uma vez antes de desistir
      if (!this.retried.has(index)) {
        this.retried.add(index);
        this.enqueueFrame(index, immediate);
      } else {
        this.failed.add(index);
      }
      return null;
    }
  }

  /**
   * Mobile: Limpeza de memória (Sliding Window ±40 frames)
   */
  pruneMemory(currentIndex) {
    if (!this.isMobile) return;

    const WINDOW = 40;
    const minKeep = currentIndex - WINDOW;
    const maxKeep = currentIndex + WINDOW;

    for (let i = 0; i < this.totalFrames; i++) {
      // Preserva sempre os frames grossos (a cada 10) e a janela ±40
      if (i % 10 === 0 || (i >= minKeep && i <= maxKeep)) continue;

      const bmp = this.frames[i];
      if (bmp) {
        if (typeof bmp.close === 'function') {
          bmp.close();
        }
        this.frames[i] = null;
        this.loadedCount = Math.max(0, this.loadedCount - 1);
      }
    }
  }

  /**
   * Recálculo de dimensões e parâmetros cover no resize
   */
  resize(cw, ch, dpr, isMobile) {
    this.isMobile = isMobile;
    if (!this.canvas) return;

    // Respeita limites de tamanho interno
    const maxInternalWidth = isMobile ? 1080 : 1920;
    const effectiveDpr = Math.min(2, dpr || 1);
    const targetW = Math.max(1, Math.min(maxInternalWidth, Math.round(cw * effectiveDpr)));
    const targetH = Math.max(1, Math.round(targetW * (Math.max(1, ch) / Math.max(1, cw))));

    if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
      this.canvas.width = targetW;
      this.canvas.height = targetH;
    }

    // Medidas nativas do frame
    const conf = this.manifest ? (isMobile ? this.manifest.mobile : this.manifest.desktop) : null;
    const imgW = conf?.width || (isMobile ? 720 : 1280);
    const imgH = conf?.height || (isMobile ? 1280 : 720);

    // Pré-calcula proporção "cover"
    const scale = Math.max(targetW / imgW, targetH / imgH);
    const drawW = Math.round(imgW * scale);
    const drawH = Math.round(imgH * scale);
    const dx = Math.round((targetW - drawW) / 2);
    const dy = Math.round((targetH - drawH) / 2);

    this.drawParams = { dx, dy, drawW, drawH };
    this.needsDraw = true;
  }

  /**
   * Atualização de estado por tick do ScrollEngine
   */
  update(scrollY, viewportH, stableViewportH) {
    if (this.isReducedMotion) {
      this.frameIndex = 0;
      this.progress = 0;
      return;
    }

    if (this.mode === 'section') {
      if (!this.wrapper) return;

      const top = this.top;
      const height = this.height;
      const scrollDist = height - stableViewportH;

      // Verifica se está dentro ou próximo da viewport
      if (scrollY < top - viewportH || scrollY > top + height) {
        this.visible = false;
        this.isFullyCovering = false;
        return;
      }

      this.visible = true;

      // Container cobre a tela inteira com position: sticky
      this.isFullyCovering = (scrollY >= top && scrollY <= top + scrollDist);

      const pRaw = scrollDist > 0 ? (scrollY - top) / scrollDist : 0;
      const progress = Math.min(1, Math.max(0, pRaw));
      this.progress = progress;

      const targetFrame = Math.min(this.totalFrames - 1, Math.max(0, Math.round(progress * (this.totalFrames - 1))));

      if (targetFrame !== this.frameIndex) {
        this.frameIndex = targetFrame;
        this.needsDraw = true;
        this.prioritizeNearFrames(targetFrame);
        this.pruneMemory(targetFrame);
      }

      if (this.onUpdate) {
        this.onUpdate(progress, this.frameIndex, this);
      }

    } else if (this.mode === 'global') {
      // Modo GLOBAL PING-PONG com onda triangular
      const justUnoccluded = this.wasOccluded && !this.occluded;
      this.wasOccluded = this.occluded;
      this.visible = !this.occluded;
      if (this.occluded) return;
      if (justUnoccluded) this.needsDraw = true;

      const N = this.totalFrames;
      const framesPorViewport = (N - 1) / (this.globalPassVh / 100);
      const pos = (scrollY / Math.max(1, stableViewportH)) * framesPorViewport;

      // Fórmula oficial: onda triangular contínua
      const period = 2 * (N - 1);
      const m = ((pos % period) + period) % period;
      const targetFrame = Math.round(m <= N - 1 ? m : period - m);

      this.progress = targetFrame / Math.max(1, N - 1);

      if (targetFrame !== this.frameIndex) {
        this.frameIndex = targetFrame;
        this.needsDraw = true;
        this.prioritizeNearFrames(targetFrame);
        this.pruneMemory(targetFrame);
      }

      if (this.onUpdate) {
        this.onUpdate(this.progress, this.frameIndex, this);
      }
    }
  }

  /**
   * Busca o frame carregado mais próximo do índice alvo
   */
  getBestFrame(targetIndex) {
    if (this.frames[targetIndex]) return this.frames[targetIndex];

    // Busca bidirecional para fora (vizinhos mais próximos)
    let dist = 1;
    const maxDist = Math.max(targetIndex, this.totalFrames - targetIndex);

    while (dist <= maxDist) {
      const prev = targetIndex - dist;
      if (prev >= 0 && this.frames[prev]) return this.frames[prev];

      const next = targetIndex + dist;
      if (next < this.totalFrames && this.frames[next]) return this.frames[next];

      dist++;
    }

    return null;
  }

  /**
   * Desenho do frame no canvas (apenas se mudou ou houve resize)
   */
  draw() {
    if (!this.ctx || !this.canvas) return;
    if (!this.visible && this.mode === 'section') return;
    if (this.occluded && this.mode === 'global') return;
    if (!this.needsDraw && this.frameIndex === this.lastDrawnIndex) return;

    const frameToDraw = this.getBestFrame(this.frameIndex);

    if (frameToDraw) {
      const { dx, dy, drawW, drawH } = this.drawParams;
      if (drawW > 0 && drawH > 0 && this.canvas.width > 0 && this.canvas.height > 0) {
        this.ctx.drawImage(frameToDraw, dx, dy, drawW, drawH);
        this.lastDrawnIndex = this.frameIndex;
        this.needsDraw = false;

        // Oculta a imagem de fallback se presente
        if (this.fallbackImg && this.fallbackImg.style.opacity !== '0') {
          this.fallbackImg.style.opacity = '0';
        }
      }
    }
  }
}
