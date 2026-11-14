/* ============================================================================
 * portal3d.js — TIMELINE COORDENADA: CAVALO FULLSCREEN -> PORTEIRA (SCROLL) -> VÍDEO AÉREO
 * ----------------------------------------------------------------------------
 * Ordem exata solicitada:
 * 1. 0.00 a 0.42: Cena do Cavalo da Sessão 2 (TELA INTEIRA, sem portal antes)
 *    - Reprodução sincronizada com a rolagem do visitante
 * 2. 0.40 a 0.74: Abertura da Porteira (No lugar do antigo portal)
 *    - Animação controlada 1:1 pelo scroll (scrubbing de progresso)
 *    - As portas de madeira rústica se abrem conforme o scroll desce
 * 3. 0.64 a 0.94: Vídeo Aéreo do Drone (drone-panorama-terreno.mp4)
 *    - Revelado pela abertura da porteira
 *    - Entra em cena cheia, em alta definição e reprodução contínua
 * 4. 0.94 a 1.00: Transição suave de saída para a Sessão 3
 * ==========================================================================*/

import { normalizar, clamp } from './utils.js';

// Elementos DOM
let horseScene = null;
let horseVideo = null;
let porteiraScene = null;
let porteiraVideo = null;
let droneScene = null;
let droneVideo = null;
let btnSom = null;

let ativo = false;
let tocandoDrone = false;

/* Faixas oficiais da Timeline Coordenada */
const FASES = {
  // 1. Cavalo Fullscreen (Início da Sessão 2)
  cavaloInicio:  0.00,
  cavaloAuge:    0.06,
  cavaloFim:     0.38,
  cavaloFadeFim: 0.45,

  // 2. Animação da Porteira (Substitui o antigo portal)
  porteiraEntra: 0.38,
  porteiraAbre:  0.44,
  porteiraTotal: 0.74,
  porteiraFim:   0.78,

  // 3. Vídeo da Visão Aérea do Drone (Revelado atrás da porteira)
  droneInicio:   0.62,
  droneAuge:     0.74,
  droneFim:      0.94,

  // 4. Saída suave para a Sessão 3
  saidaInicio:   0.94,
  saidaFim:      1.00
};

export function iniciarPortal3d() {
  horseScene = document.getElementById('sessao2-cavalo-scene');
  horseVideo = document.getElementById('sessao2-cavalo-video');

  porteiraScene = document.getElementById('sessao2-porteira-scene');
  porteiraVideo = document.getElementById('sessao2-porteira-video');

  droneScene = document.getElementById('sessao2-drone-scene');
  droneVideo = document.getElementById('sessao2-drone-video');
  btnSom = document.getElementById('drone-video-som');

  if (!horseScene && !porteiraScene) return null;

  // Configurações do vídeo do cavalo (controlado por scroll)
  if (horseVideo) {
    horseVideo.muted = true;
    horseVideo.playsInline = true;
    horseVideo.setAttribute('playsinline', '');
    horseVideo.setAttribute('muted', '');
    horseVideo.removeAttribute('loop');
  }

  // Configurações do vídeo da porteira (controlado por scroll)
  if (porteiraVideo) {
    porteiraVideo.muted = true;
    porteiraVideo.playsInline = true;
    porteiraVideo.setAttribute('playsinline', '');
    porteiraVideo.setAttribute('muted', '');
    porteiraVideo.removeAttribute('loop');
  }

  // Configurações do vídeo do drone (reprodução contínua ao ser revelado)
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
  // 1. CENA DO CAVALO EM TELA INTEIRA (0.00 a 0.45) — SEM PORTAL ANTES
  // -------------------------------------------------------------------------
  if (horseScene && horseVideo) {
    if (prog <= FASES.cavaloFadeFim) {
      horseScene.style.visibility = 'visible';

      // Opacidade: 1 até 0.38, depois transiciona para a porteira
      let opCavalo = 1;
      if (prog > FASES.cavaloFim) {
        opCavalo = 1 - normalizar(prog, FASES.cavaloFim, FASES.cavaloFadeFim);
      }
      horseScene.style.opacity = Math.max(0, Math.min(1, opCavalo)).toFixed(2);

      // Scrubbing do vídeo do cavalo com o scroll
      if (horseVideo.duration) {
        const tCavalo = normalizar(prog, FASES.cavaloInicio, FASES.cavaloFim);
        const tempoAlvo = Math.min(horseVideo.duration, tCavalo * horseVideo.duration);
        if (Math.abs(horseVideo.currentTime - tempoAlvo) > 0.12) {
          horseVideo.currentTime = tempoAlvo;
        }
      }

      // Leve aproximação natural
      const tZoom = clamp(normalizar(prog, FASES.cavaloInicio, FASES.cavaloFim), 0, 1);
      const escala = 1 + tZoom * 0.05;
      horseVideo.style.transform = `scale(${escala.toFixed(3)})`;
    } else {
      horseScene.style.opacity = '0';
      horseScene.style.visibility = 'hidden';
      if (!horseVideo.paused) horseVideo.pause();
    }
  }

  // -------------------------------------------------------------------------
  // 2. ANIMAÇÃO DA PORTEIRA (0.38 a 0.78) — SCROLL-DRIVEN, NO LUGAR DO PORTAL
  // -------------------------------------------------------------------------
  if (porteiraScene && porteiraVideo) {
    if (prog >= FASES.porteiraEntra && prog <= FASES.porteiraFim) {
      porteiraScene.style.visibility = 'visible';

      // Opacidade da porteira: entra suave de 0.38 a 0.44, permanece aberta, e dissolve de 0.72 a 0.78
      let opPorteira = 1;
      if (prog < FASES.porteiraAbre) {
        opPorteira = normalizar(prog, FASES.porteiraEntra, FASES.porteiraAbre);
      } else if (prog > FASES.droneAuge) {
        opPorteira = 1 - normalizar(prog, FASES.droneAuge, FASES.porteiraFim);
      }
      porteiraScene.style.opacity = Math.max(0, Math.min(1, opPorteira)).toFixed(2);

      // Scrubbing do vídeo da porteira com o scroll (portas se abrem!)
      if (porteiraVideo.duration) {
        const tPorteira = clamp(normalizar(prog, FASES.porteiraAbre, FASES.porteiraTotal), 0, 1);
        const tempoAlvo = tPorteira * porteiraVideo.duration;
        if (Math.abs(porteiraVideo.currentTime - tempoAlvo) > 0.10) {
          porteiraVideo.currentTime = tempoAlvo;
        }
      }
    } else {
      porteiraScene.style.opacity = '0';
      porteiraScene.style.visibility = 'hidden';
      if (!porteiraVideo.paused) porteiraVideo.pause();
    }
  }

  // -------------------------------------------------------------------------
  // 3. VÍDEO DA VISÃO AÉREA DO DRONE (0.62 a 1.00) — REVELADO PELA PORTEIRA
  // -------------------------------------------------------------------------
  if (droneScene && droneVideo) {
    if (prog >= FASES.droneInicio && prog <= FASES.saidaFim) {
      droneScene.style.visibility = 'visible';

      // Opacidade: surge conforme as portas abrem (0.62 a 0.74), mantendo-se até o final
      let opDrone = 1;
      if (prog < FASES.droneAuge) {
        opDrone = normalizar(prog, FASES.droneInicio, FASES.droneAuge);
      } else if (prog > FASES.saidaInicio) {
        opDrone = 1 - normalizar(prog, FASES.saidaInicio, FASES.saidaFim);
      }
      droneScene.style.opacity = Math.max(0, Math.min(1, opDrone)).toFixed(2);

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
      droneScene.style.visibility = 'hidden';
      if (tocandoDrone) {
        droneVideo.pause();
        tocandoDrone = false;
      }
    }
  }
}

export function destruir() {
  ativo = false;
  if (horseVideo) horseVideo.pause();
  if (porteiraVideo) porteiraVideo.pause();
  if (droneVideo) droneVideo.pause();
}

export default { iniciarPortal3d, definirProgresso, destruir };
