import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const tasks = [
  {
    src: 'C:/Users/ander/OneDrive/Desktop/portal/pomar/pomar/Woman_and_children_in_orchard_026b86b1.jpg',
    dst: path.join(projectRoot, 'public/media/img/autossuficiencia/pomar-novo.webp')
  },
  {
    src: 'C:/Users/ander/OneDrive/Desktop/portal/pomar/area equina/Horses_in_wooden_stable_stalls_f4261643.jpg',
    dst: path.join(projectRoot, 'public/media/img/possibilidades/area-equina.webp')
  },
  {
    src: 'C:/Users/ander/OneDrive/Desktop/portal/pomar/parquinho/Children_playing_on_rope_swing_b5db2350.jpg',
    dst: path.join(projectRoot, 'public/media/img/infraestrutura/parquinho.webp')
  },
  {
    src: 'C:/Users/ander/OneDrive/Desktop/portal/pomar/plantaçao/Children_playing_in_community_ga…_c5ebc328.jpg',
    dst: path.join(projectRoot, 'public/media/img/autossuficiencia/horta-nova.webp')
  },
  {
    src: 'C:/Users/ander/OneDrive/Desktop/portal/pomar/imagem de sao jose dos campos/Screenshot_2026-11-13-12-11-39-986_com.miui.gallery.png',
    dst: path.join(projectRoot, 'public/media/img/localizacao/sao-jose-campos.webp')
  },
  {
    src: 'C:/Users/ander/OneDrive/Desktop/portal/pomar/chale rustico/Rustic_chalet_with_leisure_space_0295a51e.jpg',
    dst: path.join(projectRoot, 'public/media/img/possibilidades/chale-rustico.webp')
  },
  {
    src: 'C:/Users/ander/OneDrive/Desktop/portal/pomar/fundo para abas/Portal_door_opening_with_plants_534494f9.jpg',
    dst: path.join(projectRoot, 'public/media/img/fundo-abas.webp')
  },
  {
    src: 'C:/Users/ander/OneDrive/Desktop/portal/pomar/casa de campo/Deixa_mais_atrativo_essa_imagem_1b63daa2.jpg',
    dst: path.join(projectRoot, 'public/media/img/possibilidades/casa-campo-nova.webp')
  }
];

// Add desenvolvimento files
const desenvDir = 'C:/Users/ander/OneDrive/Desktop/portal/em desenvolvimenteo';
if (fs.existsSync(desenvDir)) {
  const files = fs.readdirSync(desenvDir);
  files.forEach((f, idx) => {
    tasks.push({
      src: path.join(desenvDir, f),
      dst: path.join(projectRoot, `public/media/img/desenvolvimento/proj-desenv-${idx + 1}.webp`)
    });
  });
}

// 6 portal images
const portalLayers = [
  { src: 'C:/Users/ander/OneDrive/Desktop/portal/portal/porta esquerda/Picsart_26-11-13_11-40-44-195.png', dst: path.join(projectRoot, 'public/media/img/portal/porta-esq.webp') },
  { src: 'C:/Users/ander/OneDrive/Desktop/portal/portal/porta direita/Picsart_26-11-13_11-41-27-466.png', dst: path.join(projectRoot, 'public/media/img/portal/porta-dir.webp') },
  { src: 'C:/Users/ander/OneDrive/Desktop/portal/portal/plantas esquerda/Picsart_26-11-13_12-00-01-873.png', dst: path.join(projectRoot, 'public/media/img/portal/plantas-esq.webp') },
  { src: 'C:/Users/ander/OneDrive/Desktop/portal/portal/planta direita/Picsart_26-11-13_11-58-22-089.png', dst: path.join(projectRoot, 'public/media/img/portal/planta-dir.webp') },
  { src: 'C:/Users/ander/OneDrive/Desktop/portal/portal/tronco esquerdo/Picsart_26-11-13_12-01-25-012.png', dst: path.join(projectRoot, 'public/media/img/portal/tronco-esq.webp') },
  { src: 'C:/Users/ander/OneDrive/Desktop/portal/portal/tronco direito/Picsart_26-11-13_12-02-17-933.png', dst: path.join(projectRoot, 'public/media/img/portal/tronco-dir.webp') },
];

for (const t of tasks.concat(portalLayers)) {
  const dir = path.dirname(t.dst);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  try {
    execSync(`ffmpeg -y -i "${t.src}" -q:v 88 "${t.dst}"`, { stdio: 'ignore' });
    console.log('OK:', path.basename(t.dst), fs.statSync(t.dst).size, 'bytes');
  } catch (err) {
    console.error('Error on ' + t.src + ':', err.message);
  }
}

// Also generate hero-scroll-poster.webp from frame 1 of the hero video
const heroVideo = 'C:/Users/ander/OneDrive/Desktop/portal/pomar/animaçao sesao 1/Crianças_montando_cavalos_em_faz…_6312f44e_1080p.mp4';
const heroPoster = path.join(projectRoot, 'public/media/img/hero-scroll-poster.webp');
execSync(`ffmpeg -y -ss 00:00:00.000 -i "${heroVideo}" -vframes 1 -q:v 88 "${heroPoster}"`, { stdio: 'ignore' });
console.log('Hero poster OK:', fs.statSync(heroPoster).size);
