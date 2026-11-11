import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const basePath = 'C:/Users/ander/OneDrive/Desktop/lago drone';
const targetVideoDir = 'public/media/video';
const targetImgDir = 'public/media/img';

fs.mkdirSync(targetVideoDir, { recursive: true });
fs.mkdirSync(targetImgDir, { recursive: true });

console.log('=== 1. PROCESSANDO VÍDEOS COM FFMPEG ===');

const videosToProcess = [
  {
    name: 'sessao2-animacao.mp4',
    poster: 'sessao2-animacao-poster.webp',
    src: path.join(basePath, 'VIDEOS/usar/anim sesao 2/lv_0_20261110213930.mp4'),
    scale: '1080:-2',
    crf: '22',
    maxrate: '3500k',
    bufsize: '7000k'
  },
  {
    name: 'terreno-3d-cima.mp4',
    poster: 'terreno-3d-cima-poster.webp',
    src: path.join(basePath, 'VIDEOS/usar/mostrando o terreno de cima/lv_0_20261111001516.mp4'),
    scale: '1080:-2',
    crf: '23',
    maxrate: '3000k',
    bufsize: '6000k'
  },
  {
    name: 'sao-jose-campos.mp4',
    poster: 'sao-jose-campos-poster.webp',
    src: path.join(basePath, 'VIDEOS/usar/videos sao jose/lv_0_20261111003823.mp4'),
    scale: '1080:-2',
    crf: '22',
    maxrate: '3500k',
    bufsize: '7000k'
  },
  {
    name: 'familia-cavalos.mp4',
    poster: 'familia-cavalos-poster.webp',
    src: path.join(basePath, 'VIDEOS/usar/criança montando em cavalo/Crianças_montando_cavalos_em_faz…_6312f44e_1080p.mp4'),
    scale: '1080:-2',
    crf: '24',
    maxrate: '2800k',
    bufsize: '5600k'
  },
  {
    name: 'drone-panorama.mp4',
    poster: 'drone-panorama-poster.webp',
    src: path.join(basePath, 'VIDEOS/Aerial_drone_video_of_property_6494da8b_1080p.mp4'),
    scale: '1280:-2',
    crf: '23',
    maxrate: '3000k',
    bufsize: '6000k'
  }
];

videosToProcess.forEach(v => {
  if (fs.existsSync(v.src)) {
    const destVideo = path.join(targetVideoDir, v.name);
    const destPoster = path.join(targetImgDir, v.poster);
    
    console.log(`Otimizando vídeo: ${v.name}...`);
    const cmdVideo = `ffmpeg -y -i "${v.src}" -vf "scale=${v.scale}" -c:v libx264 -preset fast -crf ${v.crf} -maxrate ${v.maxrate} -bufsize ${v.bufsize} -pix_fmt yuv420p -an -movflags +faststart "${destVideo}"`;
    execSync(cmdVideo, { stdio: 'inherit' });

    console.log(`Gerando poster: ${v.poster}...`);
    const cmdPoster = `ffmpeg -y -ss 00:00:01 -i "${v.src}" -vframes 1 -vf "scale=1080:-2" -c:v libwebp -quality 85 "${destPoster}"`;
    execSync(cmdPoster, { stdio: 'inherit' });

    const sizeMb = (fs.statSync(destVideo).size / (1024 * 1024)).toFixed(2);
    console.log(`✓ ${v.name} gerado (${sizeMb} MB) com poster!`);
  } else {
    console.warn(`Arquivo fonte não encontrado: ${v.src}`);
  }
});

console.log('=== 2. PROCESSANDO IMAGENS PRINCIPAIS COM FFMPEG ===');

// Mapa
const mapaSrc = path.join(basePath, 'IMAGENS/ilustrativos/mapa/file_000000006ef4820eb0b0cb5956df5945.png');
if (fs.existsSync(mapaSrc)) {
  const mapaDest = path.join(targetImgDir, 'mapa-terrenos-paraiso.webp');
  console.log('Convertendo mapa oficial...');
  execSync(`ffmpeg -y -i "${mapaSrc}" -vf "scale=1600:-2" -c:v libwebp -quality 88 "${mapaDest}"`, { stdio: 'inherit' });
  console.log('✓ Mapa gerado:', (fs.statSync(mapaDest).size / 1024).toFixed(1), 'KB');
}

// Família na varanda (Sessão 2)
const fam1 = path.join(basePath, 'IMAGENS/ilustrativos/Family_on_rural_property_veranda_7864e00a.jpg');
const fam2 = path.join(basePath, 'IMAGENS/ilustrativos/Family_on_rural_property_veranda_f13e85b6.jpg');

if (fs.existsSync(fam1)) {
  const dest = path.join(targetImgDir, 'familia-varanda-1.webp');
  execSync(`ffmpeg -y -i "${fam1}" -vf "scale=1440:-2" -c:v libwebp -quality 85 "${dest}"`, { stdio: 'inherit' });
  console.log('✓ Família Varanda 1 gerada:', (fs.statSync(dest).size / 1024).toFixed(1), 'KB');
}

if (fs.existsSync(fam2)) {
  const dest = path.join(targetImgDir, 'familia-varanda-2.webp');
  execSync(`ffmpeg -y -i "${fam2}" -vf "scale=1440:-2" -c:v libwebp -quality 85 "${dest}"`, { stdio: 'inherit' });
  console.log('✓ Família Varanda 2 gerada:', (fs.statSync(dest).size / 1024).toFixed(1), 'KB');
}

// Imagens reais do terreno
const realImages = [
  { file: 'IMG_20261030_114039.jpg_4c0fccb8.jpg', dest: 'terreno-real-lago.webp' },
  { file: 'IMG_5666.HEIC_dc12bc3c.jpg', dest: 'terreno-real-vista-morro.webp' },
  { file: 'IMG_5671.HEIC_cd53d037.jpg', dest: 'terreno-real-mata-riacho.webp' },
  { file: 'IMG_5675.HEIC_c07e15cd.jpg', dest: 'terreno-real-arvores.webp' },
  { file: 'IMG_5679.HEIC_e4c7ef82.jpg', dest: 'terreno-real-acesso.webp' },
  { file: 'IMG_5691.HEIC_04ad1e39.jpg', dest: 'terreno-real-panorama.webp' },
  { file: 'IMG_5698.HEIC_90f86f0e.jpg', dest: 'terreno-real-vegetacao.webp' },
  { file: 'IMG_5704.HEIC_b3421afe.jpg', dest: 'terreno-real-porteira.webp' },
  { file: 'IMG_5705.HEIC_e730f79b.jpg', dest: 'terreno-real-nascente.webp' }
];

realImages.forEach(img => {
  const src = path.join(basePath, 'IMAGENS', img.file);
  if (fs.existsSync(src)) {
    const dest = path.join(targetImgDir, img.dest);
    execSync(`ffmpeg -y -i "${src}" -vf "scale=1280:-2" -c:v libwebp -quality 84 "${dest}"`, { stdio: 'ignore' });
    console.log(`✓ Imagem real processada: ${img.dest} (${(fs.statSync(dest).size/1024).toFixed(1)} KB)`);
  }
});

// Projetos ilustrativos
const projImages = [
  { file: 'IMG_20261001_125443.jpg_7743224e.jpg', dest: 'projeto-casa-campo.webp' },
  { file: 'IMG_20261001_125514.jpg_0ddcf0db.jpg', dest: 'projeto-deck-lago.webp' },
  { file: 'IMG_20261030_112714.jpg_04101977.jpg', dest: 'projeto-espaco-gourmet.webp' },
  { file: 'IMG_20261030_113201.jpg_e6ec5efb.jpg', dest: 'projeto-horta-pomar.webp' },
  { file: 'IMG_20261030_113241.jpg_985b068d.jpg', dest: 'projeto-piscina-borda.webp' },
  { file: 'IMG_20261030_113751.jpg_3c907275.jpg', dest: 'projeto-chale-rustico.webp' },
  { file: 'IMG_5702.HEIC_5283b389.jpg', dest: 'projeto-energia-solar.webp' }
];

projImages.forEach(img => {
  const src = path.join(basePath, 'IMAGENS/projetos em construçao', img.file);
  if (fs.existsSync(src)) {
    const dest = path.join(targetImgDir, img.dest);
    execSync(`ffmpeg -y -i "${src}" -vf "scale=1280:-2" -c:v libwebp -quality 84 "${dest}"`, { stdio: 'ignore' });
    console.log(`✓ Projeto ilustrativo processado: ${img.dest} (${(fs.statSync(dest).size/1024).toFixed(1)} KB)`);
  }
});

console.log('TODAS AS MÍDIAS FORAM PROCESSADAS COM SUCESSO!');
