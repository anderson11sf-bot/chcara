import { spawn } from 'node:child_process';
import fs from 'node:fs';

const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--no-first-run',
  '--disable-gpu',
  '--window-size=390,844',
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
      
      // Mobile scroll to #propriedades
      await send('Runtime.evaluate', {
        expression: `document.getElementById('propriedades').scrollIntoView({ block: 'start' })`
      });
      await new Promise(r => setTimeout(r, 1500));
      const sProp = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/screenshot_mobile_propriedades.png', Buffer.from(sProp.data, 'base64'));

      // Mobile scroll to footer
      await send('Runtime.evaluate', {
        expression: `document.getElementById('rodape').scrollIntoView({ block: 'start' })`
      });
      await new Promise(r => setTimeout(r, 1500));
      const sFoot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/screenshot_mobile_footer.png', Buffer.from(sFoot.data, 'base64'));

      console.log('Mobile screenshots captured');
      edge.kill();
      process.exit(0);
    };
  } catch (e) {
    console.error(e);
    edge.kill();
    process.exit(1);
  }
}, 1200);
