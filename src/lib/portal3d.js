/* ============================================================================
 * portal3d.js — TIMELINE COORDENADA DA SESSÃO 2 (5 CAMADAS EM ORDEM OBRIGATÓRIA)
 * ----------------------------------------------------------------------------
 * 1. 0.00 a 0.22: Player cinematográfico do cavalo (animacao 2 nova)
 *    - Centralizado, proporção 16:9, iluminação e sombreamento ambiente
 *    - Reprodução sincronizada com a rolagem (sem loop infinito)
 * 2. 0.22 a 0.50: Camada 1 — PORTA (Porta de correr) fecha e fecha o portal
 * 3. 0.50 a 0.72: Camada 1 — PORTA desliza lateralmente (translateX suave, sem rotateY)
 *                 Camada 2 — PLANTA abre progressivamente sincronizada
 * 4. 0.62 a 0.84: Camada 3 — TRONCO revelado em escala proporcional monumental
 * 5. 0.70 a 0.92: Camada 4 — CASA ÍRIS revelada em profundidade 3D
 * 6. 0.78 a 0.96: Camada 5 — FOLHAS em primeiro plano com paralaxe diferencial
 * 7. 0.94 a 1.00: Transição suave para a Sessão 3
 * ==========================================================================*/

import { normalizar, clamp } from './utils.js';

let horseScene = null;
let horseFrame = null;
let horseVideo = null;
let container = null;

// Camadas da Composição 3D
let portaEsq = null;
let portaDir = null;
let plantaEsq = null;
let plantaDir = null;
let troncoEsq = null;
let troncoDir = null;
let casaIris = null;
let folhaEsq = null;
let folhaDir = null;
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
  // 1. Player do cavalo
  cavaloInicio:   0.00,
  cavaloZoomFim:  0.20,
  cavaloFadeFim:  0.26,

  // 2. Fechamento das portas no centro
  fechaInicio:    0.24,
  fechaFim:       0.46,

  // 3. Abertura lateral das portas (Porta de correr) e abertura das plantas
  portaAbreInicio: 0.46,
  portaAbreFim:    0.72,
  plantaAbreInicio: 0.52,
  plantaAbreFim:   0.76,

  // 4. Troncos em escala total
  troncoInicio:   0.58,
  troncoFim:      0.82,

  // 5. Casa Íris em profundidade
  casaIrisInicio: 0.66,
  casaIrisFim:    0.88,

  // 6. Folhas em primeiro plano (paralaxe)
  folhasInicio:   0.72,
  folhasFim:      0.94,

  // 7. Saída suave para Sessão 3
  saidaInicio:    0.94,
  saidaFim:       1.00
};

export function iniciarPortal3d() {
  horseScene = document.getElementById('sessao2-cavalo-scene');
  horseFrame = document.getElementById('sessao2-player-frame');
  horseVideo = document.getElementById('sessao2-cavalo-video');
  container = document.getElementById('portal-abertura');

  // Camada 1: Portas de correr
  portaEsq = document.getElementById('pv-porta-esq');
  portaDir = document.getElementById('pv-porta-dir');
  costuraBrilho = document.getElementById('portal-costura-brilho');

  // Camada 2: Plantas
  plantaEsq = document.getElementById('pv-plantas-esq');
  plantaDir = document.getElementById('pv-plantas-dir');

  // Camada 3: Troncos
  troncoEsq = document.getElementById('pv-tronco-esq');
  troncoDir = document.getElementById('pv-tronco-dir');

  // Camada 4: Casa Íris & Vídeo de Drone
  casaIris = document.getElementById('pv-casa-iris');
  videoFrame = document.getElementById('portal-video-frame');
  droneVideo = document.getElementById('portal-video-3d');
  btnSom = document.getElementById('portal-video-som');

  // Camada 5: Folhas em primeiro plano
  folhaEsq = document.getElementById('pv-folha-esq');
  folhaDir = document.getElementById('pv-folha-dir');

  if (!container) return null;

  isMobile = window.innerWidth <= 768;
  semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
  }, { passive: true });

  // Configurações dos vídeos
  if (droneVideo) {
    droneVideo.muted = true;
    droneVideo.playsInline = true;
    droneVideo.setAttribute('playsinline', '');
    droneVideo.setAttribute('muted', '');
  }

  if (horseVideo) {
    horseVideo.muted = true;
    horseVideo.playsInline = true;
    horseVideo.setAttribute('playsinline', '');
    horseVideo.setAttribute('muted', '');
    // NÃO reproduz em loop infinito contínuo; controlado pelo scroll
    horseVideo.removeAttribute('loop');
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
 * Controla a Timeline Coordenada da Sessão 2 (progresso de 0.0 a 1.0)
 * @param {number} p
 */
export function definirProgresso(p) {
  if (!ativo || !container) return;

  const prog = clamp(p, 0, 1);

  // -------------------------------------------------------------------------
  // 1. PLAYER CINEMATOGRÁFICO DO CAVALO (0.00 a 0.26)
  // -------------------------------------------------------------------------
  if (horseVideo && horseScene) {
    if (prog <= FASES.cavaloFadeFim) {
      horseScene.style.opacity = '1';
      horseScene.style.visibility = 'visible';

      // Sincroniza o tempo do vídeo com o scroll suavemente (duração ~5.7s)
      const tCavalo = normalizar(prog, FASES.cavaloInicio, FASES.cavaloZoomFim);
      if (horseVideo.duration) {
        const tempoAlvo = Math.min(horseVideo.duration, tCavalo * horseVideo.duration);
        if (Math.abs(horseVideo.currentTime - tempoAlvo) > 0.15) {
          horseVideo.currentTime = tempoAlvo;
        }
      }

      // Zoom sutil e elegante dentro do player frame (sem esticar o quadro)
      const escalaZoom = 1 + tCavalo * 0.12;
      horseVideo.style.transform = `scale(${escalaZoom.toFixed(3)})`;

      // Fade-out suave ao entregar para a cena do portal
      if (prog > FASES.cavaloZoomFim) {
        const opCavalo = 1 - normalizar(prog, FASES.cavaloZoomFim, FASES.cavaloFadeFim);
        horseScene.style.opacity = Math.max(0, opCavalo).toFixed(2);
      }
    } else {
      horseScene.style.opacity = '0';
      horseScene.style.visibility = 'hidden';
      if (!horseVideo.paused) horseVideo.pause();
    }
  }

  // -------------------------------------------------------------------------
  // ATIVAÇÃO DO CONTAINER DO PORTAL (a partir de 22% de scroll)
  // -------------------------------------------------------------------------
  if (prog < 0.22 || prog > 0.99) {
    if (container.dataset.ativo === 'true') {
      container.dataset.ativo = 'false';
    }
  } else {
    if (container.dataset.ativo !== 'true') {
      container.dataset.ativo = 'true';
    }
  }

  if (semMovimento) {
    if (prog >= FASES.portaAbreInicio && prog <= FASES.saidaInicio) {
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
  // CAMADA 1: PORTA (PORTA DE CORRER — DESLIZA LATERALMENTE COM TRANSLATEX)
  // -------------------------------------------------------------------------
  let transX_PortaEsq = 0;
  let transX_PortaDir = 0;
  let opacidadeCostura = 0;

  if (prog <= FASES.fechaFim) {
    // Portas deslizam das laterais e se fecham no centro (0, 0)
    const tFecha = clamp(normalizar(prog, FASES.fechaInicio, FASES.fechaFim), 0, 1);
    const easeFecha = tFecha * tFecha * (3 - 2 * tFecha); // smoothstep
    transX_PortaEsq = -80 * (1 - easeFecha);
    transX_PortaDir = 80 * (1 - easeFecha);
    opacidadeCostura = easeFecha > 0.75 ? (easeFecha - 0.75) / 0.25 : 0;
  } else if (prog <= FASES.portaAbreFim) {
    // Portas deslizam lateralmente para fora (PORTA DE CORRER: translateX puro, sem rotateY)
    const tAbre = clamp(normalizar(prog, FASES.portaAbreInicio, FASES.portaAbreFim), 0, 1);
    const easeAbre = tAbre * tAbre * (3 - 2 * tAbre);
    transX_PortaEsq = -105 * easeAbre;
    transX_PortaDir = 105 * easeAbre;
    opacidadeCostura = Math.max(0, 1 - easeAbre * 3.5);
  } else {
    // Portas totalmente abertas fora da tela
    transX_PortaEsq = -105;
    transX_PortaDir = 105;
    opacidadeCostura = 0;
  }

  if (portaEsq) portaEsq.style.transform = `translateX(${transX_PortaEsq.toFixed(2)}%)`;
  if (portaDir) portaDir.style.transform = `translateX(${transX_PortaDir.toFixed(2)}%)`;
  if (costuraBrilho) costuraBrilho.style.opacity = opacidadeCostura.toFixed(2);

  // -------------------------------------------------------------------------
  // CAMADA 2: PLANTA (SEGUNDA CAMADA — SINCRONIZADA À PORTA)
  // -------------------------------------------------------------------------
  let transX_PlantaEsq = 0;
  let transX_PlantaDir = 0;

  if (prog <= FASES.plantaAbreInicio) {
    transX_PlantaEsq = 0;
    transX_PlantaDir = 0;
  } else if (prog <= FASES.plantaAbreFim) {
    const tPlanta = clamp(normalizar(prog, FASES.plantaAbreInicio, FASES.plantaAbreFim), 0, 1);
    const easePlanta = tPlanta * tPlanta * (3 - 2 * tPlanta);
    transX_PlantaEsq = -55 * easePlanta;
    transX_PlantaDir = 55 * easePlanta;
  } else {
    transX_PlantaEsq = -55;
    transX_PlantaDir = 55;
  }

  if (plantaEsq) plantaEsq.style.transform = `translateX(${transX_PlantaEsq.toFixed(2)}%)`;
  if (plantaDir) plantaDir.style.transform = `translateX(${transX_PlantaDir.toFixed(2)}%)`;

  // -------------------------------------------------------------------------
  // CAMADA 3: TRONCO (ESCALA MONUMENTAL, LATERAL PROPORCIONAL)
  // -------------------------------------------------------------------------
  let escalaTronco = 1.0;
  let shiftTroncoEsq = 0;
  let shiftTroncoDir = 0;

  if (prog >= FASES.troncoInicio) {
    const tTronco = clamp(normalizar(prog, FASES.troncoInicio, FASES.troncoFim), 0, 1);
    const easeTronco = tTronco * tTronco * (3 - 2 * tTronco);
    escalaTronco = 1.0 + easeTronco * 0.08;
    shiftTroncoEsq = -18 * easeTronco;
    shiftTroncoDir = 18 * easeTronco;
  }

  if (troncoEsq) troncoEsq.style.transform = `translateX(${shiftTroncoEsq.toFixed(1)}px) scale(${escalaTronco.toFixed(3)})`;
  if (troncoDir) troncoDir.style.transform = `translateX(${shiftTroncoDir.toFixed(1)}px) scale(${escalaTronco.toFixed(3)})`;

  // -------------------------------------------------------------------------
  // CAMADA 4: CASA ÍRIS (ARQUITETURA REVELADA EM PROFUNDIDADE)
  // -------------------------------------------------------------------------
  let opacidadeCasa = 0;
  let escalaCasa = 0.88;

  if (prog >= FASES.casaIrisInicio) {
    const tCasa = clamp(normalizar(prog, FASES.casaIrisInicio, FASES.casaIrisFim), 0, 1);
    const easeCasa = tCasa * tCasa * (3 - 2 * tCasa);
    opacidadeCasa = easeCasa;
    escalaCasa = 0.88 + easeCasa * 0.12;
  }

  if (casaIris) {
    casaIris.style.opacity = opacidadeCasa.toFixed(2);
    casaIris.style.transform = `translateZ(-80px) scale(${escalaCasa.toFixed(3)})`;
  }

  // -------------------------------------------------------------------------
  // CAMADA 5: FOLHAS (PRIMEIRO PLANO COM PARALAXE DIFERENCIAL)
  // -------------------------------------------------------------------------
  let shiftFolhaEsq = 0;
  let shiftFolhaDir = 0;
  let opacidadeFolhas = 0.85;

  if (prog >= FASES.folhasInicio) {
    const tFolhas = clamp(normalizar(prog, FASES.folhasInicio, FASES.folhasFim), 0, 1);
    const easeFolhas = tFolhas * tFolhas * (3 - 2 * tFolhas);
    shiftFolhaEsq = -35 * easeFolhas;
    shiftFolhaDir = 35 * easeFolhas;
    opacidadeFolhas = 0.85 + easeFolhas * 0.15;
  }

  if (folhaEsq) folhaEsq.style.transform = `translateX(${shiftFolhaEsq.toFixed(1)}px) translateY(${(shiftFolhaEsq * 0.25).toFixed(1)}px)`;
  if (folhaDir) folhaDir.style.transform = `translateX(${shiftFolhaDir.toFixed(1)}px) translateY(${(-shiftFolhaDir * 0.25).toFixed(1)}px)`;

  // -------------------------------------------------------------------------
  // 7. TRANSIÇÃO DE SAÍDA SUAVE PARA SESSÃO 3
  // -------------------------------------------------------------------------
  if (prog > FASES.saidaInicio) {
    const tSaida = normalizar(prog, FASES.saidaInicio, FASES.saidaFim);
    container.style.opacity = Math.max(0, 1 - tSaida).toFixed(2);
  } else {
    container.style.opacity = '1';
  }

  // Controle inteligente de áudio e vídeo do drone
  if (prog >= FASES.casaIrisInicio && prog <= FASES.saidaInicio + 0.02) {
    if (!tocandoDrone && droneVideo) {
      const prom = droneVideo.play();
      if (prom !== undefined) {
        prom.then(() => { tocandoDrone = true; }).catch(() => {});
      }
    }
  } else {
    if (tocandoDrone && droneVideo && (prog < FASES.casaIrisInicio || prog > FASES.saidaFim)) {
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
