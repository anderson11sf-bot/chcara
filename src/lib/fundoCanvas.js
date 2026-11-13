/* ============================================================================
 * fundoCanvas.js — FUNDO GLOBAL ANIMADO DO SITE (Scrub de Vídeo Contínuo)
 * ----------------------------------------------------------------------------
 * O vídeo que anteriormente pertencia à primeira sessão agora é o fundo visual
 * contínuo de TODO o site.
 *
 * COMPORTAMENTO:
 * - Acompanha a rolagem da página em sincronia direta com o scroll (0 a 1).
 * - Ao rolar para baixo avança; ao rolar para cima retrocede.
 * - Ciclo contínuo e suave ao longo de toda a navegação (sem saltos).
 * - Desenho cover no canvas 2D acelerado por hardware a 60 FPS.
 * ==========================================================================*/

import { clamp } from './utils.js';

const TOTAL_FRAMES = 94;
const PREFIXO = '/media/frames/fundo_global/fundo_';
const EXTENSAO = '.webp';
const NUM_CICLOS_GLOBAL = 3.5; // Número de voltas completas ao longo do scroll total

let canvas = null;
let ctx = null;
let larguraCanvas = 0;
let alturaCanvas = 0;
let dpr = 1;

const cacheFrames = new Map();
let frameAtual = 1;
let frameMaisProximo = 1;
let rodando = true;
let pUltimo = -1;

function pad(num, size = 4) {
  let s = String(num);
  while (s.length < size) s = '0' + s;
  return s;
}

function caminhoFrame(num) {
  return `${PREFIXO}${pad(num)}${EXTENSAO}`;
}

export function iniciarFundo(elementoCanvas, ambienteDetectado) {
  canvas = elementoCanvas;
  if (!canvas) return null;

  ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
  if (!ctx) return null;

  redimensionar();
  window.addEventListener('resize', redimensionar, { passive: true });

  // 1. Carrega o primeiro frame imediatamente (LCP)
  carregarFrame(1, (img) => {
    desenharFrame(img);
  });

  // 2. Pré-carregamento progressivo em background
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => preCarregar());
  } else {
    setTimeout(preCarregar, 150);
  }

  return { definirProgresso, redimensionar, parar, iniciar };
}

function redimensionar() {
  if (!canvas || !ctx) return;
  dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  larguraCanvas = Math.floor(window.innerWidth * dpr);
  alturaCanvas = Math.floor(window.innerHeight * dpr);

  canvas.width = larguraCanvas;
  canvas.height = alturaCanvas;

  const img = cacheFrames.get(frameAtual) || cacheFrames.get(frameMaisProximo);
  if (img) desenharFrame(img);
}

function carregarFrame(numero, cb) {
  if (cacheFrames.has(numero)) {
    if (cb) cb(cacheFrames.get(numero));
    return;
  }
  const img = new Image();
  img.src = caminhoFrame(numero);
  img.decoding = 'async';
  img.onload = () => {
    cacheFrames.set(numero, img);
    if (numero === 1 || Math.abs(numero - frameAtual) < Math.abs(frameMaisProximo - frameAtual)) {
      frameMaisProximo = numero;
    }
    if (cb) cb(img);
  };
}

function preCarregar() {
  // Carrega em rajadas intercaladas para priorizar fluidez imediata
  for (let i = 1; i <= TOTAL_FRAMES; i += 4) {
    carregarFrame(i);
  }
  setTimeout(() => {
    for (let i = 1; i <= TOTAL_FRAMES; i += 2) {
      if (!cacheFrames.has(i)) carregarFrame(i);
    }
  }, 200);
  setTimeout(() => {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      if (!cacheFrames.has(i)) carregarFrame(i);
    }
  }, 500);
}

function desenharFrame(img) {
  if (!ctx || !img || !img.complete || img.naturalWidth === 0) return;

  const cw = canvas.width;
  const ch = canvas.height;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;

  // Escala para preenchimento cover sem distorção proporcional
  const escala = Math.max(cw / iw, ch / ih);
  const sw = iw * escala;
  const sh = ih * escala;
  const sx = (cw - sw) / 2;
  const sy = (ch - sh) / 2;

  ctx.drawImage(img, 0, 0, iw, ih, sx, sy, sw, sh);
}

let rafId = null;

/**
 * Calcula o progresso cíclico do vídeo de forma contínua e sem saltos visuais.
 * @param {number} scrollProgress (0 a 1)
 * @param {number} numCiclos Número de repetições calibradas para a altura da página
 * @returns {number} Progresso normalizado de 0 a 1 dentro do ciclo
 */
export function calculateLoopedProgress(scrollProgress, numCiclos = 2.5) {
  const progressoTotal = scrollProgress * numCiclos;
  return progressoTotal % 1;
}

function renderizarFrameAtual() {
  if (cacheFrames.has(frameAtual)) {
    desenharFrame(cacheFrames.get(frameAtual));
  } else {
    // Procura o frame mais próximo já disponível em cache para manter a fluidez 60fps
    let maisProximo = frameMaisProximo;
    let menorDist = Math.abs(frameAtual - maisProximo);
    for (const k of cacheFrames.keys()) {
      const d = Math.abs(frameAtual - k);
      if (d < menorDist) {
        menorDist = d;
        maisProximo = k;
      }
    }
    frameMaisProximo = maisProximo;
    if (cacheFrames.has(maisProximo)) {
      desenharFrame(cacheFrames.get(maisProximo));
    }
    carregarFrame(frameAtual, (img) => {
      if (frameAtual === frameAtual) desenharFrame(img);
    });
  }
}

/**
 * Define o progresso de exibição do fundo com base no scroll global (0 a 1).
 * O cálculo é cíclico, reversível e sincronizado via requestAnimationFrame.
 */
export function definirProgresso(pGlobal) {
  if (!rodando || !ctx) return;
  const p = clamp(pGlobal, 0, 1);
  if (Math.abs(p - pUltimo) < 0.0004) return;
  pUltimo = p;

  const progressoCiclo = calculateLoopedProgress(p, NUM_CICLOS_GLOBAL);
  const alvo = Math.min(TOTAL_FRAMES, Math.max(1, Math.floor(progressoCiclo * TOTAL_FRAMES) + 1));

  if (alvo === frameAtual) return;
  frameAtual = alvo;

  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(renderizarFrameAtual);
}

export function parar() {
  rodando = false;
}

export function iniciar() {
  rodando = true;
  redimensionar();
}

export default { iniciarFundo, definirProgresso, redimensionar, parar, iniciar };
