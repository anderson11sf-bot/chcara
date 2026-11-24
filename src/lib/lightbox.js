/* ============================================================================
 * lightbox.js — VISUALIZADOR EM TELA CHEIA PARA TODAS AS IMAGENS DO SITE
 * ----------------------------------------------------------------------------
 * Permite clicar/tocar em qualquer imagem de conteúdo (inclusive aquelas com
 * sobreposição de gradiente ou legenda) para abri-la inteira (object-fit: contain).
 * ==========================================================================*/

let modalEl = null;
let imgEl = null;
let legendaEl = null;
let iniciado = false;

const SELETORES_CAIXA_IMAGEM = [
  '.sjc-slide-imagem-box',
  '.quadro-projeto-pdf__foto-caixa',
  '.card-profundidade',
  '.localizacao-mapa-caixa',
  '.mapa-oficial-caixa',
  '.patrimonio-foto-destaque',
  '.quadro-autossuf__esquerda',
  '.lifestyle-foto-caixa'
].join(', ');

function criarModal() {
  if (modalEl) return modalEl;

  modalEl = document.createElement('div');
  modalEl.id = 'pd-lightbox';
  modalEl.className = 'lightbox-modal';
  modalEl.setAttribute('role', 'dialog');
  modalEl.setAttribute('aria-modal', 'true');
  modalEl.setAttribute('aria-label', 'Visualização da imagem');
  modalEl.hidden = true;

  const conteudo = document.createElement('div');
  conteudo.className = 'lightbox-modal__conteudo';

  const btnFechar = document.createElement('button');
  btnFechar.type = 'button';
  btnFechar.className = 'lightbox-modal__fechar';
  btnFechar.setAttribute('aria-label', 'Fechar visualização');
  btnFechar.textContent = '✕';

  imgEl = document.createElement('img');
  imgEl.className = 'lightbox-modal__img';
  imgEl.alt = '';

  legendaEl = document.createElement('p');
  legendaEl.className = 'lightbox-modal__legenda';

  conteudo.appendChild(btnFechar);
  conteudo.appendChild(imgEl);
  conteudo.appendChild(legendaEl);
  modalEl.appendChild(conteudo);
  document.body.appendChild(modalEl);

  btnFechar.addEventListener('click', fecharLightbox);
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl || e.target === conteudo) {
      fecharLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalEl && !modalEl.hidden) {
      fecharLightbox();
    }
  });

  return modalEl;
}

export function abrirLightbox(src, alt = '') {
  if (!src) return;
  criarModal();
  imgEl.src = src;
  imgEl.alt = alt || 'Imagem ampliada';
  legendaEl.textContent = alt || '';
  legendaEl.hidden = !alt;
  modalEl.hidden = false;
  document.documentElement.classList.add('lightbox-aberto');
}

export function fecharLightbox() {
  if (!modalEl || modalEl.hidden) return;
  modalEl.hidden = true;
  imgEl.removeAttribute('src');
  document.documentElement.classList.remove('lightbox-aberto');
}

function ehImagemIgnorada(img) {
  if (!img) return true;
  if (img.closest('.barra-topo, .lightbox-modal, .whatsapp-flutuante')) return true;
  if (
    img.classList.contains('hero__bg-img') ||
    img.classList.contains('painel-fundo-img') ||
    img.classList.contains('icone')
  ) {
    return true;
  }
  const rect = img.getBoundingClientRect();
  if (rect.width > 0 && rect.width < 48 && rect.height > 0 && rect.height < 48) {
    return true;
  }
  return false;
}

export function iniciarLightbox() {
  if (iniciado || typeof document === 'undefined') return;
  iniciado = true;

  document.addEventListener('click', (e) => {
    if (e.target.closest('.lightbox-modal, a, button, video')) return;

    let imgAlvo = e.target.closest('img');
    if (ehImagemIgnorada(imgAlvo)) {
      imgAlvo = null;
    }

    if (!imgAlvo) {
      const caixa = e.target.closest(SELETORES_CAIXA_IMAGEM);
      if (caixa) {
        const candidata = caixa.querySelector('img:not(.painel-fundo-img):not(.hero__bg-img)');
        if (candidata && !ehImagemIgnorada(candidata)) {
          imgAlvo = candidata;
        }
      }
    }

    if (!imgAlvo) return;

    const src = imgAlvo.currentSrc || imgAlvo.getAttribute('src');
    if (!src) return;

    e.preventDefault();
    abrirLightbox(src, imgAlvo.getAttribute('alt') || '');
  });
}
