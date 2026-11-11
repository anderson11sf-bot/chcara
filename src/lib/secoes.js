/* ============================================================================
 * secoes.js — MONTAGEM DAS SEÇÕES CONFORME IDENTIDADE VISUAL DO DESIGNER
 * ----------------------------------------------------------------------------
 * Segue estritamente a identidade visual de "DESIGNER DO SITE" e mídias de "lago drone".
 * Títulos e headlines com tipografia serif de luxo, sem prefixos mecânicos de seção.
 * Sessão 07 totalmente reestruturada com quadro de imagens na esquerda e títulos na direita.
 * Vídeo de São José em formato vertical 9:16 (em pé).
 * ==========================================================================*/

import config from '../config.js';
import { criar, $ } from './utils.js';
import { icone } from './icones.js';

/** Cabeçalho de seção de alto padrão */
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

/** Botão de WhatsApp contextual */
function botaoWhatsApp(origem, texto, variante = 'ouro') {
  return criar('a', {
    classe: `btn btn--${variante} secao__cta`,
    href: '#',
    'data-wa-origem': origem,
    rel: 'noopener',
    texto
  });
}

/** Elemento de vídeo responsivo com suporte a proporção 16:9 ou 9:16 vertical */
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

/* --------------------------------------------------------------------------
 * 03. APRESENTAÇÃO: MAIS DO QUE UM TERRENO • UM NOVO JEITO DE VIVER
 * ------------------------------------------------------------------------ */
export function montarEfeitoParaiso() {
  const secao = $('#efeito-paraiso');
  if (!secao) return null;

  const P = config.efeitoParaiso;
  const painel = criar('div', { classe: 'painel' });

  painel.appendChild(cabecalho({
    rotulo: P.rotulo,
    titulo: P.titulo,
    texto: P.subtitulo
  }));

  if (P.video) {
    painel.appendChild(criarVideoFrame(P.video));
  }

  painel.appendChild(criar('p', { classe: 'secao__apoio', texto: P.texto }));

  // Comparativo de ritmos
  const comparativo = criar('div', { classe: 'comparativo-ritmo' });
  for (let i = 0; i < P.comparativos.length; i++) {
    const item = P.comparativos[i];
    const card = criar('div', {
      classe: `comparativo-card ${i === 1 ? 'comparativo-card--paraiso' : ''}`
    });
    card.appendChild(criar('h3', { classe: 'comparativo-card__titulo', texto: item.ritmo }));
    card.appendChild(criar('p', { classe: 'comparativo-card__desc', texto: item.desc }));
    comparativo.appendChild(card);
  }
  painel.appendChild(comparativo);

  painel.appendChild(criar('hr', { classe: 'divisor-lago' }));
  painel.appendChild(botaoWhatsApp('vsl', 'Quero viver esse ritmo no WhatsApp', 'ouro'));

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 04. AS PROPRIEDADES (7 GLEBAS & MAPA OFICIAL DEMARCADO)
 * ------------------------------------------------------------------------ */
export function montarPropriedades() {
  const secao = $('#propriedades');
  if (!secao) return null;

  const P = config.propriedades;
  const painel = criar('div', { classe: 'painel' });

  painel.appendChild(cabecalho({
    rotulo: P.rotulo,
    titulo: P.titulo,
    texto: P.subtitulo
  }));

  // Destaques da terra
  const destaques = criar('div', { classe: 'propriedades-destaques' });
  for (const d of P.destaques) {
    const box = criar('div', { classe: 'propriedade-item' });
    const ic = criar('span', { classe: 'propriedade-item__icone' });
    ic.innerHTML = icone(d.icone, { tamanho: 24 });
    box.appendChild(ic);
    box.appendChild(criar('h4', { classe: 'propriedade-item__titulo', texto: d.titulo }));
    box.appendChild(criar('p', { classe: 'propriedade-item__texto', texto: d.texto }));
    destaques.appendChild(box);
  }
  painel.appendChild(destaques);

  painel.appendChild(criar('p', { classe: 'secao__apoio', texto: P.texto }));

  // Mapa de demarcação oficial de alta definição
  if (P.mapaImagem) {
    const mapaCaixa = criar('div', { classe: 'mapa-oficial-caixa' });
    mapaCaixa.appendChild(criar('img', {
      classe: 'mapa-oficial-img',
      src: P.mapaImagem,
      alt: 'Mapa oficial de demarcação do Paraíso das Águas em São José dos Campos',
      loading: 'lazy',
      decoding: 'async',
      width: '1400',
      height: '1580'
    }));
    mapaCaixa.appendChild(criar('span', {
      classe: 'mapa-oficial-tag',
      texto: 'Planta Demarcada Oficial • Glebas A a G com Lago Central'
    }));
    painel.appendChild(mapaCaixa);
  }

  // Vídeo de sobrevoo da demarcação
  if (P.mapaVideo) {
    painel.appendChild(criarVideoFrame({
      src: P.mapaVideo.src,
      poster: P.mapaVideo.poster,
      legenda: P.mapaVideo.legenda,
      proporcao: '16-9'
    }));
  }

  // Faixa de valor referencial
  painel.appendChild(criar('div', {
    classe: 'faixa-comercial-referencia',
    texto: P.referenciaComercial
  }));

  painel.appendChild(criar('hr', { classe: 'divisor-lago' }));
  painel.appendChild(botaoWhatsApp('propriedades', 'Verificar disponibilidade das glebas no WhatsApp', 'ouro'));

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 05. INFRAESTRUTURA COMPLETA (8 CARDS COM GLOW ESMERALDA & ÍCONES)
 * ------------------------------------------------------------------------ */
export function montarInfraestrutura() {
  const secao = $('#infraestrutura');
  if (!secao) return null;

  const I = config.infraestrutura;
  const painel = criar('div', { classe: 'painel' });

  painel.appendChild(cabecalho({
    rotulo: I.rotulo,
    titulo: I.titulo,
    texto: I.subtitulo
  }));

  const grade = criar('div', { classe: 'grade-infraestrutura' });
  for (const c of I.cards) {
    const card = criar('div', { classe: 'cartao-infra' });
    const ic = criar('span', { classe: 'cartao-infra__icone' });
    ic.innerHTML = icone(c.icone, { tamanho: 28 });
    card.appendChild(ic);
    card.appendChild(criar('h3', { classe: 'cartao-infra__titulo', texto: c.titulo }));
    card.appendChild(criar('p', { classe: 'cartao-infra__texto', texto: c.texto }));
    grade.appendChild(card);
  }
  painel.appendChild(grade);

  painel.appendChild(criar('hr', { classe: 'divisor-lago' }));
  painel.appendChild(botaoWhatsApp('infraestrutura', 'Tirar dúvidas sobre a infraestrutura', 'vidro'));

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 06. POSSIBILIDADES (PROJETOS ILUSTRATIVOS 3D)
 * ------------------------------------------------------------------------ */
export function montarPossibilidades() {
  const secao = $('#possibilidades');
  if (!secao) return null;

  const P = config.possibilidades;
  const painel = criar('div', { classe: 'painel' });

  painel.appendChild(cabecalho({
    rotulo: P.rotulo,
    titulo: P.titulo,
    texto: P.subtitulo
  }));

  // Galeria de imagens dos projetos conceituais
  const grade = criar('div', { classe: 'grade-projetos' });
  for (const item of P.galeria) {
    const card = criar('article', { classe: 'card-projeto' });

    const fotoCaixa = criar('div', { classe: 'card-projeto__foto-caixa' });
    fotoCaixa.appendChild(criar('img', {
      classe: 'card-projeto__foto',
      src: item.imagem,
      alt: item.titulo,
      loading: 'lazy',
      decoding: 'async',
      width: '800',
      height: '500'
    }));
    fotoCaixa.appendChild(criar('span', {
      classe: 'badge-projeto-ilustrativo',
      texto: 'PROJETO ILUSTRATIVO'
    }));
    card.appendChild(fotoCaixa);

    const corpo = criar('div', { classe: 'card-projeto__corpo' });
    corpo.appendChild(criar('h3', { classe: 'card-projeto__titulo', texto: item.titulo }));
    corpo.appendChild(criar('p', { classe: 'card-projeto__subtitulo', texto: item.subtitulo }));
    card.appendChild(corpo);

    grade.appendChild(card);
  }
  painel.appendChild(grade);

  // Vídeos dos projetos conceituais 3D
  if (P.videosProjetos && P.videosProjetos.length > 0) {
    const gradeVideos = criar('div', { classe: 'grade-videos-projetos' });
    for (const vid of P.videosProjetos) {
      const cardVid = criar('div', { classe: 'card-video-projeto' });
      const moldura = criarVideoFrame({
        src: vid.src,
        poster: vid.poster,
        legenda: vid.titulo,
        proporcao: '16-9'
      });
      moldura.appendChild(criar('span', {
        classe: 'badge-projeto-ilustrativo badge-projeto-ilustrativo--video',
        texto: 'PROJETO ILUSTRATIVO'
      }));
      cardVid.appendChild(moldura);
      cardVid.appendChild(criar('h4', { classe: 'card-video-projeto__titulo', texto: vid.titulo }));
      cardVid.appendChild(criar('p', { classe: 'card-video-projeto__sub', texto: vid.subtitulo }));
      gradeVideos.appendChild(cardVid);
    }
    painel.appendChild(gradeVideos);
  }

  // Aviso legal obrigatório
  painel.appendChild(criar('div', {
    classe: 'aviso-legal-box',
    texto: P.avisoLegal
  }));

  painel.appendChild(criar('hr', { classe: 'divisor-lago' }));
  painel.appendChild(botaoWhatsApp('possibilidades', 'Conversar sobre ideias de projeto no WhatsApp', 'ouro'));

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 07. VIDA AUTOSSUSTENTÁVEL (NOVO QUADRO COM IMAGENS NA ESQUERDA & TEXTOS NA DIREITA)
 * ------------------------------------------------------------------------ */
export function montarAutossuficiencia() {
  const secao = $('#autossuficiencia');
  if (!secao) return null;

  const A = config.autossuficiencia;
  const painel = criar('div', { classe: 'painel painel--largo quadro-autossuficiencia' });

  // 1. COLUNA ESQUERDA: QUADRO DE MÍDIAS (MOSAICO DE FOTOS COM GLOW ESMERALDA)
  const colEsquerda = criar('div', { classe: 'quadro-midias' });
  const gradeMosaico = criar('div', { classe: 'grade-mosaico-rural' });

  // Foto 1: Horta Produtiva (topo largo)
  const itemHorta = criar('div', { classe: 'mosaico-item mosaico-item--largo' });
  itemHorta.appendChild(criar('img', {
    classe: 'mosaico-img',
    src: '/media/img/autossuficiencia/horta-produtiva.webp',
    alt: 'Horta Produtiva no Paraíso das Águas',
    loading: 'lazy',
    decoding: 'async',
    width: '680',
    height: '420'
  }));
  itemHorta.appendChild(criar('span', { classe: 'mosaico-tag', texto: 'HORTA PRODUTIVA' }));
  gradeMosaico.appendChild(itemHorta);

  // Linha do meio: Pomar e Criação Natural
  const linhaMeio = criar('div', { classe: 'mosaico-linha-dupla' });

  const itemPomar = criar('div', { classe: 'mosaico-item' });
  itemPomar.appendChild(criar('img', {
    classe: 'mosaico-img',
    src: '/media/img/autossuficiencia/pomar-arvores.webp',
    alt: 'Pomar de frutas frescas',
    loading: 'lazy',
    decoding: 'async'
  }));
  itemPomar.appendChild(criar('span', { classe: 'mosaico-tag', texto: 'POMAR' }));
  linhaMeio.appendChild(itemPomar);

  const itemCriacao = criar('div', { classe: 'mosaico-item' });
  itemCriacao.appendChild(criar('img', {
    classe: 'mosaico-img',
    src: '/media/img/autossuficiencia/criacao-natural.webp',
    alt: 'Criação Natural e Piquetes',
    loading: 'lazy',
    decoding: 'async'
  }));
  itemCriacao.appendChild(criar('span', { classe: 'mosaico-tag', texto: 'CRIAÇÃO NATURAL' }));
  linhaMeio.appendChild(itemCriacao);

  gradeMosaico.appendChild(linhaMeio);

  // Linha inferior: Energia Solar e Varanda Rural
  const linhaBaixo = criar('div', { classe: 'mosaico-linha-dupla' });

  const itemSolar = criar('div', { classe: 'mosaico-item' });
  itemSolar.appendChild(criar('img', {
    classe: 'mosaico-img',
    src: '/media/img/autossuficiencia/energia-solar.webp',
    alt: 'Energia Solar Fotovoltaica',
    loading: 'lazy',
    decoding: 'async'
  }));
  itemSolar.appendChild(criar('span', { classe: 'mosaico-tag', texto: 'ENERGIA SOLAR' }));
  linhaBaixo.appendChild(itemSolar);

  const itemVaranda = criar('div', { classe: 'mosaico-item' });
  itemVaranda.appendChild(criar('img', {
    classe: 'mosaico-img',
    src: '/media/img/autossuficiencia/varanda-rural.webp',
    alt: 'Varanda Rural e Convivência',
    loading: 'lazy',
    decoding: 'async'
  }));
  itemVaranda.appendChild(criar('span', { classe: 'mosaico-tag', texto: 'VARANDA RURAL' }));
  linhaBaixo.appendChild(itemVaranda);

  gradeMosaico.appendChild(linhaBaixo);
  colEsquerda.appendChild(gradeMosaico);
  painel.appendChild(colEsquerda);

  // 2. COLUNA DIREITA: TÍTULOS COM ANIMAÇÃO, CONTEÚDO E CTAS
  const colDireita = criar('div', { classe: 'quadro-info' });

  colDireita.appendChild(criar('span', { classe: 'rotulo-secao', texto: A.rotulo }));

  const h2 = criar('h2', { classe: 'secao__titulo quadro-info__titulo' });
  h2.innerHTML = A.titulo;
  colDireita.appendChild(h2);

  const pLead = criar('p', { classe: 'secao__apoio secao__apoio--destaque quadro-info__texto' });
  pLead.innerHTML = A.subtitulo;
  colDireita.appendChild(pLead);

  // 4 Indicadores rápidos com ícones neon e divisores
  const faixaIndicadores = criar('div', { classe: 'faixa-indicadores-rurais' });
  for (const ind of A.indicadores) {
    const itemInd = criar('div', { classe: 'item-indicador-rural' });
    const icBox = criar('span', { classe: 'item-indicador-rural__icone' });
    icBox.innerHTML = icone(ind.icone, { tamanho: 20 });
    itemInd.appendChild(icBox);
    itemInd.appendChild(criar('span', { classe: 'item-indicador-rural__rotulo', texto: ind.rotulo }));
    faixaIndicadores.appendChild(itemInd);
  }
  colDireita.appendChild(faixaIndicadores);

  // Ações
  const acoes = criar('div', { classe: 'quadro-info__acoes' });
  acoes.appendChild(botaoWhatsApp('autossuficiencia', 'Fale Conosco no WhatsApp', 'ouro'));
  acoes.appendChild(criar('a', {
    classe: 'btn btn--vidro',
    href: '#contato',
    texto: 'Agendar Visita VIP'
  }));
  colDireita.appendChild(acoes);

  painel.appendChild(colDireita);

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 08. UMA PROPRIEDADE PARA COMPARTILHAR (PATRIMÔNIO FAMILIAR)
 * ------------------------------------------------------------------------ */
export function montarCompartilhar() {
  const secao = $('#compartilhar');
  if (!secao) return null;

  const C = config.compartilhar;
  const painel = criar('div', { classe: 'painel painel--largo' });

  painel.appendChild(cabecalho({
    rotulo: C.rotulo,
    titulo: C.titulo,
    texto: C.subtitulo
  }));

  // Layout 2 colunas com imagem lifestyle da família no deck
  const layout = criar('div', { classe: 'grade-lifestyle-compartilhar' });

  const fotoBox = criar('div', { classe: 'lifestyle-foto-caixa' });
  fotoBox.appendChild(criar('img', {
    classe: 'lifestyle-foto-img',
    src: C.imagemPrincipal,
    alt: 'Família na varanda com vista para o vale e lago',
    loading: 'lazy',
    decoding: 'async',
    width: '1200',
    height: '1600'
  }));
  fotoBox.appendChild(criar('div', {
    classe: 'lifestyle-slogan-overlay',
    texto: 'O novo luxo mudou de endereço.'
  }));
  layout.appendChild(fotoBox);

  const infoBox = criar('div', { classe: 'lifestyle-info-caixa' });
  const gradeBeneficios = criar('div', { classe: 'grade-duas-colunas' });
  for (const b of C.beneficios) {
    const card = criar('div', { classe: 'card-beneficio' });
    card.appendChild(criar('h3', { classe: 'card-beneficio__titulo', texto: b.titulo }));
    card.appendChild(criar('p', { classe: 'card-beneficio__texto', texto: b.texto }));
    gradeBeneficios.appendChild(card);
  }
  infoBox.appendChild(gradeBeneficios);
  infoBox.appendChild(criar('hr', { classe: 'divisor-lago' }));
  infoBox.appendChild(botaoWhatsApp('compartilhar', 'Converse sobre as possibilidades no WhatsApp', 'ouro'));
  layout.appendChild(infoBox);

  painel.appendChild(layout);

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
  const painel = criar('div', { classe: 'painel painel--largo' });

  painel.appendChild(cabecalho({
    rotulo: S.rotulo,
    titulo: S.titulo,
    texto: S.subtitulo
  }));

  // Layout 2 Colunas: Vídeo Vertical EM PÉ (9:16) na Esquerda + Destaques na Direita
  const layoutVertical = criar('div', { classe: 'grade-sjc-vertical' });

  // 1. Moldura de Vídeo Vertical Story / Smartphone
  const videoBox = criar('div', { classe: 'sjc-video-vertical-caixa' });
  const molduraVertical = criarVideoFrame({
    src: S.videoVertical.src,
    poster: S.videoVertical.poster,
    legenda: S.videoVertical.legenda,
    proporcao: '9-16'
  });
  videoBox.appendChild(molduraVertical);
  layoutVertical.appendChild(videoBox);

  // 2. Conteúdo e Destaques de Distância
  const infoBox = criar('div', { classe: 'sjc-info-vertical' });
  infoBox.appendChild(criar('p', { classe: 'secao__apoio secao__apoio--destaque', texto: S.texto }));

  const gradeDestaques = criar('div', { classe: 'grade-sjc-destaques' });
  for (const d of S.destaques) {
    const card = criar('div', { classe: 'card-sjc' });
    card.appendChild(criar('div', { classe: 'card-sjc__valor', texto: d.valor }));
    card.appendChild(criar('h4', { classe: 'card-sjc__titulo', texto: d.titulo }));
    card.appendChild(criar('p', { classe: 'card-sjc__texto', texto: d.texto }));
    gradeDestaques.appendChild(card);
  }
  infoBox.appendChild(gradeDestaques);

  infoBox.appendChild(criar('hr', { classe: 'divisor-lago' }));
  infoBox.appendChild(botaoWhatsApp('saoJose', 'Saber mais sobre a localização e náutica no WhatsApp', 'ouro'));
  layoutVertical.appendChild(infoBox);

  painel.appendChild(layoutVertical);

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 10. CONDIÇÕES DE AQUISIÇÃO (4 CARDS COM GLOW ESMERALDA DO DESIGNER)
 * ------------------------------------------------------------------------ */
export function montarAquisicao() {
  const secao = $('#aquisicao');
  if (!secao) return null;

  const A = config.aquisicao;
  const painel = criar('div', { classe: 'painel' });

  painel.appendChild(cabecalho({
    rotulo: A.rotulo,
    titulo: A.titulo,
    texto: A.subtitulo
  }));

  // 4 Cards de Aquisição com Glow Esmeralda
  const gradeCards = criar('div', { classe: 'grade-aquisicao-cards' });
  for (const c of A.cards) {
    const card = criar('div', { classe: 'cartao-aquisicao' });
    const icBox = criar('span', { classe: 'cartao-aquisicao__icone' });
    icBox.innerHTML = icone(c.icone, { tamanho: 28 });
    card.appendChild(icBox);
    card.appendChild(criar('h3', { classe: 'cartao-aquisicao__titulo', texto: c.titulo }));
    card.appendChild(criar('p', { classe: 'cartao-aquisicao__texto', texto: c.texto }));
    gradeCards.appendChild(card);
  }
  painel.appendChild(gradeCards);

  painel.appendChild(criar('hr', { classe: 'divisor-lago' }));
  painel.appendChild(botaoWhatsApp('aquisicao', 'Solicitar Informações no WhatsApp', 'ouro'));

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 11. LOCALIZAÇÃO & DISTÂNCIAS REAIS
 * ------------------------------------------------------------------------ */
export function montarLocalizacao() {
  const secao = $('#localizacao');
  if (!secao) return null;

  const L = config.localizacao;
  const painel = criar('div', { classe: 'painel' });

  painel.appendChild(cabecalho({
    rotulo: L.rotulo,
    titulo: L.titulo,
    texto: L.subtitulo
  }));

  const tabela = criar('div', { classe: 'tabela-distancias' });
  for (const d of L.distancias) {
    const linha = criar('div', { classe: 'tabela-distancias__linha' });
    linha.appendChild(criar('span', { classe: 'tabela-distancias__destino', texto: d.destino }));
    linha.appendChild(criar('span', { classe: 'tabela-distancias__pontilhado' }));
    linha.appendChild(criar('span', { classe: 'tabela-distancias__valor', texto: d.valor }));
    tabela.appendChild(linha);
  }
  painel.appendChild(tabela);

  // Botões de rota e Google Maps
  const boxMapa = criar('div', { classe: 'mapa-cta-caixa' });
  boxMapa.appendChild(botaoWhatsApp('localizacao', 'Como Chegar no WhatsApp', 'ouro'));
  const btnMapa = criar('a', {
    classe: 'btn btn--vidro btn--com-icone',
    href: L.mapaLink,
    target: '_blank',
    rel: 'noopener noreferrer',
    texto: L.legendaMapa
  });
  boxMapa.appendChild(btnMapa);
  painel.appendChild(boxMapa);

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 12. CONTATO & AGENDAMENTO VIP (FORMULÁRIO DO DESIGNER)
 * ------------------------------------------------------------------------ */
export function montarContato() {
  const secao = $('#contato');
  if (!secao) return null;

  const C = config.contato;
  const painel = criar('div', { classe: 'painel painel--largo grade-contato-designer' });

  // Coluna 1: Textos & Filosofia "A Roça é o Novo Luxo"
  const colTexto = criar('div', { classe: 'contato-info-box' });
  colTexto.appendChild(criar('span', { classe: 'rotulo-secao', texto: C.rotulo }));

  const h2 = criar('h2', { classe: 'secao__titulo' });
  h2.innerHTML = C.titulo;
  colTexto.appendChild(h2);

  const pLead = criar('p', { classe: 'secao__apoio secao__apoio--destaque' });
  pLead.innerHTML = C.subtitulo;
  colTexto.appendChild(pLead);

  colTexto.appendChild(criar('p', { classe: 'secao__apoio', texto: C.texto }));
  painel.appendChild(colTexto);

  // Coluna 2: Card Flutuante de Agendamento
  const cardForm = criar('div', { classe: 'card-agendamento-vip' });
  cardForm.appendChild(criar('h3', { classe: 'card-agendamento-vip__titulo', texto: 'Agende sua visita' }));
  cardForm.appendChild(criar('p', { classe: 'card-agendamento-vip__sub', texto: 'Fale com um especialista' }));

  const form = criar('form', { classe: 'form-agendamento' });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = form.querySelector('input[name="nome"]')?.value || 'Interessado';
    const diaSel = form.querySelector('input[name="dia"]:checked')?.value || 'qualquer dia';
    const msg = `Olá! Meu nome é ${nome}. Gostaria de agendar uma visita VIP ao Paraíso das Águas (preferência: ${diaSel}).`;
    const numero = String(config.whatsapp.numero).replace(/\D/g, '');
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`, '_blank');
  });

  const inputNome = criar('input', {
    type: 'text',
    name: 'nome',
    placeholder: 'Seu nome completo',
    required: '',
    classe: 'form-input'
  });
  form.appendChild(inputNome);

  const rotuloDias = criar('label', { classe: 'form-agendamento__label', texto: 'Melhor dia para visita:' });
  form.appendChild(rotuloDias);

  const grupoDias = criar('div', { classe: 'grupo-dias' });
  const opcoes = [
    { id: 'dia-sabado', valor: 'Sábado', rotulo: 'Sábado' },
    { id: 'dia-domingo', valor: 'Domingo', rotulo: 'Domingo' },
    { id: 'dia-semana', valor: 'Dia de Semana', rotulo: 'Segunda a Sexta' }
  ];

  for (let i = 0; i < opcoes.length; i++) {
    const o = opcoes[i];
    const radioCaixa = criar('label', { classe: 'radio-card' });
    const radio = criar('input', {
      type: 'radio',
      name: 'dia',
      value: o.valor,
      id: o.id,
      checked: i === 0 ? '' : null
    });
    radioCaixa.appendChild(radio);
    radioCaixa.appendChild(criar('span', { classe: 'radio-card__rotulo', texto: o.rotulo }));
    grupoDias.appendChild(radioCaixa);
  }
  form.appendChild(grupoDias);

  const btnEnviar = criar('button', {
    type: 'submit',
    classe: 'btn btn--ouro btn--bloco',
    texto: C.ctaBotao
  });
  form.appendChild(btnEnviar);

  const btnWa = criar('a', {
    classe: 'btn btn--verde-wa btn--bloco',
    href: '#',
    'data-wa-origem': 'formVIP',
    texto: 'Conversar pelo WhatsApp 💬'
  });
  form.appendChild(btnWa);

  form.appendChild(criar('span', { classe: 'form-aviso-seguro', texto: '🔒 Seus dados estão protegidos.' }));

  cardForm.appendChild(form);
  painel.appendChild(cardForm);

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 13. FAQ & RODAPÉ INSTITUCIONAL
 * ------------------------------------------------------------------------ */
export function montarFaqERodape() {
  const rodapeEl = $('#rodape');
  if (!rodapeEl) return;

  const frag = document.createDocumentFragment();

  // FAQ
  const faqSecao = criar('div', { classe: 'rodape__faq' });
  faqSecao.appendChild(criar('h3', { classe: 'rodape__faq-titulo', texto: 'Perguntas Frequentes (FAQ)' }));

  const listaFaq = criar('div', { classe: 'lista-acordeoes lista-acordeoes--faq' });
  for (const item of config.faq) {
    const d = criar('details', { classe: 'acordeon acordeon--faq' });
    d.appendChild(criar('summary', { classe: 'acordeon__titulo', texto: item.p }));
    const c = criar('div', { classe: 'acordeon__corpo' });
    c.appendChild(criar('p', { texto: item.r }));
    d.appendChild(c);
    listaFaq.appendChild(d);
  }
  faqSecao.appendChild(listaFaq);
  frag.appendChild(faqSecao);

  // Rodapé institucional
  const R = config.rodape;
  const rodapeCorpo = criar('div', { classe: 'rodape__corpo' });

  const infoMarca = criar('div', { classe: 'rodape__marca' });
  infoMarca.appendChild(criar('span', { classe: 'rodape__nome', texto: R.nome }));
  infoMarca.appendChild(criar('span', { classe: 'rodape__sub', texto: R.sub }));
  infoMarca.appendChild(criar('span', { classe: 'rodape__tel', texto: `Plantão: ${R.telefone}` }));
  rodapeCorpo.appendChild(infoMarca);

  rodapeCorpo.appendChild(criar('p', { classe: 'rodape__aviso', texto: R.avisoLegal }));

  const linksLegais = criar('div', { classe: 'rodape__links' });
  linksLegais.appendChild(criar('a', { href: '/politica-de-privacidade.html', texto: 'Política de Privacidade' }));
  linksLegais.appendChild(criar('span', { texto: '•' }));
  linksLegais.appendChild(criar('a', { href: '/politica-de-cookies.html', texto: 'Política de Cookies' }));
  rodapeCorpo.appendChild(linksLegais);

  rodapeCorpo.appendChild(criar('p', {
    classe: 'rodape__copia',
    texto: `© ${R.ano} ${R.nome}. Todos os direitos reservados.`
  }));

  frag.appendChild(rodapeCorpo);

  rodapeEl.replaceChildren(frag);
}

/* --------------------------------------------------------------------------
 * MONTAGEM COMPLETA DAS SEÇÕES 3 A 13
 * ------------------------------------------------------------------------ */
export function montarSecoesMestre() {
  montarEfeitoParaiso();
  montarPropriedades();
  montarInfraestrutura();
  montarPossibilidades();
  montarAutossuficiencia();
  montarCompartilhar();
  montarSaoJose();
  montarAquisicao();
  montarLocalizacao();
  montarContato();
  montarFaqERodape();

  return true;
}

export default { montarSecoesMestre };
