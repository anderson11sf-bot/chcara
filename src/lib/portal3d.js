/* ============================================================================
 * portal3d.js — ABERTURA CINEMATOGRÁFICA DO VÍDEO 3D (SESSÃO 2)
 * ----------------------------------------------------------------------------
 * Sincronizado com o encerramento da animação da Sessão 2.
 * A tela se abre horizontalmente pelo centro revelando o player 3D do terreno.
 * Quando suficientemente aberto, o vídeo inicia autoplay automaticamente (mudo).
 * ==========================================================================*/

import { normalizar, clamp } from './utils.js';

let container = null;
let portaEsq = null;
let portaDir = null;
let costuraBrilho = null;
let videoFrame = null;
let video = null;
let btnSom = null;

let ativo = false;
let videoCarregado = false;
let tocando = false;
let semMovimento = false;

/* Faixa de progresso em que o portal atua na Sessão 2 */
const FAIXA_PORTAL = {
  surgir: 0.44,      // ativação e fade-in do contêiner
  abrirInicio: 0.48, // momento em que as portas começam a se afastar
  abrirFim: 0.68,    // portas 100% abertas e vídeo em escala normal
  manterFim: 0.90,   // encerramento da exibição antes das próximas seções
  esconderFim: 0.98  // fade out completo
};

export function iniciarPortal3d() {
  container = document.getElementById('portal-abertura');
  portaEsq = document.getElementById('portal-porta-esq');
  portaDir = document.getElementById('portal-porta-dir');
  costuraBrilho = document.getElementById('portal-costura-brilho');
  videoFrame = document.getElementById('portal-video-frame');
  video = document.getElementById('portal-video-3d');
  btnSom = document.getElementById('portal-video-som');

  if (!container || !video) return null;

  semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Garantir atributos seguros para autoplay silencioso
  video.muted = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('muted', '');

  // Botão de alternar áudio
  if (btnSom) {
    btnSom.addEventListener('click', (ev) => {
      ev.stopPropagation();
      video.muted = !video.muted;
      btnSom.setAttribute('aria-label', video.muted ? 'Ativar som' : 'Desativar som');
      btnSom.innerHTML = video.muted
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
    });
  }

  ativo = true;
  return { definirProgresso, destruir };
}

/**
 * Atualiza o portal com base no progresso global (0 a 1)
 * @param {number} p
 */
export function definirProgresso(p) {
  if (!ativo || !container) return;

  // 1. Fora do intervalo geral: tudo fechado e parado
  if (p < FAIXA_PORTAL.surgir || p > FAIXA_PORTAL.esconderFim) {
    if (container.dataset.ativo === 'true') {
      container.dataset.ativo = 'false';
    }
    if (tocando && video) {
      video.pause();
      tocando = false;
    }
    return;
  }

  // 2. Dentro do intervalo: ativa container
  if (container.dataset.ativo !== 'true') {
    container.dataset.ativo = 'true';
  }

  if (semMovimento) {
    // Modo acessível: vídeo visível sem movimento complexo
    if (p >= FAIXA_PORTAL.abrirInicio && p <= FAIXA_PORTAL.manterFim) {
      if (!tocando && video) {
        video.play().catch(() => {});
        tocando = true;
      }
    } else {
      if (tocando && video) {
        video.pause();
        tocando = false;
      }
    }
    return;
  }

  // 3. Cálculo de abertura das portas (0 = fechado, 1 = 100% aberto)
  const tAbertura = clamp(
    normalizar(p, FAIXA_PORTAL.abrirInicio, FAIXA_PORTAL.abrirFim),
    0,
    1
  );

  // Easing suave quadrático
  const easeAbertura = tAbertura < 0.5
    ? 2 * tAbertura * tAbertura
    : 1 - Math.pow(-2 * tAbertura + 2, 2) / 2;

  // Movimento horizontal oposto a partir do centro
  if (portaEsq) {
    portaEsq.style.transform = `translate3d(-${(easeAbertura * 102).toFixed(2)}%, 0, 0)`;
  }
  if (portaDir) {
    portaDir.style.transform = `translate3d(${(easeAbertura * 102).toFixed(2)}%, 0, 0)`;
  }

  // Linha de costura luminosa (desaparece conforme abre)
  if (costuraBrilho) {
    const opCostura = Math.max(0, 1 - easeAbertura * 3);
    costuraBrilho.style.opacity = opCostura.toFixed(2);
  }

  // Quadro de vídeo com revelação e leve expansão cinematográfica
  if (videoFrame) {
    const escala = (0.88 + easeAbertura * 0.12).toFixed(3);
    const opacidade = Math.min(1, easeAbertura * 1.4).toFixed(2);
    videoFrame.style.transform = `scale(${escala})`;
    videoFrame.style.opacity = opacidade;
  }

  // Fade de encerramento quando a pessoa continua rolando após a exibição
  if (p > FAIXA_PORTAL.manterFim) {
    const tSaida = normalizar(p, FAIXA_PORTAL.manterFim, FAIXA_PORTAL.esconderFim);
    const opSaida = Math.max(0, 1 - tSaida).toFixed(2);
    container.style.opacity = opSaida;
  } else {
    container.style.opacity = '1';
  }

  // 4. Autoplay inteligente e reversível
  // Quando as portas abrirem mais de 35%, inicia a reprodução
  if (tAbertura >= 0.35 && p <= FAIXA_PORTAL.manterFim + 0.02) {
    if (!tocando && video) {
      const prom = video.play();
      if (prom !== undefined) {
        prom.then(() => {
          tocando = true;
        }).catch(() => {
          // Autoplay foi bloqueado pelo navegador; continuará mutado
        });
      }
    }
  } else {
    // Se o usuário rolou para cima (fechando as portas) ou muito para baixo
    if (tocando && video && (tAbertura < 0.20 || p > FAIXA_PORTAL.manterFim + 0.03)) {
      video.pause();
      tocando = false;
    }
  }
}

export function destruir() {
  ativo = false;
  if (video) {
    video.pause();
  }
}

export default { iniciarPortal3d, definirProgresso, destruir };
