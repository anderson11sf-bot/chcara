/* ============================================================================
 * portal3d.js — TIMELINE COORDENADA DA SESSÃO 2
 * ----------------------------------------------------------------------------
 * 1. 0% a 60%: Cena do Cavalo (animacao 2 nova) com aproximação progressiva (zoom)
 * 2. 60% a 75%: Fechamento rápido do portal vegetal tridimensional (6 camadas)
 * 3. 75% a 100%: Abertura em perspectiva 3D revelando o vídeo aéreo de drone
 * ==========================================================================*/

import { normalizar, clamp } from './utils.js';

let horseScene = null;
let horseVideo = null;
let container = null;
let cenario = null;
let grupoEsq = null;
let grupoDir = null;
let plantasEsq = null;
let plantasDir = null;
let troncoEsq = null;
let troncoDir = null;
let costuraBrilho = null;
let videoFrame = null;
let droneVideo = null;
let btnSom = null;

let ativo = false;
let tocandoDrone = false;
let semMovimento = false;
let isMobile = false;

/* Faixas oficiais da Timeline Coordenada */
const FASES = {
  zoomInicio:   0.00,
  zoomFim:      0.60, // Zoom contínuo do cavalo
  fechaInicio:  0.58, // Introdução e fechamento rápido da porta
  fechaFim:     0.75, // Porta 100% fechada no centro
  abreInicio:   0.75, // Início da abertura tridimensional
  abreFim:      0.94, // Totalmente aberta revelando o drone
  saidaInicio:  0.95, // Transição suave para a Sessão 3
  saidaFim:     1.00
};

export function iniciarPortal3d() {
  horseScene = document.getElementById('sessao2-cavalo-scene');
  horseVideo = document.getElementById('sessao2-cavalo-video');
  container = document.getElementById('portal-abertura');
  cenario = document.getElementById('portal-vegetal-cenario');
  grupoEsq = document.getElementById('pv-grupo-esq');
  grupoDir = document.getElementById('pv-grupo-dir');
  plantasEsq = document.getElementById('pv-plantas-esq');
  plantasDir = document.getElementById('pv-plantas-dir');
  troncoEsq = document.getElementById('pv-tronco-esq');
  troncoDir = document.getElementById('pv-tronco-dir');
  costuraBrilho = document.getElementById('portal-costura-brilho');
  videoFrame = document.getElementById('portal-video-frame');
  droneVideo = document.getElementById('portal-video-3d');
  btnSom = document.getElementById('portal-video-som');

  if (!container || !droneVideo) return null;

  isMobile = window.innerWidth <= 768;
  semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
  }, { passive: true });

  // Configuração segura do vídeo do drone revelado atrás do portal
  droneVideo.muted = true;
  droneVideo.playsInline = true;
  droneVideo.setAttribute('playsinline', '');
  droneVideo.setAttribute('muted', '');

  // Configuração do vídeo do cavalo da sessão 2
  if (horseVideo) {
    horseVideo.muted = true;
    horseVideo.playsInline = true;
    horseVideo.setAttribute('playsinline', '');
    horseVideo.setAttribute('muted', '');
    horseVideo.play?.().catch(() => {});
  }

  // Alternância de áudio no vídeo do drone
  if (btnSom) {
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
 * Controla a Timeline Coordenada da Sessão 2 (p de 0.0 a 1.0)
 * @param {number} p
 */
export function definirProgresso(p) {
  if (!ativo || !container) return;

  const prog = clamp(p, 0, 1);

  // -------------------------------------------------------------------------
  // FASE 1: ZOOM PROGRESSIVO DO VÍDEO DO CAVALO (0% a 60%)
  // -------------------------------------------------------------------------
  if (horseVideo) {
    const tZoom = clamp(normalizar(prog, FASES.zoomInicio, FASES.zoomFim), 0, 1);
    // Escala progressiva diferenciada: desktop 1.0 a 1.35; mobile 1.0 a 1.48 (formato 9:16)
    const escalaMax = isMobile ? 1.48 : 1.35;
    const escalaAtual = 1 + tZoom * (escalaMax - 1);
    horseVideo.style.transform = `scale(${escalaAtual.toFixed(3)})`;

    // O cavalo vai desvanecendo quando o portal fecha completamente
    if (prog > FASES.fechaFim) {
      const opCavalo = Math.max(0, 1 - (prog - FASES.fechaFim) / 0.1);
      if (horseScene) horseScene.style.opacity = opCavalo.toFixed(2);
    } else {
      if (horseScene) horseScene.style.opacity = '1';
    }
  }

  // -------------------------------------------------------------------------
  // ATIVAÇÃO DO CONTAINER DO PORTAL (a partir de ~56% de scroll)
  // -------------------------------------------------------------------------
  if (prog < 0.56 || prog > 0.99) {
    if (container.dataset.ativo === 'true') {
      container.dataset.ativo = 'false';
    }
  } else {
    if (container.dataset.ativo !== 'true') {
      container.dataset.ativo = 'true';
    }
  }

  if (semMovimento) {
    if (prog >= FASES.abreInicio && prog <= FASES.saidaInicio) {
      if (!tocandoDrone && droneVideo) {
        droneVideo.play().catch(() => {});
        tocandoDrone = true;
      }
    } else {
      if (tocandoDrone && droneVideo) {
        droneVideo.pause();
        tocandoDrone = false;
      }
    }
    return;
  }

  // -------------------------------------------------------------------------
  // FASES 2 & 3: FECHAMENTO RÁPIDO (60% a 75%) E ABERTURA COM REVELAÇÃO (75% a 100%)
  // -------------------------------------------------------------------------
  let transX_Esq = -100;
  let transX_Dir = 100;
  let rotY_Esq = -35;
  let rotY_Dir = 35;
  let opacidadeCostura = 0;
  let escalaDrone = 0.92;
  let opacidadeDrone = 0.15;

  if (prog <= FASES.fechaFim) {
    // FECHAMENTO RÁPIDO DO PORTAL (60% a 75%)
    const tFecha = clamp(normalizar(prog, FASES.fechaInicio, FASES.fechaFim), 0, 1);
    const easeFecha = tFecha * tFecha * (3 - 2 * tFecha); // smoothstep

    // Portas deslizam e rotacionam rapidamente das bordas (-100%/+100%) até o centro (0%)
    transX_Esq = -100 * (1 - easeFecha);
    transX_Dir = 100 * (1 - easeFecha);
    rotY_Esq = -30 * (1 - easeFecha);
    rotY_Dir = 30 * (1 - easeFecha);

    // Brilho na costura central quando as duas portas se tocam perfeitamente
    opacidadeCostura = easeFecha > 0.85 ? (easeFecha - 0.85) / 0.15 : 0;
    escalaDrone = 0.92;
    opacidadeDrone = 0.2;
  } else {
    // ABERTURA TRIDIMENSIONAL DO PORTAL & REVELAÇÃO DO DRONE (75% a 100%)
    const tAbre = clamp(normalizar(prog, FASES.abreInicio, FASES.abreFim), 0, 1);
    const easeAbre = tAbre * tAbre * (3 - 2 * tAbre);

    // Portas abrem em perspectiva tridimensional com eixo nas extremidades
    transX_Esq = -105 * easeAbre;
    transX_Dir = 105 * easeAbre;
    rotY_Esq = -82 * easeAbre;
    rotY_Dir = 82 * easeAbre;

    // Costura luminosa some rapidamente logo que a porta começa a abrir
    opacidadeCostura = Math.max(0, 1 - easeAbre * 4);

    // Vídeo de drone ganha escala e opacidade total
    escalaDrone = 0.92 + easeAbre * 0.08;
    opacidadeDrone = Math.min(1, 0.2 + easeAbre * 0.8);
  }

  // Aplicação nos Grupos Tridimensionais (Porta + Plantas + Tronco)
  if (grupoEsq) {
    grupoEsq.style.transform = `translate3d(${transX_Esq.toFixed(2)}%, 0, 0) rotateY(${rotY_Esq.toFixed(1)}deg)`;
  }
  if (grupoDir) {
    grupoDir.style.transform = `translate3d(${transX_Dir.toFixed(2)}%, 0, 0) rotateY(${rotY_Dir.toFixed(1)}deg)`;
  }

  // Parallaxes independentes e sutis nas camadas de folhagens
  if (plantasEsq) {
    const pShift = prog <= FASES.fechaFim ? 0 : (prog - FASES.fechaFim) * 20;
    plantasEsq.style.transform = `translate3d(${(-pShift).toFixed(1)}px, 0, 26px)`;
  }
  if (plantasDir) {
    const pShift = prog <= FASES.fechaFim ? 0 : (prog - FASES.fechaFim) * 20;
    plantasDir.style.transform = `translate3d(${pShift.toFixed(1)}px, 0, 26px)`;
  }

  // Costura luminosa central
  if (costuraBrilho) {
    costuraBrilho.style.opacity = opacidadeCostura.toFixed(2);
  }

  // Quadro de vídeo de Drone
  if (videoFrame) {
    videoFrame.style.transform = `scale(${escalaDrone.toFixed(3)})`;
    videoFrame.style.opacity = opacidadeDrone.toFixed(2);
  }

  // Fade de saída suave para a Sessão 3
  if (prog > FASES.saidaInicio) {
    const tSaida = normalizar(prog, FASES.saidaInicio, FASES.saidaFim);
    container.style.opacity = Math.max(0, 1 - tSaida).toFixed(2);
  } else {
    container.style.opacity = '1';
  }

  // Controle de reprodução inteligente do vídeo de Drone
  if (prog >= FASES.abreInicio + 0.06 && prog <= FASES.saidaInicio + 0.02) {
    if (!tocandoDrone && droneVideo) {
      const prom = droneVideo.play();
      if (prom !== undefined) {
        prom.then(() => { tocandoDrone = true; }).catch(() => {});
      }
    }
  } else {
    if (tocandoDrone && droneVideo && (prog < FASES.abreInicio + 0.02 || prog > FASES.saidaFim)) {
      droneVideo.pause();
      tocandoDrone = false;
    }
  }
}

export function destruir() {
  ativo = false;
  if (droneVideo) droneVideo.pause();
  if (horseVideo) horseVideo.pause();
}

export default { iniciarPortal3d, definirProgresso, destruir };
