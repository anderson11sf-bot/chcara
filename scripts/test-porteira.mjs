import { spawn } from 'node:child_process';
import fs from 'node:fs';

const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--no-first-run',
  '--disable-gpu',
  '--window-size=1280,900',
  'about:blank'
]);

setTimeout(async () => {
  try {
    const list = await fetch('http://127.0.0.1:9222/json/list').then(r => r.json());
    const target = list.find(t => t.type === 'page');
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    ws.onopen = async () => {
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
      await send('Page.navigate', { url: 'https://chcara.vercel.app/' });
      await new Promise(r => setTimeout(r, 3000));
      
      const secaoCenasInfo = await send('Runtime.evaluate', {
        expression: `(() => {
          const s = document.getElementById('secao-cenas');
          return { top: s.offsetTop, height: s.offsetHeight, vh: window.innerHeight };
        })()`,
        returnByValue: true
      });
      const { top, height, vh } = secaoCenasInfo.result.value;
      console.log('secaoCenas:', { top, height, vh });

      const testPoints = [0.1, 0.35, 0.55, 0.70, 0.85];
      for (const p of testPoints) {
        const scrollY = top + (height - vh) * p;
        await send('Runtime.evaluate', {
          expression: `window.scrollTo(0, ${scrollY})`
        });
        await new Promise(r => setTimeout(r, 600));

        const state = await send('Runtime.evaluate', {
          expression: `(() => {
            const horse = document.getElementById('sessao2-cavalo-scene');
            const porteira = document.getElementById('sessao2-porteira-scene');
            const drone = document.getElementById('sessao2-drone-scene');
            const portVid = document.getElementById('sessao2-porteira-video');
            return {
              horseOp: horse.style.opacity,
              porteiraOp: porteira.style.opacity,
              porteiraVis: porteira.style.visibility,
              droneOp: drone.style.opacity,
              droneVis: drone.style.visibility,
              portCurTime: portVid ? portVid.currentTime : 0,
              portDuration: portVid ? portVid.duration : 0
            };
          })()`,
          returnByValue: true
        });
        console.log('Point p=' + p + ':', state.result.value);

        const shot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('scripts/screenshot_porteira_p' + Math.round(p * 100) + '.png', Buffer.from(shot.data, 'base64'));
      }

      edge.kill();
      process.exit(0);
    };
  } catch (e) {
    console.error(e);
    edge.kill();
    process.exit(1);
  }
}, 1200);
