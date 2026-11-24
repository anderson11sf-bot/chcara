/* ============================================================================
 * secoes.js — MONTAGEM DAS SEÇÕES CONFORME DESIGN OFICIAL DO PDF (mobile .pdf)
 * ----------------------------------------------------------------------------
 * Reconstrução fiel da identidade visual do PDF:
 * - Tipografia serifada elegante (Cormorant Garamond) com destaques em verde suave e ouro
 * - Cores: verde floresta profundo, dourado nobre, ciano/verde folha sutil
 * - Eliminação de qualquer aparência de software ou excesso tecnológico
 * - Sete Glebas: remoção do vídeo abaixo do mapa e galeria de fotos reais dos terrenos
 * - Projetos e Inspirações: quadros fotográficos + ticker contínuo horizontal 9:16
 * - Autossuficiência, Patrimônio, Localização, Documentação e Contato 100% fiéis ao PDF
 * ==========================================================================*/

import config from '../config.js';
import { criar, $ } from './utils.js';
import { icone } from './icones.js';

/** Cabeçalho de seção de alto padrão no estilo do PDF */
function cabecalho({ rotulo, titulo, texto }) {
  const frag = document.createDocumentFragment();
  if (rotulo) {
    frag.appendChild(criar('span', { classe: 'rotulo-secao', texto: rotulo }));
  }
  if (titulo) {
    const h2 = criar('h2', { classe: 'secao__titulo' });
    h2.innerHTML = titulo;
    frag.appendChild(h2);
  }
  if (texto) {
    const p = criar('p', { classe: 'secao__apoio secao__apoio--destaque' });
    p.innerHTML = texto;
    frag.appendChild(p);
  }
  return frag;
}

/** Botão de WhatsApp / Ação no estilo do PDF */
function botaoPDF(origem, texto, variante = 'dourado', link = '#') {
  const isExternal = typeof link === 'string' && link.startsWith('http');
  const btn = criar('a', {
    classe: `btn-pdf btn-pdf--${variante} secao__cta`,
    href: link,
    'data-wa-origem': origem,
    rel: isExternal ? 'noopener noreferrer' : 'noopener'
  });
  if (isExternal) {
    btn.setAttribute('target', '_blank');
  }
  btn.innerHTML = `<span>${texto}</span> <span class="btn-pdf__seta" aria-hidden="true">&gt;</span>`;
  return btn;
}

/** Elemento de vídeo responsivo */
function criarVideoFrame({ src, poster, legenda, proporcao = '16-9' }) {
  const moldura = criar('div', { classe: `video-moldura video-moldura--${proporcao}` });
  const video = criar('video', {
    classe: 'video-player',
    src,
    poster,
    preload: 'metadata',
    playsinline: '',
    controls: ''
  });
  moldura.appendChild(video);

  if (legenda) {
    moldura.appendChild(criar('span', { classe: 'video-legenda-tag', texto: legenda }));
  }

  return moldura;
}

/** Cria painel com fundo dinâmico em vídeo contínuo de cachoeira tropical (ou imagem na Seção 3) e overlay fosco elegante */
function criarPainel(classeExtra = '', opcoes = {}) {
  const painel = criar('div', { classe: `painel ${classeExtra}`.trim() });

  if (opcoes.usarImagem) {
    const picture = criar('picture', { classe: 'painel-fundo-picture' });
    if (opcoes.mobileSrc) {
      picture.appendChild(criar('source', {
        srcset: opcoes.mobileSrc,
        media: '(max-width: 768px)',
        type: 'image/webp'
      }));
    }
    picture.appendChild(criar('source', {
      srcset: opcoes.desktopSrc || '/images/secao3-bg.webp',
      type: 'image/webp'
    }));
    picture.appendChild(criar('img', {
      classe: 'painel-fundo-img',
      src: opcoes.desktopSrc || '/images/secao3-bg.webp',
      alt: 'Mais espaço, mais natureza',
      loading: 'lazy',
      decoding: 'async'
    }));
    painel.appendChild(picture);
  } else {
    const videoCachoeira = criar('video', {
      classe: 'painel-fundo-video',
      poster: '/media/img/cachoeira-poster.webp',
      muted: '',
      loop: '',
      playsinline: '',
      preload: 'none',
      'aria-hidden': 'true'
    });
    videoCachoeira.muted = true;
    videoCachoeira.playsInline = true;
    videoCachoeira.loop = true;

    // Fontes leves para web (WebM 693 KB e MP4 H.264 1.55 MB)
    const sourceWebm = criar('source', { src: '/media/video/cachoeira-fundo.webm', type: 'video/webm' });
    const sourceMp4 = criar('source', { src: '/media/video/cachoeira-fundo.mp4', type: 'video/mp4' });
    videoCachoeira.appendChild(sourceWebm);
    videoCachoeira.appendChild(sourceMp4);

    painel.appendChild(videoCachoeira);
  }

  const overlayCachoeira = criar('div', {
    classe: 'painel-fundo-overlay',
    'aria-hidden': 'true'
  });
  painel.appendChild(overlayCachoeira);

  return painel;
}

/* --------------------------------------------------------------------------
 * 03. APRESENTAÇÃO: CONHEÇA O PARAÍSO (PÁGINAS 3 E 7 DO PDF)
 * ------------------------------------------------------------------------ */
export function montarEfeitoParaiso() {
  const secao = $('#efeito-paraiso');
  if (!secao) return null;

  const P = config.efeitoParaiso;
  const painel = criarPainel('', {
    usarImagem: true,
    desktopSrc: '/images/secao3-bg.webp',
    mobileSrc: '/images/secao3-bg-m.webp'
  });

  painel.appendChild(cabecalho({
    rotulo: P.rotulo,
    titulo: P.titulo,
    texto: P.subtitulo
  }));

  // Vídeo de apresentação oficial (com auto-play silencioso quando atinge o centro da tela)
  if (P.video) {
    const videoMoldura = criarVideoFrame(P.video);
    painel.appendChild(videoMoldura);
    const videoEl = videoMoldura.querySelector('video');
    if (videoEl && typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      videoEl.muted = true;
      videoEl.playsInline = true;
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoEl.play().catch(() => {});
          } else {
            videoEl.pause();
          }
        });
      }, {
        threshold: 0.25,
        rootMargin: '-20% 0px -20% 0px'
      });
      obs.observe(videoEl);
    }
  }

  // Carrossel com profundidade dos 3 cards de destaque da terra
  if (P.carrosselCards && P.carrosselCards.length > 0) {
    const carrosselCaixa = criar('div', { classe: 'carrossel-profundidade' });
    const gradeCards = criar('div', { classe: 'carrossel-profundidade__grade' });

    for (const cardData of P.carrosselCards) {
      const card = criar('div', { classe: 'card-profundidade' });
      card.appendChild(criar('img', {
        classe: 'card-profundidade__img',
        src: cardData.imagem,
        alt: cardData.titulo,
        loading: 'lazy',
        decoding: 'async',
        width: '420',
        height: '560'
      }));
      const info = criar('div', { classe: 'card-profundidade__info' });
      info.appendChild(criar('h3', { classe: 'card-profundidade__titulo', texto: cardData.titulo }));
      if (cardData.tag) {
        info.appendChild(criar('span', { classe: 'card-profundidade__tag', texto: cardData.tag }));
      }
      card.appendChild(info);
      gradeCards.appendChild(card);
    }

    carrosselCaixa.appendChild(gradeCards);
    painel.appendChild(carrosselCaixa);
  }

  painel.appendChild(criar('hr', { classe: 'divisor-lago' }));
  painel.appendChild(botaoPDF('vsl', P.ctaTexto || 'Explorar os Lotes →', 'dourado'));

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 04. AS SETE GLEBAS (PÁGINA 4 DO PDF — VÍDEO REMOVIDO, MAPA COM FUNDO DRONE)
 * ------------------------------------------------------------------------ */
export function montarPropriedades() {
  const secao = $('#propriedades');
  if (!secao) return null;

  const P = config.propriedades;
  const painel = criarPainel();

  if (P.escassezDestaque) {
    const badgeEscassez = criar('div', { classe: 'hero__aviso-escassez' });
    badgeEscassez.innerHTML = `<span class="hero__aviso-escassez-ponto"></span> ${P.escassezDestaque}`;
    painel.appendChild(badgeEscassez);
  }

  painel.appendChild(cabecalho({
    rotulo: P.rotulo,
    titulo: P.titulo,
    texto: P.subtitulo
  }));

  // Destaques comerciais: 5 Casas Prontas, a partir de 20.000 m², R$ 485 mil
  if (P.destaquesComerciais && P.destaquesComerciais.length > 0) {
    const painelComercial = criar('div', { classe: 'glebas-painel-comercial' });
    for (const d of P.destaquesComerciais) {
      const item = criar('div', { classe: 'glebas-stat-item' });
      item.appendChild(criar('div', {
        classe: d.numero.includes('R$') ? 'glebas-stat-num glebas-stat-preco' : 'glebas-stat-num',
        texto: d.numero
      }));
      item.appendChild(criar('div', {
        classe: 'glebas-stat-rotulo',
        texto: d.rotulo
      }));
      item.appendChild(criar('div', {
        classe: 'glebas-stat-desc',
        texto: d.descricao
      }));
      painelComercial.appendChild(item);
    }
    painel.appendChild(painelComercial);
  }

  // Mapa oficial das Sete Glebas em alta resolução com fundo em vídeo de drone e botão Google Maps
  if (P.mapaImagem) {
    const mapaCaixa = criar('div', { classe: 'mapa-oficial-caixa' });

    if (P.mapaVideoFundo) {
      const droneBg = criar('video', {
        classe: 'mapa-drone-video-bg',
        src: P.mapaVideoFundo,
        autoplay: '',
        muted: '',
        loop: '',
        playsinline: '',
        preload: 'auto',
        'aria-hidden': 'true'
      });
      droneBg.muted = true;
      droneBg.playsInline = true;
      droneBg.autoplay = true;
      droneBg.loop = true;
      mapaCaixa.appendChild(droneBg);
    }

    const pictureMapa = criar('picture', { classe: 'mapa-oficial-picture' });
    const sourceWebp = criar('source', { srcset: '/media/img/mapa-oficial-terreno.webp', type: 'image/webp' });
    const imgMapa = criar('img', {
      classe: 'mapa-oficial-img',
      src: '/media/img/mapa-oficial-terreno.png',
      alt: 'Mapa das Sete Glebas no Paraíso das Águas',
      loading: 'eager',
      decoding: 'async',
      width: '1123',
      height: '1418'
    });
    pictureMapa.appendChild(sourceWebp);
    pictureMapa.appendChild(imgMapa);
    mapaCaixa.appendChild(pictureMapa);

    const barraAcaoMapa = criar('div', { classe: 'mapa-oficial-barra' });
    const btnMapa = criar('a', {
      classe: 'btn-mapa-interativo btn-pdf btn-pdf--dourado',
      href: P.mapsLink || 'https://maps.app.goo.gl/AztxJXPuLWaPUBSWA',
      target: '_blank',
      rel: 'noopener noreferrer'
    });
    btnMapa.innerHTML = `<span>${P.botaoMapa || 'VER LOCALIZAÇÃO NO GOOGLE MAPS'}</span> <span class="btn-pdf__seta" aria-hidden="true">&gt;</span>`;
    barraAcaoMapa.appendChild(btnMapa);
    mapaCaixa.appendChild(barraAcaoMapa);

    painel.appendChild(mapaCaixa);
  }

  // Faixa de valor referencial
  if (P.referenciaComercial) {
    painel.appendChild(criar('div', {
      classe: 'faixa-comercial-referencia',
      texto: P.referenciaComercial
    }));
  }

  painel.appendChild(criar('hr', { classe: 'divisor-lago' }));
  painel.appendChild(botaoPDF('propriedades', 'Verificar disponibilidade das glebas no WhatsApp', 'dourado'));

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 05. INFRAESTRUTURA COMPLETA (PÁGINA 5 DO PDF — 4 CARDS HORIZONTAIS DE VIDRO)
 * ------------------------------------------------------------------------ */
export function montarInfraestrutura() {
  const secao = $('#infraestrutura');
  if (!secao) return null;

  const I = config.infraestrutura;
  const painel = criarPainel();

  painel.appendChild(cabecalho({
    rotulo: I.rotulo,
    titulo: I.titulo,
    texto: I.subtitulo
  }));

  const grade = criar('div', { classe: 'grade-infra-pdf' });
  for (const c of I.cards) {
    const card = criar('div', { classe: 'card-infra-pdf' });

    const icCaixa = criar('div', { classe: 'card-infra-pdf__icone' });
    icCaixa.innerHTML = icone(c.icone, { tamanho: 28 });
    card.appendChild(icCaixa);

    const corpo = criar('div', { classe: 'card-infra-pdf__corpo' });
    corpo.appendChild(criar('h3', { classe: 'card-infra-pdf__titulo', texto: c.titulo }));
    corpo.appendChild(criar('p', { classe: 'card-infra-pdf__texto', texto: c.texto }));
    card.appendChild(corpo);

    grade.appendChild(card);
  }
  painel.appendChild(grade);

  painel.appendChild(criar('hr', { classe: 'divisor-lago' }));
  painel.appendChild(botaoPDF('infraestrutura', 'Tirar dúvidas sobre a infraestrutura', 'vidro'));

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 06. PROJETOS E POSSIBILIDADES (PÁGINAS 6 & 12 DO PDF)
 * ------------------------------------------------------------------------ */
export function montarPossibilidades() {
  const secao = $('#possibilidades');
  if (!secao) return null;

  const P = config.possibilidades;
  const painel = criarPainel('painel--largo');

  painel.appendChild(cabecalho({
    rotulo: P.rotulo,
    titulo: P.titulo,
    texto: P.subtitulo
  }));

  // Galeria fotográfica em quadros com profundidade
  const galeriaCaixa = criar('div', { classe: 'galeria-projetos-pdf', id: 'galeria-projetos-pdf' });
  for (let i = 0; i < P.quadros.length; i++) {
    const q = P.quadros[i];
    const quadro = criar('article', {
      classe: `quadro-projeto-pdf ${i === 0 ? 'quadro-projeto-pdf--principal' : ''}`,
      'data-indice': i
    });

    const fotoCaixa = criar('div', { classe: 'quadro-projeto-pdf__foto-caixa' });
    fotoCaixa.appendChild(criar('img', {
      classe: `quadro-projeto-pdf__foto ${q.id === 'chale-imbuia' ? 'quadro-projeto-pdf__foto--imbuia' : ''}`,
      src: q.imagem,
      alt: q.tituloCompleto,
      loading: 'lazy',
      decoding: 'async',
      width: '900',
      height: '560'
    }));

    if (q.badge) {
      fotoCaixa.appendChild(criar('span', {
        classe: 'quadro-projeto-pdf__badge',
        texto: q.badge
      }));
    }

    const barraTitulo = criar('div', { classe: 'quadro-projeto-pdf__barra' });
    barraTitulo.innerHTML = `<h3 class="quadro-projeto-pdf__titulo">${q.titulo}</h3> <span class="quadro-projeto-pdf__seta">&gt;</span>`;
    fotoCaixa.appendChild(barraTitulo);

    quadro.appendChild(fotoCaixa);
    galeriaCaixa.appendChild(quadro);
  }
  painel.appendChild(galeriaCaixa);

  // Ticker permanente horizontal contínuo com vídeos 9:16 verticais
  if (P.videosTicker && P.videosTicker.length > 0) {
    const tickerContainer = criar('div', { classe: 'ticker-videos-container' });
    const tickerFaixa = criar('div', { classe: 'ticker-videos-faixa' });

    // Duplicar a lista para fluxo contínuo infinito sem cortes visuais
    const listaDuplicada = [...P.videosTicker, ...P.videosTicker];
    for (const vid of listaDuplicada) {
      const itemVid = criar('div', { classe: 'ticker-video-item' });
      const video = criar('video', {
        classe: 'ticker-video-player',
        src: vid.src,
        poster: vid.poster,
        preload: 'none',
        playsinline: '',
        muted: '',
        loop: ''
      });
      video.muted = true;
      itemVid.appendChild(video);

      const legenda = criar('span', { classe: 'ticker-video-legenda', texto: vid.titulo });
      itemVid.appendChild(legenda);
      tickerFaixa.appendChild(itemVid);
    }
    tickerContainer.appendChild(tickerFaixa);
    painel.appendChild(tickerContainer);
  }

  // Aviso legal obrigatório
  painel.appendChild(criar('div', {
    classe: 'aviso-legal-box',
    texto: P.avisoLegal
  }));

  painel.appendChild(criar('hr', { classe: 'divisor-lago' }));
  painel.appendChild(botaoPDF('possibilidades', 'Conversar sobre ideias de projeto no WhatsApp', 'dourado'));

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 07. VIDA AUTOSSUFICIENTE: O QUINTAL PRODUTIVO (QUADRO IMAGEM ESQ / TÍTULOS DIR)
 * ------------------------------------------------------------------------ */
export function montarAutossuficiencia() {
  const secao = $('#autossuficiencia');
  if (!secao) return null;

  const A = config.autossuficiencia;
  const painel = criarPainel('painel--largo');

  // Headline / Banner de transição narrativa da Sessão 6 para a 7 (conforme solicitado)
  const transicaoBanner = criar('div', { classe: 'transicao-s6-s7' });
  transicaoBanner.innerHTML = `
    <span class="transicao-s6-s7__rotulo">${A.rotulo || 'AUTONOMIA &amp; SAÚDE FAMILIAR'}</span>
    <h2 class="transicao-s6-s7__titulo">${A.titulo || 'Vida Autossustentável: <span class="destaque-verde">O Quintal Produtivo</span>'}</h2>
    <p class="transicao-s6-s7__sub">${A.subtitulo || 'Produza parte dos próprios alimentos e viva em contato com a terra fértil.'}</p>
  `;
  painel.appendChild(transicaoBanner);

  // Quadro mestre: Imagens na Esquerda, Títulos na Direita com animação
  const quadroMestre = criar('div', { classe: 'quadro-autossuf-mestre' });

  // Coluna Esquerda: Moldura fotográfica com transição suave
  const esqCol = criar('div', { classe: 'quadro-autossuf__esquerda' });
  const imgPrincipal = criar('img', {
    classe: 'quadro-autossuf__img-principal',
    src: A.cards[0].imagem,
    alt: A.cards[0].titulo,
    loading: 'lazy',
    decoding: 'async',
    width: '640',
    height: '480'
  });
  esqCol.appendChild(imgPrincipal);
  quadroMestre.appendChild(esqCol);

  // Coluna Direita: Títulos interativos com ícones e animação
  const dirCol = criar('div', { classe: 'quadro-autossuf__direita' });
  A.cards.forEach((card, idx) => {
    const item = criar('div', {
      classe: `quadro-autossuf__item ${idx === 0 ? 'ativo' : ''}`,
      'data-indice': idx
    });

    const icSpan = criar('span', { classe: 'quadro-autossuf__item-icone' });
    icSpan.innerHTML = icone(card.icone, { tamanho: 24 });
    item.appendChild(icSpan);

    const corpo = criar('div', { classe: 'quadro-autossuf__item-corpo' });
    corpo.appendChild(criar('h3', { classe: 'quadro-autossuf__item-titulo', texto: card.titulo }));
    corpo.appendChild(criar('p', { classe: 'quadro-autossuf__item-sub', texto: card.sub }));
    item.appendChild(corpo);

    item.addEventListener('mouseenter', () => {
      quadroMestre.querySelectorAll('.quadro-autossuf__item').forEach(el => el.classList.remove('ativo'));
      item.classList.add('ativo');
      imgPrincipal.style.opacity = '0.35';
      imgPrincipal.style.transform = 'scale(0.98)';
      setTimeout(() => {
        imgPrincipal.src = card.imagem;
        imgPrincipal.alt = card.titulo;
        imgPrincipal.style.opacity = '1';
        imgPrincipal.style.transform = 'scale(1)';
      }, 140);
    });

    item.addEventListener('click', () => {
      quadroMestre.querySelectorAll('.quadro-autossuf__item').forEach(el => el.classList.remove('ativo'));
      item.classList.add('ativo');
      imgPrincipal.src = card.imagem;
      imgPrincipal.alt = card.titulo;
    });

    dirCol.appendChild(item);
  });
  quadroMestre.appendChild(dirCol);
  painel.appendChild(quadroMestre);

  painel.appendChild(criar('hr', { classe: 'divisor-lago' }));
  painel.appendChild(botaoPDF('autossuficiencia', A.botaoTexto || 'Conhecer o Paraíso >', 'dourado'));

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 08. PATRIMÔNIO PARA COMPARTILHAR (PÁGINA 10 DO PDF)
 * ------------------------------------------------------------------------ */
export function montarCompartilhar() {
  const secao = $('#compartilhar');
  if (!secao) return null;

  const C = config.compartilhar;
  const painel = criarPainel();

  // Foto de destaque da família no campo (Página 10 do PDF)
  if (C.imagemPrincipal) {
    const fotoDestaque = criar('div', { classe: 'patrimonio-foto-destaque' });
    fotoDestaque.appendChild(criar('img', {
      classe: 'patrimonio-foto-img',
      src: C.imagemPrincipal,
      alt: 'Família no campo — Paraíso das Águas',
      loading: 'lazy',
      decoding: 'async',
      width: '1200',
      height: '700'
    }));
    painel.appendChild(fotoDestaque);
  }

  painel.appendChild(cabecalho({
    rotulo: C.rotulo,
    titulo: C.titulo,
    texto: C.subtitulo
  }));

  // 3 Cards horizontais de vidro
  const gradeCards = criar('div', { classe: 'grade-patrimonio-cards' });
  for (const c of C.cards) {
    const card = criar('div', { classe: 'card-patrimonio-item' });

    const icBox = criar('div', { classe: 'card-patrimonio-item__icone' });
    icBox.innerHTML = icone(c.icone, { tamanho: 24 });
    card.appendChild(icBox);

    const corpo = criar('div', { classe: 'card-patrimonio-item__corpo' });
    corpo.appendChild(criar('h3', { classe: 'card-patrimonio-item__titulo', texto: c.titulo }));
    corpo.appendChild(criar('p', { classe: 'card-patrimonio-item__texto', texto: c.texto }));
    card.appendChild(corpo);

    gradeCards.appendChild(card);
  }
  painel.appendChild(gradeCards);

  painel.appendChild(criar('hr', { classe: 'divisor-lago' }));
  painel.appendChild(botaoPDF('compartilhar', C.botaoTexto || 'CONVERSE COM NOSSA EQUIPE >', 'dourado'));

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 09. SÃO JOSÉ DOS CAMPOS & REPRESA JAGUARI (VÍDEO VERTICAL 9:16 EM PÉ)
 * ------------------------------------------------------------------------ */
export function montarSaoJose() {
  const secao = $('#sao-jose');
  if (!secao) return null;

  const S = config.saoJose;
  if (!S) return secao;

  const painel = criarPainel('painel--largo');

  painel.appendChild(cabecalho({
    rotulo: S.rotulo || 'VALORIZAÇÃO IMOBILIÁRIA & PROTEÇÃO PATRIMONIAL',
    titulo: S.titulo || 'São José dos Campos: qualidade de vida em nível Suíça e liderança em valorização',
    texto: S.subtitulo || 'Valorização consistente, infraestrutura de ponta e grandes projetos que protegem o patrimônio da família.'
  }));

  // 1. Layout de Notícias: Card Compacto (Notícia 1) + Carrossel (Notícias 2 e 3)
  const layoutNoticias = criar('div', { classe: 'sjc-noticias-layout' });

  // Notícia 1: Card Compacto (sem imagem)
  const cardCompacto = criar('article', { classe: 'sjc-noticia-compacta' });
  const corpoCompacto = criar('div');
  corpoCompacto.appendChild(criar('span', { classe: 'sjc-noticia-compacta__tag', texto: 'VALORIZAÇÃO IMOBILIÁRIA' }));
  corpoCompacto.appendChild(criar('h3', { classe: 'sjc-noticia-compacta__titulo', texto: '1º lugar no m² do interior de SP' }));
  corpoCompacto.appendChild(criar('p', {
    classe: 'sjc-noticia-compacta__texto',
    texto: 'São José lidera o valor do metro quadrado no interior paulista (Índice FipeZAP), com valorização consistente nos últimos 10 anos.'
  }));
  cardCompacto.appendChild(corpoCompacto);

  const linksCompacto = criar('div', { classe: 'sjc-slide-links' });
  const linkG1 = criar('a', {
    classe: 'link-materia-jornal',
    href: 'https://g1.globo.com/sp/vale-do-paraiba-regiao/noticia/2026/10/21/preco-do-metro-quadrado-em-sao-jose-dos-campos-chega-a-r-96-mil-e-lidera-ranking-no-interior-de-sp.ghtml',
    target: '_blank',
    rel: 'noopener noreferrer'
  });
  linkG1.innerHTML = '<span>Ler matéria no G1</span> <span aria-hidden="true">↗</span>';
  linksCompacto.appendChild(linkG1);
  cardCompacto.appendChild(linksCompacto);
  layoutNoticias.appendChild(cardCompacto);

  // Carrossel com Notícias 2 e 3
  const carrosselContainer = criar('div', { classe: 'sjc-noticias-carrossel', id: 'sjc-noticias-carrossel' });
  const trilho = criar('div', { classe: 'sjc-carrossel-trilho' });

  // Slide 1 (Notícia 2: Suíça)
  const slide1 = criar('article', { classe: 'sjc-carrossel-slide' });
  const imgBox1 = criar('div', { classe: 'sjc-slide-imagem-box' });
  imgBox1.appendChild(criar('img', {
    src: '/media/img/noticias/noticia-suica.webp',
    alt: 'São José dos Campos — Qualidade de vida em nível Suíça',
    loading: 'lazy',
    decoding: 'async',
    width: '896',
    height: '504'
  }));
  imgBox1.appendChild(criar('span', { classe: 'sjc-slide-badge', texto: 'Sugestão ilustrativa' }));
  const overlay1 = criar('div', { classe: 'sjc-slide-overlay' });
  overlay1.appendChild(criar('h3', { classe: 'sjc-slide-titulo', texto: 'Nível Suíça em qualidade de vida' }));
  overlay1.appendChild(criar('p', { classe: 'sjc-slide-frase', texto: 'Primeira cidade do mundo com selo Platina ISO 37125, que avalia 133 indicadores de qualidade de vida e sustentabilidade.' }));
  imgBox1.appendChild(overlay1);
  slide1.appendChild(imgBox1);

  const corpo1 = criar('div', { classe: 'sjc-slide-corpo' });
  corpo1.appendChild(criar('p', {
    classe: 'sjc-slide-texto',
    texto: 'Um reconhecimento desse nível atrai moradores e investimentos e valoriza quem tem patrimônio por perto. O IDH da cidade é considerado muito alto.'
  }));
  const links1 = criar('div', { classe: 'sjc-slide-links' });
  const linkGazeta = criar('a', {
    classe: 'link-materia-jornal',
    href: 'https://www.gazetasp.com.br/turismo/cidade-em-sp-vence-suica-e-noruega-e-vira-a-1-do-mundo-a-atingir-o/',
    target: '_blank',
    rel: 'noopener noreferrer'
  });
  linkGazeta.innerHTML = '<span>Ler matéria na Gazeta de SP</span> <span aria-hidden="true">↗</span>';
  links1.appendChild(linkGazeta);
  corpo1.appendChild(links1);
  slide1.appendChild(corpo1);
  trilho.appendChild(slide1);

  // Slide 2 (Notícia 3: Parque)
  const slide2 = criar('article', { classe: 'sjc-carrossel-slide' });
  const imgBox2 = criar('div', { classe: 'sjc-slide-imagem-box' });
  imgBox2.appendChild(criar('img', {
    src: '/media/img/noticias/noticia-parque.webp',
    alt: 'Parque da Cidade Roberto Burle Marx',
    loading: 'lazy',
    decoding: 'async',
    width: '896',
    height: '504'
  }));
  imgBox2.appendChild(criar('span', { classe: 'sjc-slide-badge', texto: 'Sugestão ilustrativa' }));
  const overlay2 = criar('div', { classe: 'sjc-slide-overlay' });
  overlay2.appendChild(criar('h3', { classe: 'sjc-slide-titulo', texto: 'Novo Parque da Cidade' }));
  overlay2.appendChild(criar('p', { classe: 'sjc-slide-frase', texto: 'A concessão do Parque Roberto Burle Marx foi aprovada. O projeto prevê roda-gigante, teleférico, passarelas elevadas, novo teatro e centro de convenções.' }));
  imgBox2.appendChild(overlay2);
  slide2.appendChild(imgBox2);

  const corpo2 = criar('div', { classe: 'sjc-slide-corpo' });
  corpo2.appendChild(criar('p', {
    classe: 'sjc-slide-texto',
    texto: 'Novas atrações, turismo e eventos tendem a aquecer toda a região, e o Paraíso das Águas fica a cerca de 6 km do parque.'
  }));
  const links2 = criar('div', { classe: 'sjc-slide-links' });
  const linkMeon = criar('a', {
    classe: 'link-materia-jornal',
    href: 'https://www.meon.com.br/noticias/vale-do-paraiba-regiao/sao-jose-dos-campos/aprovada-concessao-parque-da-cidade-sjc-35-anos',
    target: '_blank',
    rel: 'noopener noreferrer'
  });
  linkMeon.innerHTML = '<span>Ler matéria da concessão</span> <span aria-hidden="true">↗</span>';
  links2.appendChild(linkMeon);

  const linkPref = criar('a', {
    classe: 'link-materia-jornal',
    href: 'https://www.sjc.sp.gov.br/noticias/2026/janeiro/05/retrospectiva-2025-parcerias-e-concessoes-projetam-o-futuro/',
    target: '_blank',
    rel: 'noopener noreferrer'
  });
  linkPref.innerHTML = '<span>Ver retrospectiva da Prefeitura</span> <span aria-hidden="true">↗</span>';
  links2.appendChild(linkPref);
  corpo2.appendChild(links2);
  slide2.appendChild(corpo2);
  trilho.appendChild(slide2);

  carrosselContainer.appendChild(trilho);

  // Dots
  const dotsBox = criar('div', { classe: 'sjc-carrossel-dots' });
  const dot1 = criar('button', { classe: 'sjc-carrossel-dot ativo', 'data-indice': '0', 'aria-label': 'Ir para notícia 2' });
  const dot2 = criar('button', { classe: 'sjc-carrossel-dot', 'data-indice': '1', 'aria-label': 'Ir para notícia 3' });
  dotsBox.appendChild(dot1);
  dotsBox.appendChild(dot2);
  carrosselContainer.appendChild(dotsBox);

  layoutNoticias.appendChild(carrosselContainer);
  painel.appendChild(layoutNoticias);

  // 2. Apresentação visual com vídeo vertical de SJC e destaques de mobilidade (PRESERVADA 100%)
  const gradeVertical = criar('div', { classe: 'grade-sjc-vertical' });

  // Player vertical contínuo da Ponte Estaiada (autoplay quando visível, muted, loop, playsinline, SEM controles)
  const videoCaixa = criar('div', { classe: 'sjc-video-vertical-caixa' });
  const videoMoldura = criar('div', { classe: 'video-moldura video-moldura--9-16' });
  const videoEl = criar('video', {
    classe: 'video-player video-player--autoplay video-player--sao-jose',
    src: S.video.src,
    poster: S.video.poster,
    muted: '',
    loop: '',
    playsinline: '',
    preload: 'none'
  });
  videoEl.muted = true;
  videoMoldura.appendChild(videoEl);

  if (S.video.legenda) {
    videoMoldura.appendChild(criar('span', { classe: 'video-legenda-tag', texto: S.video.legenda }));
  }
  videoCaixa.appendChild(videoMoldura);
  gradeVertical.appendChild(videoCaixa);

  // Coluna de textos e distâncias estratégicas
  const infoCol = criar('div', { classe: 'sjc-info-vertical' });
  if (S.textoApoio) {
    const pApoio = criar('p', { classe: 'secao__apoio secao__apoio--destaque' });
    pApoio.innerHTML = S.textoApoio;
    infoCol.appendChild(pApoio);
  }

  const gradeDestaques = criar('div', { classe: 'grade-sjc-destaques' });
  for (const d of S.destaques) {
    const card = criar('div', { classe: 'card-sjc' });
    card.appendChild(criar('div', { classe: 'card-sjc__valor', texto: d.valor }));
    card.appendChild(criar('h4', { classe: 'card-sjc__titulo', texto: d.titulo }));
    card.appendChild(criar('p', { classe: 'card-sjc__texto', texto: d.texto }));
    gradeDestaques.appendChild(card);
  }
  infoCol.appendChild(gradeDestaques);

  infoCol.appendChild(criar('hr', { classe: 'divisor-lago' }));
  infoCol.appendChild(botaoPDF('saoJose', S.botaoTexto || 'Conversar sobre valorização no WhatsApp', 'dourado'));
  gradeVertical.appendChild(infoCol);

  painel.appendChild(gradeVertical);

  secao.replaceChildren(painel);
  secao.hidden = false;

  iniciarCarrosselNoticias();

  return secao;
}

/**
 * Inicializador do Carrossel de Notícias SJC (Auto-rotação ~6s, dots, swipe touch e pause no hover)
 */
export function iniciarCarrosselNoticias() {
  const container = document.getElementById('sjc-noticias-carrossel');
  if (!container || container.dataset.iniciado === '1') return;
  container.dataset.iniciado = '1';

  const trilho = container.querySelector('.sjc-carrossel-trilho');
  const dots = container.querySelectorAll('.sjc-carrossel-dot');
  if (!trilho || !dots.length) return;

  let indice = 0;
  const total = dots.length;
  let timer = null;

  function irPara(idx) {
    indice = (idx + total) % total;
    trilho.style.transform = 'translateX(-' + (indice * 50) + '%)';
    dots.forEach((d, i) => d.classList.toggle('ativo', i === indice));
  }

  function proximo() {
    irPara(indice + 1);
  }

  function iniciarTimer() {
    pararTimer();
    timer = setInterval(proximo, 6000);
  }

  function pararTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  dots.forEach(d => {
    d.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = parseInt(d.getAttribute('data-indice') || '0', 10);
      irPara(idx);
      iniciarTimer();
    });
  });

  // Pausa ao passar o mouse
  container.addEventListener('mouseenter', pararTimer);
  container.addEventListener('mouseleave', iniciarTimer);

  // Swipe touch para celulares
  let startX = 0;
  let endX = 0;

  container.addEventListener('touchstart', (e) => {
    pararTimer();
    startX = e.touches[0].clientX;
    endX = startX;
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    endX = e.touches[0].clientX;
  }, { passive: true });

  container.addEventListener('touchend', () => {
    const diff = endX - startX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        irPara(indice + 1);
      } else {
        irPara(indice - 1);
      }
    }
    iniciarTimer();
  }, { passive: true });

  iniciarTimer();
}

/* --------------------------------------------------------------------------
 * 11. LOCALIZAÇÃO PRIVILEGIADA (PÁGINA 3 DO PDF)
 * ------------------------------------------------------------------------ */
export function montarLocalizacao() {
  const secao = $('#localizacao');
  if (!secao) return null;

  const L = config.localizacao;
  const painel = criarPainel();

  painel.appendChild(cabecalho({
    rotulo: L.rotulo,
    titulo: L.titulo,
    texto: L.subtitulo
  }));

  // Imagem aérea panorâmica da cidade e relevo com pin "PARAÍSO DAS ÁGUAS"
  if (L.imagemAerea) {
    const mapaCaixa = criar('div', { classe: 'localizacao-mapa-caixa' });

    if (L.videoFundo) {
      const droneBg = criar('video', {
        classe: 'localizacao-mapa-video-bg',
        src: L.videoFundo,
        muted: '',
        loop: '',
        playsinline: '',
        preload: 'none',
        'aria-hidden': 'true'
      });
      droneBg.muted = true;
      mapaCaixa.appendChild(droneBg);
    }

    mapaCaixa.appendChild(criar('img', {
      classe: 'localizacao-mapa-img',
      src: L.imagemAerea,
      alt: 'Localização do Paraíso das Águas próximo a São José dos Campos',
      loading: 'eager',
      decoding: 'async',
      width: '1200',
      height: '680'
    }));

    const pinTag = criar('div', { classe: 'pin-paraiso-marcador' });
    pinTag.innerHTML = `
      <span class="pin-paraiso-icone"></span>
      <span class="pin-paraiso-texto">PARAÍSO<br>DAS ÁGUAS</span>
    `;
    mapaCaixa.appendChild(pinTag);
    painel.appendChild(mapaCaixa);
  }

  // 3 Cards de tempo de deslocamento
  const gradeDist = criar('div', { classe: 'grade-distancias-pdf' });
  for (const d of L.distancias) {
    const card = criar('div', { classe: 'card-distancia-pdf' });

    const icBox = criar('div', { classe: 'card-distancia-pdf__icone' });
    icBox.innerHTML = icone(d.icone, { tamanho: 24 });
    card.appendChild(icBox);

    const info = criar('div', { classe: 'card-distancia-pdf__info' });
    info.appendChild(criar('span', { classe: 'card-distancia-pdf__valor', texto: d.valor }));
    info.appendChild(criar('span', { classe: 'card-distancia-pdf__destino', texto: d.destino }));
    card.appendChild(info);

    gradeDist.appendChild(card);
  }
  painel.appendChild(gradeDist);

  painel.appendChild(criar('hr', { classe: 'divisor-lago' }));
  painel.appendChild(botaoPDF('localizacao', L.botaoTexto || 'VER LOCALIZAÇÃO NO GOOGLE MAPS', 'dourado', L.mapsLink || 'https://maps.app.goo.gl/AztxJXPuLWaPUBSWA'));

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 10. DOCUMENTAÇÃO E CONDIÇÕES (PÁGINA 8 DO PDF)
 * ------------------------------------------------------------------------ */
export function montarAquisicao() {
  const secao = $('#aquisicao');
  if (!secao) return null;

  const A = config.aquisicao;
  const painel = criarPainel();

  painel.appendChild(cabecalho({
    rotulo: A.rotulo,
    titulo: A.titulo
  }));

  const grade = criar('div', { classe: 'grade-condicoes-pdf' });
  for (const c of A.cards) {
    const card = criar('div', { classe: 'card-condicao-pdf' });

    const icBox = criar('div', { classe: 'card-condicao-pdf__icone' });
    icBox.innerHTML = icone(c.icone, { tamanho: 28 });
    card.appendChild(icBox);

    const corpo = criar('div', { classe: 'card-condicao-pdf__corpo' });
    corpo.appendChild(criar('h3', { classe: 'card-condicao-pdf__titulo', texto: c.titulo }));
    corpo.appendChild(criar('p', { classe: 'card-condicao-pdf__texto', texto: c.texto }));
    card.appendChild(corpo);

    grade.appendChild(card);
  }
  painel.appendChild(grade);

  painel.appendChild(criar('hr', { classe: 'divisor-lago' }));
  painel.appendChild(botaoPDF('aquisicao', A.botaoTexto || 'FALE COM UM CONSULTOR', 'dourado'));

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 12. CONTATO & AGENDE SUA VISITA (PÁGINA 11 DO PDF)
 * ------------------------------------------------------------------------ */
export function montarContato() {
  const secao = $('#contato');
  if (!secao) return null;

  const C = config.contato;
  const painel = criarPainel('painel--largo');

  painel.appendChild(cabecalho({
    rotulo: C.rotulo,
    titulo: C.titulo,
    texto: C.subtitulo
  }));

  // Card de Agendamento em Vidro Fosco (Página 11 do PDF)
  const cardAgendamento = criar('div', { classe: 'card-agendamento-pdf' });
  cardAgendamento.appendChild(criar('h3', {
    classe: 'card-agendamento-pdf__titulo',
    texto: C.cardForm.titulo
  }));
  cardAgendamento.appendChild(criar('p', {
    classe: 'card-agendamento-pdf__sub',
    texto: C.cardForm.subtitulo
  }));

  const form = criar('form', { classe: 'form-agendamento-pdf' });

  const inputNome = criar('input', {
    classe: 'input-agendamento-pdf',
    type: 'text',
    name: 'nome',
    placeholder: 'Nome',
    required: ''
  });
  form.appendChild(inputNome);

  const inputTel = criar('input', {
    classe: 'input-agendamento-pdf',
    type: 'tel',
    name: 'telefone',
    placeholder: 'WhatsApp / Telefone',
    required: ''
  });
  form.appendChild(inputTel);

  const btnAgendar = criar('button', {
    classe: 'btn-pdf btn-pdf--dourado btn-pdf--bloco',
    type: 'submit'
  });
  btnAgendar.innerHTML = `<span>${C.cardForm.botaoAgendar}</span>`;
  form.appendChild(btnAgendar);

  const btnWA = criar('a', {
    classe: 'btn-pdf btn-pdf--vidro-wa btn-pdf--bloco',
    href: '#',
    'data-wa-origem': 'formVIP'
  });
  btnWA.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0;">
      <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.3-1.3c1.4.8 3 1.3 4.7 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.1c-1.5 0-3-.4-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3C4.2 15 3.8 13.5 3.8 12 3.8 7.5 7.5 3.8 12 3.8s8.2 3.7 8.2 8.2-3.7 8.1-8.2 8.1z"/>
    </svg>
    <span>${C.cardForm.botaoWhatsApp}</span>
  `;
  form.appendChild(btnWA);

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const nomeVal = inputNome.value.trim();
    const telVal = inputTel.value.trim();
    const msg = `Olá! Meu nome é ${nomeVal || 'Visitante'} (Telefone: ${telVal}). Gostaria de agendar uma visita ao Paraíso das Águas.`;
    const url = `https://wa.me/${config.whatsapp.numero}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  cardAgendamento.appendChild(form);
  painel.appendChild(cardAgendamento);

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * MONTAGEM MESTRE DE TODAS AS SEÇÕES
 * ------------------------------------------------------------------------ */
export function montarSecoesMestre() {
  const lista = [
    montarEfeitoParaiso(),
    montarPropriedades(),
    montarInfraestrutura(),
    montarPossibilidades(),
    montarAutossuficiencia(),
    montarCompartilhar(),
    montarSaoJose(),
    montarAquisicao(),
    montarLocalizacao(),
    montarContato()
  ];
  return lista;
}

export default {
  montarSecoesMestre,
  montarEfeitoParaiso,
  montarPropriedades,
  montarInfraestrutura,
  montarPossibilidades,
  montarAutossuficiencia,
  montarCompartilhar,
  montarSaoJose,
  montarLocalizacao,
  montarAquisicao,
  montarContato
};
