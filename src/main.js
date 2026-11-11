/* ============================================================================
 * main.js — PONTO DE ENTRADA DO SITE: PARAÍSO DAS ÁGUAS
 * ----------------------------------------------------------------------------
 * Ordem de subida:
 *   1. Motor de scroll  → define a altura da página e emite progresso (0 a 1)
 *   2. Palco + fundo    → renderiza o canvas procedural / sequências de frames
 *   3. UI               → hero, carrossel 3D, portal 3D de abertura central
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

  // (c2) Portal 3D de abertura central cinematográfica (Sessão 2)
  portal3d.iniciarPortal3d();

  // (c3) Reserva no fluxo da altura real das seções
  ajustarAlturaDasSecoes();

  aplicarVariaveisCarrossel();
  carrossel.iniciarCarrossel();

  // (d) UI e Interações
  progresso.iniciarProgresso();
  dica.iniciarDica();
  hero.iniciarHero();
  iniciarWhatsAppFlutuante(ambiente);
  ligarCtasInternos();
  ligarPausaPorVisibilidade();
  ligarEventosDeScroll();

  /* ------------------------------------------------------------------------
   * (e) Assinatura única de progresso de scroll
   * ---------------------------------------------------------------------- */
  aoProgredir((p) => {
    controleFundo?.definirProgresso(p);
    controlePalco?.definirProgresso(p);
    progresso.definirProgresso(p);
    dica.definirProgresso(p);
    hero.definirProgresso(p);
    carrossel.definirProgresso(p);
    portal3d.definirProgresso(p);
  });

  // (f) Revelação do palco
  controleFundo?.iniciar();
  document.documentElement.dataset.pdFundo = '1';
  palco.mostrarPronto();
  document.documentElement.dataset.pdPronto = '1';

  // (g) Recálculo de medidas após carregamento de fontes
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => setTimeout(() => {
      ajustarAlturaDasSecoes();
      carrossel.definirProgresso(getProgresso());
      portal3d.definirProgresso(getProgresso());
    }, 80));
  }

  // (h) Eventos de WhatsApp e Preferências
  ligarBotoesWhatsApp();
  ligarLinkDePreferencias();

  window.__PD = {
    config, ambiente, controleFundo, controlePalco, secoes,
    irPara: (fracao) => {
      const rolavel = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, Math.round(rolavel * Math.max(0, Math.min(1, fracao))));
    }
  };
}

/* --------------------------------------------------------------------------
 * 4b. Reserva de altura das seções densas
 * ------------------------------------------------------------------------ */

function ajustarAlturaDasSecoes() {
  const secoes = document.getElementById('secoes');
  if (!secoes) return;

  const medir = () => {
    const altura = Math.ceil(secoes.getBoundingClientRect().height);
    if (altura > 0) {
      aplicarVariaveis({ '--altura-secoes': `${altura}px` });
    }
    atualizarMedidas();
  };

  medir();

  let t = 0;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(medir, 220);
  }, { passive: true });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => setTimeout(medir, 90));
  }
  window.addEventListener('load', () => setTimeout(medir, 160), { once: true });
}

/* --------------------------------------------------------------------------
 * 4c. Variáveis do carrossel
 * ------------------------------------------------------------------------ */

function aplicarVariaveisCarrossel() {
  aplicarVariaveis({
    '--perspectiva-carrossel': `${config.carrossel.perspectiva}px`
  });
  const el = document.getElementById('carrossel');
  if (el) el.style.perspective = `${config.carrossel.perspectiva}px`;
}

/* --------------------------------------------------------------------------
 * 4d. Eventos de profundidade de scroll
 * ------------------------------------------------------------------------ */

function ligarEventosDeScroll() {
  const marcos = [25, 50, 75, 100];
  const disparados = new Set();

  aoProgredir((p) => {
    for (const marco of marcos) {
      if (disparados.has(marco)) continue;
      if (p * 100 >= marco) {
        disparados.add(marco);
        try {
          if (typeof window.fbq === 'function') {
            window.fbq('trackCustom', `Scroll${marco}`);
          }
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'scroll_profundidade', { percentual: marco });
          }
        } catch { /* silencioso */ }
      }
    }
  });
}

/* --------------------------------------------------------------------------
 * 5. Arranque e HMR
 * ------------------------------------------------------------------------ */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', arrancar, { once: true });
} else {
  arrancar();
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    destruirScroll();
    fundo.parar();
    dica.destruir();
    hero.destruir();
    carrossel.destruir();
    portal3d.destruir();
  });
}
