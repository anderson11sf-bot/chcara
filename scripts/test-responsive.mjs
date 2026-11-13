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
  const viewports = [
    { name: 'Desktop 1920x1080', w: 1920, h: 1080 },
    { name: 'Desktop 1440x900', w: 1440, h: 900 },
    { name: 'Desktop 1366x768', w: 1366, h: 768 },
    { name: 'Desktop 1280x720', w: 1280, h: 720 },
    { name: 'Mobile 430x932', w: 430, h: 932 },
    { name: 'Mobile 390x844', w: 390, h: 844 },
    { name: 'Mobile 360x800', w: 360, h: 800 },
  ];

  const tempProfile = path.join(process.env.TEMP || 'C:\\Temp', 'edge_resp_' + Date.now());
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${tempProfile}`,
    '--disable-gpu',
    'about:blank'
  ]);

  let targets = null;
  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 600));
    try {
      const res = await fetch('http://127.0.0.1:9225/json/list');
      if (res.ok) {
        targets = await res.json();
        if (targets && targets.length > 0) break;
      }
    } catch {}
  }

  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
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
  await send('Page.navigate', { url: 'http://localhost:4182' });
  await new Promise(r => setTimeout(r, 2000));

  console.log('=== TESTE DE RESPONSIVIDADE E OVERFLOW ===');
  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.w,
      height: vp.h,
      deviceScaleFactor: 1,
      mobile: vp.w < 768
    });
    await new Promise(r => setTimeout(r, 500));

    const check = await send('Runtime.evaluate', {
      expression: '({ scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth, overflow: document.documentElement.scrollWidth > window.innerWidth })',
      returnByValue: true
    });

    console.log(vp.name, '->', check.result.value.overflow ? 'FALHA OVERFLOW' : 'OK', `(${check.result.value.scrollW}px / ${check.result.value.innerW}px)`);
  }

  ws.close();
  edge.kill();
  server.close();
  process.exit(0);
});
