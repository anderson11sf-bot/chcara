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
await new Promise(r => setTimeout(r, 4000));

const targetsToCapture = [
  { name: 'live_01_hero_navbar', selector: '#hero' },
  { name: 'live_02_mapa_propriedades', selector: '#propriedades' },
  { name: 'live_03_autossuficiencia_quadro', selector: '#autossuficiencia' },
  { name: 'live_04_lifestyle_compartilhar', selector: '#compartilhar' },
  { name: 'live_05_sjc_vertical_video', selector: '#sao-jose' },
  { name: 'live_06_aquisicao_cards', selector: '#aquisicao' },
  { name: 'live_07_contato_vip', selector: '#contato' }
];

for (const target of targetsToCapture) {
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('${target.selector}');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`
  });
  await new Promise(r => setTimeout(r, 1200));
  const ss = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`scripts/${target.name}.png`, Buffer.from(ss.data, 'base64'));
  console.log(`Saved screenshot: scripts/${target.name}.png`);
}

ws.close();
edge.kill();
console.log('All live screenshots captured successfully!');
