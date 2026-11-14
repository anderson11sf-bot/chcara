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

server.listen(4182, async () => {
  console.log('Mobile verification server on 4182');
  const tempProfile = path.join(process.env.TEMP || 'C:\\Temp', 'edge_mobile_profile_' + Date.now());
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--no-first-run',
    '--disable-gpu',
    `--user-data-dir=${tempProfile}`,
    '--window-size=390,844',
    'about:blank'
  ]);

  let targets = null;
  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch('http://127.0.0.1:9222/json/list');
      if (res.ok) {
        targets = await res.json();
        if (targets && targets.length > 0) break;
      }
    } catch {}
  }

  const pageTarget = targets.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension://')) || targets[0];
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
  await send('Page.navigate', { url: 'http://localhost:4182' });
  await new Promise(r => setTimeout(r, 3000));

  const mobileCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const mapImg = document.querySelector('.mapa-oficial-img');
      const footerLines = document.querySelectorAll('.rodape__marca .rodape__linha');
      const logoImg = document.querySelector('.rodape__logo-img');
      const horseScene = document.getElementById('sessao2-cavalo-scene');
      const scrollHint = document.getElementById('scroll-indicador');

      return {
        viewportWidth: window.innerWidth,
        mapWidth: mapImg ? mapImg.offsetWidth : 0,
        mapHeight: mapImg ? mapImg.offsetHeight : 0,
        mapLoaded: mapImg ? mapImg.complete && mapImg.naturalWidth > 0 : false,
        footerLinesCount: footerLines.length,
        footerTexts: Array.from(footerLines).map(l => l.textContent.trim()),
        hasFooterLogo: !!logoImg,
        horseSceneWidth: horseScene ? horseScene.offsetWidth : 0,
        scrollHintVisible: scrollHint ? getComputedStyle(scrollHint).opacity : '0'
      };
    })()`,
    returnByValue: true
  });

  console.log('Mobile Check:', JSON.stringify(mobileCheck.result.value, null, 2));

  await send('Runtime.evaluate', {
    expression: `document.querySelector('#propriedades')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
  });
  await new Promise(r => setTimeout(r, 1200));
  const ssMobileMap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/verify_mobile_mapa.png', Buffer.from(ssMobileMap.data, 'base64'));
  console.log('Saved scripts/verify_mobile_mapa.png');

  await send('Runtime.evaluate', {
    expression: `document.querySelector('#rodape')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
  });
  await new Promise(r => setTimeout(r, 1200));
  const ssMobileFooter = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/verify_mobile_footer.png', Buffer.from(ssMobileFooter.data, 'base64'));
  console.log('Saved scripts/verify_mobile_footer.png');

  edge.kill();
  server.close();
  process.exit(0);
});
