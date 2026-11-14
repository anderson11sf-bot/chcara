import { spawn } from 'node:child_process';

const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--no-first-run',
  '--disable-gpu',
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
      await new Promise(r => setTimeout(r, 3500));
      const res = await send('Runtime.evaluate', {
        expression: `({
          title: document.title,
          hasPorteira: !!document.getElementById('sessao2-porteira-scene'),
          hasHorse: !!document.getElementById('sessao2-cavalo-scene'),
          hasDrone: !!document.getElementById('sessao2-drone-scene'),
          oldPortalRemoved: !document.getElementById('portal-abertura'),
          panels: document.querySelectorAll('.painel').length
        })`,
        returnByValue: true
      });
      console.log('LIVE PRODUCTION CHECK:', JSON.stringify(res.result.value, null, 2));
      edge.kill();
      process.exit(0);
    };
  } catch (e) {
    console.error(e);
    edge.kill();
    process.exit(1);
  }
}, 1200);
