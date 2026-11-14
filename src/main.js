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
  let controleFundo = null;
  try {
    const canvas = document.getElementById('fundo-canvas');
    if (canvas) controleFundo = fundo.iniciarFundo(canvas, ambiente);
  } catch (e) { console.warn('[pd] fundo:', e); }

  // (c) Montagem das seções mestres (3 a 13) — CRÍTICO: nunca pode falhar
  let secoes = null;
  try {
    secoes = montarSecoesMestre();
    iniciarAnimacoesEntrada();
  } catch (e) {
    console.error('[pd] ERRO FATAL EM SECOES:', e);
  }

  // (c2) Portal 3D coordenado (Cavalo -> Escurece -> Porteira 120 FPS -> Drone)
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

  /* ------------------------------------------------------------------------
   * (e) Assinatura única de progresso de scroll
   * ---------------------------------------------------------------------- */
  const secaoCenas = document.getElementById('secao-cenas');
  const palcoEl = document.getElementById('palco');

  const atualizarVisibilidadeFundoGlobal = (y, vh) => {
    if (!palcoEl) return;

    // Fim da Sessão 2: onde a transição da cena 2 termina
    let fimSessao2 = vh * 3.5;
    if (secaoCenas) {
      fimSessao2 = secaoCenas.offsetTop + secaoCenas.offsetHeight;
    }

    // Intervalo de transição da Sessão 2 para a Sessão 3
    const margem = vh * 0.35;
    const inicioFade = fimSessao2 - vh - margem;
    const fimFade = fimSessao2 - vh * 0.15;

    if (y < inicioFade) {
      // Sessão 1 e Sessão 2: Fundo global oculto
      if (palcoEl.dataset.visivel !== 'false') {
        palcoEl.dataset.visivel = 'false';
        palcoEl.style.opacity = '0';
        palcoEl.style.visibility = 'hidden';
      }
    } else if (y >= fimFade) {
      // Sessão 3 em diante: Fundo global visível
      if (palcoEl.dataset.visivel !== 'true') {
        palcoEl.dataset.visivel = 'true';
        palcoEl.style.opacity = '1';
        palcoEl.style.visibility = 'visible';
      }
    } else {
      // Transição suave
      const t = Math.min(1, Math.max(0, (y - inicioFade) / (fimFade - inicioFade)));
      palcoEl.dataset.visivel = 'true';
      palcoEl.style.opacity = t.toFixed(3);
      palcoEl.style.visibility = 'visible';
    }
  };

  const atualizarQuadrosScroll = (pGlobal) => {
    const y = window.scrollY || window.pageYOffset || 0;
    const vh = window.innerHeight || 1;

    // 0. Controle de Visibilidade do Fundo Global (Oculto em 1 e 2, ativo de 3 em diante)
    atualizarVisibilidadeFundoGlobal(y, vh);

    // 1. Progresso do Hero (0 a 1 nos primeiros 85% de vh)
    const pHero = Math.min(1, Math.max(0, y / Math.max(1, vh * 0.85)));
    hero.definirProgresso(pHero);
    dica.definirProgresso(pHero);

    // 2. Progresso da Sessão 2 (Timeline Coordenada)
    let pCena = 0;
    if (secaoCenas) {
      const topoCena = secaoCenas.offsetTop || vh;
      const distCena = Math.max(1, secaoCenas.offsetHeight - vh);
      pCena = Math.min(1, Math.max(0, (y - topoCena) / distCena));
    }
    carrossel.definirProgresso(pCena);
    portal3d.definirProgresso(pCena);

    // 3. Fundo Global contínuo (vídeo original sincronizado com o scroll de todo o site)
    controleFundo?.definirProgresso(pGlobal);
    controlePalco?.definirProgresso(pGlobal);

    // 4. Barra de progresso de leitura global (0 a 1 no site inteiro)
    progresso.definirProgresso(pGlobal);
  };

  // Atualização sincronizada 100% no ticker do GSAP (sem eventos redundantes)
  aoProgredir((p) => {
    atualizarQuadrosScroll(p);
  });

  // (f) Revelação do palco
  controleFundo?.iniciar();
  document.documentElement.dataset.pdFundo = '1';
  palco.mostrarPronto();
  document.documentElement.dataset.pdPronto = '1';

  // (g) Recálculo de medidas após carregamento de fontes
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => setTimeout(() => {
      atualizarQuadrosScroll(getProgresso());
    }, 80));
  }

  // (h) Eventos de WhatsApp e Preferências
  ligarBotoesWhatsApp();
  ligarLinkDePreferencias();

  window.__PD = {
    config, ambiente, controleFundo, controlePalco, secoes,
    atualizar: atualizarQuadrosScroll,
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
