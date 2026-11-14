import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const inputVideo = 'C:\\Users\\ander\\OneDrive\\Desktop\\portal\\pomar\\animaçao sesao 1\\Crianças_montando_cavalos_em_faz…_6312f44e_1080p.mp4';
const outDesk = path.resolve('public/frames/hero');
const outMob = path.resolve('public/frames/hero-m');

fs.mkdirSync(outDesk, { recursive: true });
fs.mkdirSync(outMob, { recursive: true });

// Limpa frames antigos
for (const f of fs.readdirSync(outDesk)) fs.unlinkSync(path.join(outDesk, f));
for (const f of fs.readdirSync(outMob)) fs.unlinkSync(path.join(outMob, f));

console.log('Extracting Desktop Hero frames (full 24fps, 960w)...');
const cmdDesk = `ffmpeg -y -i "${inputVideo}" -vf "fps=24,scale=960:-1:flags=lanczos" -c:v libwebp -lossless 0 -q:v 75 -compression_level 3 -threads 0 "${path.join(outDesk, 'f_%04d.webp')}"`;
execSync(cmdDesk, { stdio: 'inherit' });

console.log('Extracting Mobile Hero frames (full 24fps, 640w)...');
const cmdMob = `ffmpeg -y -i "${inputVideo}" -vf "fps=24,scale=640:-1:flags=lanczos" -c:v libwebp -lossless 0 -q:v 75 -compression_level 3 -threads 0 "${path.join(outMob, 'f_%04d.webp')}"`;
execSync(cmdMob, { stdio: 'inherit' });

const countDesk = fs.readdirSync(outDesk).filter(f => f.endsWith('.webp')).length;
const countMob = fs.readdirSync(outMob).filter(f => f.endsWith('.webp')).length;

let totalBytesDesk = 0;
for (const f of fs.readdirSync(outDesk)) totalBytesDesk += fs.statSync(path.join(outDesk, f)).size;
let totalBytesMob = 0;
for (const f of fs.readdirSync(outMob)) totalBytesMob += fs.statSync(path.join(outMob, f)).size;

console.log(`Hero Full Extracted:`);
console.log(`Desktop: ${countDesk} frames, ${(totalBytesDesk / 1024 / 1024).toFixed(2)} MB`);
console.log(`Mobile: ${countMob} frames, ${(totalBytesMob / 1024 / 1024).toFixed(2)} MB`);
