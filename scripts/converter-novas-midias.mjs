import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'C:/Users/ander/OneDrive/Desktop/SITES/chcara';
const LAGO_DRONE = 'C:/Users/ander/OneDrive/Desktop/lago drone';

console.log('=== PROCESSAMENTO DE MÍDIAS NOVAS: LAGO DRONE ===');

// Garantir diretórios
const dirs = [
  'public/media/frames/sessao2',
  'public/media/video',
  'public/media/img',
  'public/media/img/autossuficiencia'
];
for (const d of dirs) {
  const p = path.join(ROOT, d);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

// 1. ANIMAÇÃO DE SCROLL DA SESSÃO 2 (NOVO VÍDEO)
const videoS2 = path.join(LAGO_DRONE, 'VIDEOS/usar/anim sesao 2/lv_0_20261110213930.mp4');
console.log('1. Extraindo frames WebP da Sessão 2:', videoS2);

// Limpa frames antigos
const framesS2Dir = path.join(ROOT, 'public/media/frames/sessao2');
for (const f of fs.readdirSync(framesS2Dir)) {
  if (f.endsWith('.webp')) fs.unlinkSync(path.join(framesS2Dir, f));
}

// Extrai ~95 frames (taxa de 18 fps para duração de 5.1s -> 92 frames)
const cmdFrames = `ffmpeg -y -i "${videoS2}" -vf "fps=18,scale=720:1280:force_original_aspect_ratio=decrease" -vcodec libwebp -quality 80 -compression_level 4 "${framesS2Dir}/s2_%04d.webp"`;
execSync(cmdFrames, { stdio: 'inherit' });

const totalFramesS2 = fs.readdirSync(framesS2Dir).filter(f => f.endsWith('.webp')).length;
console.log(`Extraídos ${totalFramesS2} frames WebP para a Sessão 2.`);

// Poster e vídeo web da Sessão 2
const posterS2 = path.join(ROOT, 'public/media/img/sessao2-scroll-poster.webp');
fs.copyFileSync(path.join(framesS2Dir, 's2_0001.webp'), posterS2);

const videoWebS2 = path.join(ROOT, 'public/media/video/sessao2-scroll.mp4');
const cmdVideoS2 = `ffmpeg -y -i "${videoS2}" -vf "scale=720:1280:force_original_aspect_ratio=decrease" -c:v libx264 -crf 24 -preset fast -pix_fmt yuv420p -movflags +faststart -an "${videoWebS2}"`;
execSync(cmdVideoS2, { stdio: 'inherit' });

// 2. VÍDEO DE SÃO JOSÉ DOS CAMPOS EM FORMATO EM PÉ (9:16)
const videoSjc = path.join(LAGO_DRONE, 'VIDEOS/usar/videos sao jose/lv_0_20261111003823.mp4');
console.log('2. Otimizando vídeo vertical de São José dos Campos:', videoSjc);
const videoWebSjc = path.join(ROOT, 'public/media/video/sao-jose-vertical.mp4');
const posterSjc = path.join(ROOT, 'public/media/img/sao-jose-vertical-poster.webp');

const cmdVideoSjc = `ffmpeg -y -i "${videoSjc}" -vf "scale=720:1280:force_original_aspect_ratio=decrease" -c:v libx264 -crf 24 -preset fast -pix_fmt yuv420p -movflags +faststart -an "${videoWebSjc}"`;
execSync(cmdVideoSjc, { stdio: 'inherit' });

const cmdPosterSjc = `ffmpeg -y -ss 00:00:01 -i "${videoSjc}" -vframes 1 -vf "scale=720:1280:force_original_aspect_ratio=decrease" -vcodec libwebp -quality 82 "${posterSjc}"`;
execSync(cmdPosterSjc, { stdio: 'inherit' });

// 3. MAPA OFICIAL TOPOGRÁFICO DAS 7 GLEBAS
const mapaSrc = path.join(LAGO_DRONE, 'IMAGENS/ilustrativos/mapa/file_000000006ef4820eb0b0cb5956df5945.png');
console.log('3. Convertendo Mapa Oficial das 7 Glebas:', mapaSrc);
const mapaDest = path.join(ROOT, 'public/media/img/mapa-oficial-terreno.webp');
const cmdMapa = `ffmpeg -y -i "${mapaSrc}" -vf "scale=1400:-1" -vcodec libwebp -quality 85 "${mapaDest}"`;
execSync(cmdMapa, { stdio: 'inherit' });

// 4. FOTOS ILUSTRATIVAS DA FAMÍLIA NO DECK
const familia1Src = path.join(LAGO_DRONE, 'IMAGENS/ilustrativos/Family_on_rural_property_veranda_7864e00a.jpg');
const familia2Src = path.join(LAGO_DRONE, 'IMAGENS/ilustrativos/Family_on_rural_property_veranda_f13e85b6.jpg');
console.log('4. Convertendo fotos da família na varanda');

const cmdFam1 = `ffmpeg -y -i "${familia1Src}" -vf "scale=1600:-1" -vcodec libwebp -quality 84 "${ROOT}/public/media/img/familia-veranda-lago.webp"`;
const cmdFam2 = `ffmpeg -y -i "${familia2Src}" -vf "scale=1200:-1" -vcodec libwebp -quality 84 "${ROOT}/public/media/img/familia-novo-luxo.webp"`;
execSync(cmdFam1, { stdio: 'inherit' });
execSync(cmdFam2, { stdio: 'inherit' });

// 5. FOTOS REAIS DO TERRENO E LAGO
console.log('5. Convertendo fotos reais do terreno');
const fotosReais = [
  { src: 'IMAGENS/IMG_5704.HEIC_b3421afe.jpg', dest: 'public/media/img/terreno-lago-panorama.webp', w: 1400 },
  { src: 'IMAGENS/IMG_5671.HEIC_cd53d037.jpg', dest: 'public/media/img/terreno-estrada-lago.webp', w: 1400 },
  { src: 'IMAGENS/IMG_5691.HEIC_04ad1e39.jpg', dest: 'public/media/img/terreno-lago-alto.webp', w: 1400 },
  { src: 'IMAGENS/IMG_5666.HEIC_dc12bc3c.jpg', dest: 'public/media/img/terreno-pasto-colina.webp', w: 1400 }
];
for (const f of fotosReais) {
  const sPath = path.join(LAGO_DRONE, f.src);
  const dPath = path.join(ROOT, f.dest);
  if (fs.existsSync(sPath)) {
    const cmd = `ffmpeg -y -i "${sPath}" -vf "scale=${f.w}:-1" -vcodec libwebp -quality 84 "${dPath}"`;
    execSync(cmd, { stdio: 'inherit' });
  }
}

// 6. RECORTE DOS CARDS DA SESSÃO 7 (VIDA AUTOSSUSTENTÁVEL) DO DESIGNER
console.log('6. Extraindo imagens da Sessão 07 (Quadro de Autossustentabilidade)');
const designS7 = path.join(LAGO_DRONE, 'DESIGNER DO SITE/Real_estate_website_UI_design_755b4dfc.jpg');
// Coordenadas das fotos no design 1376x768:
// Horta: x=690, y=120, w=340, h=270
// Pomar: x=1045, y=120, w=275, h=175
// Criação: x=1045, y=308, w=275, h=175
// Energia Solar: x=690, y=405, w=340, h=270
// Varanda Rural: x=1045, y=495, w=275, h=180

const cropsS7 = [
  { name: 'horta-produtiva', x: 690, y: 120, w: 340, h: 270 },
  { name: 'pomar-arvores', x: 1045, y: 120, w: 275, h: 175 },
  { name: 'criacao-natural', x: 1045, y: 308, w: 275, h: 175 },
  { name: 'energia-solar', x: 690, y: 405, w: 340, h: 270 },
  { name: 'varanda-rural', x: 1045, y: 495, w: 275, h: 180 }
];

for (const c of cropsS7) {
  const dPath = path.join(ROOT, `public/media/img/autossuficiencia/${c.name}.webp`);
  const cmd = `ffmpeg -y -i "${designS7}" -filter:v "crop=${c.w}:${c.h}:${c.x}:${c.y}" -vcodec libwebp -quality 90 "${dPath}"`;
  execSync(cmd, { stdio: 'inherit' });
}

console.log('=== PROCESSAMENTO DE MÍDIAS CONCLUÍDO COM SUCESSO! ===');
