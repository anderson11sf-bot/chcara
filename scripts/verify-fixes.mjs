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
  console.log('Verification server running on 4180');
  const tempProfile = path.join(process.env.TEMP || 'C:\\Temp', 'edge_verify_profile_' + Date.now());
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--no-first-run',
    '--disable-gpu',
    `--user-data-dir=${tempProfile}`,
    '--window-size=1280,900',
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

  if (!targets) {
    console.error('Failed to connect to Edge port 9222');
    edge.kill();
    server.close();
    process.exit(1);
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
  await send('Page.navigate', { url: 'http://localhost:4180' });
  await new Promise(r => setTimeout(r, 3500));

  const check = await send('Runtime.evaluate', {
    expression: `(() => {
      const res = {};

      // 1. Footer verification
      const logoImg = document.querySelector('.rodape__logo-img');
      const rodapeMarca = document.querySelector('.rodape__marca');
      const rodapeLinhas = document.querySelectorAll('.rodape__marca .rodape__linha');
      res.footer = {
        hasLogo: !!logoImg,
        logoSrc: logoImg?.src,
        logoLoaded: logoImg?.complete && logoImg?.naturalWidth > 0,
        logoWidth: logoImg?.naturalWidth,
        linesCount: rodapeLinhas.length,
        linesText: Array.from(rodapeLinhas).map(l => l.textContent.trim()),
        marcaDisplay: rodapeMarca ? getComputedStyle(rodapeMarca).display : null,
        marcaFlexDirection: rodapeMarca ? getComputedStyle(rodapeMarca).flexDirection : null
      };

      // 2. Map verification
      const mapImg = document.querySelector('.mapa-oficial-img');
      const mapVid = document.querySelector('.mapa-drone-video-bg');
      const mapBox = document.querySelector('.mapa-oficial-caixa');
      res.map = {
        boxVisible: !!mapBox && mapBox.offsetWidth > 0,
        imgFound: !!mapImg,
        imgSrc: mapImg?.currentSrc || mapImg?.src,
        imgLoaded: mapImg?.complete && mapImg?.naturalWidth > 0,
        imgDimensions: mapImg ? { w: mapImg.offsetWidth, h: mapImg.offsetHeight, nw: mapImg.naturalWidth, nh: mapImg.naturalHeight } : null,
        imgZIndex: mapImg ? getComputedStyle(mapImg).zIndex : null,
        imgOpacity: mapImg ? getComputedStyle(mapImg).opacity : null,
        vidFound: !!mapVid,
        vidSrc: mapVid?.src,
        vidZIndex: mapVid ? getComputedStyle(mapVid).zIndex : null
      };

      // 3. Porteira & Section 2 Fullscreen verification
      const porteira = document.getElementById('porteira-transicao');
      const porteiraVid = document.getElementById('porteira-video');
      const horseScene = document.getElementById('sessao2-cavalo-scene');
      const horseVid = document.getElementById('sessao2-cavalo-video');
      const droneVid = document.getElementById('portal-video-3d');
      res.section2 = {
        hasPorteira: !!porteira,
        porteiraVidSrc: porteiraVid?.src,
        horseSceneFullscreen: horseScene ? {
          position: getComputedStyle(horseScene).position,
          width: horseScene.offsetWidth,
          height: horseScene.offsetHeight
        } : null,
        horseVidFullscreen: horseVid ? {
          objectFit: getComputedStyle(horseVid).objectFit,
          w: horseVid.offsetWidth,
          h: horseVid.offsetHeight
        } : null,
        hasDroneVideo: !!droneVid,
        droneVidSrc: droneVid?.src
      };

      // 4. Waterfall video background on panels
      const painelVideos = document.querySelectorAll('.painel-fundo-video');
      res.waterfall = {
        totalPanelsWithVideo: painelVideos.length,
        firstVideoSrc: painelVideos[0]?.src,
        firstVideoOpacity: painelVideos[0] ? getComputedStyle(painelVideos[0]).opacity : null
      };

      // 5. Scroll hint indicator
      const scrollHint = document.getElementById('scroll-indicador');
      res.scrollHint = {
        found: !!scrollHint,
        visible: scrollHint ? getComputedStyle(scrollHint).opacity : null,
        hasDot: !!scrollHint?.querySelector('.scroll-indicador__ponto'),
        hasText: scrollHint?.querySelector('.scroll-indicador__texto')?.textContent.trim()
      };

      return res;
    })()`,
    returnByValue: true
  });

  console.log('=== VERIFICATION RESULTS ===');
  console.log(JSON.stringify(check.result.value, null, 2));

  // Take screenshot of map
  await send('Runtime.evaluate', {
    expression: `document.querySelector('#propriedades')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
  });
  await new Promise(r => setTimeout(r, 1200));
  const ssMap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/verify_mapa_test.png', Buffer.from(ssMap.data, 'base64'));
  console.log('Screenshot saved: scripts/verify_mapa_test.png');

  // Take screenshot of footer
  await send('Runtime.evaluate', {
    expression: `document.querySelector('#rodape')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
  });
  await new Promise(r => setTimeout(r, 1200));
  const ssFooter = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/verify_footer_test.png', Buffer.from(ssFooter.data, 'base64'));
  console.log('Screenshot saved: scripts/verify_footer_test.png');

  edge.kill();
  server.close();
  process.exit(0);
});
