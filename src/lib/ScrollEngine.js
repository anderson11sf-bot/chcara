/**
 * ScrollEngine.js — Motor Central de Scroll de Alta Performance (120 FPS / 100 Hz)
 * 
 * Regras arquiteturais estritas:
 * - UM ÚNICO loop requestAnimationFrame para o site inteiro
 * - window.scrollY lido UMA ÚNICA VEZ por tick, antes de qualquer escrita no DOM
 * - ZERO leitura de layout (offsetTop, getBoundingClientRect) dentro do tick
 * - Medidas de layout cacheadas e atualizadas apenas via ResizeObserver/fonts.ready
 * - Altura de viewport estável (lvh) ignorando flutuações de barra de endereço <= 150px
 * - Oclusão inteligente: pula o canvas global quando um wrapper de seção cobre a tela
 * - Overlay de debug ativado por ?debug=1 na URL
 */

export class ScrollEngine {
  constructor() {
    /** @type {import('./FrameLayer.js').FrameLayer[]} */
    this.layers = [];
    this.rafId = null;
    this.isRunning = false;
    this.lastScrollY = -1;

    // Viewport estável e dimensões
    this.viewportW = 0;
    this.viewportH = 0;
    this.stableViewportH = 0;
    this.dpr = 1;
    this.isMobile = false;

    // Cache de redimensionamento
    this.resizePending = false;
    this.lastResizeH = 0;
    this.lastResizeW = 0;

    // Modo Debug (?debug=1)
    this.isDebug = false;
    this.debugOverlay = null;
    this.fpsCount = 0;
    this.fpsLastTime = performance.now();
    this.currentFps = 60;

    // IntersectionObserver para lazy loading de layers de seção
    this.sectionObserver = null;
  }

  /**
   * Inicializa o motor
   */
  init() {
    if (typeof window === 'undefined') return;

    // Checa URL para modo debug
    try {
      const params = new URLSearchParams(window.location.search);
      this.isDebug = params.get('debug') === '1';
    } catch {
      this.isDebug = false;
    }

    if (this.isDebug) {
      this.createDebugOverlay();
    }

    // Medição inicial do viewport estável
    this.viewportW = window.innerWidth;
    this.viewportH = window.innerHeight;
    this.stableViewportH = window.innerHeight;
    this.lastResizeW = this.viewportW;
    this.lastResizeH = this.viewportH;
    this.dpr = window.devicePixelRatio || 1;
    this.isMobile = this.viewportW < 768;

    // Setup do IntersectionObserver para carregar frames quando próximo
    this.initObserver();

    // Eventos de redimensionamento e fontes
    this.bindEvents();

    // Inicia o loop mestre
    this.start();
  }

  /**
   * Registra uma camada de animação
   * @param {import('./FrameLayer.js').FrameLayer} layer
   */
  addLayer(layer) {
    this.layers.push(layer);
    layer.init();

    // Se for modo seção, observa visibilidade para carregar com folga de 2 viewports
    if (layer.mode === 'section' && layer.wrapper && this.sectionObserver) {
      this.sectionObserver.observe(layer.wrapper);
    }

    // Calcula medidas iniciais
    this.scheduleMeasurements();
  }

  /**
   * IntersectionObserver com rootMargin de 2 viewports para disparo antecipado de download
   */
  initObserver() {
    if (!('IntersectionObserver' in window)) return;

    this.sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const wrapper = entry.target;
          const layer = this.layers.find(l => l.wrapper === wrapper);
          if (layer && !layer.initialLoadStarted) {
            layer.startInitialLoad();
          }
        }
      });
    }, {
      root: null,
      rootMargin: '200% 0px 200% 0px',
      threshold: 0
    });
  }

  /**
   * Conecta ouvintes de eventos estruturais
   */
  bindEvents() {
    window.addEventListener('resize', () => this.handleResize(), { passive: true });
    window.addEventListener('orientationchange', () => this.scheduleMeasurements(true), { passive: true });

    // Recalcula após carregamento de fontes
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        this.scheduleMeasurements(true);
      });
    }

    // Observa mudanças de layout no corpo da página
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(() => {
        this.scheduleMeasurements();
      });
      ro.observe(document.body);
    }

    // Pausa e retomada no visibilitychange para economia de recursos
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else {
        this.scheduleMeasurements(true);
        this.start();
      }
    });
  }

  /**
   * Tratamento de resize com filtro para barra de endereço móvel
   */
  handleResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Celular: ignora redimensionamentos em que somente a altura oscila até 150px
    if (this.isMobile && w === this.lastResizeW && Math.abs(h - this.lastResizeH) <= 150) {
      // Atualiza o stableViewportH para o maior valor visto (lvh real)
      if (h > this.stableViewportH) {
        this.stableViewportH = h;
      }
      return;
    }

    this.lastResizeW = w;
    this.lastResizeH = h;
    this.viewportW = w;
    this.viewportH = h;
    this.stableViewportH = Math.max(this.stableViewportH, h);
    this.dpr = window.devicePixelRatio || 1;
    this.isMobile = w < 768;

    this.scheduleMeasurements(true);
  }

  /**
   * Agenda recálculo assíncrono de medidas sem layout thrashing
   */
  scheduleMeasurements(immediate = false) {
    if (this.resizePending && !immediate) return;
    this.resizePending = true;

    const measure = () => {
      this.resizePending = false;
      this.updateCachedMeasurements();
    };

    if (immediate) {
      measure();
    } else {
      requestAnimationFrame(measure);
    }
  }

  /**
   * Atualiza o cache de dimensões e posições de todos os wrappers
   */
  updateCachedMeasurements() {
    const scrollY = window.scrollY || window.pageYOffset || 0;

    for (const layer of this.layers) {
      if (layer.mode === 'section' && layer.wrapper) {
        const rect = layer.wrapper.getBoundingClientRect();
        layer.top = rect.top + scrollY;
        layer.height = rect.height;
      }

      // Notifica a layer das novas dimensões de canvas
      const cw = layer.canvas ? layer.canvas.clientWidth || this.viewportW : this.viewportW;
      const ch = layer.canvas ? layer.canvas.clientHeight || this.viewportH : this.viewportH;
      layer.resize(cw, ch, this.dpr, this.isMobile);
    }

    // Força atualização no próximo tick
    this.lastScrollY = -1;
  }

  /**
   * Inicia o loop de animação
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    const tick = (now) => {
      if (!this.isRunning) return;

      // 1. LEITURA ÚNICA DE SCROLL no início do frame
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const vh = this.viewportH;
      const stableVh = this.stableViewportH;

      // 2. Oclusão da animação global por containers sticky ativos
      let sectionCobrindoTela = false;
      for (const layer of this.layers) {
        if (layer.mode === 'section') {
          layer.update(scrollY, vh, stableVh);
          if (layer.isFullyCovering) {
            sectionCobrindoTela = true;
          }
        }
      }

      // 3. Atualiza layer global aplicando oclusão
      for (const layer of this.layers) {
        if (layer.mode === 'global') {
          layer.occluded = sectionCobrindoTela;
          layer.update(scrollY, vh, stableVh);
        }
      }

      // 4. DESENHO: Cada layer desenha se necessário
      for (const layer of this.layers) {
        layer.draw();
      }

      // 5. Atualização de métricas do modo debug
      if (this.isDebug) {
        this.updateDebugHud(now, scrollY);
      }

      this.lastScrollY = scrollY;
      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);
  }

  /**
   * Pausa o loop
   */
  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Cria HUD de debug no DOM
   */
  createDebugOverlay() {
    const el = document.createElement('div');
    el.id = 'scroll-engine-debug';
    el.style.cssText = `
      position: fixed;
      bottom: 12px;
      left: 12px;
      background: rgba(0, 0, 0, 0.88);
      color: #00FF88;
      font-family: Consolas, monospace;
      font-size: 11px;
      line-height: 1.4;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid rgba(0, 255, 136, 0.4);
      z-index: 999999;
      pointer-events: none;
      box-shadow: 0 4px 16px rgba(0,0,0,0.6);
      max-width: 90vw;
    `;
    document.body.appendChild(el);
    this.debugOverlay = el;
  }

  /**
   * Atualiza informações do HUD de debug
   */
  updateDebugHud(now, scrollY) {
    this.fpsCount++;
    if (now - this.fpsLastTime >= 500) {
      this.currentFps = Math.round((this.fpsCount * 1000) / (now - this.fpsLastTime));
      this.fpsCount = 0;
      this.fpsLastTime = now;
    }

    if (!this.debugOverlay) return;

    let html = `<div style="font-weight:bold;margin-bottom:4px;border-bottom:1px solid #333;padding-bottom:2px">
      ScrollEngine | FPS: ${this.currentFps} | scrollY: ${Math.round(scrollY)}px
    </div>`;

    for (const l of this.layers) {
      const status = l.mode === 'global'
        ? (l.occluded ? '<span style="color:#FF4444">OCLUSO</span>' : '<span style="color:#00FF88">ATIVO</span>')
        : (l.visible ? '<span style="color:#00FF88">VISIVEL</span>' : '<span style="color:#888888">OFFSCREEN</span>');

      html += `<div>
        [${l.id.toUpperCase()}] frame: ${l.frameIndex}/${l.totalFrames} | ${(l.progress * 100).toFixed(1)}% | carregados: ${l.loadedCount} | ${status}
      </div>`;
    }

    this.debugOverlay.innerHTML = html;
  }
}
