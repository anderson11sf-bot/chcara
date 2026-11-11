/* ============================================================================
 * config.js — PAINEL ÚNICO DE CONTROLE DO SITE: PARAÍSO DAS ÁGUAS
 * ----------------------------------------------------------------------------
 * Chácaras de 2 Hectares (20.000 m² a 22.300 m²) em São José dos Campos - SP
 * Com um grande lago no coração da comunidade, água mineral de nascente, asfalto e segurança.
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
    portal3d: 'Olá! Assisti à abertura 3D do terreno do Paraíso das Águas e quero mais detalhes sobre as opções.',
    vsl: 'Olá! Assisti à apresentação em vídeo do Paraíso das Águas e gostaria de tirar dúvidas sobre a propriedade.',
    efeitoParaiso: 'Olá! Gostaria de agendar uma visita ao Paraíso das Águas para conhecer o lago e a nascente.',
    propriedades: 'Olá! Tenho interesse nas propriedades de 2 hectares do Paraíso das Águas (a partir de R$ 475 mil*).',
    infraestrutura: 'Olá! Gostaria de tirar dúvidas sobre a infraestrutura (asfalto até a portaria, trifásico, fibra óptica) do Paraíso das Águas.',
    possibilidades: 'Olá! Vi os projetos ilustrativos do Paraíso das Águas e quero saber o que posso construir.',
    autossuficiencia: 'Olá! Quero saber mais sobre a terra fértil, horta, pomar e as nascentes de água mineral.',
    compartilhar: 'Olá! Quero entender como funciona a opção de compra compartilhada em família ou com sócio.',
    saoJose: 'Olá! Quero saber a localização exata em São José dos Campos e a proximidade da Represa Jaguari.',
    aquisicao: 'Olá! Quero entender as condições de financiamento direto com o proprietário e a aceitação de imóvel na troca.',
    localizacao: 'Olá! Quero confirmar a localização exata no Google Maps e agendar minha rota de visita.',
    contato: 'Olá! Gostaria de confirmar um horário para visitar o Paraíso das Águas.',
    faq: 'Olá! Fiquei com uma dúvida sobre o Paraíso das Águas e gostaria de falar com o proprietário.'
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
    textoSecundario: 'Continue descendo ✨'
  }
};

/* ---------------------------------------------------------------------------
 * 3. HERO (PRIMEIRA DOBRA)
 * -------------------------------------------------------------------------*/
export const hero = {
  wordmark: 'Paraíso das Águas',
  subtituloTopo: 'SÃO JOSÉ DOS CAMPOS • SP',
  headline: 'Seu paraíso de <em>2 hectares</em> com lago, água mineral e segurança',
  subheadline: 'a 20 minutos do centro de São José dos Campos e a 2 km da Represa Jaguari',
  ctaPrimario: 'Agendar visita no WhatsApp',
  ctaSecundario: 'Ver apresentação completa',
  // 3 Selos com ícones SVG
  selos: [
    { texto: 'Documentação em ordem', icone: 'chave' },
    { texto: 'Financia direto com o proprietário', icone: 'apertoMao' },
    { texto: 'Aceita imóvel na troca', icone: 'troca' }
  ],
  // 4 Emblemas da faixa rápida com ícones SVG
  emblemas: [
    { texto: '20 mil m² por chácara', icone: 'area' },
    { texto: 'Um grande lago no coração da comunidade', icone: 'lago' },
    { texto: 'Asfalto, fibra e energia trifásica', icone: 'estrada' },
    { texto: '20 min do centro • 2 km da represa', icone: 'pin' }
  ],
  poster: '/media/img/hero-scroll-poster.webp',
  framesTotal: 94
};

/* ---------------------------------------------------------------------------
 * 4. SESSÃO 2: O NOVO LUXO & ABERTURA CINEMATOGRÁFICA DO VÍDEO 3D
 * -------------------------------------------------------------------------*/
export const sessao2 = {
  rotulo: 'Sessão 02 • O Conceito',
  framesTotal: 104,
  cards: [
    {
      rotulo: 'Mudança de Perspectiva',
      icone: 'ouro',
      titulo: 'O novo luxo mudou de endereço.',
      sub: 'A roça é o novo luxo.'
    },
    {
      rotulo: 'Espaço & Autonomia',
      icone: 'nascente',
      titulo: '2 Hectares com água mineral e grande lago.',
      sub: 'Espaço, privacidade e liberdade que a cidade não consegue oferecer.'
    }
  ],
  portal3d: {
    videoSrc: '/media/video/terreno-3d-cima.mp4',
    poster: '/media/img/terreno-3d-cima-poster.webp',
    tag: 'Projeto 3D • Topografia Real',
    legenda: '2 Hectares (20.000 m² a 22.300 m²) • Vista Aérea Exclusiva'
  }
};

/* ---------------------------------------------------------------------------
 * 5. SESSÃO 3: VSL & O EFEITO PARAÍSO DAS ÁGUAS
 * -------------------------------------------------------------------------*/
export const efeitoParaiso = {
  rotulo: 'Sessão 03 • Apresentação Oficial',
  titulo: 'O Efeito Paraíso das Águas',
  subtitulo: 'Apenas 20 minutos separam a agitação da cidade do silêncio do seu refúgio particular.',
  texto: 'Assista à apresentação completa do empreendimento. O Paraíso das Águas foi planejado para quem busca grande dimensão de terra com a tranquilidade da água abundante e acesso totalmente pavimentado.',
  video: {
    src: '/media/video/vsl-oficial.mp4',
    poster: '/media/img/vsl-oficial-poster.webp',
    legenda: 'Apresentação em vídeo do Paraíso das Águas'
  },
  comparativos: [
    { ritmo: 'O Ritmo da Cidade', desc: 'Trânsito cansativo, ruído contínuo, espaço confinado e rotina acelerada.' },
    { ritmo: 'O Ritmo do Paraíso', desc: 'Brisa na água, canto dos pássaros, água pura de nascente e 2 hectares de terra fértil.' }
  ]
};

/* ---------------------------------------------------------------------------
 * 6. SESSÃO 4: AS PROPRIEDADES (VISÃO GERAL 2 HECTARES)
 * -------------------------------------------------------------------------*/
export const propriedades = {
  rotulo: 'Sessão 04 • As Propriedades',
  titulo: 'Visão Geral: 7 Propriedades de ~2 Hectares',
  subtitulo: 'Áreas de 20.000 m² a 22.300 m² com documentação regularizada.',
  texto: 'Cada propriedade conta com aproximadamente 2 hectares (dimensão ideal para garantir privacidade total e viabilizar projeto rural ou de lazer). Um grande lago se localiza no coração da comunidade, com parte pertencente à maioria das chácaras. Na parte alta brota a mina de água mineral que abastece a região.',
  mapaImagem: '/media/img/mapa-oficial-terreno.webp',
  mapaVideo: {
    src: '/media/video/mapa-sobrevoo.mp4',
    poster: '/media/img/mapa-sobrevoo-poster.webp',
    legenda: 'Sobrevoo da demarcação e topografia'
  },
  destaques: [
    { icone: 'area', titulo: '20.000 m² a 22.300 m²', texto: 'Propriedades rurais amplas com matrícula e demarcação individualizada.' },
    { icone: 'lago', titulo: 'Grande Lago Central', texto: 'Um espelho d\'água principal no coração da terra, com margem para a maioria das chácaras.' },
    { icone: 'nascente', titulo: 'Minas d\'Água Mineral', texto: 'Nascentes perenes de água mineral na parte alta (mesmo aquífero da Cristágua).' },
    { icone: 'montanha', titulo: 'Platôs Naturais', texto: 'Topografia com áreas suaves ideais para construção de sede, chalé e área de lazer.' }
  ],
  referenciaComercial: 'Propriedades a partir de R$ 475 mil* com financiamento facilitado direto com o proprietário.'
};

/* ---------------------------------------------------------------------------
 * 7. SESSÃO 5: INFRAESTRUTURA COMPLETA
 * -------------------------------------------------------------------------*/
export const infraestrutura = {
  rotulo: 'Sessão 05 • Estrutura Pronta & Em Implantação',
  titulo: 'Infraestrutura Completa: A Vida no Campo com Conforto Urbano',
  subtitulo: 'Tudo pronto para moradia permanente ou lazer de fim de semana, com alta tecnologia e segurança.',
  cards: [
    { icone: 'estrada', titulo: 'Asfalto até a Portaria', texto: 'Acesso rápido e 100% asfaltado em qualquer época do ano, sem trechos intransitáveis de barro.' },
    { icone: 'chave', titulo: 'Portaria & Monitoramento', texto: 'Entrada com portaria, câmeras de segurança e grupo de apoio e vigilância entre vizinhos.' },
    { icone: 'raio', titulo: 'Energia Elétrica Trifásica', texto: 'Rede elétrica trifásica com carga potente para motores, bombas, iluminação e grandes projetos residenciais.' },
    { icone: 'wifi', titulo: 'Fibra Óptica de Alta Velocidade', texto: 'Internet rápida para trabalho remoto, streaming e comunicação sem falhas.' },
    { icone: 'lago', titulo: 'Um Grande Lago Central', texto: 'Lago no coração da comunidade com peixes e acesso para a maioria das glebas.' },
    { icone: 'nascente', titulo: 'Água Mineral de Nascente', texto: 'Mina perene de água pura na parte alta, com abundância de recursos hídricos.' },
    { icone: 'arvores', titulo: 'APP & Natureza Preservada', texto: 'Área de Preservação Permanente respeitada, com riacho e mata nativa abundante.' },
    { icone: 'pin', titulo: '20 Min do Centro • 2 km da Represa', texto: 'Próximo ao comércio de SJC e a apenas 2 km da Represa Jaguari (polo náutico de jetski e lancha).' }
  ]
};

/* ---------------------------------------------------------------------------
 * 8. SESSÃO 6: POSSIBILIDADES (PROJETOS ILUSTRATIVOS)
 * -------------------------------------------------------------------------*/
export const possibilidades = {
  rotulo: 'Sessão 06 • Inspirações Arquitetônicas',
  titulo: 'Uma Terra, Inúmeras Possibilidades',
  subtitulo: 'Sugestões ilustrativas do que você pode construir em seus 20.000 m² de terreno.',
  avisoLegal: '*PROJETO ILUSTRATIVO — As fotos e vídeos desta seção são propostas conceituais e artísticas para demonstrar o potencial da área. Cada proprietário desenvolve seu projeto de forma particular, conforme seu desejo e as regras aplicáveis. As benfeitorias não estão inclusas no valor da terra nua.',
  galeria: [
    {
      imagem: '/media/img/proj-house_with_pool_and_hillside_20261014125200_jpg.webp',
      titulo: 'Casa de Campo Contemporânea com Piscina',
      subtitulo: 'Projeto moderno integrado à encosta suave com vista para a natureza.'
    },
    {
      imagem: '/media/img/proj-make_image_attractive_and_beautiful_20261014124921_jpg.webp',
      titulo: 'Varanda Panorâmica & Espaço Gourmet',
      subtitulo: 'Convivência ao ar livre com vista para as colinas e o pôr do sol.'
    },
    {
      imagem: '/media/img/proj-make_bedroom_attractive_and_beau_20261014125305_jpg.webp',
      titulo: 'Suíte Master com Esquadrias Panorâmicas',
      subtitulo: 'Conforto térmico, iluminação natural e despertar com a vista da serra.'
    },
    {
      imagem: '/media/img/proj-make_this_image_attractive_20261014124853_jpg.webp',
      titulo: 'Chalé Rústico em Madeira de Lei e Vidro',
      subtitulo: 'Estilo acolhedor perfeito para casa de hóspedes ou refúgio de descanso.'
    },
    {
      imagem: '/media/img/proj-make_image_attractive_and_beautiful_20261014125238_jpg.webp',
      titulo: 'Residência com Pergolado e Jardim Privativo',
      subtitulo: 'Integração de jardins floridos, pergolados e áreas de descanso.'
    }
  ],
  videosProjetos: [
    {
      src: '/media/video/proj-mansao-campo.mp4',
      poster: '/media/img/proj-mansao-campo-poster.webp',
      titulo: 'Vídeo Conceito • Mansão de Campo 3D',
      subtitulo: 'Apresentação tridimensional de projeto residencial com piscina e deck.'
    },
    {
      src: '/media/video/proj-chale-lago.mp4',
      poster: '/media/img/proj-chale-lago-poster.webp',
      titulo: 'Vídeo Conceito • Chalé Junto à Água',
      subtitulo: 'Simulação arquitetônica de implantação próxima aos espelhos d\'água.'
    }
  ]
};

/* ---------------------------------------------------------------------------
 * 9. SESSÃO 7: VIDA AUTOSSUSTENTÁVEL (O QUINTAL PRODUTIVO)
 * -------------------------------------------------------------------------*/
export const autossuficiencia = {
  rotulo: 'Sessão 07 • Autonomia & Saúde Familiar',
  titulo: 'Vida Autossustentável: O Quintal Produtivo',
  subtitulo: 'Produza parte dos próprios alimentos e viva em contato com a terra fértil.',
  fotosReais: [
    { src: '/media/img/nova-335807931_1791516204451162.webp', legenda: 'Mata nativa e nascentes de água mineral' },
    { src: '/media/img/nova-589744048_1791513842984375.webp', legenda: 'Platô natural com solo de altíssima fertilidade' },
    { src: '/media/img/nova-619243340_1791516252137560.webp', legenda: 'Vista aberta para o horizonte da serra' }
  ],
  pilares: [
    { icone: 'arvores', titulo: 'Horta & Pomar Orgânico', texto: 'Solo fértil com água mineral abundante para cultivar verduras frescas, legumes e árvores frutíferas sem agrotóxicos.' },
    { icone: 'cavalos', titulo: 'Criação de Animais & Piquetes', texto: 'Área com 20.000 m² permite piquetes para cavalos, galinheiro com ovos caipiras e animais de estimação com espaço livre.' },
    { icone: 'nascente', titulo: 'Água Mineral Direto da Fonte', texto: 'Água pura e límpida de nascente da serra, com vazão permanente durante todo o ano.' },
    { icone: 'raio', titulo: 'Espaço para Energia Solar', texto: 'Insolação plena para instalação de painéis fotovoltaicos, proporcionando independência energética.' }
  ]
};

/* ---------------------------------------------------------------------------
 * 10. SESSÃO 8: UMA PROPRIEDADE PARA COMPARTILHAR
 * -------------------------------------------------------------------------*/
export const compartilhar = {
  rotulo: 'Sessão 08 • Multi-geracional ou Sociedade',
  titulo: 'Uma Propriedade para Compartilhar em Família',
  subtitulo: '20.000 m² oferecem metragem suficiente para acolher mais de uma casa com privacidade total.',
  texto: 'Adquirir a propriedade em parceria entre pais e filhos, irmãos ou amigos de confiança é uma opção econômica e vantajosa. O investimento e a manutenção são divididos, enquanto cada família desfruta de mais de 10.000 m² de terreno particular.',
  beneficios: [
    { titulo: 'Investimento Acessível', texto: 'Divida o valor de aquisição e desfrute de uma grande propriedade rural pagando metade.' },
    { titulo: 'Privacidade Entre Casas', texto: 'Distâncias generosas de mais de 80 a 100 metros entre construções garantem privacidade total.' },
    { titulo: 'Lazer e Lago em Comum', texto: 'Momentos de confraternização no lago, churrasqueiras e áreas verdes para reunir toda a família.' },
    { titulo: 'Manutenção Leve', texto: 'Custos de jardinagem, caseiro e conservação divididos de forma equilibrada.' }
  ]
};

/* ---------------------------------------------------------------------------
 * 11. SESSÃO 9: SÃO JOSÉ DOS CAMPOS & REPRESA JAGUARI
 * -------------------------------------------------------------------------*/
export const saoJose = {
  rotulo: 'Sessão 09 • Cidade ao Lado & Lazer Náutico',
  titulo: 'São José dos Campos & Represa Jaguari',
  subtitulo: 'A conveniência da maior cidade do Vale do Paraíba a 20 min e os esportes náuticos a 2 km.',
  texto: 'O Paraíso das Águas reúne o melhor dos dois mundos: tranquilidade rural com asfalto até a porta, a apenas 2 km da Represa Jaguari — ponto privilegiado para lanchas, jetski e passeios náuticos — e a 20 minutos de São José dos Campos, cidade de referência em saúde, educação e serviços.',
  video: {
    src: '/media/video/sao-jose-campos.mp4',
    poster: '/media/img/sao-jose-campos-poster.webp',
    legenda: 'São José dos Campos: qualidade de vida e proximidade'
  },
  destaques: [
    { valor: '2 km', titulo: 'Represa Jaguari (Jetski & Náutica)', texto: 'Ideal para esportes aquáticos, passeios de barco e pescaria esportiva a 5 minutos.' },
    { valor: '20 min', titulo: 'Centro de São José dos Campos', texto: 'Comércio, gastronomia, centros médicos e serviços a curta distância pavimentada.' },
    { valor: '6 km', titulo: 'Parque da Cidade (Burle Marx)', texto: 'Área verde tradicional de SJC para caminhadas, passeios culturais e eventos.' },
    { valor: '~1h', titulo: 'São Paulo (Dutra / Carvalho Pinto)', texto: 'Ligação direta e rápida com a capital paulista e o Aeroporto de Guarulhos.' }
  ]
};

/* ---------------------------------------------------------------------------
 * 12. SESSÃO 10: CONDIÇÕES DE AQUISIÇÃO & SEGURANÇA JURÍDICA
 * -------------------------------------------------------------------------*/
export const aquisicao = {
  rotulo: 'Sessão 10 • Negociação Direta & Documentação',
  titulo: 'Condições de Aquisição & Segurança Jurídica',
  subtitulo: 'Negociação transparente e direta com o proprietário.',
  acordeoes: [
    {
      titulo: 'Documentação 100% em Ordem & Escritura Pública',
      conteudo: 'As propriedades possuem histórico dominial regular, matrícula e documentação jurídica apta para transferência definitiva via escritura pública.'
    },
    {
      titulo: 'Financiamento Direto com o Proprietário',
      conteudo: 'Possibilidade de parcelamento direto com o dono mediante entrada facilitada, sem burocracia de aprovação bancária.'
    },
    {
      titulo: 'Aceita Imóvel e Veículo na Negociação',
      conteudo: 'Estuda-se a inclusão de imóveis (terrenos, casas ou apartamentos) em São José dos Campos e região ou veículos como parte do pagamento, após avaliação.'
    },
    {
      titulo: 'Atendimento Personalizado e Visita Agendada',
      conteudo: 'Você é recebido no local com exclusividade para caminhar pela terra, conferir a nascente de água mineral, o grande lago e tirar todas as dúvidas técnicas.'
    }
  ]
};

/* ---------------------------------------------------------------------------
 * 13. SESSÃO 11: LOCALIZAÇÃO & GOOGLE MAPS
 * -------------------------------------------------------------------------*/
export const localizacao = {
  rotulo: 'Sessão 11 • Localização Exata',
  titulo: 'Localização Privilegiada em São José dos Campos',
  subtitulo: 'Fácil de chegar por asfalto até a portaria, com rotas rápidas e sinalizadas.',
  distancias: [
    { destino: 'Represa Jaguari (Polo Náutico & Marina)', valor: '~2 km (5 min)' },
    { destino: 'Centro de São José dos Campos', valor: '~20 min' },
    { destino: 'Parque da Cidade (Burle Marx)', valor: '~6 km (12 min)' },
    { destino: 'Jardim Aquarius / Colinas Shopping', valor: '~19 km (22 min)' },
    { destino: 'Unidade Básica de Saúde e Pronto Atendimento', valor: '~2 km a 4,5 km' },
    { destino: 'São Paulo Capital (Dutra / Carvalho Pinto)', valor: '~1 hora' }
  ],
  mapaLink: 'https://maps.app.goo.gl/kVdV28pwVikpB3oJ6',
  legendaMapa: 'Abrir rota no Google Maps →'
};

/* ---------------------------------------------------------------------------
 * 14. SESSÃO 12: CONTATO & AGENDAMENTO VIP
 * -------------------------------------------------------------------------*/
export const contato = {
  rotulo: 'Sessão 12 • Agende Sua Visita',
  titulo: 'Venha Conhecer de Perto o Seu Próximo Refúgio',
  subtitulo: 'Visitas exclusivas com horário marcado para garantir total atenção à sua família.',
  texto: 'Caminhe na beira do grande lago, beba água direto da nascente da serra e sinta a tranquilidade dos 2 hectares. Escolha o melhor dia e fale direto com o proprietário no WhatsApp.',
  ctaBotao: 'Agendar Visita no WhatsApp'
};

/* ---------------------------------------------------------------------------
 * 15. FAQ & RODAPÉ
 * -------------------------------------------------------------------------*/
export const faq = [
  { p: 'A documentação está em ordem?', r: 'Sim. A propriedade possui documentação regularizada, apta para escritura pública e transferência direta.' },
  { p: 'Como funciona o financiamento direto?', r: 'O parcelamento pode ser feito diretamente com o proprietário mediante entrada facilitada, sem burocracia bancária.' },
  { p: 'Aceitam imóvel ou carro como parte do pagamento?', r: 'Sim. Aceita-se avaliação de imóvel na troca ou veículo seminovo como parte da negociação.' },
  { p: 'Como é o lago da propriedade?', r: 'Existe um grande lago localizado no coração da comunidade, dividido entre os terrenos, garantindo acesso à água para a maioria das chácaras. Na parte alta fica a mina de água mineral.' },
  { p: 'A Represa Jaguari fica perto?', r: 'Sim, a apenas cerca de 2 km da propriedade. É uma excelente opção para quem tem jetski, lancha ou gosta de pescaria.' },
  { p: 'Como agendar uma visita presencial?', r: 'Basta clicar no botão de WhatsApp ou preencher o formulário na página. As visitas são agendadas com horário marcado.' }
];

export const rodape = {
  nome: 'Paraíso das Águas',
  sub: 'São José dos Campos • SP',
  telefone: '(12) 98320-8335',
  avisoLegal: '*Imagens com a inscrição "PROJETO ILUSTRATIVO" são conceitos artísticos e sugestões arquitetônicas. Condições comerciais, valores e disponibilidade sujeitos a alteração sem aviso prévio. Consulte detalhes no WhatsApp.',
  ano: 2026
};

/* ---------------------------------------------------------------------------
 * 16. SEO & LGPD
 * -------------------------------------------------------------------------*/
export const seo = {
  titulo: 'Chácaras em São José dos Campos | Paraíso das Águas — 2 Hectares com Grande Lago e Água Mineral',
  descricao: 'Propriedades rurais de 2 hectares (20.000 m² a 22.300 m²) em São José dos Campos - SP. Grande lago central, minas de água mineral, asfalto até a portaria, fibra óptica e financiamento direto.',
  url: 'https://chcara.vercel.app',
  imagemOg: '/media/img/hero-scroll-poster.webp',
  palavrasChave: 'chácara à venda São José dos Campos, chácara com lago, terreno 2 hectares SJC, chácara água mineral, represa jaguari jetski'
};

export const tracking = {
  googleTagId: '',
  metaPixelId: ''
};

export const lgpd = {
  bannerAtivo: true,
  chaveStorage: 'pd-consent-v2',
  validadeDias: 180,
  textoResumo: 'Utilizamos cookies técnicos para assegurar o funcionamento do site e mensurar acessos de forma anônima.'
};

export default {
  whatsapp, scroll, hero, sessao2, efeitoParaiso, propriedades, infraestrutura,
  possibilidades, autossuficiencia, compartilhar, saoJose, aquisicao,
  localizacao, contato, faq, rodape, seo, lgpd, tracking
};
