/* ============================================================================
 * sessao2Scroll.js — ANIMAÇÃO DE SCROLL DA SESSÃO 2 (Canvas 60 FPS)
 * ----------------------------------------------------------------------------
 * Scrub 1:1 com o scroll dos 104 frames da transição da natureza na Sessão 2.
 * Integração com a abertura cinematográfica do vídeo 3D ao final da sessão.
 * ==========================================================================*/

import { clamp } from './utils.js';

const TOTAL_FRAMES = 90;
const PREFIXO = '/media/frames/sessao2/s2_';
const EXTENSAO = '.webp';

let canvas = null;
let ctx = null;
let larguraCanvas = 0;
let alturaCanvas = 0;
let dpr = 1;

const cacheImagens = new Map();
let frameAtual = 1;
let frameMaisProximo = 1;

function pad(num, size = 4) {
  let s = String(num);
  while (s.length < size) s = '0' + s;
  return s;
}

function caminhoFrame(num) {
  return `${PREFIXO}${pad(num)}${EXTENSAO}`;
}

export function iniciarSessao2Scroll() {
  canvas = document.getElementById('sessao2-canvas');
  if (!canvas) return null;

  ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
  if (!ctx) return null;

  redimensionar();
  window.addEventListener('resize', redimensionar, { passive: true });

  // 1. Carrega o primeiro frame imediatamente
  carregarFrame(1, (img) => {
    desenharFrame(img);
  });

  // 2. Pré-carregamento progressivo
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => preCarregarFrames());
  } else {
    setTimeout(preCarregarFrames, 300);
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
  for (let i = 1; i <= TOTAL_FRAMES; i += 3) {
    carregarFrame(i);
  }
  setTimeout(() => {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      if (!cacheImagens.has(i)) carregarFrame(i);
    }
  }, 500);
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
 * @param {number} p progresso local da Sessão 2 (0 a 1)
 */
export function definirProgresso(p) {
  if (!ctx) return;
  // A animação dos frames cobre os primeiros 75% da Sessão 2; os 25% finais dão espaço para a abertura do vídeo 3D
  const t = clamp(p / 0.75, 0, 1);
  const indice = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(t * (TOTAL_FRAMES - 1)) + 1));

  if (indice === frameAtual) return;
  frameAtual = indice;

  const img = cacheImagens.get(indice);
  if (img && img.complete) {
    frameMaisProximo = indice;
    desenharFrame(img);
  } else {
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

export default { iniciarSessao2Scroll, definirProgresso };
