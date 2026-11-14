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

server.listen(4178, async () => {
  console.log('Testing dist on port 4178');
  const tempProfile = path.join(process.env.TEMP || 'C:\\Temp', 'edge_test_profile_' + Date.now());
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--no-first-run',
    '--disable-gpu',
    '--window-size=1280,1000',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));
  let list = [];
  for (let i = 0; i < 10; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9224/json/list');
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
  await send('Page.navigate', { url: 'http://localhost:4178' });
  await new Promise(r => setTimeout(r, 3000));

  // Check Rodapé centering
  const rodapeInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      const rodape = document.querySelector('.rodape');
      const marca = document.querySelector('.rodape__marca');
      const logo = document.querySelector('.rodape__logo-img');
      const nome = document.querySelector('.rodape__nome');
      const sub = document.querySelector('.rodape__sub');
      const tel = document.querySelector('.rodape__tel');
      const s1 = window.getComputedStyle(rodape);
      const s2 = window.getComputedStyle(marca);
      const s3 = window.getComputedStyle(nome);
      const s4 = window.getComputedStyle(sub);
      const s5 = window.getComputedStyle(tel);
      return {
        rodapeTextCenter: s1.textAlign,
        marcaAlignItems: s2.alignItems,
        marcaDisplay: s2.display,
        nomeTextCenter: s3.textAlign,
        subTextCenter: s4.textAlign,
        telTextCenter: s5.textAlign,
        logoNaturalWidth: logo ? logo.naturalWidth : 0,
        logoLoaded: logo ? logo.complete : false
      };
    })()`,
    returnByValue: true
  });
  console.log('Rodape Check:', JSON.stringify(rodapeInfo.result.value, null, 2));

  // Check Mapa Section 4
  const mapaInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      const secao4 = document.getElementById('propriedades');
      const caixa = secao4 ? secao4.querySelector('.mapa-oficial-caixa') : null;
      const img = secao4 ? secao4.querySelector('.mapa-oficial-img') : null;
      const tag = secao4 ? secao4.querySelector('.mapa-oficial-tag') : null;
      const btn = secao4 ? secao4.querySelector('.mapa-oficial-barra a') : null;
      const hasOldBgVideo = secao4 ? !!secao4.querySelector('.mapa-drone-video-bg') : false;
      return {
        hasSecao4: !!secao4,
        hasCaixa: !!caixa,
        hasImg: !!img,
        imgSrc: img ? img.src : null,
        imgNaturalWidth: img ? img.naturalWidth : 0,
        imgNaturalHeight: img ? img.naturalHeight : 0,
        hasTagDemarcacao: !!tag,
        hasGoogleMapsBtn: !!btn,
        btnHref: btn ? btn.href : null,
        hasOldBgVideo
      };
    })()`,
    returnByValue: true
  });
  console.log('Mapa Check:', JSON.stringify(mapaInfo.result.value, null, 2));

  // Check Porteira
  const porteiraInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      const vid = document.getElementById('sessao2-porteira-video');
      return {
        exists: !!vid,
        src: vid ? vid.src : null,
        readyState: vid ? vid.readyState : 0,
        duration: vid ? vid.duration : 0
      };
    })()`,
    returnByValue: true
  });
  console.log('Porteira Check:', JSON.stringify(porteiraInfo.result.value, null, 2));

  ws.close();
  edge.kill();
  server.close();
  process.exit(0);
});
