import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const raiz = 'C:/Users/ander/OneDrive/Desktop/agua mminando';
const destinoImg = 'C:/Users/ander/OneDrive/Desktop/SITES/chcara/public/media/img';
const destinoVideo = 'C:/Users/ander/OneDrive/Desktop/SITES/chcara/public/media/video';
const destinoFrames = 'C:/Users/ander/OneDrive/Desktop/SITES/chcara/public/media/frames';

fs.mkdirSync(destinoImg, { recursive: true });
fs.mkdirSync(destinoVideo, { recursive: true });
fs.mkdirSync(destinoFrames, { recursive: true });

console.log('===> Processando fotos de "novas"...');
const pastaNovas = path.join(raiz, 'novas');
if (fs.existsSync(pastaNovas)) {
  const arquivos = fs.readdirSync(pastaNovas).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  for (const arq of arquivos) {
    const src = path.join(pastaNovas, arq);
    const dest = path.join(destinoImg, `nova-${arq.replace(/\.[^.]+$/, '')}.webp`);
    try {
      execSync(`ffmpeg -y -i "${src}" -vf "scale=min(1920\\,iw):-2" -c:v libwebp -quality 82 "${dest}"`, { stdio: 'pipe' });
      console.log(`OK: nova-${arq} -> ${dest}`);
    } catch (e) {
      console.error(`Erro ao converter ${src}:`, e.message);
    }
  }
}

console.log('===> Processando fotos e videos de "projetos"...');
const pastaProjetos = path.join(raiz, 'projetos');
if (fs.existsSync(pastaProjetos)) {
  const arquivos = fs.readdirSync(pastaProjetos);
  for (const arq of arquivos) {
    const src = path.join(pastaProjetos, arq);
    const stat = fs.statSync(src);
    if (!stat.isFile()) continue;

    const clean = arq.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').toLowerCase();

    if (arq.endsWith('.jpg') || arq.endsWith('.png')) {
      const dest = path.join(destinoImg, `proj-${clean.replace(/\.[^.]+$/, '')}.webp`);
      try {
        execSync(`ffmpeg -y -i "${src}" -vf "scale=min(1920\\,iw):-2" -c:v libwebp -quality 82 "${dest}"`, { stdio: 'pipe' });
        console.log(`OK imagem projeto: ${dest}`);
      } catch (e) {
        console.error(`Erro projeto img ${src}:`, e.message);
      }
    } else if (arq.endsWith('.mp4')) {
      const dest = path.join(destinoVideo, `proj-${clean}`);
      const poster = path.join(destinoImg, `proj-${clean.replace(/\.mp4$/, '')}-poster.webp`);
      try {
        execSync(`ffmpeg -y -i "${src}" -c:v libx264 -crf 26 -preset faster -c:a aac -b:a 96k -movflags +faststart "${dest}"`, { stdio: 'pipe' });
        execSync(`ffmpeg -y -ss 00:00:01 -i "${src}" -vframes 1 -vf "scale=min(1280\\,iw):-2" -c:v libwebp -quality 80 "${poster}"`, { stdio: 'pipe' });
        console.log(`OK video projeto: ${dest}`);
      } catch (e) {
        console.error(`Erro projeto vid ${src}:`, e.message);
      }
    }
  }
}

console.log('===> Processando mapa do terreno...');
const mapaImg = path.join(raiz, 'mapa do terreno', 'Screenshot_2026-10-09-00-25-17-696_com.mi.globalbrowser.jpg');
if (fs.existsSync(mapaImg)) {
  const dest = path.join(destinoImg, 'mapa-oficial-terreno.webp');
  try {
    execSync(`ffmpeg -y -i "${mapaImg}" -vf "scale=min(1920\\,iw):-2" -c:v libwebp -quality 85 "${dest}"`, { stdio: 'pipe' });
    console.log(`OK mapa oficial: ${dest}`);
  } catch (e) {
    console.error(`Erro mapa img:`, e.message);
  }
}

const mapaVid = path.join(raiz, 'mapa do terreno', 'lv_0_20261014002321.mp4');
if (fs.existsSync(mapaVid)) {
  const destVid = path.join(destinoVideo, 'mapa-sobrevoo.mp4');
  const destPoster = path.join(destinoImg, 'mapa-sobrevoo-poster.webp');
  try {
    execSync(`ffmpeg -y -i "${mapaVid}" -c:v libx264 -crf 26 -preset faster -an -movflags +faststart "${destVid}"`, { stdio: 'pipe' });
    execSync(`ffmpeg -y -ss 00:00:01 -i "${mapaVid}" -vframes 1 -c:v libwebp -quality 80 "${destPoster}"`, { stdio: 'pipe' });
    console.log(`OK mapa video: ${destVid}`);
  } catch (e) {
    console.error(`Erro mapa vid:`, e.message);
  }
}

console.log('===> Processando VSL...');
const vslSrc = path.join(raiz, 'vsl', 'lv_0_20261014000718.mp4');
if (fs.existsSync(vslSrc)) {
  const destVid = path.join(destinoVideo, 'vsl-oficial.mp4');
  const destPoster = path.join(destinoImg, 'vsl-oficial-poster.webp');
  try {
    execSync(`ffmpeg -y -i "${vslSrc}" -c:v libx264 -crf 25 -preset faster -c:a aac -b:a 128k -movflags +faststart "${destVid}"`, { stdio: 'pipe' });
    execSync(`ffmpeg -y -ss 00:00:02 -i "${vslSrc}" -vframes 1 -vf "scale=min(1280\\,iw):-2" -c:v libwebp -quality 82 "${destPoster}"`, { stdio: 'pipe' });
    console.log(`OK VSL: ${destVid}`);
  } catch (e) {
    console.error(`Erro VSL:`, e.message);
  }
}

console.log('===> Processando vídeos de scroll para animações...');
// 1. Hero scroll video: lv_0_20261013233300.mp4
const heroAnimSrc = path.join(raiz, 'animacoes', 'lv_0_20261013233300.mp4');
if (fs.existsSync(heroAnimSrc)) {
  const destVid = path.join(destinoVideo, 'hero-scroll.mp4');
  const destPoster = path.join(destinoImg, 'hero-scroll-poster.webp');
  try {
    // encode keyframe every 1 frame for ultra smooth scrub on desktop
    execSync(`ffmpeg -y -i "${heroAnimSrc}" -an -c:v libx264 -crf 24 -g 1 -preset faster -vf "scale=min(1280\\,iw):-2" -movflags +faststart "${destVid}"`, { stdio: 'pipe' });
    execSync(`ffmpeg -y -ss 00:00:00.1 -i "${heroAnimSrc}" -vframes 1 -c:v libwebp -quality 82 "${destPoster}"`, { stdio: 'pipe' });
    console.log(`OK hero scroll video: ${destVid}`);
  } catch (e) {
    console.error(`Erro hero scroll vid:`, e.message);
  }

  // Extract frames for canvas scroll: 90 frames total (10 fps approx over 9.4s)
  const pastaHeroFrames = path.join(destinoFrames, 'hero');
  fs.mkdirSync(pastaHeroFrames, { recursive: true });
  try {
    console.log('Extraindo frames do hero scroll...');
    execSync(`ffmpeg -y -i "${heroAnimSrc}" -vf "fps=10,scale=min(720\\,iw):-2" -c:v libwebp -quality 70 "${pastaHeroFrames}/hero_%04d.webp"`, { stdio: 'pipe' });
    const totalFrames = fs.readdirSync(pastaHeroFrames).filter(f => f.endsWith('.webp')).length;
    console.log(`OK hero frames extraídos: ${totalFrames} frames`);
  } catch (e) {
    console.error(`Erro ao extrair frames hero:`, e.message);
  }
}

// 2. Transicao Sessão 2: lv_0_20261014001401.mp4
const transicaoSrc = path.join(raiz, 'animacoes', 'lv_0_20261014001401.mp4');
if (fs.existsSync(transicaoSrc)) {
  const destVid = path.join(destinoVideo, 'sessao2-scroll.mp4');
  const destPoster = path.join(destinoImg, 'sessao2-scroll-poster.webp');
  try {
    execSync(`ffmpeg -y -i "${transicaoSrc}" -an -c:v libx264 -crf 24 -g 1 -preset faster -vf "scale=min(1280\\,iw):-2" -movflags +faststart "${destVid}"`, { stdio: 'pipe' });
    execSync(`ffmpeg -y -ss 00:00:00.1 -i "${transicaoSrc}" -vframes 1 -c:v libwebp -quality 82 "${destPoster}"`, { stdio: 'pipe' });
    console.log(`OK sessao2 scroll video: ${destVid}`);
  } catch (e) {
    console.error(`Erro sessao2 scroll vid:`, e.message);
  }

  const pastaSessao2Frames = path.join(destinoFrames, 'sessao2');
  fs.mkdirSync(pastaSessao2Frames, { recursive: true });
  try {
    console.log('Extraindo frames da sessao 2 scroll...');
    execSync(`ffmpeg -y -i "${transicaoSrc}" -vf "fps=10,scale=min(720\\,iw):-2" -c:v libwebp -quality 70 "${pastaSessao2Frames}/s2_%04d.webp"`, { stdio: 'pipe' });
    const totalFrames = fs.readdirSync(pastaSessao2Frames).filter(f => f.endsWith('.webp')).length;
    console.log(`OK sessao 2 frames extraídos: ${totalFrames} frames`);
  } catch (e) {
    console.error(`Erro ao extrair frames sessao 2:`, e.message);
  }
}

console.log('===> CONVERSÃO CONCLUÍDA COM SUCESSO!');
