/* ============================================================================
 * whatsapp.js — BOTÃO FLUTUANTE DE WHATSAPP + CONVERSÕES RASTREADAS
 * ----------------------------------------------------------------------------
 * O botão fica fixo no canto inferior direito por CSS padrão (#25D366).
 * É arrastável por Pointer Events somente quando o usuário arrasta mais de 6px.
 * Um clique ou toque simples SEMPRE abre a conversa no WhatsApp.
 * ==========================================================================*/

import config from '../config.js';
import { gravarStorage, lerStorage, clamp } from './utils.js';

/* ---------- Montagem de link --------------------------------------------- */

export function lerUtm() {
  if (!config.whatsapp.incluirUtm) return null;
  try {
    const q = new URLSearchParams(window.location.search);
    const utm = {
      source: q.get('utm_source') || '',
      medium: q.get('utm_medium') || '',
      campaign: q.get('utm_campaign') || '',
      content: q.get('utm_content') || '',
      term: q.get('utm_term') || ''
    };
    return Object.values(utm).some(Boolean) ? utm : null;
  } catch {
    return null;
  }
}

export function montarLinkWhatsApp(origem = 'flutuante', extra = {}) {
  const base = config.whatsapp.mensagens[origem] || config.whatsapp.mensagemBase;
  let texto = base.replace('{gleba}', extra.gleba || 'propriedade de 2 hectares');

  if (extra.intencao) texto += ' ' + extra.intencao;

  const utm = lerUtm();
  if (utm) {
    const partes = [];
    if (utm.source) partes.push(`origem: ${utm.source}`);
    if (utm.campaign) partes.push(`campanha: ${utm.campaign}`);
    if (utm.medium) partes.push(`mídia: ${utm.medium}`);
    if (partes.length) texto += ` (${partes.join(' · ')})`;
  }

  const numero = String(config.whatsapp.numero).replace(/\D/g, '');
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

export function rastrearCliqueWhatsApp(origem, dados = {}) {
  const info = { origem, ...dados };
  try {
    if (typeof window.fbq === 'function') window.fbq('track', 'Contact', info);
    if (typeof window.gtag === 'function') window.gtag('event', 'clique_whatsapp', info);
  } catch {
    /* rastreamento não interrompe navegação */
  }
}

export function ligarBotoesWhatsApp(raiz = document) {
  const botoes = raiz.querySelectorAll('[data-wa-origem]');
  botoes.forEach((el) => {
    if (el.dataset.waLigado === '1') return;
    el.dataset.waLigado = '1';

    const origem = el.dataset.waOrigem || 'flutuante';
    const gleba = el.dataset.waGleba || '';
    const intencao = el.dataset.waIntencao || '';

    const hrefAtual = el.getAttribute('href') || '';
    if (hrefAtual.includes('maps.app.goo.gl') || hrefAtual.includes('google.com/maps') || hrefAtual.includes('goo.gl/maps')) {
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
      return;
    }

    el.setAttribute('href', montarLinkWhatsApp(origem, { gleba, intencao }));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');

    const aoClicar = () => rastrearCliqueWhatsApp(origem, gleba ? { gleba } : {});
    el.addEventListener('click', aoClicar);
  });
  return botoes.length;
}

/* ---------- Botão flutuante interativo ---------------------------------- */

const CHAVE_POSICAO = 'pd-wa-pos-v2';
const LIMIAR_ARRASTE = 6;
const MARGEM = 16;

let botao = null;
let arrastando = false;
let moveu = false;
let inicio = { x: 0, y: 0 };
let offset = { x: 0, y: 0 };
let pos = null;
let ponteiroId = null;

export function iniciarWhatsAppFlutuante() {
  botao = document.getElementById('wa-flutuante');
  if (!botao) return null;

  ligarBotoesWhatsApp();

  // Restaura posição arrastada anterior se existir e for válida
  const salva = lerStorage(CHAVE_POSICAO, null);
  if (salva && typeof salva.x === 'number' && typeof salva.y === 'number') {
    if (salva.y > 60 && salva.x > 20 && salva.x < window.innerWidth - 60) {
      pos = { x: salva.x, y: salva.y };
      aplicarPosicao();
    }
  }

  botao.addEventListener('pointerdown', aoPressionar);
  window.addEventListener('pointermove', aoMover);
  window.addEventListener('pointerup', aoSoltar);
  window.addEventListener('pointercancel', aoSoltar);
  botao.addEventListener('click', aoClicar);

  return {
    destruir: () => {
      if (!botao) return;
      botao.removeEventListener('pointerdown', aoPressionar);
      window.removeEventListener('pointermove', aoMover);
      window.removeEventListener('pointerup', aoSoltar);
      window.removeEventListener('pointercancel', aoSoltar);
      botao.removeEventListener('click', aoClicar);
    }
  };
}

function aplicarPosicao() {
  if (!botao || !pos) return;
  botao.style.left = `${pos.x}px`;
  botao.style.top = `${pos.y}px`;
  botao.style.right = 'auto';
  botao.style.bottom = 'auto';
  botao.style.transform = 'none';
}

function aoPressionar(ev) {
  if (ev.button !== undefined && ev.button !== 0) return;

  ponteiroId = ev.pointerId;
  const rect = botao.getBoundingClientRect();
  offset = { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
  inicio = { x: ev.clientX, y: ev.clientY };

  arrastando = true;
  moveu = false;
}

function aoMover(ev) {
  if (!arrastando || ev.pointerId !== ponteiroId) return;

  const dx = ev.clientX - inicio.x;
  const dy = ev.clientY - inicio.y;

  if (!moveu && Math.hypot(dx, dy) < LIMIAR_ARRASTE) return;

  moveu = true;
  botao.classList.add('arrastando');

  const larguraTela = window.innerWidth;
  const alturaTela = window.innerHeight;
  const bW = botao.offsetWidth || 60;
  const bH = botao.offsetHeight || 60;

  const novoX = clamp(ev.clientX - offset.x, MARGEM, larguraTela - bW - MARGEM);
  const novoY = clamp(ev.clientY - offset.y, MARGEM, alturaTela - bH - MARGEM);

  pos = { x: novoX, y: novoY };
  aplicarPosicao();

  if (ev.cancelable) ev.preventDefault();
}

function aoSoltar(ev) {
  if (!arrastando || ev.pointerId !== ponteiroId) return;

  arrastando = false;
  ponteiroId = null;
  botao.classList.remove('arrastando');

  if (moveu && pos) {
    gravarStorage(CHAVE_POSICAO, pos);
  }
}

function aoClicar(ev) {
  if (moveu) {
    ev.preventDefault();
    ev.stopPropagation();
    moveu = false;
  }
}

export default {
  iniciarWhatsAppFlutuante, montarLinkWhatsApp, ligarBotoesWhatsApp,
  rastrearCliqueWhatsApp, lerUtm
};
