/* ============================================================================
 * secoes.js — MONTAGEM DAS SEÇÕES 3 A 13 CONFORME ESPECIFICAÇÃO MESTRE
 * ----------------------------------------------------------------------------
 * Renderização dinâmica, semântica e limpa das 11 seções de conteúdo denso.
 * ==========================================================================*/

import config from '../config.js';
import { criar, $ } from './utils.js';
import { icone } from './icones.js';

/** Cabeçalho de seção padrão */
function cabecalho({ rotulo, titulo, texto }) {
  const frag = document.createDocumentFragment();
  if (rotulo) frag.appendChild(criar('span', { classe: 'rotulo-secao', texto: rotulo }));
  if (titulo) frag.appendChild(criar('h2', { texto: titulo }));
  if (texto) frag.appendChild(criar('p', { classe: 'secao__apoio', texto }));
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

/** Elemento de vídeo responsivo com poster */
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
 * 03. O EFEITO PARAÍSO DAS ÁGUAS
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
  painel.appendChild(botaoWhatsApp('efeitoParaiso', 'Quero viver esse ritmo no WhatsApp', 'ouro'));

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 04. AS PROPRIEDADES (VISÃO GERAL 2 HECTARES)
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

  // Mapa de demarcação oficial
  if (P.mapaImagem) {
    const mapaCaixa = criar('div', { classe: 'mapa-oficial-caixa' });
    mapaCaixa.appendChild(criar('img', {
      classe: 'mapa-oficial-img',
      src: P.mapaImagem,
      alt: 'Mapa oficial de demarcação do Paraíso das Águas',
      loading: 'lazy',
      decoding: 'async'
    }));
    mapaCaixa.appendChild(criar('span', {
      classe: 'mapa-oficial-tag',
      texto: 'Planta Demarcada Oficial'
    }));
    painel.appendChild(mapaCaixa);
  }

  // Faixa de valor referencial
  painel.appendChild(criar('div', {
    classe: 'faixa-comercial-referencia',
    texto: P.referenciaComercial
  }));

  painel.appendChild(criar('hr', { classe: 'divisor-lago' }));
  painel.appendChild(botaoWhatsApp('propriedades', 'Verificar disponibilidade no WhatsApp', 'ouro'));

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 05. INFRAESTRUTURA COMPLETA
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
 * 06. POSSIBILIDADES (PROJETOS ILUSTRATIVOS)
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

  const grade = criar('div', { classe: 'grade-projetos' });
  for (const item of P.galeria) {
    const card = criar('article', { classe: 'card-projeto' });

    const fotoCaixa = criar('div', { classe: 'card-projeto__foto-caixa' });
    fotoCaixa.appendChild(criar('img', {
      classe: 'card-projeto__foto',
      src: item.imagem,
      alt: item.titulo,
      loading: 'lazy',
      decoding: 'async'
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

  // Aviso de transparência jurídica
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
 * 07. AUTOSSUFICIÊNCIA (O QUINTAL PRODUTIVO)
 * ------------------------------------------------------------------------ */
export function montarAutossuficiencia() {
  const secao = $('#autossuficiencia');
  if (!secao) return null;

  const A = config.autossuficiencia;
  const painel = criar('div', { classe: 'painel' });

  painel.appendChild(cabecalho({
    rotulo: A.rotulo,
    titulo: A.titulo,
    texto: A.subtitulo
  }));

  if (A.video) {
    painel.appendChild(criarVideoFrame(A.video));
  }

  const grade = criar('div', { classe: 'grade-duas-colunas' });
  for (const p of A.pilares) {
    const card = criar('div', { classe: 'card-beneficio' });
    const ic = criar('span', { classe: 'cartao-infra__icone' });
    ic.innerHTML = icone(p.icone, { tamanho: 24 });
    card.appendChild(ic);
    card.appendChild(criar('h3', { classe: 'card-beneficio__titulo', texto: p.titulo }));
    card.appendChild(criar('p', { classe: 'card-beneficio__texto', texto: p.texto }));
    grade.appendChild(card);
  }
  painel.appendChild(grade);

  painel.appendChild(criar('hr', { classe: 'divisor-lago' }));
  painel.appendChild(botaoWhatsApp('autossuficiencia', 'Quero saber mais sobre a terra e animais', 'ouro'));

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 08. COMPARTILHAR (AQUISIÇÃO COMPARTILHADA)
 * ------------------------------------------------------------------------ */
export function montarCompartilhar() {
  const secao = $('#compartilhar');
  if (!secao) return null;

  const C = config.compartilhar;
  const painel = criar('div', { classe: 'painel' });

  painel.appendChild(cabecalho({
    rotulo: C.rotulo,
    titulo: C.titulo,
    texto: C.subtitulo
  }));

  painel.appendChild(criar('p', { classe: 'secao__apoio', texto: C.texto }));

  const grade = criar('div', { classe: 'grade-duas-colunas' });
  for (const b of C.beneficios) {
    const card = criar('div', { classe: 'card-beneficio' });
    card.appendChild(criar('h3', { classe: 'card-beneficio__titulo', texto: b.titulo }));
    card.appendChild(criar('p', { classe: 'card-beneficio__texto', texto: b.texto }));
    grade.appendChild(card);
  }
  painel.appendChild(grade);

  painel.appendChild(criar('hr', { classe: 'divisor-lago' }));
  painel.appendChild(botaoWhatsApp('compartilhar', 'Simular compra compartilhada no WhatsApp', 'vidro'));

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 09. SÃO JOSÉ DOS CAMPOS
 * ------------------------------------------------------------------------ */
export function montarSaoJose() {
  const secao = $('#sao-jose');
  if (!secao) return null;

  const S = config.saoJose;
  const painel = criar('div', { classe: 'painel' });

  painel.appendChild(cabecalho({
    rotulo: S.rotulo,
    titulo: S.titulo,
    texto: S.subtitulo
  }));

  if (S.video) {
    painel.appendChild(criarVideoFrame(S.video));
  }

  painel.appendChild(criar('p', { classe: 'secao__apoio', texto: S.texto }));

  const grade = criar('div', { classe: 'grade-sjc-destaques' });
  for (const d of S.destaques) {
    const card = criar('div', { classe: 'card-sjc' });
    card.appendChild(criar('div', { classe: 'card-sjc__valor', texto: d.valor }));
    card.appendChild(criar('h4', { classe: 'card-sjc__titulo', texto: d.titulo }));
    card.appendChild(criar('p', { classe: 'card-sjc__texto', texto: d.texto }));
    grade.appendChild(card);
  }
  painel.appendChild(grade);

  painel.appendChild(criar('hr', { classe: 'divisor-lago' }));
  painel.appendChild(botaoWhatsApp('saoJose', 'Saber mais sobre a localização e acessos', 'ouro'));

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 10. CONDIÇÕES DE AQUISIÇÃO
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

  const lista = criar('div', { classe: 'acordeoes-lista' });
  for (let i = 0; i < A.acordeoes.length; i++) {
    const item = A.acordeoes[i];
    const details = criar('details', { classe: 'acordeon-item' });
    if (i === 0) details.open = true; // primeiro aberto por padrão

    const summary = criar('summary', { classe: 'acordeon-sumario' });
    summary.appendChild(document.createTextNode(item.titulo));
    const setinha = criar('span', { texto: '▾' });
    summary.appendChild(setinha);
    details.appendChild(summary);

    const corpo = criar('div', { classe: 'acordeon-conteudo', texto: item.conteudo });
    details.appendChild(corpo);

    lista.appendChild(details);
  }
  painel.appendChild(lista);

  painel.appendChild(criar('hr', { classe: 'divisor-lago' }));
  painel.appendChild(botaoWhatsApp('aquisicao', 'Consultar condições de financiamento direto', 'ouro'));

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 11. LOCALIZAÇÃO & DISTÂNCIAS
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

  const lista = criar('ul', { classe: 'tabela-distancias' });
  for (const d of L.distancias) {
    const li = criar('li', { classe: 'distancia-linha' });
    li.appendChild(criar('span', { classe: 'distancia-linha__destino', texto: d.destino }));
    li.appendChild(criar('strong', { classe: 'distancia-linha__valor', texto: d.valor }));
    lista.appendChild(li);
  }
  painel.appendChild(lista);

  if (L.mapaLink) {
    painel.appendChild(criar('a', {
      classe: 'btn btn--vidro',
      href: L.mapaLink,
      target: '_blank',
      rel: 'noopener noreferrer',
      texto: L.legendaMapa
    }));
  }

  painel.appendChild(criar('hr', { classe: 'divisor-lago' }));
  painel.appendChild(botaoWhatsApp('localizacao', 'Confirmar localização no WhatsApp', 'ouro'));

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 12. CONTATO & AGENDAMENTO VIP
 * ------------------------------------------------------------------------ */
export function montarContato() {
  const secao = $('#contato');
  if (!secao) return null;

  const C = config.contato;
  const painel = criar('div', { classe: 'painel' });

  painel.appendChild(cabecalho({
    rotulo: C.rotulo,
    titulo: C.titulo,
    texto: C.subtitulo
  }));

  painel.appendChild(criar('p', { classe: 'secao__apoio', texto: C.texto }));

  // Formulário inteligente integrado ao WhatsApp
  const form = criar('form', { classe: 'form-contato-caixa' });

  const campoNome = criar('div', { classe: 'form-campo' });
  campoNome.appendChild(criar('label', { classe: 'form-rotulo', for: 'nome-lead', texto: 'Seu Nome Completo' }));
  const inputNome = criar('input', {
    classe: 'form-input',
    type: 'text',
    id: 'nome-lead',
    placeholder: 'Ex.: Carlos Eduardo',
    required: ''
  });
  campoNome.appendChild(inputNome);
  form.appendChild(campoNome);

  const campoTel = criar('div', { classe: 'form-campo' });
  campoTel.appendChild(criar('label', { classe: 'form-rotulo', for: 'tel-lead', texto: 'Seu WhatsApp / Telefone' }));
  const inputTel = criar('input', {
    classe: 'form-input',
    type: 'tel',
    id: 'tel-lead',
    placeholder: '(12) 99999-9999',
    required: ''
  });
  campoTel.appendChild(inputTel);
  form.appendChild(campoTel);

  const campoDia = criar('div', { classe: 'form-campo' });
  campoDia.appendChild(criar('label', { classe: 'form-rotulo', for: 'dia-lead', texto: 'Melhor Dia para Visita' }));
  const inputDia = criar('input', {
    classe: 'form-input',
    type: 'text',
    id: 'dia-lead',
    placeholder: 'Ex.: Sábado pela manhã ou Domingo à tarde'
  });
  campoDia.appendChild(inputDia);
  form.appendChild(campoDia);

  const btnEnviar = criar('button', {
    classe: 'btn btn--ouro',
    type: 'submit',
    texto: C.ctaBotao
  });
  form.appendChild(btnEnviar);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = inputNome.value.trim() || 'Interessado';
    const tel = inputTel.value.trim() || 'Não informado';
    const dia = inputDia.value.trim() || 'A combinar';

    const textoMsg = `Olá! Meu nome é ${nome}. Gostaria de agendar uma visita ao Paraíso das Águas no dia/período: ${dia}. Meu WhatsApp é: ${tel}.`;
    const urlWa = `https://wa.me/${config.whatsapp.numero}?text=${encodeURIComponent(textoMsg)}`;
    window.open(urlWa, '_blank', 'noopener,noreferrer');
  });

  painel.appendChild(form);

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 13. RODAPÉ INSTITUCIONAL
 * ------------------------------------------------------------------------ */
export function montarRodape() {
  const rodapeEl = document.getElementById('rodape');
  if (!rodapeEl) return null;

  const R = config.rodape;
  const inner = criar('div', { classe: 'rodape__inner' });

  inner.appendChild(criar('span', { classe: 'rodape__marca', texto: R.nome }));
  inner.appendChild(criar('span', { classe: 'rodape__sub', texto: R.sub }));
  inner.appendChild(criar('p', { classe: 'rodape__aviso', texto: R.avisoLegal }));

  const links = criar('div', { classe: 'rodape__links' });
  const linkPriv = criar('a', { href: '/privacidade.html', texto: 'Política de Privacidade' });
  const linkTermos = criar('a', { href: '/termos.html', texto: 'Termos de Uso' });
  const btnCookies = criar('button', {
    type: 'button',
    id: 'link-cookies-rodape',
    texto: 'Preferências de Cookies'
  });
  links.appendChild(linkPriv);
  links.appendChild(linkTermos);
  links.appendChild(btnCookies);
  inner.appendChild(links);

  inner.appendChild(criar('p', {
    classe: 'rodape__copy',
    texto: `© ${R.ano} Paraíso das Águas. Todos os direitos reservados. Plantão: ${R.telefone}`
  }));

  rodapeEl.replaceChildren(inner);
  return rodapeEl;
}

/* --------------------------------------------------------------------------
 * Montagem completa das 11 seções
 * ------------------------------------------------------------------------ */
export function montarSecoesMestre() {
  return {
    efeitoParaiso: montarEfeitoParaiso(),
    propriedades: montarPropriedades(),
    infraestrutura: montarInfraestrutura(),
    possibilidades: montarPossibilidades(),
    autossuficiencia: montarAutossuficiencia(),
    compartilhar: montarCompartilhar(),
    saoJose: montarSaoJose(),
    aquisicao: montarAquisicao(),
    localizacao: montarLocalizacao(),
    contato: montarContato(),
    rodape: montarRodape()
  };
}

export default { montarSecoesMestre };
