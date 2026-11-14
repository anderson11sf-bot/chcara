import { spawn } from 'node:child_process';

const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless=new',
  '--remote-debugging-port=9229',
  '--no-first-run',
  '--disable-gpu',
  '--window-size=1280,1000',
  'about:blank'
]);

setTimeout(async () => {
  try {
    let list = [];
    for (let i = 0; i < 15; i++) {
      try {
        const res = await fetch('http://127.0.0.1:9229/json/list');
        if (res.ok) {
          list = await res.json();
          if (list.length > 0) break;
        }
      } catch {}
      await new Promise(r => setTimeout(r, 400));
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
    await send('Network.enable');
    await send('Network.setCacheDisabled', { cacheDisabled: true });
    await send('Page.navigate', { url: 'https://chcara.vercel.app/?v=' + Date.now() });
    await new Promise(r => setTimeout(r, 4000));

    const check = await send('Runtime.evaluate', {
      expression: `(() => {
        const canvas = document.getElementById('sessao2-porteira-canvas');
        const escurecer = document.getElementById('sessao2-cavalo-escurecer');
        const mapa = document.querySelector('.mapa-oficial-img');
        return {
          hasCanvas: !!canvas,
          canvasWidth: canvas ? canvas.width : 0,
          hasEscurecer: !!escurecer,
          hasMapa: !!mapa,
          mapaLoaded: mapa ? mapa.complete : false
        };
      })()`,
      returnByValue: true
    });
    console.log('LIVE Performance Check:', JSON.stringify(check.result.value, null, 2));

    ws.close();
    edge.kill();
    process.exit(0);
  } catch (e) {
    console.error(e);
    edge.kill();
    process.exit(1);
  }
}, 1200);
