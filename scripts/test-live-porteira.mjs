import { spawn } from 'node:child_process';

const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless=new',
  '--remote-debugging-port=9226',
  '--no-first-run',
  '--disable-gpu',
  '--window-size=1280,1000',
  'about:blank'
]);

setTimeout(async () => {
  try {
    const list = await fetch('http://127.0.0.1:9226/json/list').then(r => r.json());
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
    await send('Page.navigate', { url: 'https://chcara.vercel.app/' });
    await new Promise(r => setTimeout(r, 3500));

    // Test porteira scrubbing by simulating scroll
    const testResult = await send('Runtime.evaluate', {
      expression: `(async () => {
        const vid = document.getElementById('sessao2-porteira-video');
        if (!vid) return { found: false };
        // Scroll down into Sessao 2 porteira range
        window.scrollTo(0, window.innerHeight * 1.8);
        await new Promise(r => setTimeout(r, 600));
        const ct = vid.currentTime;
        const dur = vid.duration;
        const paused = vid.paused;
        return {
          found: true,
          currentTime: ct,
          duration: dur,
          paused,
          readyState: vid.readyState
        };
      })()`,
      awaitPromise: true,
      returnByValue: true
    });

    console.log('LIVE Porteira Scroll Test:', JSON.stringify(testResult.result.value, null, 2));

    ws.close();
    edge.kill();
    process.exit(0);
  } catch (e) {
    console.error(e);
    edge.kill();
    process.exit(1);
  }
}, 1200);
