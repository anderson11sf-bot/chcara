import { spawn } from 'node:child_process';
import fs from 'node:fs';

const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--no-first-run',
  '--disable-gpu',
  '--window-size=1280,1200',
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
      
      // Use Lenis or element scrollIntoView
      await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.getElementById('propriedades');
          if (window.__lenis) {
            window.__lenis.scrollTo(el, { immediate: true });
          } else {
            el.scrollIntoView({ block: 'start' });
          }
        })()`
      });
      await new Promise(r => setTimeout(r, 2000));

      const screenshotProp = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/screenshot_real_propriedades.png', Buffer.from(screenshotProp.data, 'base64'));

      // Check footer
      await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.getElementById('rodape');
          if (window.__lenis) {
            window.__lenis.scrollTo(el, { immediate: true });
          } else {
            el.scrollIntoView({ block: 'start' });
          }
        })()`
      });
      await new Promise(r => setTimeout(r, 2000));

      const screenshotFooter = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/screenshot_real_footer.png', Buffer.from(screenshotFooter.data, 'base64'));

      console.log('Screenshots captured!');
      edge.kill();
      process.exit(0);
    };
  } catch (e) {
    console.error(e);
    edge.kill();
    process.exit(1);
  }
}, 1200);
