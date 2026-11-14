import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const projectDir = 'c:/Users/ander/OneDrive/Desktop/SITES/chcara';
process.chdir(projectDir);
const distDir = path.join(projectDir, 'dist');

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

server.listen(4195, async () => {
  console.log('Verification server running on 4195');
  const tempProfile = path.join(process.env.TEMP || 'C:\\Temp', 'edge_verify_all_' + Date.now());
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--remote-debugging-port=9235',
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
      const res = await fetch('http://127.0.0.1:9235/json/list');
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

  const testViewport = async (w, h, name) => {
    console.log(`\n=== Testing Viewport: ${name} (${w}x${h}) ===`);
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w <= 768 });
    await send('Page.navigate', { url: 'http://localhost:4195' });
    await new Promise(r => setTimeout(r, 2000));

    // 1. Check Sessão 2 Player Frame
    const s2Data = await send('Runtime.evaluate', {
      expression: `(() => {
        const frame = document.querySelector('.sessao2-player-frame');
        const video = document.querySelector('.sessao2-cavalo-video');
        const r = frame ? frame.getBoundingClientRect() : null;
        return {
          frameRect: r ? { width: r.width, height: r.height, top: r.top, left: r.left } : null,
          frameDisplay: frame ? window.getComputedStyle(frame).display : null,
          videoAspect: video ? (video.videoWidth + 'x' + video.videoHeight) : null,
          videoPaused: video ? video.paused : null
        };
      })()`,
      returnByValue: true
    });
    console.log('Sessão 2 Player Data:', JSON.stringify(s2Data.result.value));

    // 2. Scroll into Sessão 2 portal sequence (progresso 0.65)
    await send('Runtime.evaluate', {
      expression: `(() => {
        const s2 = document.getElementById('secao-cenas');
        if (s2) {
          window.scrollTo(0, s2.offsetTop + (s2.offsetHeight - window.innerHeight) * 0.65);
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    const portalData = await send('Runtime.evaluate', {
      expression: `(() => {
        const portaEsq = document.getElementById('pv-porta-esq');
        const portaDir = document.getElementById('pv-porta-dir');
        const plantaEsq = document.getElementById('pv-plantas-esq');
        const troncoEsq = document.getElementById('pv-tronco-esq');
        const casaIris = document.getElementById('pv-casa-iris');
        const folhaEsq = document.getElementById('pv-folha-esq');
        return {
          portaEsqTransform: portaEsq?.style.transform,
          portaDirTransform: portaDir?.style.transform,
          plantaEsqTransform: plantaEsq?.style.transform,
          troncoEsqScale: troncoEsq?.style.transform,
          casaIrisOpacity: casaIris?.style.opacity,
          folhaEsqTransform: folhaEsq?.style.transform
        };
      })()`,
      returnByValue: true
    });
    console.log('Portal 3D at 65% scroll:', JSON.stringify(portalData.result.value));

    // 3. Scroll to Map section (#propriedades)
    await send('Runtime.evaluate', {
      expression: `document.getElementById('propriedades')?.scrollIntoView({ behavior: 'instant', block: 'center' });`
    });
    await new Promise(r => setTimeout(r, 1000));

    const mapData = await send('Runtime.evaluate', {
      expression: `(() => {
        const m = document.querySelector('.mapa-oficial-img');
        const box = document.querySelector('.mapa-oficial-caixa');
        const v = document.querySelector('.mapa-drone-video-bg');
        const mr = m?.getBoundingClientRect();
        const topEl = mr ? document.elementFromPoint(mr.left + mr.width / 2, mr.top + mr.height / 2) : null;
        return {
          boxOpacity: box ? window.getComputedStyle(box).opacity : null,
          boxDisplay: box ? window.getComputedStyle(box).display : null,
          imgComplete: m?.complete,
          imgNaturalWidth: m?.naturalWidth,
          imgOpacity: m ? window.getComputedStyle(m).opacity : null,
          imgZIndex: m ? window.getComputedStyle(m).zIndex : null,
          videoZIndex: v ? window.getComputedStyle(v).zIndex : null,
          elementAtCenter: topEl ? (topEl.tagName + '.' + topEl.className) : null
        };
      })()`,
      returnByValue: true
    });
    console.log('Mapa Oficial Data:', JSON.stringify(mapData.result.value));

    // 4. Scroll to Localização (#localizacao)
    await send('Runtime.evaluate', {
      expression: `document.getElementById('localizacao')?.scrollIntoView({ behavior: 'instant', block: 'center' });`
    });
    await new Promise(r => setTimeout(r, 1000));

    const locData = await send('Runtime.evaluate', {
      expression: `(() => {
        const loc = document.querySelector('.localizacao-mapa-img');
        const box = document.querySelector('.localizacao-mapa-caixa');
        const v = document.querySelector('.localizacao-mapa-video-bg');
        const lr = loc?.getBoundingClientRect();
        const topEl = lr ? document.elementFromPoint(lr.left + lr.width / 2, lr.top + lr.height / 2) : null;
        return {
          boxOpacity: box ? window.getComputedStyle(box).opacity : null,
          imgComplete: loc?.complete,
          imgNaturalWidth: loc?.naturalWidth,
          imgZIndex: loc ? window.getComputedStyle(loc).zIndex : null,
          videoZIndex: v ? window.getComputedStyle(v).zIndex : null,
          elementAtCenter: topEl ? (topEl.tagName + '.' + topEl.className) : null
        };
      })()`,
      returnByValue: true
    });
    console.log('Localização Data:', JSON.stringify(locData.result.value));

    // Take screenshot
    if (w === 1920) {
      await send('Runtime.evaluate', {
        expression: `document.getElementById('propriedades')?.scrollIntoView({ behavior: 'instant', block: 'center' });`
      });
      await new Promise(r => setTimeout(r, 600));
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(projectDir, 'scripts/verified-desktop-mapa.png'), Buffer.from(shot.data, 'base64'));

      await send('Runtime.evaluate', {
        expression: `document.getElementById('secao-cenas')?.scrollIntoView({ behavior: 'instant', block: 'start' });`
      });
      await new Promise(r => setTimeout(r, 600));
      const shotS2 = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(projectDir, 'scripts/verified-desktop-sessao2.png'), Buffer.from(shotS2.data, 'base64'));
    }

    if (w === 390) {
      await send('Runtime.evaluate', {
        expression: `document.getElementById('propriedades')?.scrollIntoView({ behavior: 'instant', block: 'center' });`
      });
      await new Promise(r => setTimeout(r, 600));
      const shotMob = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(projectDir, 'scripts/verified-mobile-mapa.png'), Buffer.from(shotMob.data, 'base64'));

      await send('Runtime.evaluate', {
        expression: `document.getElementById('secao-cenas')?.scrollIntoView({ behavior: 'instant', block: 'start' });`
      });
      await new Promise(r => setTimeout(r, 600));
      const shotMobS2 = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(projectDir, 'scripts/verified-mobile-sessao2.png'), Buffer.from(shotMobS2.data, 'base64'));
    }
  };

  // Test across all required viewports
  await testViewport(1920, 1080, 'Desktop 1920x1080');
  await testViewport(1366, 768, 'Desktop 1366x768');
  await testViewport(390, 844, 'Mobile iPhone 390x844');
  await testViewport(360, 800, 'Mobile Android 360x800');

  console.log('\nAll viewports successfully verified!');
  edge.kill();
  server.close();
  process.exit(0);
});
