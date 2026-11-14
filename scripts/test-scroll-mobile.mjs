import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const distDir = path.resolve('dist');
const mimeTypes = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(4186, async () => {
  console.log('Mobile verification server on 4186');
  const tempProfile = path.join(process.env.TEMP || 'C:\\Temp', 'edge_mob_' + Date.now());
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--no-first-run',
    '--disable-gpu',
    `--user-data-dir=${tempProfile}`,
    '--window-size=390,844',
    'about:blank'
  ]);

  let targets = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      const res = await fetch('http://127.0.0.1:9223/json/list');
      if (res.ok) {
        targets = await res.json();
        if (targets && targets.length > 0) break;
      }
    } catch {}
  }

  if (!targets || !targets[0]) {
    console.error('Failed to connect to Edge CDP');
    server.close();
    edge.kill();
    return;
  }

  const wsUrl = targets[0].webSocketDebuggerUrl;
  const ws = new globalThis.WebSocket(wsUrl);

  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const id = msgId++;
    const handler = (event) => {
      const parsed = JSON.parse(event.data);
      if (parsed.id === id) {
        ws.removeEventListener('message', handler);
        resolve(parsed.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: 'http://localhost:4186/' });

  await new Promise(r => setTimeout(r, 2000));

  // Screenshot 1: Hero Top
  let shot = await send('Page.captureScreenshot');
  fs.writeFileSync('scripts/test_hero_top.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved test_hero_top.png');

  // Scroll 1: 300px (Hero fading, blending)
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 300)' });
  await new Promise(r => setTimeout(r, 800));
  shot = await send('Page.captureScreenshot');
  fs.writeFileSync('scripts/test_hero_blend.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved test_hero_blend.png');

  // Scroll 2: Seção 2 Pomar (y = 500)
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 500)' });
  await new Promise(r => setTimeout(r, 800));
  shot = await send('Page.captureScreenshot');
  fs.writeFileSync('scripts/test_pomar_mobile.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved test_pomar_mobile.png');

  // Scroll 3: Seção 2 Porteira abrindo (y = 900)
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 900)' });
  await new Promise(r => setTimeout(r, 800));
  shot = await send('Page.captureScreenshot');
  fs.writeFileSync('scripts/test_porteira_mobile.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved test_porteira_mobile.png');

  // Check console errors
  const resEval = await send('Runtime.evaluate', {
    expression: 'document.documentElement.dataset.pdErro || "NO_ERROR"'
  });
  console.log('Runtime pdErro status:', resEval.result?.value);

  ws.close();
  edge.kill();
  server.close();
  process.exit(0);
});
