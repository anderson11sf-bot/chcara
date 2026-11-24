/* ============================================================================
 * config.js — PAINEL DE CONTROLE DO SITE: PARAÍSO DAS ÁGUAS
 * ----------------------------------------------------------------------------
 * Propriedades exclusivas de alto padrão a partir de 20.000 m² em São José dos Campos - SP
 * Apenas 5 propriedades com casa pronta disponíveis.
 * Com 2 lagos divididos entre as propriedades, energia e fibra óptica já instaladas,
 * asfalto até o local e financiamento facilitado direto a partir de R$ 485 mil.
 * ==========================================================================*/

/* ---------------------------------------------------------------------------
 * 1. WHATSAPP
 * -------------------------------------------------------------------------*/
export const whatsapp = {
  numero: '5512983208335',
  numeroFormatado: '(12) 98320-8335',
  mensagemBase: 'Olá! Vi o site do Paraíso das Águas e quero agendar uma visita para conhecer as propriedades com casa pronta a partir de 20.000 m².',
  mensagens: {
    flutuante: 'Olá! Vi o site do Paraíso das Águas e quero agendar uma visita para conhecer as propriedades a partir de 20.000 m² (apenas 5 casas disponíveis).',
    hero: 'Olá! Quero agendar uma visita ao Paraíso das Águas. Vi as propriedades a partir de 20.000 m² com 2 lagos, energia e fibra instaladas.',
    portal3d: 'Olá! Assisti à apresentação aérea do terreno do Paraíso das Águas e quero mais detalhes sobre as glebas disponíveis.',
    vsl: 'Olá! Assisti à apresentação oficial do Paraíso das Águas e gostaria de tirar dúvidas sobre as propriedades.',
    efeitoParaiso: 'Olá! Gostaria de agendar uma visita ao Paraíso das Águas para conhecer os 2 lagos e os terrenos a partir de 20.000 m².',
    propriedades: 'Olá! Tenho interesse nas propriedades a partir de 20.000 m² do Paraíso das Águas (a partir de R$ 485 mil*). Só temos 5 casas prontas?',
    infraestrutura: 'Olá! Gostaria de tirar dúvidas sobre a infraestrutura (asfalto, rede elétrica e fibra óptica já instaladas, 2 lagos) do Paraíso das Águas.',
    possibilidades: 'Olá! Vi as inspirações de projetos do Paraíso das Águas (incluindo o chalé em madeira imbuia) e quero saber mais.',
    autossuficiencia: 'Olá! Quero saber mais sobre horta orgânica, pomar e autonomia energética no Paraíso das Águas.',
    compartilhar: 'Olá! Quero entender como funciona o patrimônio compartilhado em família no Paraíso das Águas.',
    saoJose: 'Olá! Vi a matéria sobre a valorização de São José dos Campos e quero entender o potencial de investimento do Paraíso das Águas.',
    aquisicao: 'Olá! Quero entender as condições de documentação, financiamento direto com a incorporadora e permuta.',
    localizacao: 'Olá! Quero confirmar a rota e localização no Google Maps para agendar uma visita.',
    contato: 'Olá! Gostaria de confirmar um horário para visitar o Paraíso das Águas e conhecer as 5 propriedades com casa pronta.',
    formVIP: 'Olá! Preenchi o formulário no site e quero agendar minha visita ao Paraíso das Águas (R$ 485 mil*).'
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
 * 3. HERO (PRIMEIRA DOBRA — CONCEITO FAMÍLIA URBANA & ESCASSEZ)
 * -------------------------------------------------------------------------*/
export const hero = {
  wordmark: 'Paraíso das Águas',
  subtituloTopo: 'SÃO JOSÉ DOS CAMPOS',
  escassezAviso: 'Só temos 5 propriedades com casa pronta',
  headline: 'Seu refúgio privativo <br><span class="destaque-verde">a partir de 20.000 m²</span>',
  subheadline: 'O equilíbrio perfeito para a família urbana: natureza preservada, conectividade com fibra óptica, segurança e 2 lagos a 20 min do centro.',
  ctaPrimario: 'Agendar Visita Exclusiva',
  ctaSecundario: 'Conhecer o Paraíso',
  cards: [
    { icone: 'arvores', titulo: 'A partir de 20 mil m²', sub: 'privacidade e ar puro' },
    { icone: 'lago', titulo: '2 lagos divididos', sub: 'entre as propriedades' },
    { icone: 'raio', titulo: 'Energia & Fibra Óptica', sub: 'já instaladas para home office' },
    { icone: 'pin', titulo: '20 min do centro', sub: 'de São José dos Campos' }
  ],
  poster: '/media/img/hero-scroll-poster.webp',
  framesTotal: 90
};

/* ---------------------------------------------------------------------------
 * 4. SESSÃO 2: O NOVO LUXO & ABERTURA CINEMATOGRÁFICA
 * -------------------------------------------------------------------------*/
export const sessao2 = {
  rotulo: '02 / O NOVO LUXO',
  titulo: 'O novo luxo é ter <br><span class="destaque-verde">espaço para viver.</span>',
  subtitulo: 'Um refúgio exclusivo para a família urbana construir memórias, projetos de vida e bem-estar em harmonia com a natureza.',
  framesTotal: 90,
  portal3d: {
    videoSrc: '/media/video/drone-panorama-terreno.mp4',
    poster: '/media/img/drone-panorama-terreno-poster.webp',
    tag: 'Vista Aérea • Terreno & Lagos',
    legenda: 'A partir de 20.000 m² • Topografia Real & 2 Lagos'
  }
};

/* ---------------------------------------------------------------------------
 * 5. SESSÃO 3: CONHEÇA O PARAÍSO & VSL OFICIAL
 * -------------------------------------------------------------------------*/
export const efeitoParaiso = {
  rotulo: 'CONHEÇA O PARAÍSO',
  titulo: 'MAIS ESPAÇO. MAIS NATUREZA. <br><span class="destaque-verde">MAIS LIBERDADE.</span>',
  subtitulo: 'Propriedades exclusivas a partir de 20.000 m² planejadas para a família urbana viver com total privacidade, segurança e o conforto que merece, cercada de verde e com 2 lagos compartilhados.',
  video: {
    src: '/media/video/vsl-oficial.mp4?v=20261124',
    poster: '/media/img/vsl-oficial-poster.webp?v=20261124',
    legenda: 'Apresentação oficial do Paraíso das Águas'
  },
  carrosselCards: [
    {
      imagem: '/media/img/terreno-lago-panorama.webp',
      titulo: '2 Lagos Divididos Entre as Propriedades',
      tag: 'Espelho D\'água Exclusivo'
    },
    {
      imagem: '/media/img/terreno-lago-alto.webp',
      titulo: 'Natureza Preservada',
      tag: 'Mata & Fauna Nativa'
    }
  ],
  ctaTexto: 'Explorar as Propriedades →'
};

/* ---------------------------------------------------------------------------
 * 6. SESSÃO 4: AS SETE GLEBAS & ESTOQUE EXCLUSIVO (5 CASAS PRONTAS)
 * -------------------------------------------------------------------------*/
export const propriedades = {
  rotulo: '04 / O PROJETO',
  titulo: 'AS SETE GLEBAS',
  subtitulo: 'Propriedades exclusivas de alto padrão com infraestrutura instalada e natureza preservada em São José dos Campos.',
  mapaImagem: '/media/img/mapa-oficial-terreno.webp?v=20261124',
  mapaVideoFundo: '/media/video/mapa-drone-bg.mp4',
  botaoMapa: 'VER LOCALIZAÇÃO NO GOOGLE MAPS',
  mapsLink: 'https://maps.app.goo.gl/AztxJXPuLWaPUBSWA',
  escassezDestaque: 'Só temos 5 propriedades com casa pronta',
  destaquesComerciais: [
    {
      numero: '5 CASAS',
      rotulo: 'ESTOQUE LIMITADO',
      descricao: 'Só temos 5 propriedades com casa pronta'
    },
    {
      numero: 'A partir de 20.000 m²',
      rotulo: 'METRAGEM EXCLUSIVA',
      descricao: 'Amplos terrenos com total privacidade para sua família'
    },
    {
      numero: 'R$ 485 mil',
      rotulo: 'INVESTIMENTO A PARTIR DE',
      descricao: 'Financiamento facilitado direto com o incorporador'
    }
  ],
  referenciaComercial: 'Atenção: só temos 5 propriedades com casa pronta. Propriedades a partir de 20.000 m² por R$ 485 mil* com financiamento facilitado direto com o incorporador.'
};

/* ---------------------------------------------------------------------------
 * 7. SESSÃO 5: INFRAESTRUTURA COMPLETA (SEM ÁGUA, SEM LAZER, COM 2 LAGOS E FIBRA)
 * -------------------------------------------------------------------------*/
export const infraestrutura = {
  rotulo: '05 . INFRAESTRUTURA',
  titulo: 'Tudo o que a família urbana precisa para <br><span class="destaque-verde">VIVER COM CONFORTO</span>',
  subtitulo: 'Infraestrutura planejada para garantir total comodidade, segurança 24h e conectividade em meio à natureza.',
  fundoVidro: '/media/img/fundo-abas.webp',
  cards: [
    {
      icone: 'chave',
      titulo: 'Segurança 24h',
      texto: 'Portaria com controle rigoroso de acesso e monitoramento permanente para a tranquilidade e proteção da sua família.'
    },
    {
      icone: 'raio',
      titulo: 'Rede Elétrica e Fibra Óptica Já Instaladas',
      texto: 'Infraestrutura completa com rede de energia elétrica e internet por fibra óptica de alta velocidade já instaladas e funcionando. Perfeito para a família urbana desfrutar de home office rápido, entretenimento de qualidade e zero dor de cabeça com instalações básicas.'
    },
    {
      icone: 'estrada',
      titulo: 'Acesso Pavimentado e Vias Arborizadas',
      texto: 'Asfalto até o acesso da propriedade e vias internas planejadas integradas ao relevo natural, facilitando a circulação prática e segura.'
    },
    {
      icone: 'lago',
      titulo: '2 Lagos Divididos Entre Todas as Propriedades',
      texto: 'Diferencial exclusivo de 2 belos lagos com espelho d\'água divididos entre todas as propriedades para contemplação, pesca esportiva e privacidade compartilhada com alto padrão.'
    }
  ]
};

/* ---------------------------------------------------------------------------
 * 8. SESSÃO 6: PROJETOS E POSSIBILIDADES (MADEIRA IMBUIA & SUGESTÕES ILUSTRATIVAS)
 * -------------------------------------------------------------------------*/
export const possibilidades = {
  rotulo: '06 | PROJETOS E POSSIBILIDADES',
  titulo: 'Como você imagina o <br><span class="destaque-verde">seu paraíso?</span>',
  subtitulo: 'Inspirações de projetos conceituais pensados para a sua propriedade a partir de 20.000 m².',
  fundoVidro: '/media/img/fundo-abas.webp',
  quadros: [
    {
      id: 'casa-campo',
      numero: '01',
      titulo: 'CASA DE CAMPO',
      tituloCompleto: 'CASA DE CAMPO CONTEMPORÂNEA',
      imagem: '/media/img/possibilidades/casa-campo-nova.webp?v=20261124',
      badge: 'Sugestão ilustrativa'
    },
    {
      id: 'chale-imbuia',
      numero: '02',
      titulo: 'CHALÉ EM MADEIRA IMBUIA',
      tituloCompleto: 'CHALÉ EM MADEIRA IMBUIA COM DECK PANORÂMICO',
      imagem: '/media/img/possibilidades/madeira-imbuia.webp',
      badge: 'Sugestão ilustrativa'
    },
    {
      id: 'desenvolvimento',
      numero: '03',
      titulo: 'CONCEITO ARQUITETÔNICO',
      tituloCompleto: 'POSSIBILIDADES DE IMPLANTAÇÃO EXCLUSIVA',
      imagem: '/media/img/desenvolvimento/proj-desenv-1.webp',
      badge: 'Sugestão ilustrativa'
    },
    {
      id: 'equestre',
      numero: '04',
      titulo: 'ESTRUTURA EQUESTRE',
      tituloCompleto: 'ESTRUTURA E EXPERIÊNCIA EQUESTRE',
      imagem: '/media/img/possibilidades/area-equina.webp',
      badge: 'Sugestão ilustrativa'
    }
  ],
  videosTicker: [
    {
      src: '/media/video/drone-relevo-lagos.mp4',
      poster: '/media/img/drone-relevo-lagos-poster.webp',
      titulo: 'Topografia & 2 Lagos Reais'
    },
    {
      src: '/media/video/drone-panorama-terreno.mp4',
      poster: '/media/img/drone-panorama-terreno-poster.webp',
      titulo: 'A partir de 20.000 m² em Altitude'
    },
    {
      src: '/media/video/drone-chacaras-natureza.mp4',
      poster: '/media/img/drone-chacaras-natureza-poster.webp',
      titulo: 'Natureza & Espelho D\'água'
    },
    {
      src: '/media/video/drone-acesso-vale.mp4',
      poster: '/media/img/drone-acesso-vale-poster.webp',
      titulo: 'Acesso Pavimentado ao Empreendimento'
    },
        {
      src: '/media/video/proj-mansao-campo.mp4',
      poster: '/media/img/proj-mansao-campo-poster.webp',
      titulo: 'Mansão de Campo (Sugestão ilustrativa)'
    },
    {
      src: '/media/video/proj-chale-lago.mp4',
      poster: '/media/img/proj-chale-lago-poster.webp',
      titulo: 'Chalé Junto ao Lago (Sugestão ilustrativa)'
    }
  ],
  avisoLegal: '*Sugestão ilustrativa — As fotos e vídeos desta seção são referências conceituais e artísticas para demonstrar o potencial da área. Cada proprietário desenvolve seu projeto de forma particular, conforme seu desejo e as regras aplicáveis. As benfeitorias não estão inclusas no valor da terra nua.'
};

/* ---------------------------------------------------------------------------
 * 9. SESSÃO 7: VIDA AUTOSSUFICIENTE
 * -------------------------------------------------------------------------*/
export const autossuficiencia = {
  rotulo: 'AUTONOMIA & SAÚDE FAMILIAR',
  titulo: 'Vida Autossustentável: <br><span class="destaque-verde">O Quintal Produtivo</span>',
  subtitulo: 'Produza alimentos orgânicos frescos e viva em harmonia com a terra fértil.',
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
      sub: 'Alimentos frescos, verduras e legumes colhidos na hora',
      imagem: '/media/img/autossuficiencia/horta-nova.webp'
    },
    {
      icone: 'area',
      titulo: 'Criação Natural',
      sub: 'Galinheiro caipira e espaço amplo para convivência animal',
      imagem: '/media/img/autossuficiencia/criacao-natural.webp?v=20261124'
    },
    {
      icone: 'raio',
      titulo: 'Autonomia Energética',
      sub: 'Energia solar sustentável e água pura de nascente perene',
      imagem: '/media/img/autossuficiencia/energia-solar.webp'
    }
  ],
  botaoTexto: 'Conhecer o Paraíso >'
};

/* ---------------------------------------------------------------------------
 * 10. SESSÃO 8: PATRIMÔNIO PARA COMPARTILHAR
 * -------------------------------------------------------------------------*/
export const compartilhar = {
  rotulo: 'PATRIMÔNIO FAMILIAR',
  titulo: 'UM PATRIMÔNIO SÓLIDO <br><span class="destaque-ouro">PARA COMPARTILHAR</span>',
  subtitulo: 'Crie memórias que duram gerações em um refúgio seguro, cercado por natureza e feito para conectar quem você mais ama com alto padrão e tranquilidade.',
  imagemPrincipal: '/media/img/familia-novo-luxo.webp?v=20261124b',
  cards: [
    {
      icone: 'coracao',
      titulo: 'Qualidade de vida única',
      texto: 'Espaços planejados para o bem-estar e a convivência saudável de quem você ama.'
    },
    {
      icone: 'escudo',
      titulo: 'Segurança e liberdade',
      texto: 'Um refúgio tranquilo e protegido para as crianças viverem livres em contato com o verde.'
    },
    {
      icone: 'folha',
      titulo: 'Legado e valorização patrimonial',
      texto: 'Um patrimônio sólido e seguro em uma das regiões que mais se valorizam no Brasil.'
    }
  ],
  botaoTexto: 'CONVERSE COM NOSSA EQUIPE >'
};

/* ---------------------------------------------------------------------------
 * 11. SESSÃO 9: VALORIZAÇÃO IMOBILIÁRIA DE SÃO JOSÉ DOS CAMPOS & PROTEÇÃO PATRIMONIAL
 * -------------------------------------------------------------------------*/
export const saoJose = {
  rotulo: 'VALORIZAÇÃO IMOBILIÁRIA & PROTEÇÃO PATRIMONIAL',
  titulo: 'São José dos Campos: qualidade de vida em nível Suíça e liderança em valorização',
  subtitulo: 'Valorização consistente, infraestrutura de ponta e grandes projetos que protegem o patrimônio da família.',
  video: {
    src: '/media/video/sao-jose-vertical.mp4',
    poster: '/media/img/sao-jose-vertical-poster.webp',
    legenda: 'São José dos Campos & Represa Jaguari • Vídeo Vertical'
  },
  textoApoio: 'O Paraíso das Águas reúne o melhor dos dois mundos: tranquilidade de um refúgio privativo cercado por natureza com asfalto até a porta, a apenas 2 km da Represa Jaguari — ponto privilegiado para lanchas, jetski e esportes náuticos — e a 20 minutos de São José dos Campos, cidade de referência internacional em qualidade de vida, saúde e tecnologia.',
  pilares: [
    {
      id: 'pilar-a',
      titulo: 'Histórico de 10 Anos e Multiplicação de Patrimônio',
      tag: '1º LUGAR NO M² DO INTERIOR DE SP',
      texto: 'São José dos Campos se consolida como uma das cidades que mais crescem e se valorizam no Brasil, liderando com folga o ranking do valor do metro quadrado no interior de São Paulo segundo o respeitado Índice FipeZAP. Para o investidor e para a família urbana que busca blindar e expandir seu capital, o município apresenta um histórico sólido de valorização contínua nos últimos 10 anos. Uma tese de investimento comprovada na prática, com potencial real de multiplicação patrimonial a cada 5 anos, acompanhando o ritmo acelerado de desenvolvimento do polo aeroespacial e tecnológico do Vale do Paraíba.',
      links: [
        {
          url: 'https://g1.globo.com/sp/vale-do-paraiba-regiao/noticia/2026/10/21/preco-do-metro-quadrado-em-sao-jose-dos-campos-chega-a-r-96-mil-e-lidera-ranking-no-interior-de-sp.ghtml',
          texto: 'Ler matéria completa no G1 →',
          fonte: 'G1 Vale do Paraíba / FipeZAP'
        }
      ]
    },
    {
      id: 'pilar-b',
      titulo: 'Um dos Melhores IDHs do Brasil e a "Suíça Brasileira"',
      tag: 'NÍVEL PLATINA MUNDIAL (ISO 37125)',
      texto: 'Com um dos índices de desenvolvimento humano (IDH) mais elevados de todo o país, São José dos Campos alcançou reconhecimento global como a autêntica "Suíça Brasileira". Tornou-se a primeiríssima cidade do mundo a conquistar o cobiçado nível Platina da certificação internacional ISO 37125, superando metrópoles consagradas da Suíça e da Noruega em indicadores de qualidade de vida, sustentabilidade, segurança pública, infraestrutura e inovação urbana de padrão internacional.',
      links: [
        {
          url: 'https://www.gazetasp.com.br/turismo/cidade-em-sp-vence-suica-e-noruega-e-vira-a-1-do-mundo-a-atingir-o/',
          texto: 'Ler matéria na Gazeta de SP →',
          fonte: 'Gazeta de São Paulo'
        }
      ]
    },
    {
      id: 'pilar-c',
      titulo: 'Parque da Cidade e Grandes Projetos de Concessão',
      tag: '35 ANOS DE CONCESSÃO & CAPITAL INTERNACIONAL',
      texto: 'O futuro de São José dos Campos projeta uma valorização imobiliária ainda mais vigorosa com a aprovação da concessão do icônico Parque da Cidade Roberto Burle Marx por 35 anos. O masterplan prevê a implantação de um moderníssimo Centro de Exposições, Convenções e Eventos internacionais, além de um novo Teatro Municipal. Somam-se a isso grandes acordos comerciais e a forte atração de investimentos de capital árabe na região, criando um ciclo virtuoso que impulsiona de forma contínua o valor dos imóveis no entorno.',
      links: [
        {
          url: 'https://www.meon.com.br/noticias/vale-do-paraiba-regiao/sao-jose-dos-campos/aprovada-concessao-parque-da-cidade-sjc-35-anos',
          texto: 'Ler matéria da concessão no Meon →',
          fonte: 'Portal Meon'
        },
        {
          url: 'https://www.sjc.sp.gov.br/noticias/2026/janeiro/05/retrospectiva-2025-parcerias-e-concessoes-projetam-o-futuro/',
          texto: 'Ver retrospectiva no portal da Prefeitura de SJC →',
          fonte: 'Prefeitura de São José dos Campos'
        }
      ]
    }
  ],
  destaques: [
    { valor: '20 min', titulo: 'Centro de São José dos Campos', texto: 'Comércio sofisticado, gastronomia de alto padrão, centros médicos e hospitais de ponta.' },
    { valor: '2 km', titulo: 'Represa Jaguari (Náutica & Jetski)', texto: 'Ponto nobre para esportes aquáticos, lanchas e lazer náutico a 5 minutos da propriedade.' },
    { valor: '6 km', titulo: 'Parque da Cidade (Burle Marx)', texto: 'Novo Centro de Convenções e Teatro Municipal em área verde tombada por Burle Marx.' },
    { valor: '~1h', titulo: 'São Paulo (Dutra / Carvalho Pinto)', texto: 'Acesso rápido e duplicado à capital paulista e ao Aeroporto Internacional de Guarulhos.' }
  ],
  botaoTexto: 'Conversar com um especialista sobre valorização e investimento'
};

/* ---------------------------------------------------------------------------
 * 12. SESSÃO 11: LOCALIZAÇÃO PRIVILEGIADA
 * -------------------------------------------------------------------------*/
export const localizacao = {
  rotulo: '09. LOCALIZAÇÃO',
  titulo: 'PERTO DA CIDADE. <br><span class="destaque-verde">CONECTADO À NATUREZA.</span>',
  subtitulo: 'A perfeita integração entre o silêncio da natureza preservada e a conveniência de São José dos Campos.',
  imagemAerea: '/media/img/localizacao/sao-jose-campos.webp?v=20261124',
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
 * 13. SESSÃO 10: DOCUMENTAÇÃO E CONDIÇÕES
 * -------------------------------------------------------------------------*/
export const aquisicao = {
  rotulo: '10. DOCUMENTAÇÃO E CONDIÇÕES',
  titulo: 'UMA COMPRA COM MAIS <br><span class="destaque-verde">TRANQUILIDADE.</span>',
  cards: [
    {
      icone: 'chave',
      titulo: 'Documentação 100% Regularizada',
      texto: 'Toda a documentação das glebas está aprovada e pronta para escritura e transferência imediata.'
    },
    {
      icone: 'apertoMao',
      titulo: 'Financiamento Direto',
      texto: 'Condições facilitadas de pagamento diretamente com o incorporador, sem burocracia bancária.'
    },
    {
      icone: 'troca',
      titulo: 'Permuta Sob Análise',
      texto: 'Avaliação de imóvel ou veículo de alto padrão como parte do pagamento.'
    },
    {
      icone: 'chat',
      titulo: 'Atendimento Personalizado',
      texto: 'Equipe especializada para orientar a família urbana em cada etapa da aquisição.'
    }
  ],
  botaoTexto: 'FALE COM UM CONSULTOR'
};

/* ---------------------------------------------------------------------------
 * 14. SESSÃO 12: CONTATO & ESCASSEZ (5 CASAS PRONTAS)
 * -------------------------------------------------------------------------*/
export const contato = {
  rotulo: 'ÚLTIMAS UNIDADES',
  titulo: 'O contato com a natureza é o <br><span class="destaque-ouro">novo luxo.</span>',
  subtitulo: 'Só temos 5 propriedades com casa pronta. Um refúgio privativo exclusivo a partir de 20.000 m² com segurança, 2 lagos divididos, energia e fibra óptica já instaladas. A apenas 20 min do centro.',
  escassezAviso: 'Atenção: só temos 5 propriedades com casa pronta disponíveis.',
  cardForm: {
    titulo: 'AGENDE SUA VISITA EXCLUSIVA',
    subtitulo: 'Só temos 5 propriedades com casa pronta a partir de R$ 485 mil*',
    botaoAgendar: 'AGENDAR VISITA ↗',
    botaoWhatsApp: 'FALE CONOSCO NO WHATSAPP >'
  }
};

/* ---------------------------------------------------------------------------
 * 15. SEO & META
 * -------------------------------------------------------------------------*/
export const seo = {
  titulo: 'Paraíso das Águas | Propriedades a partir de 20.000 m² em São José dos Campos',
  descricao: 'Refúgio privativo exclusivo a partir de 20.000 m² em São José dos Campos. Apenas 5 propriedades com casa pronta. 2 lagos compartilhados, energia e fibra óptica já instaladas, asfalto e financiamento direto a partir de R$ 485 mil.',
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
