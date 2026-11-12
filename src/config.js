/* ============================================================================
 * config.js — PAINEL DE CONTROLE DO SITE: PARAÍSO DAS ÁGUAS
 * ----------------------------------------------------------------------------
 * Baseado estritamente no DESIGN OFICIAL DO PDF (mobile .pdf)
 * Propriedades rurais de 2 Hectares (20.000 m² a 23.830 m²) em São José dos Campos - SP
 * Com grande lago central, minas de água mineral, asfalto, fibra e financiamento direto.
 * ==========================================================================*/

/* ---------------------------------------------------------------------------
 * 1. WHATSAPP
 * -------------------------------------------------------------------------*/
export const whatsapp = {
  numero: '5512983208335',
  numeroFormatado: '(12) 98320-8335',
  mensagemBase: 'Olá! Vi o site do Paraíso das Águas e quero agendar uma visita para conhecer as propriedades de 2 hectares.',
  mensagens: {
    flutuante: 'Olá! Vi o site do Paraíso das Águas e quero agendar uma visita para conhecer as propriedades de 2 hectares.',
    hero: 'Olá! Quero agendar uma visita ao Paraíso das Águas. Vi a opção de 2 hectares com lago e água mineral.',
    portal3d: 'Olá! Assisti à apresentação 3D do terreno do Paraíso das Águas e quero mais detalhes sobre as glebas.',
    vsl: 'Olá! Assisti à apresentação oficial do Paraíso das Águas e gostaria de tirar dúvidas sobre a propriedade.',
    efeitoParaiso: 'Olá! Gostaria de agendar uma visita ao Paraíso das Águas para conhecer o lago e as nascentes.',
    propriedades: 'Olá! Tenho interesse nas 7 glebas de 2 hectares do Paraíso das Águas (a partir de R$ 475 mil*).',
    infraestrutura: 'Olá! Gostaria de tirar dúvidas sobre a infraestrutura (asfalto, portaria 24h, trifásico, fibra óptica) do Paraíso das Águas.',
    possibilidades: 'Olá! Vi as inspirações de projetos do Paraíso das Águas e quero saber o que posso construir.',
    autossuficiencia: 'Olá! Quero saber mais sobre horta, pomar, galinheiro e energia solar no Paraíso das Águas.',
    compartilhar: 'Olá! Quero entender como funciona o patrimônio compartilhado em família no Paraíso das Águas.',
    saoJose: 'Olá! Quero saber a localização exata em São José dos Campos e a proximidade da Represa Jaguari.',
    aquisicao: 'Olá! Quero entender as condições de documentação, financiamento direto com a incorporadora e permuta.',
    localizacao: 'Olá! Quero confirmar a rota e localização no Google Maps para agendar uma visita.',
    contato: 'Olá! Gostaria de confirmar um horário para visitar o Paraíso das Águas.',
    formVIP: 'Olá! Preenchi o formulário no site e quero agendar minha visita ao Paraíso das Águas.'
  },
  incluirUtm: true
};

/* ---------------------------------------------------------------------------
 * 2. RITMO DO SCROLL
 * -------------------------------------------------------------------------*/
export const scroll = {
  alturaTotalSvh: 520,
  lenis: {
    lerpDesktop: 0.085,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
    scrubDesktop: 0.4,
    scrubMobile: 0
  },
  dica: {
    esconderAposPx: 20,
    reaparecerAposMs: 4500,
    textoSecundario: 'Role para continuar v'
  }
};

/* ---------------------------------------------------------------------------
 * 3. HERO (PRIMEIRA DOBRA — CONFORME PÁGINA 1 DO PDF)
 * -------------------------------------------------------------------------*/
export const hero = {
  wordmark: 'Paraíso das Águas',
  subtituloTopo: 'SÃO JOSÉ DOS CAMPOS',
  headline: 'Seu paraíso <br><span class="destaque-verde">de 2 hectares</span>',
  subheadline: 'Natureza, liberdade e segurança, a 20 min do centro.',
  ctaPrimario: 'Agendar Visita',
  ctaSecundario: 'Conhecer o Paraíso',
  cards: [
    { icone: 'arvores', titulo: '20 mil m²', sub: 'por chácara' },
    { icone: 'lago', titulo: 'Lago central', sub: 'entre os terrenos' },
    { icone: 'folha', titulo: 'Natureza preservada', sub: 'e ar puro' },
    { icone: 'pin', titulo: '20 min do centro', sub: 'de São José dos Campos' }
  ],
  poster: '/media/img/hero-scroll-poster.webp',
  framesTotal: 90
};

/* ---------------------------------------------------------------------------
 * 4. SESSÃO 2: O NOVO LUXO & ABERTURA CINEMATOGRÁFICA 3D (PÁGINA 2 DO PDF)
 * -------------------------------------------------------------------------*/
export const sessao2 = {
  rotulo: '02 / O NOVO LUXO',
  titulo: 'O novo luxo é ter <br><span class="destaque-verde">espaço para viver.</span>',
  subtitulo: 'Um lugar para a sua família, e. seus projetos e uma vida mais perto da natureza.',
  framesTotal: 90,
  portal3d: {
    videoSrc: '/media/video/terreno-3d-cima.mp4',
    poster: '/media/img/terreno-3d-cima-poster.webp',
    tag: 'Projeto 3D • Topografia Real',
    legenda: '2 Hectares (20.000 m² a 23.830 m²) • Vista Aérea Exclusiva'
  }
};

/* ---------------------------------------------------------------------------
 * 5. SESSÃO 3: CONHEÇA O PARAÍSO & VSL OFICIAL (PÁGINAS 3 E 7 DO PDF)
 * -------------------------------------------------------------------------*/
export const efeitoParaiso = {
  rotulo: 'CONHEÇA O PARAÍSO',
  titulo: 'MAIS ESPAÇO. MAIS NATUREZA. <br><span class="destaque-verde">MAIS LIBERDADE.</span>',
  subtitulo: 'Chácaras a partir de 20.000 m² para você viver com a privacidade, o conforto e a liberdade que a sua família merece, cercada de verde por todos os lados.',
  video: {
    src: '/media/video/vsl-oficial.mp4',
    poster: '/media/img/vsl-oficial-poster.webp',
    legenda: 'Apresentação oficial do Paraíso das Águas'
  },
  carrosselCards: [
    {
      imagem: '/media/img/terreno-lago-panorama.webp',
      titulo: 'Lagos e Espelhos D\'água',
      tag: 'Água Abundante'
    },
    {
      imagem: '/media/img/terreno-lago-alto.webp',
      titulo: 'Natureza Preservada',
      tag: 'Mata & Fauna'
    },
    {
      imagem: '/media/img/terreno-pasto-colina.webp',
      titulo: 'Amplos Terrenos',
      tag: '20.000 m² a 23.830 m²'
    }
  ],
  ctaTexto: 'Explorar os Lotes →'
};

/* ---------------------------------------------------------------------------
 * 6. SESSÃO 4: AS SETE GLEBAS (PÁGINA 4 DO PDF)
 * -------------------------------------------------------------------------*/
export const propriedades = {
  rotulo: '04 / PROJETO',
  titulo: 'AS SETE GLEBAS',
  subtitulo: 'Descubra cada propriedade e suas características.',
  mapaImagem: '/media/img/mapa-oficial-terreno.webp',
  botaoMapa: 'Ver no Mapa Interativo',
  glebas: [
    {
      nome: 'GLEBA A',
      area: '20.000 m² de área total',
      tags: ['Lago Central', 'Privacidade'],
      imagem: '/media/img/glebas/gleba-a-lago-vista.webp'
    },
    {
      nome: 'GLEBA B',
      area: '20.500 m² de área total',
      tags: ['Vista Panorâmica', 'Acesso Fácil'],
      imagem: '/media/img/glebas/gleba-b-estrada-natureza.webp'
    },
    {
      nome: 'GLEBA C',
      area: '21.200 m² de área total',
      tags: ['Margem do Lago', 'Deck Natural'],
      imagem: '/media/img/glebas/gleba-c-lago-deck.webp'
    },
    {
      nome: 'GLEBA D',
      area: '22.300 m² de área total',
      tags: ['Platô Elevado', 'Nascente Próxima'],
      imagem: '/media/img/glebas/gleba-d-plato-elevado.webp'
    },
    {
      nome: 'GLEBA E',
      area: '20.000 m² de área total',
      tags: ['Colina Suave', 'Terra Fértil'],
      imagem: '/media/img/glebas/gleba-e-colina-verde.webp'
    },
    {
      nome: 'GLEBA F',
      area: '23.830 m² de área total',
      tags: ['Mata Nativa', 'Máxima Privacidade'],
      imagem: '/media/img/glebas/gleba-f-mata-nativa.webp'
    },
    {
      nome: 'GLEBA G',
      area: '20.100 m² de área total',
      tags: ['Nascente Exclusiva', 'Lago Central'],
      imagem: '/media/img/glebas/gleba-g-nascente-lago.webp'
    }
  ],
  referenciaComercial: 'Propriedades a partir de R$ 475 mil* com financiamento facilitado direto com o proprietário.'
};

/* ---------------------------------------------------------------------------
 * 7. SESSÃO 5: INFRAESTRUTURA (PÁGINA 5 DO PDF)
 * -------------------------------------------------------------------------*/
export const infraestrutura = {
  rotulo: '05 . INFRAESTRUTURA',
  titulo: 'Tudo o que você precisa para <br><span class="destaque-ouro">VIVER MELHOR</span>',
  subtitulo: 'Infraestrutura planejada para garantir o máximo de conforto, segurança e qualidade de vida.',
  cards: [
    {
      icone: 'chave',
      titulo: 'Segurança 24h',
      texto: 'Portaria com controle de acesso e monitoramento permanente para sua tranquilidade.'
    },
    {
      icone: 'nascente',
      titulo: 'Redes de Água e Energia',
      texto: 'Infraestrutura completa de abastecimento de água e energia elétrica prontos para uso.'
    },
    {
      icone: 'estrada',
      titulo: 'Vias Arborizadas',
      texto: 'Ruas planejadas e integradas ao paisagismo natural, facilitando a circulação interna.'
    },
    {
      icone: 'arvores',
      titulo: 'Áreas de Convivência',
      texto: 'Espaços de lazer integrados à natureza, trilhas ecológicas e áreas preservadas.'
    }
  ]
};

/* ---------------------------------------------------------------------------
 * 8. SESSÃO 6: PROJETOS E POSSIBILIDADES (PÁGINAS 6 & 12 DO PDF)
 * -------------------------------------------------------------------------*/
export const possibilidades = {
  rotulo: '06 | PROJETOS E POSSIBILIDADES',
  titulo: 'Como você imagina o <br><span class="destaque-verde">seu paraíso?</span>',
  subtitulo: 'Inspirações de projetos pensados para a sua chácara de 2 hectares.',
  quadros: [
    {
      id: 'casa-campo',
      numero: '01',
      titulo: 'CASA DE CAMPO',
      tituloCompleto: 'CASA DE CAMPO CONTEMPORÂNEA',
      imagem: '/media/img/proj-house_with_pool_and_hillside_20261014125200_jpg.webp',
      badge: 'PROJETO ILUSTRATIVO'
    },
    {
      id: 'lazer-piscina',
      numero: '02',
      titulo: 'ESPAÇO DE LAZER',
      tituloCompleto: 'ÁREA DE LAZER COM PISCINA',
      imagem: '/media/img/proj-make_image_attractive_and_beautiful_20261014124921_jpg.webp',
      badge: 'PROJETO ILUSTRATIVO'
    },
    {
      id: 'horta-pomar',
      numero: '03',
      titulo: 'HORTA E POMAR',
      tituloCompleto: 'VIVER SUSTENTÁVEL',
      imagem: '/media/img/autossuficiencia/horta-produtiva.webp',
      badge: 'PROJETO ILUSTRATIVO'
    },
    {
      id: 'equestre',
      numero: '04',
      titulo: 'ESPAÇO EQUESTRE',
      tituloCompleto: 'ÁREA EQUESTRE',
      imagem: '/media/img/proj-make_this_image_attractive_20261014124853_jpg.webp',
      badge: 'PROJETO ILUSTRATIVO'
    }
  ],
  videosTicker: [
    {
      src: '/media/video/proj-mansao-campo.mp4',
      poster: '/media/img/proj-mansao-campo-poster.webp',
      titulo: 'Mansão de Campo 3D'
    },
    {
      src: '/media/video/proj-chale-lago.mp4',
      poster: '/media/img/proj-chale-lago-poster.webp',
      titulo: 'Chalé Junto ao Lago'
    },
    {
      src: '/media/video/demo-1.mp4',
      poster: '/media/img/terreno-3d-cima-poster.webp',
      titulo: 'Topografia e Lagos'
    },
    {
      src: '/media/video/demo-2.mp4',
      poster: '/media/img/terreno-lago-panorama.webp',
      titulo: 'Acesso e Natureza'
    }
  ],
  avisoLegal: '*PROJETO ILUSTRATIVO — As fotos e vídeos desta seção são propostas conceituais e artísticas para demonstrar o potencial da área. Cada proprietário desenvolve seu projeto de forma particular, conforme seu desejo e as regras aplicáveis. As benfeitorias não estão inclusas no valor da terra nua.'
};

/* ---------------------------------------------------------------------------
 * 9. SESSÃO 7: VIDA AUTOSSUFICIENTE (PÁGINA 9 DO PDF)
 * -------------------------------------------------------------------------*/
export const autossuficiencia = {
  rotulo: '07 • VIDA AUTOSSUFICIENTE',
  titulo: 'MAIS CONEXÃO <br><span class="destaque-verde">COM A NATUREZA</span>',
  subtitulo: 'Práticas sustentáveis e autonomia para uma vida natural, autossuficiente e em harmonia com o meio ambiente.',
  cards: [
    {
      icone: 'arvores',
      titulo: 'Horta',
      sub: 'Alimentos orgânicos',
      imagem: '/media/img/autossuficiencia/horta-produtiva.webp'
    },
    {
      icone: 'folha',
      titulo: 'Pomar',
      sub: 'Frutas frescas',
      imagem: '/media/img/autossuficiencia/pomar-arvores.webp'
    },
    {
      icone: 'area',
      titulo: 'Galinheiro',
      sub: 'Criação natural',
      imagem: '/media/img/autossuficiencia/criacao-natural.webp'
    },
    {
      icone: 'raio',
      titulo: 'Energia Solar',
      sub: 'Sustentabilidade',
      imagem: '/media/img/autossuficiencia/energia-solar.webp'
    }
  ],
  botaoTexto: 'Conhecer o Paraíso >'
};

/* ---------------------------------------------------------------------------
 * 10. SESSÃO 8: PATRIMÔNIO PARA COMPARTILHAR (PÁGINA 10 DO PDF)
 * -------------------------------------------------------------------------*/
export const compartilhar = {
  rotulo: 'PATRIMÔNIO FAMILIAR',
  titulo: 'UM PATRIMÔNIO <br><span class="destaque-ouro">PARA COMPARTILHAR</span>',
  subtitulo: 'Crie memórias que duram gerações em um lugar seguro, cercado por natureza e feito para conectar quem você mais ama.',
  imagemPrincipal: '/media/img/familia-novo-luxo.webp',
  cards: [
    {
      icone: 'coracao',
      titulo: 'Qualidade de vida única',
      texto: 'Espaços planejados para o bem-estar e a união de quem você ama.'
    },
    {
      icone: 'escudo',
      titulo: 'Segurança para todos',
      texto: 'Um refúgio tranquilo e protegido para as crianças brincarem livres.'
    },
    {
      icone: 'folha',
      titulo: 'Legado e valorização',
      texto: 'Um patrimônio sólido e seguro em uma das regiões que mais cresce.'
    }
  ],
  botaoTexto: 'CONVERSE COM NOSSA EQUIPE >'
};

/* ---------------------------------------------------------------------------
 * 11. SESSÃO 9: LOCALIZAÇÃO PRIVILEGIADA (PÁGINA 3 DO PDF)
 * -------------------------------------------------------------------------*/
export const localizacao = {
  rotulo: '09. LOCALIZAÇÃO',
  titulo: 'PERTO DA CIDADE. <br><span class="destaque-ouro">CONECTADO À NATUREZA.</span>',
  subtitulo: 'A perfeita integração entre a tranquilidade do campo e a proximidade de São José dos Campos.',
  imagemAerea: '/media/img/sao-jose-vertical-poster.webp',
  distancias: [
    { valor: '20 min', destino: 'Centro de S. J. dos Campos', icone: 'carro' },
    { valor: '15 min', destino: 'Rodovia Dutra', icone: 'estrada' },
    { valor: '10 min', destino: 'Comércios e Serviços', icone: 'loja' }
  ],
  botaoTexto: 'COMO CHEGAR >',
  mapsLink: 'https://maps.app.goo.gl/kVdV28pwVikpB3oJ6'
};

/* ---------------------------------------------------------------------------
 * 12. SESSÃO 10: DOCUMENTAÇÃO E CONDIÇÕES (PÁGINA 8 DO PDF)
 * -------------------------------------------------------------------------*/
export const aquisicao = {
  rotulo: '10. DOCUMENTAÇÃO E CONDIÇÕES',
  titulo: 'UMA COMPRA COM MAIS <br><span class="destaque-verde">TRANQUILIDADE.</span>',
  cards: [
    {
      icone: 'chave',
      titulo: 'Documentação',
      texto: 'Toda a documentação do empreendimento está 100% aprovada e regularizada.'
    },
    {
      icone: 'apertoMao',
      titulo: 'Financiamento Direto',
      texto: 'Condições facilitadas de pagamento diretamente com a incorporadora.'
    },
    {
      icone: 'troca',
      titulo: 'Permuta',
      texto: 'Análise de aceitação de imóvel ou veículo como parte do pagamento.'
    },
    {
      icone: 'chat',
      titulo: 'Atendimento ao Cliente',
      texto: 'Equipe especializada para auxiliar você em todas as etapas.'
    }
  ],
  botaoTexto: 'FALE COM UM CONSULTOR'
};

/* ---------------------------------------------------------------------------
 * 13. SESSÃO 12: CONTATO & AGENDE SUA VISITA (PÁGINA 11 DO PDF)
 * -------------------------------------------------------------------------*/
export const contato = {
  rotulo: 'ÚLTIMAS UNIDADES',
  titulo: 'A roça é o <br><span class="destaque-ouro">novo luxo.</span>',
  subtitulo: 'Um refúgio exclusivo de 20 mil m² com a segurança, liberdade e a natureza que sua família merece. Apenas a 20 min do centro.',
  cardForm: {
    titulo: 'AGENDE SUA VISITA',
    subtitulo: 'Solicite mais informações',
    botaoAgendar: 'AGENDAR VISITA ↗',
    botaoWhatsApp: 'FALE CONOSCO NO WHATSAPP >'
  }
};

/* ---------------------------------------------------------------------------
 * 14. SEO & META
 * -------------------------------------------------------------------------*/
export const seo = {
  titulo: 'Chácaras em São José dos Campos | Paraíso das Águas — 2 Hectares',
  descricao: 'Propriedades rurais de 2 hectares (20.000 m² a 23.830 m²) em São José dos Campos. Grande lago central, minas de água mineral, asfalto, fibra óptica e financiamento direto.',
  url: 'https://chcara.vercel.app'
};

export const tracking = {
  googleTagId: '',
  metaPixelId: ''
};

export default {
  whatsapp,
  scroll,
  hero,
  sessao2,
  efeitoParaiso,
  propriedades,
  infraestrutura,
  possibilidades,
  autossuficiencia,
  compartilhar,
  localizacao,
  aquisicao,
  contato,
  seo,
  tracking
};
