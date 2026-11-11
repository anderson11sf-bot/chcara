/* ============================================================================
 * config.js — PAINEL ÚNICO DE CONTROLE DO SITE: PARAÍSO DAS ÁGUAS
 * ----------------------------------------------------------------------------
 * Chácaras de 2 Hectares (20.000 m² a 22.300 m²) em São José dos Campos - SP
 * Com 3 grandes lagos, nascentes de água mineral, asfalto e segurança.
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
    hero: 'Olá! Quero agendar uma visita ao Paraíso das Águas. Vi a opção de 2 hectares com lagos e água mineral.',
    portal3d: 'Olá! Assisti ao vídeo 3D do terreno do Paraíso das Águas e quero mais detalhes sobre as opções.',
    efeitoParaiso: 'Olá! Vi as imagens dos lagos do Paraíso das Águas e gostaria de agendar uma visita.',
    propriedades: 'Olá! Tenho interesse nas chácaras de 2 hectares do Paraíso das Águas (a partir de R$ 475 mil*).',
    infraestrutura: 'Olá! Gostaria de tirar dúvidas sobre a infraestrutura (asfalto, trifásico, fibra) do Paraíso das Águas.',
    possibilidades: 'Olá! Vi os projetos ilustrativos do Paraíso das Águas e quero saber o que posso construir.',
    autossuficiencia: 'Olá! Quero saber mais sobre a terra fértil, horta, pomar e as nascentes de água mineral.',
    compartilhar: 'Olá! Quero entender como funciona a opção de compra compartilhada em família ou com sócio.',
    saoJose: 'Olá! Quero saber a localização exata e o acesso a partir de São José dos Campos e da Represa Jaguari.',
    aquisicao: 'Olá! Quero entender as condições de financiamento direto com o proprietário e a escritura individual.',
    localizacao: 'Olá! Quero confirmar como chegar e receber a localização exata no Google Maps.',
    contato: 'Olá! Preenchi o agendamento no site e gostaria de confirmar o melhor dia para a minha visita.',
    faq: 'Olá! Fiquei com uma dúvida sobre o Paraíso das Águas e gostaria de falar com o proprietário.'
  },
  incluirUtm: true
};

/* ---------------------------------------------------------------------------
 * 2. RITMO DO SCROLL E DO PALCO
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
  etapas: {
    etapa1: { inicio: 0.00, fim: 0.40 }, // amanhecer na chácara
    etapa2: { inicio: 0.38, fim: 0.72 }, // caminhada na mata e no riacho
    etapa3: { inicio: 0.70, fim: 1.00 }  // morros, lago e céu estrelado
  },
  dica: {
    esconderAposPx: 20,
    reaparecerAposMs: 4500,
    textoSecundario: 'Continue descendo ✨'
  }
};

/* ---------------------------------------------------------------------------
 * 3. FUNDO PROCEDURAL & FRAMES
 * -------------------------------------------------------------------------*/
export const fundo = {
  modo: 'frames',
  frames: {
    etapa1: { pasta: '/media/frames/', quantidade: 113, prefixo: 'fundo1_', extensao: 'webp' },
    etapa2: { pasta: '/media/frames/', quantidade: 114, prefixo: 'fundo2_', extensao: 'webp' },
    etapa3: { pasta: '/media/frames/', quantidade: 114, prefixo: 'fundo3_', extensao: 'webp' }
  },
  resolucao: {
    mobile: 0.8,
    desktop: 1.0,
    modoLite: 0.5
  },
  particulas: {
    mobile: 24,
    desktop: 55,
    modoLite: 0,
    raioMin: 0.8,
    raioMax: 2.2,
    velocidade: 0.16,
    deriva: 0.35,
    cintilar: 0.9
  },
  intensidades: {
    neblina: 0.8,
    brilhoSol: 0.9,
    orvalho: 0.5,
    vinheta: 0.50,
    raiosDeLuz: 0.7,
    folhagemLuminosa: 0.6,
    estrelas: 1.0,
    vagalumesChacara: 0.85
  },
  duracoes: {
    crossfadeEtapas: 0.6,
    entradaPalco: 1.2
  },
  misturaEtapas: 0.55,
  permitirCanvas: true
};

/* ---------------------------------------------------------------------------
 * 4. VIDRO DO PALCO
 * -------------------------------------------------------------------------*/
export const vidroTV = {
  ativo: true,
  opacidade: 0.12,
  reflexoOpacidade: 0.05,
  vinhetaForca: 0.40,
  scanlineOpacidade: 0.0,
  brilhoBorda: 0.20,
  raioCantos: '18px',
  usarBackdropFiltro: true
};

/* ---------------------------------------------------------------------------
 * 5. HERO
 * -------------------------------------------------------------------------*/
export const hero = {
  wordmark: 'Paraíso das Águas',
  subtituloTopo: 'SÃO JOSÉ DOS CAMPOS • SP',
  headline: 'Seu paraíso de <em>2 hectares</em> com lago, água mineral e segurança',
  subheadline: 'a 20 minutos do centro de São José dos Campos e a 2 km da Represa Jaguari',
  subheadline1: 'a 20 minutos do centro de São José dos Campos e a 2 km da Represa Jaguari',
  ctaPrimario: 'Agendar visita no WhatsApp',
  ctaSecundario: 'Ver apresentação completa',
  selos: [
    { texto: '2 Hectares (20.000 m²)', icone: 'area' },
    { texto: '3 Grandes Lagos & Minas d\'Água', icone: 'lago' },
    { texto: 'Escritura Pública Individual', icone: 'chave' },
    { texto: 'Financiamento Direto sem Banco', icone: 'apertoMao' },
    { texto: 'Opções a partir de R$ 475 mil*', icone: 'ouro' }
  ],
  poster: '/media/img/terreno-real-panorama.webp'
};

/* ---------------------------------------------------------------------------
 * 6. SESSÃO 2: CENA NARRATIVA & ABERTURA CINEMATOGRÁFICA
 * -------------------------------------------------------------------------*/
export const titulos = [
  { rotulo: 'O Conceito', icone: 'ouro', texto: 'O novo luxo mudou de endereço: a roça é o novo luxo.' },
  { rotulo: 'Água Pura', icone: 'nascente', texto: 'Nascentes perenes de água mineral brotando na sua própria terra.' },
  { rotulo: '3 Grandes Lagos', icone: 'lago', texto: 'Espelhos d\'água cristalinos no coração da propriedade.' },
  { rotulo: 'Infraestrutura', icone: 'estrada', texto: 'Asfalto até a portaria, fibra óptica de 500MB e energia trifásica.' },
  { rotulo: '2 Hectares', icone: 'area', texto: '20.000 m² a 22.300 m² de liberdade absoluta e privacidade.' }
];

export const carrossel = {
  faixa: { inicio: 0.00, fim: 0.48 },
  visiveis: 3,
  rotacaoMax: 40,
  perspectiva: 1200,
  deslocamento: 1.2
};

export const portal3d = {
  videoSrc: '/media/video/terreno-3d-cima.mp4',
  poster: '/media/img/terreno-3d-cima-poster.webp',
  tag: 'Projeto 3D • Vista Aérea',
  legenda: '2 Hectares • Topografia Real & Lagos',
  faixa: { inicio: 0.45, fim: 0.95 }
};

/* ---------------------------------------------------------------------------
 * 7. SESSÃO 3: O EFEITO PARAÍSO DAS ÁGUAS
 * -------------------------------------------------------------------------*/
export const efeitoParaiso = {
  rotulo: 'Sessão 03 • A Transformação',
  titulo: 'O Efeito Paraíso das Águas',
  subtitulo: 'Apenas 20 minutos separam a buzina da cidade do silêncio absoluto dos lagos.',
  texto: 'Uma transição imediata de ritmo. No Paraíso das Águas, você não precisa escolher entre a conveniência urbana e a paz do campo. Aqui, o ar puro e as águas límpidas acolhem a sua família todos os dias.',
  video: {
    src: '/media/video/drone-panorama.mp4',
    poster: '/media/img/hero-lago.webp',
    legenda: 'Voo panorâmico sobre os 3 lagos e a mata preservada'
  },
  comparativos: [
    { ritmo: 'O Ritmo da Cidade', desc: 'Trânsito cansativo, barulho constante, poluição e espaço confinado entre quatro paredes.' },
    { ritmo: 'O Ritmo do Paraíso', desc: 'Canto dos pássaros, brisa suave nos lagos, horizonte livre e 20.000 m² para respirar fundo.' }
  ]
};

/* ---------------------------------------------------------------------------
 * 8. SESSÃO 4: AS PROPRIEDADES (VISÃO GERAL 2 HECTARES)
 * -------------------------------------------------------------------------*/
export const propriedades = {
  rotulo: 'Sessão 04 • As Propriedades',
  titulo: '2 Hectares de Liberdade: 20.000 m² a 22.300 m²',
  subtitulo: 'Espaço real para viver, produzir e descansar com privacidade total.',
  texto: 'Cada propriedade conta com aproximadamente 2 hectares (dimensão ideal para garantir privacidade e aproveitamento rural pleno). O conjunto possui 3 grandes lagos interligados, minas de água mineral em abundância e topografia com platôs naturais prontos para construir.',
  mapaImagem: '/media/img/mapa-terrenos-paraiso.webp',
  destaques: [
    { icone: 'area', titulo: '20.000 m² a 22.300 m²', texto: 'Área ampla com matrícula e documentação jurídica individualizada.' },
    { icone: 'lago', titulo: '3 Grandes Lagos', texto: 'Espelhos d\'água com peixes, deck contemplativo e margens preservadas.' },
    { icone: 'nascente', titulo: 'Água Mineral na Serra', texto: 'Minas d\'água na parte alta com água pura e cristalina o ano todo.' },
    { icone: 'montanha', titulo: 'Topografia com Platôs', texto: 'Áreas planas e suaves com vista panorâmica para o nascer e pôr do sol.' }
  ],
  referenciaComercial: 'Opções a partir de R$ 475 mil* com financiamento facilitado direto com o proprietário.'
};

/* ---------------------------------------------------------------------------
 * 9. SESSÃO 5: INFRAESTRUTURA COMPLETA
 * -------------------------------------------------------------------------*/
export const infraestrutura = {
  rotulo: 'Sessão 05 • Estrutura Pronta & Em Implantação',
  titulo: 'Infraestrutura Completa: O Campo com Conforto Urbano',
  subtitulo: 'Tudo pronto para você morar ou passar os finais de semana sem abrir mão da tecnologia e segurança.',
  cards: [
    { icone: 'estrada', titulo: 'Asfalto até a Portaria', texto: 'Acesso rápido, limpo e seguro em qualquer clima, sem estradas de barro esburacadas.' },
    { icone: 'chave', titulo: 'Portaria & Monitoramento', texto: 'Controle de acesso, câmeras e grupo de segurança integrado entre vizinhos.' },
    { icone: 'raio', titulo: 'Energia Elétrica Trifásica', texto: 'Rede instalada com capacidade de sobra para bombas, maquinário e residências amplas.' },
    { icone: 'wifi', titulo: 'Fibra Óptica 500 MB', texto: 'Internet de alta velocidade instalada: faça home office e assista streaming sem lentidão.' },
    { icone: 'nascente', titulo: 'Abundância Hídrica Natural', texto: 'Nascentes perenes, água mineral de montanha e vizinhança da fonte Cristágua.' },
    { icone: 'arvores', titulo: 'Ruas Abertas e Drenadas', texto: 'Vias internas largas, cascalhadas e estruturadas para tráfego seguro o ano inteiro.' }
  ]
};

/* ---------------------------------------------------------------------------
 * 10. SESSÃO 6: POSSIBILIDADES (PROJETOS ILUSTRATIVOS)
 * -------------------------------------------------------------------------*/
export const possibilidades = {
  rotulo: 'Sessão 06 • Inspirações & Ideias',
  titulo: 'Uma Terra, Inúmeras Possibilidades',
  subtitulo: 'Inspirações do que você pode construir em 20.000 m² de terreno.',
  avisoLegal: '*PROJETO ILUSTRATIVO — Imagens e conceitos meramente ilustrativos como sugestão de aproveitamento do espaço. Cada proprietário desenvolve seu projeto arquitetônico exclusivo de acordo com suas preferências e normas vigentes.',
  galeria: [
    { imagem: '/media/img/projeto-casa-campo.webp', titulo: 'Casa de Campo Contemporânea', subtitulo: 'Varandas amplas, integração com a mata e luz natural abundante.' },
    { imagem: '/media/img/projeto-deck-lago.webp', titulo: 'Píer & Deck Flutuante no Lago', subtitulo: 'O cenário perfeito para relaxar, pescar ou contemplar o entardecer.' },
    { imagem: '/media/img/projeto-espaco-gourmet.webp', titulo: 'Espaço Gourmet & Fogo de Chão', subtitulo: 'Para reunir amigos e família ao redor da brasa sob o céu estrelado.' },
    { imagem: '/media/img/projeto-piscina-borda.webp', titulo: 'Piscina com Borda Infinita', subtitulo: 'Reflexos da água conectando-se diretamente ao horizonte da serra.' },
    { imagem: '/media/img/projeto-chale-rustico.webp', titulo: 'Chalé Rústico de Hóspedes', subtitulo: 'Acolhimento com privacidade para familiares e visitantes de final de semana.' },
    { imagem: '/media/img/projeto-energia-solar.webp', titulo: 'Autonomia Solar & Sustentabilidade', subtitulo: 'Geração própria de energia limpa para abastecer toda a propriedade.' }
  ]
};

/* ---------------------------------------------------------------------------
 * 11. SESSÃO 7: VIDA AUTOSSUSTENTÁVEL (O QUINTAL PRODUTIVO)
 * -------------------------------------------------------------------------*/
export const autossuficiencia = {
  rotulo: 'Sessão 07 • Sustentabilidade & Família',
  titulo: 'Vida Autossustentável: O Quintal Produtivo',
  subtitulo: 'Alimente sua família com o que a terra dá de melhor e viva com liberdade.',
  video: {
    src: '/media/video/familia-cavalos.mp4',
    poster: '/media/img/familia-cavalos-poster.webp',
    legenda: 'Crianças montando a cavalo, ar puro e contato direto com a terra'
  },
  pilares: [
    { icone: 'arvores', titulo: 'Pomar & Horta Orgânica', texto: 'Colha verduras frescas, hortaliças e frutas direto do pé, sem veneno e com sabor de verdade.' },
    { icone: 'cavalos', titulo: 'Espaço para Cavalos e Animais', texto: 'Piquetes amplos, pastagem verde e espaço para cavalos, galinheiro com ovos caipiras e pets livres.' },
    { icone: 'nascente', titulo: 'Água Mineral na Torneira', texto: 'Mesma bacia de água pura da serra: saúde inegociável para quem você ama.' },
    { icone: 'raio', titulo: 'Energia Limpa e Independência', texto: 'Espaço ideal para telhados solares com custo quase zero de eletricidade.' }
  ]
};

/* ---------------------------------------------------------------------------
 * 12. SESSÃO 8: UMA PROPRIEDADE PARA COMPARTILHAR
 * -------------------------------------------------------------------------*/
export const compartilhar = {
  rotulo: 'Sessão 08 • Compra Compartilhada',
  titulo: 'Uma Propriedade para Compartilhar',
  subtitulo: '20.000 m² é espaço suficiente para duas ou mais famílias viverem com total privacidade.',
  texto: 'Uma das tendências mais inteligentes do campo: adquirir a chácara em parceria entre irmãos, pais e filhos, ou amigos de longa data. O investimento e a manutenção caem pela metade, enquanto cada núcleo familiar desfruta de mais de 10.000 m² de área exclusiva.',
  beneficios: [
    { titulo: 'Investimento Dividido', texto: 'Compre uma propriedade de alto padrão pagando metade do valor de aquisição.' },
    { titulo: 'Privacidade Preservada', texto: '10.000 m² para cada casa garantem distâncias de mais de 100 metros entre as residências.' },
    { titulo: 'Lazer e Lagos em Comum', texto: 'Compartilhe o lago, os piquetes, o espaço gourmet e o fogo de chão para encontros inesquecíveis.' },
    { titulo: 'Custo de Manutenção Reduzido', texto: 'Caseiro, manutenção de cercas e limpeza de áreas comuns rateados de forma leve.' }
  ]
};

/* ---------------------------------------------------------------------------
 * 13. SESSÃO 9: SÃO JOSÉ DOS CAMPOS (A CIDADE AO SEU LADO)
 * -------------------------------------------------------------------------*/
export const saoJose = {
  rotulo: 'Sessão 09 • Localização Estratégica',
  titulo: 'São José dos Campos: A Capital Tecnológica ao Seu Lado',
  subtitulo: 'Toda a infraestrutura da melhor cidade de médio porte do Brasil a apenas 20 minutos de distância.',
  texto: 'Morar no Paraíso das Águas é desfrutar da calmaria do campo com o respaldo de uma das cidades mais modernas e seguras do país. Escolas de ponta, shopping centers, hospitais de excelência e aeroporto internacional a poucos quilômetros.',
  video: {
    src: '/media/video/sao-jose-campos.mp4',
    poster: '/media/img/sao-jose-campos-poster.webp',
    legenda: 'São José dos Campos: tecnologia, saúde e conveniência'
  },
  destaques: [
    { valor: '20 min', titulo: 'Centro de SJC & Shopping Colinas', texto: 'Alta gastronomia, cinemas, boutiques e centros empresariais.' },
    { valor: '2 km', titulo: 'Represa Jaguari (Náutica & Jetski)', texto: 'Lazer náutico completo, rampa de barcos e pesca esportiva.' },
    { valor: 'Polo', titulo: 'Saúde & Educação de Referência', texto: 'Hospital Albert Einstein / Vivalle, ITA, Univap e colégios bilíngues.' },
    { valor: '1h20', titulo: 'São Paulo Capital & Guarulhos', texto: 'Acesso rápido via Rodovia Presidente Dutra ou Carvalho Pinto.' }
  ]
};

/* ---------------------------------------------------------------------------
 * 14. SESSÃO 10: CONDIÇÕES DE AQUISIÇÃO & JURÍDICO
 * -------------------------------------------------------------------------*/
export const aquisicao = {
  rotulo: 'Sessão 10 • Segurança Jurídica & Negociação',
  titulo: 'Condições de Aquisição Facilitada & Segurança Jurídica',
  subtitulo: 'Transparência total para você realizar sua conquista com tranquilidade.',
  acordeoes: [
    {
      titulo: 'Documentação 100% em Ordem & Escritura Individual',
      conteudo: 'A propriedade possui histórico regular, matrícula individualizada e Cadastro Ambiental Rural (CAR) averbado. Você adquire sua chácara com total amparo legal.'
    },
    {
      titulo: 'Financiamento Direto com o Proprietário',
      conteudo: 'Sem exigência de aprovação bancária burocrática, sem comprovação de renda complexa. Negociação direta e personalizada com entrada facilitada e parcelas que cabem no seu fluxo.'
    },
    {
      titulo: 'Aceitação de Veículos e Imóveis na Troca (Permuta)',
      conteudo: 'Avaliamos veículos seminovos e imóveis (casas, apartamentos ou terrenos) em São José dos Campos e na Grande São Paulo como parte do pagamento.'
    },
    {
      titulo: 'Atendimento Personalizado e Visita VIP',
      conteudo: 'Você é recebido diretamente na propriedade para caminhar pelos limites, conferir as minas de água e os lagos e tirar todas as dúvidas contratuais.'
    }
  ]
};

/* ---------------------------------------------------------------------------
 * 15. SESSÃO 11: LOCALIZAÇÃO & DISTÂNCIAS
 * -------------------------------------------------------------------------*/
export const localizacao = {
  rotulo: 'Sessão 11 • Como Chegar',
  titulo: 'Localização Estratégica & Acessos Pavimentados',
  subtitulo: 'Fácil de chegar por asfalto até a portaria, com rotas seguras.',
  distancias: [
    { destino: 'Centro de São José dos Campos', valor: '~20 min' },
    { destino: 'Represa Jaguari (Náutica & Marina)', valor: '~5 min (2 km)' },
    { destino: 'Parque da Cidade (Burle Marx)', valor: '~18 min' },
    { destino: 'Jardim Aquarius / Colinas Shopping', valor: '~22 min' },
    { destino: 'UPA e Unidades Básicas de Saúde', valor: '~4,5 km' },
    { destino: 'Aeroporto Internacional de Guarulhos', valor: '~1h10' },
    { destino: 'São Paulo (Capital)', valor: '~1h20' }
  ],
  mapaLink: 'https://maps.app.goo.gl/kVdV28pwVikpB3oJ6',
  legendaMapa: 'Abrir rota no Google Maps →'
};

/* ---------------------------------------------------------------------------
 * 16. SESSÃO 12: CONTATO & AGENDAMENTO VIP
 * -------------------------------------------------------------------------*/
export const contato = {
  rotulo: 'Sessão 12 • Agende Sua Visita',
  titulo: 'Venha Conhecer de Perto o Seu Próximo Refúgio',
  subtitulo: 'Visitas exclusivas com horário marcado para garantir total atenção à sua família.',
  texto: 'Caminhe na beira dos 3 lagos, beba água direto da nascente da serra e sinta o ar puro da montanha. Agende agora pelo WhatsApp.',
  ctaBotao: 'Falar no WhatsApp e Agendar Visita'
};

/* ---------------------------------------------------------------------------
 * 17. SESSÃO 13: FAQ & RODAPÉ
 * -------------------------------------------------------------------------*/
export const faq = [
  { p: 'A documentação está em ordem?', r: 'Sim. As propriedades possuem documentação 100% regularizada, com escritura pública individualizada e CAR registrado.' },
  { p: 'Como funciona o financiamento direto?', r: 'O financiamento é feito diretamente com o proprietário mediante entrada facilitada, sem necessidade de intermediação ou burocracia bancária.' },
  { p: 'Aceitam imóveis ou carros como parte do pagamento?', r: 'Sim! Avaliamos permuta com veículos seminovos e imóveis em São José dos Campos ou na capital paulista.' },
  { p: 'Como são os 3 lagos da propriedade?', r: 'São 3 grandes espelhos d\'água abastecidos por nascentes perenes da própria propriedade, com peixes e decks contemplativos.' },
  { p: 'A Represa Jaguari fica perto?', r: 'Sim, a apenas 2 km de distância (cerca de 5 minutos), ideal para quem possui lancha, jetski ou gosta de pesca esportiva.' },
  { p: 'Como agendar uma visita presencial?', r: 'As visitas são realizadas com hora marcada para você ser recebido com tranquilidade. Basta clicar no botão de WhatsApp e escolher o melhor dia.' }
];

export const rodape = {
  nome: 'Paraíso das Águas',
  sub: 'São José dos Campos • SP',
  telefone: '(12) 98320-8335',
  avisoLegal: '*Imagens com a inscrição "PROJETO ILUSTRATIVO" são referências arquitetônicas artísticas conceituais. Condições comerciais, valores e disponibilidade sujeitos a alteração sem aviso prévio. Consulte detalhes no WhatsApp.',
  ano: 2026
};

/* ---------------------------------------------------------------------------
 * 18. SEO & LGPD
 * -------------------------------------------------------------------------*/
export const seo = {
  titulo: 'Chácaras em São José dos Campos | Paraíso das Águas — 2 Hectares com 3 Lagos e Água Mineral',
  descricao: 'Propriedades exclusivas de 2 hectares (20.000 m²) em São José dos Campos com 3 lagos, água mineral de nascente, asfalto até a portaria, fibra óptica e financiamento direto.',
  url: 'https://paraisodasaguassjc.com.br',
  imagemOg: '/media/img/hero-lago.webp',
  palavrasChave: 'chácara São José dos Campos, chácara com lago, terreno 2 hectares SJC, chácara água mineral, represa jaguari jetski'
};

export const lgpd = {
  bannerAtivo: true,
  chaveStorage: 'pd-consent-v2',
  validadeDias: 180,
  textoResumo: 'Utilizamos cookies para assegurar o funcionamento da página e mensurar acessos de forma anônima.'
};

export default {
  whatsapp, scroll, fundo, vidroTV, hero, titulos, carrossel, portal3d,
  efeitoParaiso, propriedades, infraestrutura, possibilidades,
  autossuficiencia, compartilhar, saoJose, aquisicao, localizacao,
  contato, faq, rodape, seo, lgpd
};
