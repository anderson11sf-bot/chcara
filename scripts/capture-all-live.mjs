import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

async function runCapture() {
  const tempProfile = path.join(process.env.TEMP || 'C:\\Temp', 'edge_screen_profile_' + Date.now());
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${tempProfile}`,
    '--disable-gpu',
    '--window-size=1280,800',
    'about:blank'
  ]);

  let targets = null;
  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 600));
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
  await send('Page.navigate', { url: 'https://chcara.vercel.app' });
  await new Promise(r => setTimeout(r, 4000));

  // Desktop captures
  const desktopCaptures = [
    { name: 'desktop_01_hero', selector: '#hero' },
    { name: 'desktop_02_sessao2', selector: '#secao-cenas' },
    { name: 'desktop_03_vsl', selector: '#efeito-paraiso' },
    { name: 'desktop_04_glebas', selector: '#propriedades' },
    { name: 'desktop_05_infra', selector: '#infraestrutura' },
    { name: 'desktop_06_projetos', selector: '#possibilidades' },
    { name: 'desktop_07_autossuf', selector: '#autossuficiencia' },
    { name: 'desktop_08_patrimonio', selector: '#compartilhar' },
    { name: 'desktop_09_localizacao', selector: '#localizacao' },
    { name: 'desktop_10_contato', selector: '#contato' }
  ];

  for (const target of desktopCaptures) {
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('${target.selector}');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));
    const ss = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`scripts/${target.name}.png`, Buffer.from(ss.data, 'base64'));
    console.log(`Saved screenshot: scripts/${target.name}.png`);
  }

  // Switch to Mobile Emulation (390 x 844)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 1000));

  const mobileCaptures = [
    { name: 'mobile_01_hero', selector: '#hero' },
    { name: 'mobile_02_sessao2', selector: '#secao-cenas' },
    { name: 'mobile_04_glebas', selector: '#propriedades' },
    { name: 'mobile_06_projetos', selector: '#possibilidades' },
    { name: 'mobile_07_autossuf', selector: '#autossuficiencia' },
    { name: 'mobile_10_contato', selector: '#contato' }
  ];

  for (const target of mobileCaptures) {
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('${target.selector}');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));
    const ss = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`scripts/${target.name}.png`, Buffer.from(ss.data, 'base64'));
    console.log(`Saved screenshot: scripts/${target.name}.png`);
  }

  ws.close();
  edge.kill();
  console.log('All live captures finished!');
}

runCapture().catch(console.error);
