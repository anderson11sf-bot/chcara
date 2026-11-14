/* ============================================================================
 * portal3d.js — SESSÃO 2: CAVALO -> TERMINA ESCURECENDO -> PORTEIRA (120 FPS) -> VÍDEO AÉREO
 * ----------------------------------------------------------------------------
 * 1. 0.00 a 0.36: Cena do Cavalo (Fullscreen Cover)
 *    - 0.26 a 0.36: O cavalo TERMINA ESCURECENDO (fade to black total)
 * 2. 0.36 a 0.42: Entra a Porteira rústica na escuridão
 * 3. 0.42 a 0.72: Abertura da Porteira via Canvas Image Sequence a 120 FPS / 100 Hz
 *    - Renderização 2D acelerada por GPU direta, sem travas de seek de vídeo
 *    - LERP suave com amortecimento inercial orgânico
 * 4. 0.60 a 0.94: Vídeo Aéreo do Drone revelado atrás da porteira
 * 5. 0.94 a 1.00: Transição suave de saída para a Sessão 3
 * ==========================================================================*/

import { normalizar, clamp } from './utils.js';

// Elementos DOM
let horseScene = null;
let horseVideo = null;
let horseEscurecer = null;

let porteiraScene = null;
let porteiraCanvas = null;
let porteiraCtx = null;
let porteiraVideo = null;

let droneScene = null;
let droneVideo = null;
let btnSom = null;

let ativo = false;
let tocandoDrone = false;

// Configuração do Canvas de Imagens da Porteira (120 FPS / 100 Hz)
const TOTAL_FRAMES_PORTEIRA = 94;
const porteiraFrames = [];
let framesCarregados = 0;
let porteiraProgAlvo = 0;
let porteiraProgAtual = 0;
let porteiraLoopId = null;

function preCarregarPorteira() {
  for (let i = 1; i <= TOTAL_FRAMES_PORTEIRA; i++) {
    const num = String(i).padStart(3, '0');
    const img = new Image();
    img.decoding = 'async';
    img.src = `/media/porteira/p_${num}.webp`;
    img.onload = () => {
      framesCarregados++;
      if (i === 1 && porteiraCtx) {
        desenharFramePorteira(0);
      }
    };
    porteiraFrames.push(img);
  }
}

function desenharFramePorteira(idx) {
  if (!porteiraCanvas || !porteiraCtx) return;
  const img = porteiraFrames[idx];
  if (img && img.complete && img.naturalWidth > 0) {
    porteiraCtx.drawImage(img, 0, 0, porteiraCanvas.width, porteiraCanvas.height);
  }
}

function iniciarLoopPorteira() {
  if (porteiraLoopId) return;

  const loop = () => {
    if (!ativo) {
      porteiraLoopId = null;
      return;
    }

    // LERP exponencial com amortecimento fluido a 100Hz / 120Hz
    const diff = porteiraProgAlvo - porteiraProgAtual;
    if (Math.abs(diff) > 0.0004) {
      porteiraProgAtual += diff * 0.18;
    } else {
      porteiraProgAtual = porteiraProgAlvo;
    }

    const frameIdx = Math.min(TOTAL_FRAMES_PORTEIRA - 1, Math.max(0, Math.round(porteiraProgAtual * (TOTAL_FRAMES_PORTEIRA - 1))));
    desenharFramePorteira(frameIdx);

    porteiraLoopId = requestAnimationFrame(loop);
  };

  porteiraLoopId = requestAnimationFrame(loop);
}

/* Faixas da Timeline Coordenada */
const FASES = {
  // 1. Cavalo Fullscreen: 0.00 a 0.36 (escurecendo de 0.26 a 0.36)
  cavaloInicio:    0.00,
  cavaloEscurece: 0.26,
  cavaloFim:       0.36,

  // 2. Animação da Porteira: surge de 0.36 a 0.42, abre de 0.42 a 0.70, dissolve de 0.68 a 0.75
  porteiraEntra:   0.36,
  porteiraAbre:    0.42,
  porteiraTotal:   0.70,
  porteiraFim:     0.75,

  // 3. Vídeo Aéreo do Drone: surge de 0.60 a 0.72, auge até 0.94
  droneInicio:     0.60,
  droneAuge:       0.72,
  droneFim:        0.94,

  // 4. Saída suave para a Sessão 3
  saidaInicio:     0.94,
  saidaFim:        1.00
};

export function iniciarPortal3d() {
  horseScene = document.getElementById('sessao2-cavalo-scene');
  horseVideo = document.getElementById('sessao2-cavalo-video');
  horseEscurecer = document.getElementById('sessao2-cavalo-escurecer');

  porteiraScene = document.getElementById('sessao2-porteira-scene');
  porteiraCanvas = document.getElementById('sessao2-porteira-canvas');
  porteiraVideo = document.getElementById('sessao2-porteira-video');

  droneScene = document.getElementById('sessao2-drone-scene');
  droneVideo = document.getElementById('sessao2-drone-video');
  btnSom = document.getElementById('drone-video-som');

  if (!horseScene && !porteiraScene) return null;

  // Inicializa contexto de alta performance do Canvas 2D
  if (porteiraCanvas) {
    porteiraCtx = porteiraCanvas.getContext('2d', { alpha: false, desynchronized: true });
    porteiraCanvas.width = 1280;
    porteiraCanvas.height = 720;
    preCarregarPorteira();
  }

  // Configurações do vídeo do cavalo
  if (horseVideo) {
    horseVideo.muted = true;
    horseVideo.playsInline = true;
    horseVideo.setAttribute('playsinline', '');
    horseVideo.setAttribute('muted', '');
    horseVideo.removeAttribute('loop');
  }

  // Configurações do vídeo do drone
  if (droneVideo) {
    droneVideo.muted = true;
    droneVideo.playsInline = true;
    droneVideo.loop = true;
    droneVideo.setAttribute('playsinline', '');
    droneVideo.setAttribute('muted', '');
    droneVideo.setAttribute('loop', '');
  }

  // Alternância de áudio no vídeo do drone
  if (btnSom && droneVideo) {
    btnSom.addEventListener('click', (ev) => {
      ev.stopPropagation();
      droneVideo.muted = !droneVideo.muted;
      btnSom.setAttribute('aria-label', droneVideo.muted ? 'Ativar som' : 'Desativar som');
      btnSom.innerHTML = droneVideo.muted
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
    });
  }

  ativo = true;
  iniciarLoopPorteira();
  return { definirProgresso, destruir };
}

/**
 * Controla a Timeline Coordenada da Sessão 2 (progresso p de 0.0 a 1.0)
 * @param {number} p
 */
export function definirProgresso(p) {
  if (!ativo) return;
  const prog = clamp(p, 0, 1);

  // -------------------------------------------------------------------------
  // 1. CENA DO CAVALO: AVANÇA E TERMINA ESCURECENDO (0.00 a 0.36)
  // -------------------------------------------------------------------------
  if (horseScene && horseVideo) {
    if (prog <= FASES.cavaloFim) {
      horseScene.style.opacity = '1';

      // Termina escurecendo totalmente para o preto puro de 0.26 a 0.36
      if (horseEscurecer) {
        let opEscurecer = 0;
        if (prog >= FASES.cavaloEscurece) {
          opEscurecer = normalizar(prog, FASES.cavaloEscurece, FASES.cavaloFim);
        }
        horseEscurecer.style.opacity = Math.max(0, Math.min(1, opEscurecer)).toFixed(3);
      }

      // Scrubbing do vídeo do cavalo com o scroll
      const durCavalo = horseVideo.duration || 4.0;
      const tCavalo = clamp(normalizar(prog, FASES.cavaloInicio, FASES.cavaloEscurece), 0, 1);
      const tempoAlvoCavalo = Math.min(durCavalo, tCavalo * durCavalo);
      if (Math.abs(horseVideo.currentTime - tempoAlvoCavalo) > 0.08 && !horseVideo.seeking) {
        horseVideo.currentTime = tempoAlvoCavalo;
      }

      // Leve aproximação natural
      const escala = 1 + tCavalo * 0.04;
      horseVideo.style.transform = `scale(${escala.toFixed(3)})`;
    } else {
      horseScene.style.opacity = '0';
      if (!horseVideo.paused) horseVideo.pause();
    }
  }

  // -------------------------------------------------------------------------
  // 2. ANIMAÇÃO DA PORTEIRA: SURGE DA ESCURIDÃO E ABRE A 120 FPS / 100 HZ (0.36 a 0.75)
  // -------------------------------------------------------------------------
  if (porteiraScene) {
    if (prog >= FASES.porteiraEntra && prog <= FASES.porteiraFim) {
      // Opacidade: surge suavemente da escuridão (0.36 a 0.42), abre, e dissolve ao final (0.68 a 0.75)
      let opPorteira = 1;
      if (prog < FASES.porteiraAbre) {
        opPorteira = normalizar(prog, FASES.porteiraEntra, FASES.porteiraAbre);
      } else if (prog > FASES.droneAuge - 0.04) {
        opPorteira = 1 - normalizar(prog, FASES.droneAuge - 0.04, FASES.porteiraFim);
      }
      porteiraScene.style.opacity = Math.max(0, Math.min(1, opPorteira)).toFixed(3);

      // Scrubbing da abertura da porteira (0.0 = fechada, 1.0 = totalmente aberta)
      const tPorteira = clamp(normalizar(prog, FASES.porteiraAbre, FASES.porteiraTotal), 0, 1);
      porteiraProgAlvo = tPorteira;
    } else {
      porteiraScene.style.opacity = '0';
      if (prog < FASES.porteiraEntra) {
        porteiraProgAlvo = 0;
        porteiraProgAtual = 0;
      } else if (prog > FASES.porteiraFim) {
        porteiraProgAlvo = 1;
        porteiraProgAtual = 1;
      }
    }
  }

  // -------------------------------------------------------------------------
  // 3. VÍDEO DA VISÃO AÉREA DO DRONE (0.60 a 1.00) — REVELADO PELA PORTEIRA
  // -------------------------------------------------------------------------
  if (droneScene && droneVideo) {
    if (prog >= FASES.droneInicio && prog <= FASES.saidaFim) {
      // Opacidade: surge conforme as portas abrem (0.60 a 0.72)
      let opDrone = 1;
      if (prog < FASES.droneAuge) {
        opDrone = normalizar(prog, FASES.droneInicio, FASES.droneAuge);
      } else if (prog > FASES.saidaInicio) {
        opDrone = 1 - normalizar(prog, FASES.saidaInicio, FASES.saidaFim);
      }
      droneScene.style.opacity = Math.max(0, Math.min(1, opDrone)).toFixed(3);

      // Leve expansão cinematográfica
      const tExp = clamp(normalizar(prog, FASES.droneInicio, FASES.droneAuge), 0, 1);
      const escalaDrone = 0.96 + tExp * 0.04;
      droneVideo.style.transform = `scale(${escalaDrone.toFixed(3)})`;

      // Autoplay do vídeo de drone
      if (prog >= FASES.droneAuge - 0.05 && prog <= FASES.saidaInicio + 0.02) {
        if (!tocandoDrone) {
          const prom = droneVideo.play();
          if (prom !== undefined) {
            prom.then(() => { tocandoDrone = true; }).catch(() => {});
          }
        }
      }
    } else {
      droneScene.style.opacity = '0';
      if (tocandoDrone) {
        droneVideo.pause();
        tocandoDrone = false;
      }
    }
  }
}

export function destruir() {
  ativo = false;
  if (porteiraLoopId) {
    cancelAnimationFrame(porteiraLoopId);
    porteiraLoopId = null;
  }
  if (horseVideo) horseVideo.pause();
  if (droneVideo) droneVideo.pause();
}

export default { iniciarPortal3d, definirProgresso, destruir };
