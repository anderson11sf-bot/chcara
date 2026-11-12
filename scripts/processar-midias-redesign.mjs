import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const cavaloFolder = 'C:\\Users\\ander\\OneDrive\\Desktop\\lago drone\\VIDEOS\\usar\\criança montando em cavalo';
const cavaloFiles = fs.readdirSync(cavaloFolder).filter(f => f.endsWith('.mp4'));
const cavaloInput = path.join(cavaloFolder, cavaloFiles[0]);

const sessao2Input = 'C:\\Users\\ander\\OneDrive\\Desktop\\lago drone\\animacao 1 nova\\lv_0_20261112120755.mp4';
const vslInput = 'C:\\Users\\ander\\OneDrive\\Desktop\\lago drone\\VIDEOS\\apresenta\\lv_0_20261112135807.mp4';

console.log('1. Migrando frames antigos do Hero para Fundo Global...');
const fundoGlobalDir = path.resolve('public', 'media', 'frames', 'fundo_global');
if (!fs.existsSync(fundoGlobalDir)) fs.mkdirSync(fundoGlobalDir, { recursive: true });

const oldHeroDir = path.resolve('public', 'media', 'frames', 'hero');
if (fs.existsSync(oldHeroDir)) {
  const oldFrames = fs.readdirSync(oldHeroDir).filter(f => f.endsWith('.webp'));
  for (const f of oldFrames) {
    const src = path.join(oldHeroDir, f);
    const dest = path.join(fundoGlobalDir, f.replace('hero_', 'fundo_'));
    fs.copyFileSync(src, dest);
  }
  console.log(`Copiados ${oldFrames.length} frames para fundo_global!`);
}

console.log('\n2. Processando novo vídeo do Cavalo para a Primeira Sessão...');
// Limpar diretório do hero para novos frames
const heroFramesDir = path.resolve('public', 'media', 'frames', 'hero');
if (fs.existsSync(heroFramesDir)) {
  fs.rmSync(heroFramesDir, { recursive: true, force: true });
}
fs.mkdirSync(heroFramesDir, { recursive: true });

// Extrair 90 frames do vídeo do cavalo em WebP (960x1706 / 1080x1920)
// Duração: ~14.9s. 90 frames = ~6 fps
console.log('Extraindo frames do cavalo...');
execSync(`ffmpeg -y -i "${cavaloInput}" -vf "fps=90/14.916,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" -vframes 90 -c:v libwebp -quality 82 -compression_level 4 "${path.join(heroFramesDir, 'hero_%04d.webp')}"`, { stdio: 'inherit' });

// Vídeo web do cavalo e poster
const heroVideoOutput = path.resolve('public', 'media', 'video', 'hero-cavalo.mp4');
const heroPosterOutput = path.resolve('public', 'media', 'img', 'hero-scroll-poster.webp');
execSync(`ffmpeg -y -i "${cavaloInput}" -vf "scale=1080:1920" -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart -an "${heroVideoOutput}"`, { stdio: 'inherit' });
execSync(`ffmpeg -y -i "${cavaloInput}" -ss 00:00:01 -vframes 1 -vf "scale=1080:1920" -c:v libwebp -quality 88 "${heroPosterOutput}"`, { stdio: 'inherit' });

console.log('\n3. Processando novo vídeo da Sessão 2 (animacao 1 nova)...');
const s2FramesDir = path.resolve('public', 'media', 'frames', 'sessao2');
if (fs.existsSync(s2FramesDir)) {
  fs.rmSync(s2FramesDir, { recursive: true, force: true });
}
fs.mkdirSync(s2FramesDir, { recursive: true });

// lv_0_20261112120755.mp4 tem 5.66s. Extrair 90 frames (16 fps)
execSync(`ffmpeg -y -i "${sessao2Input}" -vf "fps=90/5.666,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" -vframes 90 -c:v libwebp -quality 82 -compression_level 4 "${path.join(s2FramesDir, 's2_%04d.webp')}"`, { stdio: 'inherit' });

const s2VideoOutput = path.resolve('public', 'media', 'video', 'sessao2-scroll.mp4');
const s2PosterOutput = path.resolve('public', 'media', 'img', 'sessao2-scroll-poster.webp');
execSync(`ffmpeg -y -i "${sessao2Input}" -vf "scale=1920:1080" -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart -an "${s2VideoOutput}"`, { stdio: 'inherit' });
execSync(`ffmpeg -y -i "${sessao2Input}" -ss 00:00:00.5 -vframes 1 -vf "scale=1920:1080" -c:v libwebp -quality 88 "${s2PosterOutput}"`, { stdio: 'inherit' });

console.log('\n4. Processando vídeo de Apresentação da Terceira Sessão...');
const vslVideoOutput = path.resolve('public', 'media', 'video', 'vsl-oficial.mp4');
const vslPosterOutput = path.resolve('public', 'media', 'img', 'vsl-oficial-poster.webp');
execSync(`ffmpeg -y -i "${vslInput}" -vf "scale=1920:1080" -c:v libx264 -preset medium -crf 24 -maxrate 2800k -bufsize 5600k -c:a aac -b:a 128k -movflags +faststart "${vslVideoOutput}"`, { stdio: 'inherit' });
execSync(`ffmpeg -y -i "${vslInput}" -ss 00:00:03 -vframes 1 -vf "scale=1920:1080" -c:v libwebp -quality 85 "${vslPosterOutput}"`, { stdio: 'inherit' });

console.log('\n5. Processando fotos reais para a Sessão Sete Glebas...');
const imagensDir = 'C:\\Users\\ander\\OneDrive\\Desktop\\lago drone\\IMAGENS';
const glebasImgDir = path.resolve('public', 'media', 'img', 'glebas');
if (!fs.existsSync(glebasImgDir)) fs.mkdirSync(glebasImgDir, { recursive: true });

const fotosGlebas = [
  { in: 'IMG_5704.HEIC_b3421afe.jpg', out: 'gleba-a-lago-vista.webp' },
  { in: 'IMG_5671.HEIC_cd53d037.jpg', out: 'gleba-b-estrada-natureza.webp' },
  { in: 'IMG_5691.HEIC_04ad1e39.jpg', out: 'gleba-c-lago-deck.webp' },
  { in: 'IMG_5666.HEIC_dc12bc3c.jpg', out: 'gleba-d-plato-elevado.webp' },
  { in: 'IMG_5675.HEIC_c07e15cd.jpg', out: 'gleba-e-colina-verde.webp' },
  { in: 'IMG_5679.HEIC_e4c7ef82.jpg', out: 'gleba-f-mata-nativa.webp' },
  { in: 'IMG_5681.HEIC_15fc526a.jpg', out: 'gleba-g-nascente-lago.webp' }
];

for (const foto of fotosGlebas) {
  const fullIn = path.join(imagensDir, foto.in);
  const fullOut = path.join(glebasImgDir, foto.out);
  if (fs.existsSync(fullIn)) {
    execSync(`ffmpeg -y -i "${fullIn}" -vf "scale=1200:800:force_original_aspect_ratio=increase,crop=1200:800" -c:v libwebp -quality 85 "${fullOut}"`);
    console.log(`Gerada imagem da gleba: ${foto.out}`);
  }
}

console.log('\nTodas as novas mídias foram processadas com sucesso!');
