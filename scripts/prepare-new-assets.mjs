import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

console.log('=== PREPARING NEW ASSETS ===');

const logoSrc = 'C:/Users/ander/OneDrive/Desktop/portal/logo/Designing_PARAÍSO_DAS_ÁGUAS_logo_4572fe55_2K.png';
const porteiraSrc = 'C:/Users/ander/OneDrive/Desktop/portal/porteira/Wooden_doors_opening_to_field_993a412a_1080p.mp4';
const cachoeiraSrc = 'C:/Users/ander/OneDrive/Desktop/aguas caindo/Transparent_water_falling_like_w…_cc76a147.mp4';
const mapaSrc = 'C:/Users/ander/OneDrive/Desktop/lago drone/IMAGENS/ilustrativos/mapa/file_000000006ef4820eb0b0cb5956df5945.png';

// 1. Logo
console.log('1. Converting logo...');
execSync(`ffmpeg -y -i "${logoSrc}" -vf "scale=iw:ih" public/media/img/logo-paraiso.png`, { stdio: 'inherit' });
execSync(`ffmpeg -y -i "${logoSrc}" -c:v libwebp -quality 92 public/media/img/logo-paraiso.webp`, { stdio: 'inherit' });

// 2. Porteira
console.log('2. Converting porteira video...');
execSync(`ffmpeg -y -i "${porteiraSrc}" -c:v libx264 -crf 23 -preset slow -an -movflags +faststart public/media/video/porteira-abertura.mp4`, { stdio: 'inherit' });
execSync(`ffmpeg -y -ss 00:00:00.100 -i public/media/video/porteira-abertura.mp4 -vframes 1 -c:v libwebp -quality 85 public/media/img/porteira-poster.webp`, { stdio: 'inherit' });

// 3. Cachoeira
console.log('3. Converting cachoeira video...');
execSync(`ffmpeg -y -i "${cachoeiraSrc}" -c:v libx264 -crf 25 -preset slow -an -movflags +faststart public/media/video/cachoeira-fundo.mp4`, { stdio: 'inherit' });
execSync(`ffmpeg -y -ss 00:00:00.100 -i public/media/video/cachoeira-fundo.mp4 -vframes 1 -c:v libwebp -quality 85 public/media/img/cachoeira-poster.webp`, { stdio: 'inherit' });

// 4. Mapa
console.log('4. Converting mapa...');
execSync(`ffmpeg -y -i "${mapaSrc}" public/media/img/mapa-oficial-terreno.png`, { stdio: 'inherit' });
execSync(`ffmpeg -y -i "${mapaSrc}" -c:v libwebp -quality 92 public/media/img/mapa-oficial-terreno.webp`, { stdio: 'inherit' });

console.log('=== ALL ASSETS PREPARED SUCCESSFULLY ===');
const checkFiles = [
  'public/media/img/logo-paraiso.png',
  'public/media/img/logo-paraiso.webp',
  'public/media/video/porteira-abertura.mp4',
  'public/media/img/porteira-poster.webp',
  'public/media/video/cachoeira-fundo.mp4',
  'public/media/img/cachoeira-poster.webp',
  'public/media/img/mapa-oficial-terreno.png',
  'public/media/img/mapa-oficial-terreno.webp'
];

for (const f of checkFiles) {
  const stat = fs.statSync(f);
  console.log(`- ${f}: ${(stat.size / 1024).toFixed(1)} KB`);
}
