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
  const events = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      events.push({ type: 'CONSOLE', params: msg.params });
    } else if (msg.method === 'Runtime.exceptionThrown') {
      events.push({ type: 'EXCEPTION', text: msg.params.exceptionDetails });
    } else if (msg.method === 'Network.responseReceived') {
      events.push({ type: 'RESPONSE', url: msg.params.response.url, status: msg.params.response.status });
    } else if (msg.method === 'Network.loadingFailed') {
      events.push({ type: 'NET_FAIL', url: msg.params });
    }
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

  await send('Network.enable');
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Console.enable');

  console.log('Navigating to https://chcara.vercel.app ...');
  await send('Page.navigate', { url: 'https://chcara.vercel.app' });

  await new Promise(r => setTimeout(r, 4000));

  console.log('--- CAPTURED EVENTS ---');
  for (const ev of events) {
    if (ev.type === 'EXCEPTION') {
      console.log('EXCEPTION:', JSON.stringify(ev.text));
    } else if (ev.type === 'CONSOLE') {
      console.log('CONSOLE:', ev.params.type, ev.params.args.map(a => a.value || a.description));
    } else if (ev.type === 'RESPONSE' && ev.status >= 400) {
      console.log('HTTP ERROR:', ev.status, ev.url);
    } else if (ev.type === 'NET_FAIL') {
      console.log('NET FAIL:', JSON.stringify(ev.url));
    }
  }

  const scripts = await send('Runtime.evaluate', {
    expression: `Array.from(document.querySelectorAll('script')).map(s => ({ src: s.src, type: s.type }))`,
    returnByValue: true
  });
  console.log('SCRIPTS IN DOM:', scripts.result.value);

  ws.close();
} catch (e) {
  console.error(e);
} finally {
  edge.kill('SIGKILL');
}
