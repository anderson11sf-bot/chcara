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
  subtitulo: 'Um lugar para a sua família, seus projetos e uma vida mais perto da natureza.',
  framesTotal: 90,
  portal3d: {
    videoSrc: '/media/video/drone-panorama-terreno.mp4',
    poster: '/media/img/drone-panorama-terreno-poster.webp',
    tag: 'Vista Aérea • Terreno & Lagos',
    legenda: '2 Hectares • Topografia Real & Lagos'
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
  subtitulo: 'Grandes propriedades rurais com infraestrutura e natureza preservada em São José dos Campos.',
  mapaImagem: '/media/img/mapa-oficial-terreno.webp',
  mapaVideoFundo: '/media/video/mapa-drone-bg.mp4',
  botaoMapa: 'VER LOCALIZAÇÃO NO GOOGLE MAPS',
  mapsLink: 'https://maps.app.goo.gl/AztxJXPuLWaPUBSWA',
  destaquesComerciais: [
    {
      numero: '7',
      rotulo: 'GLEBAS DISPONÍVEIS',
      descricao: 'Propriedades rurais exclusivas a partir de 20.000 m²'
    },
    {
      numero: '4',
      rotulo: 'COM CASAS',
      descricao: 'Glebas com residências campestres já implantadas'
    },
    {
      numero: 'R$ 475 mil',
      rotulo: 'A PARTIR DE',
      descricao: 'Financiamento facilitado direto com o proprietário'
    }
  ],
  referenciaComercial: 'Propriedades a partir de R$ 475 mil* com financiamento facilitado direto com o proprietário.'
};

/* ---------------------------------------------------------------------------
 * 7. SESSÃO 5: INFRAESTRUTURA (PÁGINA 5 DO PDF)
 * -------------------------------------------------------------------------*/
export const infraestrutura = {
  rotulo: '05 . INFRAESTRUTURA',
  titulo: 'Tudo o que você precisa para <br><span class="destaque-verde">VIVER MELHOR</span>',
  subtitulo: 'Infraestrutura planejada para garantir o máximo de conforto, segurança e qualidade de vida.',
  fundoVidro: '/media/img/fundo-abas.webp',
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
      titulo: 'Áreas de Convivência & Lazer',
      texto: 'Espaços de convivência integrados à natureza, parquinho infantil e trilhas ecológicas.',
      imagem: '/media/img/infraestrutura/parquinho.webp'
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
  fundoVidro: '/media/img/fundo-abas.webp',
  quadros: [
    {
      id: 'casa-campo',
      numero: '01',
      titulo: 'CASA DE CAMPO',
      tituloCompleto: 'CASA DE CAMPO CONTEMPORÂNEA',
      imagem: '/media/img/possibilidades/casa-campo-nova.webp',
      badge: 'PROJETO ILUSTRATIVO'
    },
    {
      id: 'chale-rustico',
      numero: '02',
      titulo: 'CHALÉ RÚSTICO',
      tituloCompleto: 'CHALÉ RÚSTICO COM ÁREA DE LAZER',
      imagem: '/media/img/possibilidades/chale-rustico.webp',
      badge: 'PROJETO ILUSTRATIVO'
    },
    {
      id: 'desenvolvimento',
      numero: '03',
      titulo: 'EM DESENVOLVIMENTO',
      tituloCompleto: 'POSSIBILIDADES DE IMPLANTAÇÃO',
      imagem: '/media/img/desenvolvimento/proj-desenv-1.webp',
      badge: 'PROJETO EM DESENVOLVIMENTO'
    },
    {
      id: 'equestre',
      numero: '04',
      titulo: 'ÁREA EQUINA',
      tituloCompleto: 'ESTRUTURA E EXPERIÊNCIA EQUESTRE',
      imagem: '/media/img/possibilidades/area-equina.webp',
      badge: 'PROJETO ILUSTRATIVO'
    }
  ],
  videosTicker: [
    {
      src: '/media/video/drone-relevo-lagos.mp4',
      poster: '/media/img/drone-relevo-lagos-poster.webp',
      titulo: 'Topografia & Lagos Reais'
    },
    {
      src: '/media/video/drone-panorama-terreno.mp4',
      poster: '/media/img/drone-panorama-terreno-poster.webp',
      titulo: '2 Hectares em Altitude'
    },
    {
      src: '/media/video/drone-chacaras-natureza.mp4',
      poster: '/media/img/drone-chacaras-natureza-poster.webp',
      titulo: 'Natureza & Espelho D\'água'
    },
    {
      src: '/media/video/drone-acesso-vale.mp4',
      poster: '/media/img/drone-acesso-vale-poster.webp',
      titulo: 'Acesso ao Empreendimento'
    },
    {
      src: '/media/video/drone-patrimonio.mp4',
      poster: '/media/img/drone-patrimonio-poster.webp',
      titulo: 'Topografia e Lagos (Drone)'
    },
    {
      src: '/media/video/proj-mansao-campo.mp4',
      poster: '/media/img/proj-mansao-campo-poster.webp',
      titulo: 'Mansão de Campo (Conceito)'
    },
    {
      src: '/media/video/proj-chale-lago.mp4',
      poster: '/media/img/proj-chale-lago-poster.webp',
      titulo: 'Chalé Junto ao Lago (Conceito)'
    }
  ],
  avisoLegal: '*PROJETO ILUSTRATIVO — As fotos e vídeos desta seção são referências conceituais e artísticas para demonstrar o potencial da área. Cada proprietário desenvolve seu projeto de forma particular, conforme seu desejo e as regras aplicáveis. As benfeitorias não estão inclusas no valor da terra nua.'
};

/* ---------------------------------------------------------------------------
 * 9. SESSÃO 7: VIDA AUTOSSUFICIENTE (PÁGINA 9 DO PDF)
 * -------------------------------------------------------------------------*/
export const autossuficiencia = {
  rotulo: 'AUTONOMIA & SAÚDE FAMILIAR',
  titulo: 'Vida Autossustentável: <br><span class="destaque-verde">O Quintal Produtivo</span>',
  subtitulo: 'Produza parte dos próprios alimentos e viva em contato com a terra fértil.',
  fundoVidro: '/media/img/fundo-abas.webp',
  cards: [
    {
      icone: 'folha',
      titulo: 'Pomar Produtivo',
      sub: 'Árvores frutíferas produtivas e colheita fresca no quintal',
      imagem: '/media/img/autossuficiencia/pomar-novo.webp'
    },
    {
      icone: 'arvores',
      titulo: 'Horta Orgânica',
      sub: 'Alimentos frescos, verduras e legumes direto da terra fértil',
      imagem: '/media/img/autossuficiencia/horta-nova.webp'
    },
    {
      icone: 'area',
      titulo: 'Criação Natural',
      sub: 'Galinheiro caipira e espaço amplo para convivência animal',
      imagem: '/media/img/autossuficiencia/criacao-natural.webp'
    },
    {
      icone: 'raio',
      titulo: 'Autonomia Energética',
      sub: 'Energia solar sustentável e água mineral de nascente perene',
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
  videoDrone: {
    src: '/media/video/drone-patrimonio.mp4',
    poster: '/media/img/drone-patrimonio-poster.webp',
    legenda: 'Vista Aérea da Propriedade • O Legado da Sua Família'
  },
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
 * 11. SESSÃO 9: SÃO JOSÉ DOS CAMPOS & REPRESA JAGUARI (VÍDEO VERTICAL 9:16)
 * -------------------------------------------------------------------------*/
export const saoJose = {
  rotulo: 'LOCALIZAÇÃO PRIVILEGIADA',
  titulo: 'A tranquilidade do campo. <br><span class="destaque-verde">A conveniência da cidade.</span>',
  subtitulo: 'A perfeita integração entre a paz do interior e a facilidade de acesso a São José dos Campos. Viva cercado pela natureza sem abrir mão da infraestrutura urbana.',
  video: {
    src: '/media/video/sao-jose-vertical.mp4',
    poster: '/media/img/sao-jose-vertical-poster.webp',
    legenda: 'São José dos Campos & Represa Jaguari • Vídeo Vertical'
  },
  textoApoio: 'O Paraíso das Águas reúne o melhor dos dois mundos: tranquilidade rural com asfalto até a porta, a apenas 2 km da Represa Jaguari — ponto privilegiado para lanchas, jetski e passeios náuticos — e a 20 minutos de São José dos Campos, cidade de referência em saúde, educação e serviços.',
  destaques: [
    { valor: '20 min', titulo: 'Centro de São José dos Campos', texto: 'Comércio, gastronomia, centros médicos e serviços a curta distância pavimentada.' },
    { valor: '2 km', titulo: 'Represa Jaguari (Jetski & Náutica)', texto: 'Ideal para esportes aquáticos, passeios de barco e pescaria esportiva a 5 minutos.' },
    { valor: '6 km', titulo: 'Parque da Cidade (Burle Marx)', texto: 'Área verde tradicional de SJC para caminhadas, passeios culturais e eventos.' },
    { valor: '~1h', titulo: 'São Paulo (Dutra / Carvalho Pinto)', texto: 'Ligação direta e rápida com a capital paulista e o Aeroporto de Guarulhos.' }
  ],
  botaoTexto: 'Saber mais sobre a localização e náutica no WhatsApp'
};

/* ---------------------------------------------------------------------------
 * 12. SESSÃO 11: LOCALIZAÇÃO PRIVILEGIADA (PÁGINA 3 DO PDF)
 * -------------------------------------------------------------------------*/
export const localizacao = {
  rotulo: '09. LOCALIZAÇÃO',
  titulo: 'PERTO DA CIDADE. <br><span class="destaque-verde">CONECTADO À NATUREZA.</span>',
  subtitulo: 'A perfeita integração entre a tranquilidade do campo e a proximidade de São José dos Campos.',
  imagemAerea: '/media/img/localizacao/sao-jose-campos.webp',
  videoFundo: '/media/video/mapa-drone-bg.mp4',
  distancias: [
    { valor: '20 min', destino: 'Centro de S. J. dos Campos', icone: 'carro' },
    { valor: '15 min', destino: 'Rodovia Dutra', icone: 'estrada' },
    { valor: '10 min', destino: 'Comércios e Serviços', icone: 'loja' }
  ],
  botaoTexto: 'VER LOCALIZAÇÃO NO GOOGLE MAPS',
  mapsLink: 'https://maps.app.goo.gl/AztxJXPuLWaPUBSWA'
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
  saoJose,
  localizacao,
  aquisicao,
  contato,
  seo,
  tracking
};
