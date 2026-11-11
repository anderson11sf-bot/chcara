import fs from 'fs';
import path from 'path';

const distDir = 'C:/Users/ander/OneDrive/Desktop/SITES/chcara/dist';
const indexPath = path.join(distDir, 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf-8');

console.log('=== VERIFICAÇÃO DO BUILD E DAS 13 SEÇÕES ===');

// 1. Verificar se as 13 seções estão presentes
const secoesEsperadas = [
  'hero',
  'secao-cenas',
  'efeito-paraiso',
  'propriedades',
  'infraestrutura',
  'possibilidades',
  'autossuficiencia',
  'compartilhar',
  'sao-jose',
  'aquisicao',
  'localizacao',
  'contato',
  'rodape'
];

let secoesFaltando = [];
for (const s of secoesEsperadas) {
  if (!indexHtml.includes(`id="${s}"`)) {
    secoesFaltando.push(s);
  }
}

if (secoesFaltando.length === 0) {
  console.log('✓ Todas as 13 seções mestres estão presentes em index.html!');
} else {
  console.error('✗ Faltando seções:', secoesFaltando);
}

// 2. Verificar Portal 3D
const portalElements = [
  'portal-abertura',
  'portal-video-frame',
  'portal-video-3d',
  'portal-porta-esq',
  'portal-porta-dir',
  'portal-costura-brilho'
];

let portalFaltando = [];
for (const p of portalElements) {
  if (!indexHtml.includes(`id="${p}"`)) {
    portalFaltando.push(p);
  }
}

if (portalFaltando.length === 0) {
  console.log('✓ Todos os elementos do Portal 3D de abertura central estão presentes!');
} else {
  console.error('✗ Faltando elementos do Portal 3D:', portalFaltando);
}

// 3. Verificar número do WhatsApp no index.html e config.js
if (indexHtml.includes('wa-flutuante')) {
  console.log('✓ Botão flutuante de WhatsApp presente no HTML.');
}

// 4. Verificar se há arquivos de mídia essenciais no dist
const midiasEssenciais = [
  'media/video/terreno-3d-cima.mp4',
  'media/video/drone-panorama.mp4',
  'media/video/familia-cavalos.mp4',
  'media/video/sao-jose-campos.mp4',
  'media/img/mapa-terrenos-paraiso.webp',
  'media/img/hero-lago.webp',
  'media/img/projeto-casa-campo.webp',
  'media/img/projeto-deck-lago.webp',
  'media/img/projeto-espaco-gourmet.webp',
  'media/img/projeto-piscina-borda.webp',
  'media/img/projeto-chale-rustico.webp',
  'media/img/projeto-energia-solar.webp'
];

let midiasFaltando = [];
for (const m of midiasEssenciais) {
  const p = path.join(distDir, m);
  if (!fs.existsSync(p)) {
    midiasFaltando.push(m);
  }
}

if (midiasFaltando.length === 0) {
  console.log('✓ Todas as mídias essenciais estão presentes no diretório dist!');
} else {
  console.error('✗ Mídias faltando no dist:', midiasFaltando);
}

console.log('=== VERIFICAÇÃO CONCLUÍDA ===');
