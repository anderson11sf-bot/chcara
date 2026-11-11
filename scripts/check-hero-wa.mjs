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

server.listen(4174, async () => {
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
  await send('Page.navigate', { url: 'http://localhost:4174' });
  await new Promise(r => setTimeout(r, 2500));

  const check = await send('Runtime.evaluate', {
    expression: `(function() {
      const wa = document.getElementById('wa-flutuante');
      const waRect = wa ? wa.getBoundingClientRect() : null;
      const waStyle = wa ? window.getComputedStyle(wa) : null;

      const hl = document.getElementById('hero-headline');
      const hlRect = hl ? hl.getBoundingClientRect() : null;
      const hlStyle = hl ? window.getComputedStyle(hl) : null;

      const inner = document.querySelector('.hero__inner');
      const innerRect = inner ? inner.getBoundingClientRect() : null;
      const innerStyle = inner ? window.getComputedStyle(inner) : null;

      const hero = document.getElementById('hero');
      const heroRect = hero ? hero.getBoundingClientRect() : null;

      return JSON.stringify({
        viewport: { width: window.innerWidth, height: window.innerHeight },
        wa: {
          rect: waRect,
          position: waStyle?.position,
          right: waStyle?.right,
          bottom: waStyle?.bottom,
          top: waStyle?.top,
          left: waStyle?.left,
          zIndex: waStyle?.zIndex,
          display: waStyle?.display
        },
        hero: {
          rect: heroRect
        },
        inner: {
          rect: innerRect,
          margin: innerStyle?.margin,
          alignItems: innerStyle?.alignItems
        },
        headline: {
          rect: hlRect,
          textAlign: hlStyle?.textAlign,
          fontSize: hlStyle?.fontSize,
          margin: hlStyle?.margin,
          offsetWidth: hl?.offsetWidth
        }
      }, null, 2);
    })()`,
    returnByValue: true
  });

  console.log('LAYOUT ANALYSIS:\n', check.result.value);

  // Take screenshot at 1280x800 desktop
  const ssDesktop = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('ss_desktop_1280.png', Buffer.from(ssDesktop.data, 'base64'));

  // Now emulate mobile: 390x844 (iPhone 12/13/14)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 600));

  const checkMobile = await send('Runtime.evaluate', {
    expression: `(function() {
      const wa = document.getElementById('wa-flutuante');
      const waRect = wa ? wa.getBoundingClientRect() : null;
      const hl = document.getElementById('hero-headline');
      const hlRect = hl ? hl.getBoundingClientRect() : null;
      return JSON.stringify({
        viewport: { width: window.innerWidth, height: window.innerHeight },
        wa: waRect,
        headline: { rect: hlRect, offsetWidth: hl?.offsetWidth }
      }, null, 2);
    })()`,
    returnByValue: true
  });
  console.log('MOBILE ANALYSIS:\n', checkMobile.result.value);

  const ssMobile = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('ss_mobile_390.png', Buffer.from(ssMobile.data, 'base64'));

  ws.close();
  edge.kill();
  server.close();
});
