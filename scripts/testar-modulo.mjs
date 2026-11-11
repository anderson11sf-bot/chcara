import { spawn } from 'node:child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const edge = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-gpu',
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const versionRes = await fetch('http://127.0.0.1:9222/json/list');
  const targets = await versionRes.json();
  const pageTarget = targets.find(t => t.type === 'page');
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let msgId = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };

  await new Promise(r => ws.onopen = r);

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');

  await send('Page.navigate', { url: 'https://chcara.vercel.app' });
  await new Promise(r => setTimeout(r, 2500));

  const res = await send('Runtime.evaluate', {
    expression: `(function() {
      try {
        return window.__PD ? 'PD_EXISTS' : 'NO_PD';
      } catch(e) {
        return 'ERR: ' + e.message;
      }
    })()`,
    returnByValue: true
  });

  console.log('WINDOW.__PD:', JSON.stringify(res, null, 2));

  // Check document.readyState
  const res2 = await send('Runtime.evaluate', {
    expression: `document.readyState`,
    returnByValue: true
  });
  console.log('READY_STATE:', JSON.stringify(res2, null, 2));

  // Let's check what scripts are in the DOM and if any failed
  const res3 = await send('Runtime.evaluate', {
    expression: `(function() {
      const scripts = Array.from(document.scripts).map(s => s.src || s.textContent.slice(0, 30));
      return JSON.stringify(scripts);
    })()`,
    returnByValue: true
  });
  console.log('SCRIPTS:', res3.result?.value);

  ws.close();
} catch (e) {
  console.error(e);
} finally {
  edge.kill('SIGKILL');
}
