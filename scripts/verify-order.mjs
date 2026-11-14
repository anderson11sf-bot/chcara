import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const distDir = path.resolve('dist');
const mimeTypes = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2'
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

server.listen(4188, async () => {
  console.log('Verification server running on 4188');
  const tempProfile = path.join(process.env.TEMP || 'C:\\Temp', 'edge_verify_order_' + Date.now());
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
    console.error('Failed to connect to Edge debugging port 9222');
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
  await send('Page.navigate', { url: 'http://localhost:4188' });
  await new Promise(r => setTimeout(r, 2500));

  const evaluation = await send('Runtime.evaluate', {
    expression: `(() => {
      // 1. Check Section 2 structure
      const secaoCenas = document.getElementById('secao-cenas');
      const horseScene = document.getElementById('sessao2-cavalo-scene');
      const horseVideo = document.getElementById('sessao2-cavalo-video');
      const porteiraScene = document.getElementById('sessao2-porteira-scene');
      const porteiraVideo = document.getElementById('sessao2-porteira-video');
      const droneScene = document.getElementById('sessao2-drone-scene');
      const droneVideo = document.getElementById('sessao2-drone-video');

      // Check that old portal artificial doors are completely GONE
      const oldPortal = document.getElementById('portal-abertura');
      const oldPortas = document.getElementById('pv-portas-cenario');
      const oldPlantas = document.getElementById('pv-plantas-cenario');
      const oldPorteiraAntesS2 = document.getElementById('porteira-transicao');

      // 2. Check waterfall in text tabs
      const paineis = Array.from(document.querySelectorAll('.painel'));
      const painelVideos = paineis.map(p => ({
        hasVideo: !!p.querySelector('.painel-fundo-video'),
        hasOverlay: !!p.querySelector('.painel-fundo-overlay'),
        videoZIndex: p.querySelector('.painel-fundo-video') ? window.getComputedStyle(p.querySelector('.painel-fundo-video')).zIndex : null,
        overlayZIndex: p.querySelector('.painel-fundo-overlay') ? window.getComputedStyle(p.querySelector('.painel-fundo-overlay')).zIndex : null
      }));

      // Check preservation of content images and videos
      const vslVideo = document.querySelector('#efeito-paraiso video.video-player');
      const mapaImg = document.querySelector('.mapa-oficial-img');
      const sjcVideo = document.querySelector('.video-player--sao-jose');

      // 3. Footer check
      const footerLines = Array.from(document.querySelectorAll('.rodape__linha')).map(el => el.textContent.trim());
      const footerLogo = !!document.querySelector('.rodape__logo-img');

      return {
        section2: {
          hasHorseScene: !!horseScene,
          hasHorseVideo: !!horseVideo,
          hasPorteiraScene: !!porteiraScene,
          hasPorteiraVideo: !!porteiraVideo,
          hasDroneScene: !!droneScene,
          hasDroneVideo: !!droneVideo,
          oldPortalRemoved: !oldPortal,
          oldPortasRemoved: !oldPortas,
          oldPlantasRemoved: !oldPlantas,
          oldPorteiraAntesS2Removed: !oldPorteiraAntesS2
        },
        waterfall: {
          totalPanels: paineis.length,
          allHaveVideo: painelVideos.every(p => p.hasVideo),
          allHaveOverlay: painelVideos.every(p => p.hasOverlay),
          videoZIndexBehind: painelVideos.every(p => p.videoZIndex === '-2' || p.videoZIndex === '-1' || parseInt(p.videoZIndex) < 0),
          vslPreserved: !!vslVideo,
          mapPreserved: !!mapaImg,
          sjcPreserved: !!sjcVideo
        },
        footer: {
          hasLogo: footerLogo,
          lines: footerLines
        }
      };
    })()`,
    returnByValue: true
  });

  console.log('VERIFICATION RESULTS:', JSON.stringify(evaluation?.result?.value || evaluation, null, 2));

  // Test scrolling into Section 2 and check timeline
  await send('Runtime.evaluate', {
    expression: `(() => {
      // simulate scroll to 25% of secao-cenas
      const portal3d = window.__portal3d || null;
      window.scrollTo(0, window.innerHeight * 1.5);
    })()`
  });

  await new Promise(r => setTimeout(r, 1000));

  edge.kill();
  server.close();
  process.exit(0);
});
