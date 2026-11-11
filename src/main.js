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
import * as heroScroll from './lib/heroScroll.js';
import * as sessao2Scroll from './lib/sessao2Scroll.js';
import * as carrossel from './lib/carrossel.js';
import * as portal3d from './lib/portal3d.js';
import { montarSecoesMestre } from './lib/secoes.js';
import { iniciarSeo } from './lib/seo.js';
import { iniciarCookies, ligarLinkDePreferencias } from './lib/cookies.js';
import { iniciarWhatsAppFlutuante, ligarBotoesWhatsApp } from './lib/whatsapp.js';

/* --------------------------------------------------------------------------
 * 1. Textos dinâmicos do config.js
 * ------------------------------------------------------------------------ */

function aplicarTextos() {
  const headline = document.getElementById('hero-headline');
  if (headline) {
    headline.innerHTML = config.hero.headline;
  }

  const sub = document.getElementById('hero-sub');
  if (sub) sub.textContent = config.hero.subheadline;

  const ctaPrimario = document.getElementById('hero-cta-primario');
  if (ctaPrimario) {
    const rotulo = ctaPrimario.lastChild;
    if (rotulo && rotulo.nodeType === Node.TEXT_NODE) rotulo.nodeValue = ` ${config.hero.ctaPrimario}`;
  }

  const ctaSecundario = document.getElementById('hero-cta-secundario');
  if (ctaSecundario) ctaSecundario.textContent = config.hero.ctaSecundario;

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
  iniciarSeo();
  iniciarCookies();

  aplicarTextos();

  // (a) Motor de scroll mestre
  const { ambiente } = iniciarScroll();

  // (b) Palco visual & Fundo procedural
  const controlePalco = palco.iniciarPalco(ambiente);
  const canvas = document.getElementById('fundo-canvas');
  const controleFundo = canvas ? fundo.iniciarFundo(canvas, ambiente) : null;

  // (c) Montagem das seções mestres (3 a 13)
  const secoes = montarSecoesMestre();

  // (c2) Canvas e animações de scroll
  const controleHeroScroll = heroScroll.iniciarHeroScroll();
  const controleSessao2Scroll = sessao2Scroll.iniciarSessao2Scroll();

  // (c3) Portal 3D de abertura central cinematográfica (Sessão 2)
  portal3d.iniciarPortal3d();

  aplicarVariaveisCarrossel();
  carrossel.iniciarCarrossel();

  // (d) UI e Interações
  progresso.iniciarProgresso();
  dica.iniciarDica();
  hero.iniciarHero();
  iniciarWhatsAppFlutuante();
  ligarCtasInternos();
  ligarPausaPorVisibilidade();
  ligarEventosDeScroll();

  /* ------------------------------------------------------------------------
   * (e) Assinatura única de progresso de scroll
   * ---------------------------------------------------------------------- */
  const secaoCenas = document.getElementById('secao-cenas');

  const atualizarQuadrosScroll = (pGlobal) => {
    const y = window.scrollY || window.pageYOffset || 0;
    const vh = window.innerHeight || 1;

    // 1. Progresso do Hero (0 a 1 nos primeiros 85% de vh)
    const pHero = Math.min(1, Math.max(0, y / Math.max(1, vh * 0.85)));
    hero.definirProgresso(pHero);
    controleHeroScroll?.definirProgresso(pHero);
    dica.definirProgresso(pHero);

    // 2. Progresso da Sessão 2 (Canvas de transição + Carrossel 3D + Abertura Central 3D)
    let pCena = 0;
    if (secaoCenas) {
      const topoCena = secaoCenas.offsetTop || vh;
      const distCena = Math.max(1, secaoCenas.offsetHeight - vh);
      pCena = Math.min(1, Math.max(0, (y - topoCena) / distCena));
    }
    controleSessao2Scroll?.definirProgresso(pCena);
    carrossel.definirProgresso(pCena);
    portal3d.definirProgresso(pCena);

    // 3. Fundo procedural e Palco visual
    controleFundo?.definirProgresso(pCena < 0.98 ? pCena : 1);
    controlePalco?.definirProgresso(pCena);

    // 4. Barra de progresso de leitura global (0 a 1 no site inteiro)
    progresso.definirProgresso(pGlobal);
  };

  const aoRolarImediato = () => {
    const rolavel = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const p = Math.min(1, Math.max(0, (window.scrollY || window.pageYOffset || 0) / rolavel));
    atualizarQuadrosScroll(p);
  };
  window.addEventListener('scroll', aoRolarImediato, { passive: true });

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
