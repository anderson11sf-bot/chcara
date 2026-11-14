/* ============================================================================
 * main.js — PONTO DE ENTRADA DO SITE: PARAÍSO DAS ÁGUAS
 * ----------------------------------------------------------------------------
 * Ordem de subida:
 *   1. Motor de scroll  → define a altura da página e emite progresso (0 a 1)
 *   2. Palco + fundo    → canvas procedural e sequências de frames
 *   3. UI               → hero com scroll canvas, carrossel 3D, portal 3D
 *   4. Seções Mestres   → as 13 seções em fluxo normal, com legibilidade total
 * ==========================================================================*/

import './styles/main.css';

import config from './config.js';
import {
  iniciarScroll, atualizarMedidas, aoProgredir, getAmbiente, getProgresso,
  irPara, pausarScroll, retomarScroll, destruirScroll
} from './lib/scroll.js';

import { aplicarVariaveis } from './lib/utils.js';
import * as palco from './lib/palco.js';
import * as fundo from './lib/fundoCanvas.js';
import * as progresso from './lib/progresso.js';
import * as dica from './lib/dica.js';
import * as hero from './lib/hero.js';
import * as carrossel from './lib/carrossel.js';
import * as portal3d from './lib/portal3d.js';
import { montarSecoesMestre } from './lib/secoes.js';
import { iniciarAnimacoesEntrada } from './lib/animacoes.js';
import { iniciarGerenciadorVideos } from './lib/videoManager.js';
import { iniciarSeo } from './lib/seo.js';
import { iniciarCookies, ligarLinkDePreferencias } from './lib/cookies.js';
import { iniciarWhatsAppFlutuante, ligarBotoesWhatsApp } from './lib/whatsapp.js';

import { ScrollEngine } from './lib/ScrollEngine.js';
import { FrameLayer } from './lib/FrameLayer.js';
import FRAMES_MANIFEST from './framesManifest.js';

/* --------------------------------------------------------------------------
 * 1. Textos dinâmicos do config.js
 * ------------------------------------------------------------------------ */

function aplicarTextos() {
  const headline = document.getElementById('hero-headline');
  if (headline && config.hero.headline) {
    headline.innerHTML = config.hero.headline;
  }

  const sub = document.getElementById('hero-sub');
  if (sub && config.hero.subheadline) {
    sub.innerHTML = config.hero.subheadline;
  }

  const dicaTexto = document.getElementById('dica-texto');
  if (dicaTexto && !dicaTexto.textContent.trim()) {
    dicaTexto.textContent = 'Deslize para baixo e descubra o paraíso';
  }

  if (config.seo.titulo) document.title = config.seo.titulo;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && config.seo.descricao) metaDesc.setAttribute('content', config.seo.descricao);
}

/* --------------------------------------------------------------------------
 * 2. CTA interno: rolar até a seção desejada
 * ------------------------------------------------------------------------ */

function ligarCtasInternos() {
  const ctaSecundario = document.getElementById('hero-cta-secundario');
  if (!ctaSecundario) return;

  ctaSecundario.addEventListener('click', (ev) => {
    const alvo = ctaSecundario.getAttribute('href') || '';
    if (alvo.startsWith('#') && document.querySelector(alvo)) {
      ev.preventDefault();
      irPara(alvo, -20);
    }
  });
}

/* --------------------------------------------------------------------------
 * 3. Pausa por visibilidade (economia de bateria)
 * ------------------------------------------------------------------------ */

function ligarPausaPorVisibilidade() {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pausarScroll();
      fundo.parar();
    } else {
      retomarScroll();
      fundo.iniciar();
      atualizarMedidas();
    }
  });
}

/* --------------------------------------------------------------------------
 * 4. Arranque principal
 * ------------------------------------------------------------------------ */

function arrancar() {
  window.addEventListener('error', (ev) => {
    document.documentElement.dataset.pdErro =
      `${ev.message || 'erro'} @ ${ev.filename || '?'}:${ev.lineno || 0}`;
  });
  window.addEventListener('unhandledrejection', (ev) => {
    document.documentElement.dataset.pdErro =
      `promise: ${(ev.reason && ev.reason.message) || ev.reason}`;
  });

  try {
    arrancarInterno();
    document.documentElement.dataset.pdOk = '1';
  } catch (erro) {
    document.documentElement.dataset.pdErro = `${(erro && erro.message) || erro}`;
    console.error('[pd] falha na inicialização:', erro);
    try { ligarBotoesWhatsApp(); } catch { /* ignora */ }
    document.body.classList.remove('preload');
  }
}

function arrancarInterno() {
  try { iniciarSeo(); } catch (e) { console.warn('[pd] seo:', e); }
  try { iniciarCookies(); } catch (e) { console.warn('[pd] cookies:', e); }
  try { aplicarTextos(); } catch (e) { console.warn('[pd] textos:', e); }

  // (a) Motor de scroll mestre
  let ambiente = { mobile: window.innerWidth < 768, largura: window.innerWidth, altura: window.innerHeight };
  try {
    const sc = iniciarScroll();
    if (sc?.ambiente) ambiente = sc.ambiente;
  } catch (e) {
    console.warn('[pd] scroll:', e);
  }

  // (b) Palco visual & Fundo procedural
  let controlePalco = null;
  try { controlePalco = palco.iniciarPalco(ambiente); } catch (e) { console.warn('[pd] palco:', e); }

  // (c) Montagem das seções mestres (3 a 13) — CRÍTICO: nunca pode falhar
  let secoes = null;
  try {
    secoes = montarSecoesMestre();
    iniciarAnimacoesEntrada();
  } catch (e) {
    console.error('[pd] ERRO FATAL EM SECOES:', e);
  }

  // (c2) Portal 3D coordenado
  try { portal3d.iniciarPortal3d(); } catch (e) { console.warn('[pd] portal3d:', e); }
  try { aplicarVariaveisCarrossel(); } catch (e) { console.warn('[pd] var-carrossel:', e); }
  try { carrossel.iniciarCarrossel(); } catch (e) { console.warn('[pd] carrossel:', e); }

  // (d) UI e Interações
  try { progresso.iniciarProgresso(); } catch (e) { console.warn('[pd] progresso:', e); }
  try { dica.iniciarDica(); } catch (e) { console.warn('[pd] dica:', e); }
  try { hero.iniciarHero(); } catch (e) { console.warn('[pd] hero:', e); }
  try { iniciarGerenciadorVideos(); } catch (e) { console.warn('[pd] videos:', e); }
  try { iniciarWhatsAppFlutuante(); } catch (e) { console.warn('[pd] wa-flutuante:', e); }
  try { ligarCtasInternos(); } catch (e) { console.warn('[pd] ctas:', e); }
  try { ligarPausaPorVisibilidade(); } catch (e) { console.warn('[pd] pausa:', e); }
  try { ligarEventosDeScroll(); } catch (e) { console.warn('[pd] eventos-scroll:', e); }

  // (e) Motor Central de Animação de Scroll 120 FPS (ScrollEngine + FrameLayers)
  let scrollEngine = null;
  try {
    scrollEngine = new ScrollEngine();

    // 1. Seção 2: Abertura da Porteira (120 FPS) -> Televisãozinha 9x16 Vista do Alto
    const secaoCenas = document.getElementById('secao-cenas');
    const tvFrame = document.getElementById('sessao2-tv-frame');
    const tvVideo = document.getElementById('sessao2-tv-video');
    const tvSomBtn = document.getElementById('tv-video-som');

    if (tvSomBtn && tvVideo) {
      tvSomBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        tvVideo.muted = !tvVideo.muted;
        tvSomBtn.classList.toggle('com-som', !tvVideo.muted);
        tvSomBtn.setAttribute('aria-label', tvVideo.muted ? 'Ativar som' : 'Desativar som');
      });
    }

    // 1. Controlador da Televisãozinha 9x16 com Vista Aérea do Terreno (Seção 2)
    if (secaoCenas && tvFrame) {
      let secaoTop = 0;
      let secaoHeight = 0;

      const updateSecaoBounds = () => {
        secaoTop = secaoCenas.offsetTop || 0;
        secaoHeight = secaoCenas.offsetHeight || 0;
      };

      updateSecaoBounds();
      window.addEventListener('resize', updateSecaoBounds, { passive: true });

      scrollEngine.onTick((scrollY, vh, stableVh) => {
        const scrollDist = secaoHeight - stableVh;
        if (scrollDist <= 0) return;

        // Fora da seção: oculta e pausa vídeo
        if (scrollY < secaoTop - vh || scrollY > secaoTop + secaoHeight) {
          if (tvFrame.style.opacity !== '0') {
            tvFrame.style.opacity = '0';
            tvFrame.style.transform = 'scale(0.35)';
          }
          if (tvVideo && !tvVideo.paused) {
            tvVideo.pause();
          }
          return;
        }

        const rawP = (scrollY - secaoTop) / scrollDist;
        const prog = Math.min(1, Math.max(0, rawP));

        // Curva suave de entrada, exibição contínua e transição de saída da TV
        let scale = 0.35;
        let opacity = 0;

        if (prog <= 0.35) {
          // Fase 1: Emerge no centro crescendo de 0.38 para 1.00 sobre o fundo global
          const p = prog / 0.35;
          scale = 0.38 + p * 0.62;
          opacity = Math.min(1, p * 1.3);
        } else if (prog <= 0.78) {
          // Fase 2: Destaque total no centro, vídeo aéreo rodando
          const p = (prog - 0.35) / 0.43;
          scale = 1.00 + p * 0.06;
          opacity = 1.0;
        } else {
          // Fase 3: Transição suave para a próxima seção
          const p = (prog - 0.78) / 0.22;
          scale = 1.06 + p * 0.04;
          opacity = Math.max(0, 1.0 - p * 1.5);
        }

        tvFrame.style.transform = `scale(${scale.toFixed(3)})`;
        tvFrame.style.opacity = opacity.toFixed(3);

        if (tvVideo) {
          if (opacity > 0.10 && tvVideo.paused) {
            tvVideo.play().catch(() => {});
          } else if (opacity <= 0.05 && !tvVideo.paused) {
            tvVideo.pause();
          }
        }
      });
    }

    // 2. Layer Global (Modo GLOBAL PING-PONG com GLOBAL_PASS_VH = 450)
    const globalCanvas = document.getElementById('global-scroll-canvas');
    const globalLayer = new FrameLayer({
      id: 'global',
      mode: 'global',
      canvas: globalCanvas,
      globalPassVh: 450,
      manifestEntry: FRAMES_MANIFEST.global
    });

    scrollEngine.init();
    scrollEngine.addLayer(globalLayer);
  } catch (e) {
    console.error('[pd] scrollEngine:', e);
  }

  // (f) Barra de progresso de leitura global e palco
  aoProgredir((pGlobal) => {
    progresso.definirProgresso(pGlobal);
    controlePalco?.definirProgresso(pGlobal);
  });

  // (g) Revelação do palco
  palco.mostrarPronto();
  document.documentElement.dataset.pdPronto = '1';

  // (h) Recálculo de medidas após carregamento de fontes
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => setTimeout(() => {
      scrollEngine?.scheduleMeasurements(true);
    }, 80));
  }

  // (i) Eventos de WhatsApp e Preferências
  ligarBotoesWhatsApp();
  ligarLinkDePreferencias();

  window.__PD = {
    config, ambiente, scrollEngine, controlePalco, secoes,
    irPara: (fracao) => {
      const rolavel = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, Math.round(rolavel * Math.max(0, Math.min(1, fracao))));
    }
  };

  document.body.classList.remove('preload');
}

function aplicarVariaveisCarrossel() {
  const c = config.carrossel || {};
  aplicarVariaveis(document.documentElement, {
    'perspectiva-carrossel': `${c.perspectiva || 1200}px`
  });
}

function ligarEventosDeScroll() {
  let disparou50 = false;
  let disparou90 = false;

  aoProgredir((p) => {
    if (!disparou50 && p >= 0.50) {
      disparou50 = true;
      dispararEventoAnalitico('scroll_50');
    }
    if (!disparou90 && p >= 0.90) {
      disparou90 = true;
      dispararEventoAnalitico('scroll_90');
    }
  });
}

function dispararEventoAnalitico(nome) {
  try {
    if (typeof window.gtag === 'function') window.gtag('event', nome);
    if (typeof window.fbq === 'function') window.fbq('trackCustom', nome);
  } catch {
    /* analíticos não quebram navegação */
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', arrancar, { once: true });
} else {
  arrancar();
}

export default { arrancar };
