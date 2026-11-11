/* ============================================================================
 * hero.js — COMPORTAMENTO E TRANSIÇÃO DA PRIMEIRA DOBRA (HERO)
 * ----------------------------------------------------------------------------
 * Gerencia a montagem dos selos e emblemas da prova rápida, além da saída
 * suave por scroll.
 * ==========================================================================*/

import config from '../config.js';
import { clamp } from './utils.js';
import { icone } from './icones.js';

let headline = null;
let sub = null;
let selos = null;
let emblemas = null;
let acoes = null;
let wordmark = null;
let heroBgImg = null;
let ativo = false;
let base = null;
let noTopo = false;

export function iniciarHero() {
  headline = document.getElementById('hero-headline');
  sub = document.getElementById('hero-sub');
  selos = document.getElementById('hero-selos');
  emblemas = document.getElementById('hero-emblemas');
  acoes = document.querySelector('.hero__acoes');
  wordmark = document.querySelector('.hero__wordmark-caixa');
  heroBgImg = document.getElementById('hero-bg-img');
  const secao = document.getElementById('hero');

  if (!headline || !secao) return null;
  ativo = true;

  montarSelos();
  montarEmblemas();
  base = { headline: null, sub: null, selos: null, emblemas: null, acoes: null, wordmark: null, bg: null };

  return { definirProgresso, destruir };
}

/** 3 Selos de condições comerciais principais */
function montarSelos() {
  if (!selos) return;
  const itens = config.hero.selos || [];
  selos.replaceChildren();
  for (const item of itens) {
    const li = document.createElement('li');
    li.className = 'selo selo--hero';

    if (typeof item === 'object' && item.icone) {
      const ic = document.createElement('span');
      ic.className = 'selo__icone';
      ic.innerHTML = icone(item.icone, { tamanho: 18 });
      li.appendChild(ic);
    }

    const txt = document.createElement('span');
    txt.className = 'selo__texto';
    txt.textContent = typeof item === 'object' ? item.texto : item;
    li.appendChild(txt);

    selos.appendChild(li);
  }
}

/** 4 Emblemas rápidos de diferenciais */
function montarEmblemas() {
  if (!emblemas) return;
  const itens = config.hero.emblemas || [];
  emblemas.replaceChildren();
  for (const item of itens) {
    const li = document.createElement('li');
    li.className = 'emblema--hero';

    if (item.icone) {
      const ic = document.createElement('span');
      ic.className = 'emblema__icone';
      ic.innerHTML = icone(item.icone, { tamanho: 16 });
      li.appendChild(ic);
    }

    const txt = document.createElement('span');
    txt.className = 'emblema__texto';
    txt.textContent = item.texto;
    li.appendChild(txt);

    emblemas.appendChild(li);
  }
}

/**
 * @param {number} p progresso local do hero (0 a 1)
 */
export function definirProgresso(p) {
  if (!ativo) return;

  const t = clamp(p, 0, 1);

  if (t === 0) {
    if (!noTopo) {
      noTopo = true;
      for (const el of [headline, sub, selos, emblemas, acoes, wordmark]) {
        if (!el) continue;
        el.style.transform = '';
        el.style.opacity = '';
        el.style.filter = '';
      }
      if (heroBgImg) {
        heroBgImg.style.transform = 'scale(1) translate3d(0, 0, 0)';
        heroBgImg.style.opacity = '1';
      }
      base = { headline: null, sub: null, selos: null, emblemas: null, acoes: null, wordmark: null, bg: null };
    }
    return;
  }

  noTopo = false;

  if (heroBgImg) {
    const scaleBg = 1 + t * 0.12;
    const yBg = t * 24;
    heroBgImg.style.transform = `scale(${scaleBg.toFixed(3)}) translate3d(0, ${yBg.toFixed(1)}px, 0)`;
    heroBgImg.style.opacity = clamp(1 - t * 0.75, 0, 1).toFixed(3);
  }

  const opTitulo = clamp(1 - t * 0.9, 0, 1);
  const opSub = clamp(1 - t * 1.25, 0, 1);
  const opSelos = clamp(1 - t * 1.5, 0, 1);
  const opAcoes = clamp(1 - t * 1.4, 0, 1);
  const opEmblemas = clamp(1 - t * 1.6, 0, 1);
  const blurTitulo = t > 0.55 ? ((t - 0.55) / 0.45) * 5 : 0;

  escrever(wordmark, 'wordmark', -t * 26, opSub, 0, 0.6);
  escrever(headline, 'headline', -t * 42, opTitulo, blurTitulo, 0.6);
  escrever(sub, 'sub', -t * 58, opSub, blurTitulo * 0.7, 0.6);
  escrever(selos, 'selos', -t * 70, opSelos, 0, 0.8);
  escrever(acoes, 'acoes', -t * 82, opAcoes, 0, 0.8);
  escrever(emblemas, 'emblemas', -t * 94, opEmblemas, 0, 0.8);
}

function escrever(el, chave, y, opacity, blur, tolerancia) {
  if (!el) return;
  const anterior = base[chave];

  if (anterior &&
      Math.abs(anterior.y - y) < tolerancia &&
      Math.abs(anterior.opacity - opacity) < 0.02 &&
      Math.abs((anterior.blur || 0) - blur) < 0.4) {
    return;
  }
  base[chave] = { y, opacity, blur };

  el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
  el.style.opacity = opacity.toFixed(3);
  el.style.filter = blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : '';
}

export function destruir() {
  ativo = false;
}

export default { iniciarHero, definirProgresso, destruir };
