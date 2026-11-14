/* ============================================================================
 * portal3d.js — TIMELINE COORDENADA: PORTEIRA, CENA 2 FULLSCREEN & VÍDEO AÉREO
 * ----------------------------------------------------------------------------
 * 1. 0.00 a 0.18: Transição da Porteira
 *    - Vídeo da porteira abrindo (porteira-abertura.mp4)
 *    - Conforme abre, a Sessão 2 entra em tela inteira suavemente
 * 2. 0.08 a 0.48: Cena 2 do Cavalo em TELA INTEIRA (Fullscreen)
 *    - Reprodução sincronizada com a rolagem do visitante
 *    - Ocupa a área inteira da tela sem moldura de player
 * 3. 0.46 a 0.62: Fechamento das Portas de Correr do Portal Vegetal 3D
 * 4. 0.60 a 0.86: Abertura Lateral das Portas (translateX) + Plantas sincronizadas
 * 5. 0.66 a 0.94: Revelação do VÍDEO DA VISÃO AÉREA DO DRONE (drone-panorama-terreno)
 * 6. 0.72 a 0.96: Grandes troncos monumentais + Folhas em 1º plano com paralaxe 3D
 * 7. 0.94 a 1.00: Transição suave para a Sessão 3
 * ==========================================================================*/

import { normalizar, clamp } from './utils.js';

// Transição da Porteira
let porteiraEl = null;
let porteiraVideo = null;

// Cena do Cavalo (Tela Inteira)
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
let videoFrame = null;
let droneVideo = null;
let btnSom = null;
let folhaEsq = null;
let folhaDir = null;
let costuraBrilho = null;

let ativo = false;
let tocandoDrone = false;
let semMovimento = false;
let isMobile = false;

/* Faixas oficiais da Timeline Coordenada */
const FASES = {
  // 1. Porteira
  porteiraInicio: 0.00,
  porteiraAbre:   0.14,
  porteiraFim:    0.20,

  // 2. Cavalo Fullscreen
  cavaloInicio:   0.08,
  cavaloAuge:     0.20,
  cavaloFim:      0.44,
  cavaloFadeFim:  0.50,

  // 3. Fechamento das portas do portal
  fechaInicio:    0.46,
  fechaFim:       0.60,

  // 4. Abertura lateral das portas (Porta de correr) e plantas
  portaAbreInicio: 0.60,
  portaAbreFim:    0.84,
  plantaAbreInicio: 0.64,
  plantaAbreFim:   0.86,

  // 5. Troncos monumentais
  troncoInicio:   0.66,
  troncoFim:      0.88,

  // 6. Vídeo da Visão Aérea do Drone (Atrás do Portal)
  droneInicio:    0.66,
  droneFim:       0.94,

  // 7. Folhas em primeiro plano (paralaxe)
  folhasInicio:   0.70,
  folhasFim:      0.95,

  // 8. Saída suave para Sessão 3
  saidaInicio:    0.94,
  saidaFim:       1.00
};

export function iniciarPortal3d() {
  porteiraEl = document.getElementById('porteira-transicao');
  porteiraVideo = document.getElementById('porteira-video');

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

  // Camada 4: Vídeo de Drone da Visão Aérea
  videoFrame = document.getElementById('portal-video-frame');
  droneVideo = document.getElementById('portal-video-3d');
  btnSom = document.getElementById('portal-video-som');

  // Camada 5: Folhas em primeiro plano
  folhaEsq = document.getElementById('pv-folha-esq');
  folhaDir = document.getElementById('pv-folha-dir');

  if (!container && !horseScene) return null;

  isMobile = window.innerWidth <= 768;
  semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
  }, { passive: true });

  // Configurações do vídeo da porteira
  if (porteiraVideo) {
    porteiraVideo.muted = true;
    porteiraVideo.playsInline = true;
    porteiraVideo.setAttribute('playsinline', '');
    porteiraVideo.setAttribute('muted', '');
  }

  // Configurações do vídeo do cavalo (controlado por scroll)
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
    droneVideo.setAttribute('playsinline', '');
    droneVideo.setAttribute('muted', '');
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
  if (!ativo) return;

  const prog = clamp(p, 0, 1);

  // -------------------------------------------------------------------------
  // 1. TRANSIÇÃO DA PORTEIRA (0.00 a 0.20)
  // -------------------------------------------------------------------------
  if (porteiraEl) {
    if (prog <= FASES.porteiraFim) {
      porteiraEl.dataset.ativa = 'true';
      porteiraEl.style.visibility = 'visible';

      // Sincroniza o vídeo da porteira abrindo
      if (porteiraVideo && porteiraVideo.duration) {
        const tPorteira = clamp(normalizar(prog, FASES.porteiraInicio, FASES.porteiraAbre), 0, 1);
        const tempoAlvo = tPorteira * porteiraVideo.duration;
        if (Math.abs(porteiraVideo.currentTime - tempoAlvo) > 0.12) {
          porteiraVideo.currentTime = tempoAlvo;
        }
      }

      // Fade-out suave enquanto a Sessão 2 entra por baixo
      if (prog > FASES.porteiraAbre) {
        const opPorteira = 1 - normalizar(prog, FASES.porteiraAbre, FASES.porteiraFim);
        porteiraEl.style.opacity = Math.max(0, opPorteira).toFixed(2);
      } else {
        porteiraEl.style.opacity = '1';
      }
    } else {
      porteiraEl.dataset.ativa = 'false';
      porteiraEl.style.opacity = '0';
      porteiraEl.style.visibility = 'hidden';
    }
  }

  // -------------------------------------------------------------------------
  // 2. CENA DO CAVALO EM TELA INTEIRA (0.08 a 0.50)
  // -------------------------------------------------------------------------
  if (horseVideo && horseScene) {
    if (prog >= FASES.cavaloInicio && prog <= FASES.cavaloFadeFim) {
      horseScene.style.visibility = 'visible';

      // Entrada suave da Sessão 2 conforme a porteira se abre
      let opCavalo = 1;
      if (prog < FASES.cavaloAuge) {
        opCavalo = normalizar(prog, FASES.cavaloInicio, FASES.cavaloAuge);
      } else if (prog > FASES.cavaloFim) {
        opCavalo = 1 - normalizar(prog, FASES.cavaloFim, FASES.cavaloFadeFim);
      }
      horseScene.style.opacity = Math.max(0, Math.min(1, opCavalo)).toFixed(2);

      // Sincroniza o vídeo do cavalo em tela inteira com o scroll
      if (horseVideo.duration) {
        const tCavalo = normalizar(prog, FASES.cavaloInicio, FASES.cavaloFim);
        const tempoAlvo = Math.min(horseVideo.duration, tCavalo * horseVideo.duration);
        if (Math.abs(horseVideo.currentTime - tempoAlvo) > 0.15) {
          horseVideo.currentTime = tempoAlvo;
        }
      }

      // Leve aproximação cinematográfica natural (scale 1.00 a 1.06)
      const tZoom = clamp(normalizar(prog, FASES.cavaloInicio, FASES.cavaloFim), 0, 1);
      const escala = 1 + tZoom * 0.06;
      horseVideo.style.transform = `scale(${escala.toFixed(3)})`;
    } else {
      horseScene.style.opacity = '0';
      horseScene.style.visibility = 'hidden';
      if (!horseVideo.paused) horseVideo.pause();
    }
  }

  // -------------------------------------------------------------------------
  // 3. ATIVAÇÃO DO CONTAINER DO PORTAL VEGETAL (a partir de 44% de scroll)
  // -------------------------------------------------------------------------
  if (container) {
    if (prog < 0.44 || prog > 0.99) {
      if (container.dataset.ativo === 'true') {
        container.dataset.ativo = 'false';
      }
    } else {
      if (container.dataset.ativo !== 'true') {
        container.dataset.ativo = 'true';
      }
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
    // Portas deslizam das laterais e fecham no centro (0, 0)
    const tFecha = clamp(normalizar(prog, FASES.fechaInicio, FASES.fechaFim), 0, 1);
    const easeFecha = tFecha * tFecha * (3 - 2 * tFecha);
    transX_PortaEsq = -80 * (1 - easeFecha);
    transX_PortaDir = 80 * (1 - easeFecha);
    opacidadeCostura = easeFecha > 0.75 ? (easeFecha - 0.75) / 0.25 : 0;
  } else if (prog <= FASES.portaAbreFim) {
    // Portas de correr deslizam lateralmente para fora (translateX puro, sem rotateY)
    const tAbre = clamp(normalizar(prog, FASES.portaAbreInicio, FASES.portaAbreFim), 0, 1);
    const easeAbre = tAbre * tAbre * (3 - 2 * tAbre);
    transX_PortaEsq = -105 * easeAbre;
    transX_PortaDir = 105 * easeAbre;
    opacidadeCostura = Math.max(0, 1 - easeAbre * 3.5);
  } else {
    // Totalmente abertas fora da tela
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
  // CAMADA 4: VÍDEO DA VISÃO AÉREA DO DRONE (REVELADO ATRÁS DO PORTAL)
  // -------------------------------------------------------------------------
  if (videoFrame) {
    let opacidadeDrone = 0;
    let escalaDrone = 0.90;

    if (prog >= FASES.droneInicio) {
      const tDrone = clamp(normalizar(prog, FASES.droneInicio, FASES.droneFim), 0, 1);
      const easeDrone = tDrone * tDrone * (3 - 2 * tDrone);
      opacidadeDrone = easeDrone;
      escalaDrone = 0.90 + easeDrone * 0.10;
    }

    videoFrame.style.opacity = opacidadeDrone.toFixed(2);
    videoFrame.style.transform = `scale(${escalaDrone.toFixed(3)})`;
  }

  // Reprodução automática do vídeo aéreo do drone quando revelado
  if (prog >= FASES.droneInicio && prog <= FASES.saidaInicio + 0.02) {
    if (!tocandoDrone && droneVideo) {
      const prom = droneVideo.play();
      if (prom !== undefined) {
        prom.then(() => { tocandoDrone = true; }).catch(() => {});
      }
    }
  } else {
    if (tocandoDrone && droneVideo && (prog < FASES.droneInicio || prog > FASES.saidaFim)) {
      droneVideo.pause();
      tocandoDrone = false;
    }
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
  // 8. TRANSIÇÃO DE SAÍDA SUAVE PARA SESSÃO 3
  // -------------------------------------------------------------------------
  if (container) {
    if (prog > FASES.saidaInicio) {
      const tSaida = normalizar(prog, FASES.saidaInicio, FASES.saidaFim);
      container.style.opacity = Math.max(0, 1 - tSaida).toFixed(2);
    } else {
      container.style.opacity = '1';
    }
  }
}

export function destruir() {
  ativo = false;
  if (porteiraVideo) porteiraVideo.pause();
  if (droneVideo) droneVideo.pause();
  if (horseVideo) horseVideo.pause();
}

export default { iniciarPortal3d, definirProgresso, destruir };
