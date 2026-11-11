import { spawn } from 'node:child_process';
import fs from 'node:fs';

const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless=new', '--remote-debugging-port=9222', '--no-first-run', '--disable-gpu',
  '--window-size=1280,800', 'about:blank'
]);
await new Promise(r => setTimeout(r, 1500));
const targets = await (await fetch('http://127.0.0.1:9222/json/list')).json();
const pageTarget = targets.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension://'));
const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);

let id = 1;
const send = (method, params = {}) => new Promise(res => {
  const curId = id++;
  const handler = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.id === curId) { ws.removeEventListener('message', handler); res(data.result); }
  };
  ws.addEventListener('message', handler);
  ws.send(JSON.stringify({ id: curId, method, params }));
});

await send('Page.enable');
await send('Runtime.enable');
await send('Page.navigate', { url: 'https://chcara.vercel.app' });
await new Promise(r => setTimeout(r, 3500));

const scrollPoints = [
  { name: 'live_01_hero', y: 0 },
  { name: 'live_02_sessao2_portal', y: 1200 },
  { name: 'live_03_vsl_comparativo', y: 2500 },
  { name: 'live_04_mapa_propriedades', y: 4500 },
  { name: 'live_05_projetos_3d', y: 7000 },
  { name: 'live_06_localizacao_faq', y: 12000 }
];

for (const pt of scrollPoints) {
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${pt.y})` });
  await new Promise(r => setTimeout(r, 800));
  const ss = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${pt.name}.png`, Buffer.from(ss.data, 'base64'));
  console.log(`Saved screenshot: ${pt.name}.png`);
}

ws.close();
edge.kill();
console.log('All screenshots captured successfully!');
