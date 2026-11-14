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
      await new Promise(r => setTimeout(r, 4000));
      const res = await send('Runtime.evaluate', {
        expression: `(() => {
          const img = document.querySelector('.mapa-oficial-img');
          const caixa = document.querySelector('.mapa-oficial-caixa');
          const video = document.querySelector('.mapa-drone-video-bg');
          const picture = document.querySelector('.mapa-oficial-picture');
          const tag = document.querySelector('.mapa-oficial-tag');
          if (!img) return { error: 'img not found' };
          const rect = img.getBoundingClientRect();
          const caixaRect = caixa ? caixa.getBoundingClientRect() : null;
          const imgStyle = window.getComputedStyle(img);
          const caixaStyle = caixa ? window.getComputedStyle(caixa) : null;
          return {
            img: {
              src: img.src,
              currentSrc: img.currentSrc,
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight,
              complete: img.complete,
              width: rect.width,
              height: rect.height,
              display: imgStyle.display,
              visibility: imgStyle.visibility,
              opacity: imgStyle.opacity,
              zIndex: imgStyle.zIndex,
              position: imgStyle.position
            },
            caixa: {
              width: caixaRect ? caixaRect.width : 0,
              height: caixaRect ? caixaRect.height : 0,
              background: caixaStyle ? caixaStyle.background : '',
              overflow: caixaStyle ? caixaStyle.overflow : ''
            },
            hasVideo: !!video,
            tagText: tag ? tag.textContent : null
          };
        })()`,
        returnByValue: true
      });
      console.log('MAPA DIAGNOSTIC:', JSON.stringify(res.result.value, null, 2));
      edge.kill();
      process.exit(0);
    };
  } catch (e) {
    console.error(e);
    edge.kill();
    process.exit(1);
  }
}, 1200);
