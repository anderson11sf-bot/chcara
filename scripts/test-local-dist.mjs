import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

// Simple static server for dist
const distDir = path.resolve('dist');
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(4173, async () => {
  console.log('Dist server listening on http://localhost:4173');

  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new', '--remote-debugging-port=9222', '--no-first-run', '--disable-gpu', 'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1500));
  const targets = await (await fetch('http://127.0.0.1:9222/json/list')).json();
  const pageTarget = targets.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension://'));
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.method === 'Runtime.exceptionThrown') {
      console.log('EXCEPTION:', JSON.stringify(data.params.exceptionDetails, null, 2));
    }
    if (data.method === 'Runtime.consoleAPICalled') {
      console.log('CONSOLE:', data.params.type, data.params.args.map(a => a.value || a.description));
    }
  };

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
  await send('Console.enable');

  await send('Page.navigate', { url: 'http://localhost:4173' });
  await new Promise(r => setTimeout(r, 3000));

  const evalRes = await send('Runtime.evaluate', {
    expression: `JSON.stringify({
      title: document.title,
      pdOk: document.documentElement.dataset.pdOk,
      pdErro: document.documentElement.dataset.pdErro,
      bodyClass: document.body.className,
      heroHeight: document.getElementById('hero')?.offsetHeight,
      secaoCenasHeight: document.getElementById('secao-cenas')?.offsetHeight,
      allSections: Array.from(document.querySelectorAll('section, footer')).map(s => ({
        id: s.id,
        className: s.className,
        height: s.offsetHeight,
        children: s.children.length,
        firstText: s.innerText?.slice(0, 45).replace(/\\n/g, ' ')
      })),
      windowInnerHeight: window.innerHeight,
      docScrollHeight: document.documentElement.scrollHeight
    })`,
    returnByValue: true
  });

  console.log('DOM STATE:\n', JSON.stringify(JSON.parse(evalRes.result.value), null, 2));

  // Screenshot at scroll 0
  const ss0 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('ss_local_top.png', Buffer.from(ss0.data, 'base64'));

  // Scroll to 2000 and capture
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 2000)' });
  await new Promise(r => setTimeout(r, 600));
  const ss1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('ss_local_2000.png', Buffer.from(ss1.data, 'base64'));

  // Scroll to 5000 and capture
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 5000)' });
  await new Promise(r => setTimeout(r, 600));
  const ss2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('ss_local_5000.png', Buffer.from(ss2.data, 'base64'));

  ws.close();
  edge.kill();
  server.close();
  console.log('Done test!');
});
