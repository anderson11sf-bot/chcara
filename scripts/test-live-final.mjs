import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless=new',
  '--remote-debugging-port=9225',
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
        const res = await fetch('http://127.0.0.1:9225/json/list');
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
    // Bypass cache to get fresh deployment
    await send('Network.enable');
    await send('Network.setCacheDisabled', { cacheDisabled: true });
    await send('Page.navigate', { url: 'https://chcara.vercel.app/?v=' + Date.now() });
    await new Promise(r => setTimeout(r, 4500));

    // Check Rodapé
    const rodapeInfo = await send('Runtime.evaluate', {
      expression: `(() => {
        const rodape = document.querySelector('.rodape');
        const marca = document.querySelector('.rodape__marca');
        const logo = document.querySelector('.rodape__logo-img');
        const nome = document.querySelector('.rodape__nome');
        const s1 = window.getComputedStyle(rodape);
        const s2 = window.getComputedStyle(marca);
        const s3 = window.getComputedStyle(nome);
        return {
          rodapeTextCenter: s1.textAlign,
          marcaAlignItems: s2.alignItems,
          nomeTextCenter: s3.textAlign,
          logoWidth: logo ? logo.clientWidth : 0
        };
      })()`,
      returnByValue: true
    });
    console.log('LIVE Rodape:', JSON.stringify(rodapeInfo.result.value, null, 2));

    // Scroll to footer & screenshot
    await send('Runtime.evaluate', {
      expression: `document.getElementById('rodape').scrollIntoView({ behavior: 'instant' })`
    });
    await new Promise(r => setTimeout(r, 1000));
    const ssFooter = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/live_verified_footer.png', Buffer.from(ssFooter.data, 'base64'));

    // Check Mapa
    const mapaInfo = await send('Runtime.evaluate', {
      expression: `(() => {
        const secao4 = document.getElementById('propriedades');
        const img = secao4 ? secao4.querySelector('.mapa-oficial-img') : null;
        const tag = secao4 ? secao4.querySelector('.mapa-oficial-tag') : null;
        const hasTagText = document.body.innerText.includes('MAPA OFICIAL DE DEMARCAÇÃO');
        return {
          hasSecao4: !!secao4,
          hasImg: !!img,
          imgSrc: img ? img.src : null,
          imgLoaded: img ? img.complete : false,
          hasTagElement: !!tag,
          hasTagTextInBody: hasTagText
        };
      })()`,
      returnByValue: true
    });
    console.log('LIVE Mapa:', JSON.stringify(mapaInfo.result.value, null, 2));

    // Scroll to #propriedades & screenshot
    await send('Runtime.evaluate', {
      expression: `document.getElementById('propriedades').scrollIntoView({ behavior: 'instant' })`
    });
    await new Promise(r => setTimeout(r, 1000));
    const ssMapa = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/live_verified_mapa.png', Buffer.from(ssMapa.data, 'base64'));

    console.log('Screenshots live_verified_footer.png and live_verified_mapa.png saved!');

    ws.close();
    edge.kill();
    process.exit(0);
  } catch (e) {
    console.error(e);
    edge.kill();
    process.exit(1);
  }
}, 1200);
