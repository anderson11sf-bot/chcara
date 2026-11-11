/* ============================================================================
 * heroScroll.js — ANIMAÇÃO DE SCROLL DA SESSÃO HERO (Canvas 60 FPS)
 * ----------------------------------------------------------------------------
 * Scrub 1:1 com o scroll do usuário nos frames WebP de alta performance.
 * Sem atraso, sem travamento no mobile, vai e volta seguindo o dedo.
 * ==========================================================================*/

import { clamp } from './utils.js';

const TOTAL_FRAMES = 94;
const PREFIXO = '/media/frames/hero/hero_';
const EXTENSAO = '.webp';

let canvas = null;
let ctx = null;
let larguraCanvas = 0;
let alturaCanvas = 0;
let dpr = 1;

const cacheImagens = new Map();
let frameAtual = 1;
let frameMaisProximo = 1;
let animando = false;
let posterFallback = null;

function pad(num, size = 4) {
  let s = String(num);
  while (s.length < size) s = '0' + s;
  return s;
}

function caminhoFrame(num) {
  return `${PREFIXO}${pad(num)}${EXTENSAO}`;
}

export function iniciarHeroScroll() {
  canvas = document.getElementById('hero-canvas');
  posterFallback = document.getElementById('hero-bg-img');

  if (!canvas) return null;

  ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
  if (!ctx) return null;

  redimensionar();
  window.addEventListener('resize', redimensionar, { passive: true });

  // 1. Carrega o primeiro frame imediatamente (LCP instantâneo)
  carregarFrame(1, (img) => {
    desenharFrame(img);
    if (posterFallback) {
      posterFallback.style.opacity = '0';
      posterFallback.style.pointerEvents = 'none';
    }
  });

  // 2. Pré-carregamento progressivo (1 a cada 3 frames, depois o restante)
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => preCarregarFrames());
  } else {
    setTimeout(preCarregarFrames, 200);
  }

  return { definirProgresso, redimensionar };
}

function redimensionar() {
  if (!canvas || !ctx) return;
  const ret = canvas.getBoundingClientRect();
  dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  larguraCanvas = Math.floor(ret.width * dpr);
  alturaCanvas = Math.floor(ret.height * dpr);

  if (larguraCanvas === 0 || alturaCanvas === 0) {
    larguraCanvas = Math.floor(window.innerWidth * dpr);
    alturaCanvas = Math.floor(window.innerHeight * dpr);
  }

  canvas.width = larguraCanvas;
  canvas.height = alturaCanvas;

  const img = cacheImagens.get(frameAtual) || cacheImagens.get(frameMaisProximo);
  if (img) desenharFrame(img);
}

function carregarFrame(numero, cb) {
  if (cacheImagens.has(numero)) {
    if (cb) cb(cacheImagens.get(numero));
    return;
  }
  const img = new Image();
  img.src = caminhoFrame(numero);
  img.decoding = 'async';
  img.onload = () => {
    cacheImagens.set(numero, img);
    if (numero === 1 || Math.abs(numero - frameAtual) < Math.abs(frameMaisProximo - frameAtual)) {
      frameMaisProximo = numero;
    }
    if (cb) cb(img);
  };
}

function preCarregarFrames() {
  // Passo 1: frames chave
  for (let i = 1; i <= TOTAL_FRAMES; i += 3) {
    carregarFrame(i);
  }
  // Passo 2: preenchimento suave
  setTimeout(() => {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      if (!cacheImagens.has(i)) carregarFrame(i);
    }
  }, 400);
}

function desenharFrame(img) {
  if (!ctx || !img || !img.complete || img.naturalWidth === 0) return;

  const wC = larguraCanvas;
  const hC = alturaCanvas;
  const wI = img.naturalWidth;
  const hI = img.naturalHeight;

  // Object-fit: cover
  const escala = Math.max(wC / wI, hC / hI);
  const wD = wI * escala;
  const hD = hI * escala;
  const xD = (wC - wD) / 2;
  const yD = (hC - hD) / 2;

  ctx.drawImage(img, 0, 0, wI, hI, xD, yD, wD, hD);
}

/**
 * @param {number} p progresso do hero (0 a 1)
 */
export function definirProgresso(p) {
  if (!ctx) return;
  const t = clamp(p, 0, 1);
  const indice = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(t * (TOTAL_FRAMES - 1)) + 1));

  if (indice === frameAtual) return;
  frameAtual = indice;

  const img = cacheImagens.get(indice);
  if (img && img.complete) {
    frameMaisProximo = indice;
    desenharFrame(img);
  } else {
    // Busca o frame disponível mais próximo
    let menorDist = Infinity;
    let melhorFrame = frameMaisProximo;
    for (const [k, im] of cacheImagens.entries()) {
      if (im.complete) {
        const d = Math.abs(k - indice);
        if (d < menorDist) {
          menorDist = d;
          melhorFrame = k;
        }
      }
    }
    frameMaisProximo = melhorFrame;
    const fallback = cacheImagens.get(melhorFrame);
    if (fallback) desenharFrame(fallback);
  }
}

export default { iniciarHeroScroll, definirProgresso };
