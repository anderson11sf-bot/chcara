/* ============================================================================
 * secoes.js — MONTAGEM DAS SEÇÕES 3 A 13 CONFORME ESPECIFICAÇÃO MESTRE
 * ----------------------------------------------------------------------------
 * Renderização dinâmica, semântica e limpa das 11 seções de conteúdo denso.
 * Todas as mídias novas mapeadas: VSL, mapa oficial, sobrevoo, projetos 3D e fotos reais.
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
 * 03. O EFEITO PARAÍSO DAS ÁGUAS & VSL OFICIAL
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
 * 04. AS PROPRIEDADES (VISÃO GERAL 2 HECTARES) & MAPA OFICIAL
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
      width: '1920',
      height: '1080'
    }));
    mapaCaixa.appendChild(criar('span', {
      classe: 'mapa-oficial-tag',
      texto: 'Planta Demarcada Oficial • 7 Glebas de ~2 Hectares'
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
      // Adiciona o selo "PROJETO ILUSTRATIVO" também no player do vídeo
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
 * 07. AUTOSSUFICIÊNCIA (O QUINTAL PRODUTIVO) & FOTOS REAIS
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

  // Galeria de fotos reais da terra e das águas
  if (A.fotosReais && A.fotosReais.length > 0) {
    const gradeFotos = criar('div', { classe: 'grade-fotos-reais' });
    for (const f of A.fotosReais) {
      const itemFoto = criar('div', { classe: 'item-foto-real' });
      itemFoto.appendChild(criar('img', {
        classe: 'item-foto-real__img',
        src: f.src,
        alt: f.legenda,
        loading: 'lazy',
        decoding: 'async'
      }));
      itemFoto.appendChild(criar('span', {
        classe: 'item-foto-real__legenda',
        texto: f.legenda
      }));
      gradeFotos.appendChild(itemFoto);
    }
    painel.appendChild(gradeFotos);
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
  painel.appendChild(botaoWhatsApp('autossuficiencia', 'Quero saber mais sobre a terra e a nascente', 'ouro'));

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
 * 09. SÃO JOSÉ DOS CAMPOS & REPRESA JAGUARI
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
  painel.appendChild(botaoWhatsApp('saoJose', 'Saber mais sobre a localização e o lazer na represa', 'ouro'));

  secao.replaceChildren(painel);
  secao.hidden = false;
  return secao;
}

/* --------------------------------------------------------------------------
 * 10. CONDIÇÕES DE AQUISIÇÃO & SEGURANÇA JURÍDICA
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

  const listaAcordeoes = criar('div', { classe: 'lista-acordeoes' });
  for (let i = 0; i < A.acordeoes.length; i++) {
    const item = A.acordeoes[i];
    const details = criar('details', { classe: 'acordeon', open: i === 0 ? '' : null });
    const summary = criar('summary', { classe: 'acordeon__titulo', texto: item.titulo });
    const corpo = criar('div', { classe: 'acordeon__corpo' });
    corpo.appendChild(criar('p', { texto: item.conteudo }));

    details.appendChild(summary);
    details.appendChild(corpo);
    listaAcordeoes.appendChild(details);
  }
  painel.appendChild(listaAcordeoes);

  painel.appendChild(criar('hr', { classe: 'divisor-lago' }));
  painel.appendChild(botaoWhatsApp('aquisicao', 'Consultar condições de financiamento direto', 'ouro'));

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

  // Botão para Google Maps
  const boxMapa = criar('div', { classe: 'mapa-cta-caixa' });
  const btnMapa = criar('a', {
    classe: 'btn btn--vidro btn--com-icone',
    href: L.mapaLink,
    target: '_blank',
    rel: 'noopener noreferrer',
    texto: L.legendaMapa
  });
  boxMapa.appendChild(btnMapa);
  painel.appendChild(boxMapa);

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

  // Formulário rápido de preferência de visita
  const form = criar('form', { classe: 'form-agendamento' });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const diaSel = form.querySelector('input[name="dia"]:checked')?.value || 'qualquer dia';
    const msg = `Olá! Gostaria de agendar uma visita ao Paraíso das Águas. Tenho preferência para ir em um(a) ${diaSel}.`;
    const numero = String(config.whatsapp.numero).replace(/\D/g, '');
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`, '_blank');
  });

  const rotuloOpcoes = criar('label', { classe: 'form-agendamento__label', texto: 'Selecione seu melhor dia para visita:' });
  form.appendChild(rotuloOpcoes);

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

  painel.appendChild(form);

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
