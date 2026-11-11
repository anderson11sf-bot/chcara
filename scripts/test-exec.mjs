import { spawn } from 'node:child_process';

const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless=new', '--remote-debugging-port=9222', '--no-first-run', '--disable-gpu', 'about:blank'
]);
await new Promise(r => setTimeout(r, 1500));
const targets = await (await fetch('http://127.0.0.1:9222/json/list')).json();
const pageTarget = targets.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension://'));
console.log('Attaching to page target:', pageTarget);
const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);

ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  if (data.method === 'Runtime.exceptionThrown') {
    console.log('EXCEPTION:', JSON.stringify(data.params.exceptionDetails, null, 2));
  }
  if (data.method === 'Runtime.consoleAPICalled') {
    console.log('CONSOLE:', data.params.type, data.params.args.map(a => a.value || a.description));
  }
};

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
await send('Console.enable');

await send('Page.navigate', { url: 'https://chcara.vercel.app' });
await new Promise(r => setTimeout(r, 4000));

const evalRes = await send('Runtime.evaluate', {
  expression: `JSON.stringify({
    url: window.location.href,
    title: document.title,
    pdOk: document.documentElement.dataset.pdOk,
    pdErro: document.documentElement.dataset.pdErro,
    bodyClass: document.body.className,
    heroHeight: document.getElementById('hero')?.offsetHeight,
    secaoCenasHeight: document.getElementById('secao-cenas')?.offsetHeight,
    secoesConteudoExists: !!document.getElementById('secoes-conteudo'),
    secoesConteudoHeight: document.getElementById('secoes-conteudo')?.offsetHeight,
    secoesConteudoChildren: document.getElementById('secoes-conteudo')?.children.length,
    allSections: Array.from(document.querySelectorAll('section')).map(s => ({
      id: s.id,
      className: s.className,
      height: s.offsetHeight,
      children: s.children.length,
      firstText: s.innerText?.slice(0, 50)
    })),
    windowInnerHeight: window.innerHeight,
    docScrollHeight: document.documentElement.scrollHeight
  })`,
  returnByValue: true
});
console.log('DOM STATE:\n', JSON.stringify(JSON.parse(evalRes.result.value), null, 2));

// Take screenshot of top
const ssTop = await send('Page.captureScreenshot', { format: 'png' });
import fs from 'node:fs';
fs.writeFileSync('test_ss_top.png', Buffer.from(ssTop.data, 'base64'));

// Scroll to 2500px and take screenshot
await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 2500)' });
await new Promise(r => setTimeout(r, 1000));
const ssMid = await send('Page.captureScreenshot', { format: 'png' });
fs.writeFileSync('test_ss_mid.png', Buffer.from(ssMid.data, 'base64'));

// Scroll to 6000px and take screenshot
await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 6000)' });
await new Promise(r => setTimeout(r, 1000));
const ssFar = await send('Page.captureScreenshot', { format: 'png' });
fs.writeFileSync('test_ss_far.png', Buffer.from(ssFar.data, 'base64'));

ws.close();
edge.kill();
