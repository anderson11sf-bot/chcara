import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const cavaloFolder = 'C:\\Users\\ander\\OneDrive\\Desktop\\lago drone\\VIDEOS\\usar\\criança montando em cavalo';
const cavaloFiles = fs.readdirSync(cavaloFolder).filter(f => f.endsWith('.mp4'));

const files = [
  ...cavaloFiles.map(f => path.join(cavaloFolder, f)),
  'C:\\Users\\ander\\OneDrive\\Desktop\\lago drone\\animacao 1 nova\\lv_0_20261112120755.mp4',
  'C:\\Users\\ander\\OneDrive\\Desktop\\lago drone\\VIDEOS\\apresenta\\lv_0_20261112135807.mp4'
];

for (const f of files) {
  try {
    const out = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,duration,nb_frames -of default=noprint_wrappers=1 "${f}"`, { encoding: 'utf-8' });
    console.log('=== FILE:', path.basename(f), '===');
    console.log(out.trim());
  } catch (e) {
    console.error('Error on', f, e.message);
  }
}
