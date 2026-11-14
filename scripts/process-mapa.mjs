import fs from 'node:fs';
import { execSync } from 'node:child_process';

// Let's crop 16px from right to remove the white scrollbar/margin:
// 1143 - 20 = 1123 width
execSync('ffmpeg -y -i "C:/Users/ander/OneDrive/Desktop/SITES/chcara/public/media/img/mapa-glebas-original.png" -vf "crop=1123:1418:0:0" -c:v png "C:/Users/ander/OneDrive/Desktop/SITES/chcara/public/media/img/mapa-oficial-terreno.png"');
console.log('PNG updated!');

// Generate WebP
execSync('ffmpeg -y -i "C:/Users/ander/OneDrive/Desktop/SITES/chcara/public/media/img/mapa-oficial-terreno.png" -c:v libwebp -quality 90 "C:/Users/ander/OneDrive/Desktop/SITES/chcara/public/media/img/mapa-oficial-terreno.webp"');
console.log('WebP updated!');
