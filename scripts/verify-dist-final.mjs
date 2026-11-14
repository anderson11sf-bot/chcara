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

server.listen(4180, async () => {
  console.log('Testing dist on port 4180');
  const tempProfile = path.join(process.env.TEMP || 'C:\\Temp', 'edge_test_profile_' + Date.now());
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--remote-debugging-port=9228',
    '--no-first-run',
    '--disable-gpu',
    '--window-size=1280,1000',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));
  let list = [];
  for (let i = 0; i < 10; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9228/json/list');
      if (res.ok) {
        list = await res.json();
        if (list.length > 0) break;
      }
    } catch {}
    await new Promise(r => setTimeout(r, 300));
  }

  const target = list.find(t => t.type === 'page');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (m, p = {}) => new Promise(res => {
    const curId = id++;
    const h = (msg) => {
      const d = JSON.parse(msg.data);
      if (d.id === curId) { ws.removeEventListener('message', h); res(d.result); }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: curId, method: m, params: p }));
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: 'http://localhost:4180' });
  await new Promise(r => setTimeout(r, 3000));

  // Check Sessão 2 (Cavalo, Escurecer, Porteira Canvas)
  const sessao2Info = await send('Runtime.evaluate', {
    expression: `(() => {
      const cavalo = document.getElementById('sessao2-cavalo-scene');
      const escurecer = document.getElementById('sessao2-cavalo-escurecer');
      const porteiraScene = document.getElementById('sessao2-porteira-scene');
      const porteiraCanvas = document.getElementById('sessao2-porteira-canvas');
      const droneScene = document.getElementById('sessao2-drone-scene');
      return {
        hasCavalo: !!cavalo,
        hasEscurecer: !!escurecer,
        hasPorteiraScene: !!porteiraScene,
        hasPorteiraCanvas: !!porteiraCanvas,
        canvasWidth: porteiraCanvas ? porteiraCanvas.width : 0,
        canvasHeight: porteiraCanvas ? porteiraCanvas.height : 0,
        hasDroneScene: !!droneScene
      };
    })()`,
    returnByValue: true
  });
  console.log('Sessao 2 Check:', JSON.stringify(sessao2Info.result.value, null, 2));

  // Check Mapa Section 4
  const mapaInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      const secao4 = document.getElementById('propriedades');
      const caixa = secao4 ? secao4.querySelector('.mapa-oficial-caixa') : null;
      const img = secao4 ? secao4.querySelector('.mapa-oficial-img') : null;
      const tag = secao4 ? secao4.querySelector('.mapa-oficial-tag') : null;
      const btn = secao4 ? secao4.querySelector('.mapa-oficial-barra a') : null;
      return {
        hasSecao4: !!secao4,
        hasCaixa: !!caixa,
        hasImg: !!img,
        imgSrc: img ? img.src : null,
        hasTagDemarcacao: !!tag,
        hasGoogleMapsBtn: !!btn
      };
    })()`,
    returnByValue: true
  });
  console.log('Mapa Check:', JSON.stringify(mapaInfo.result.value, null, 2));

  ws.close();
  edge.kill();
  server.close();
  process.exit(0);
});
