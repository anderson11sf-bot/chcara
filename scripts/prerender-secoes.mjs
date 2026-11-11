import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const distDir = path.resolve('dist');
const mimeTypes = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(4175, async () => {
  console.log('Dist server on 4175');
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new', '--remote-debugging-port=9222', '--no-first-run', '--disable-gpu', 'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1500));
  const targets = await (await fetch('http://127.0.0.1:9222/json/list')).json();
  const pageTarget = targets.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension://'));
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
  await send('Page.navigate', { url: 'http://localhost:4175' });
  await new Promise(r => setTimeout(r, 3000));

  const secoesHtml = await send('Runtime.evaluate', {
    expression: `document.getElementById('secoes')?.innerHTML`,
    returnByValue: true
  });

  const rodapeHtml = await send('Runtime.evaluate', {
    expression: `document.getElementById('rodape')?.innerHTML`,
    returnByValue: true
  });

  console.log('Secoes HTML length:', secoesHtml.result.value?.length);
  console.log('Rodape HTML length:', rodapeHtml.result.value?.length);

  if (secoesHtml.result.value && rodapeHtml.result.value) {
    const indexPath = path.resolve('index.html');
    let indexContent = fs.readFileSync(indexPath, 'utf-8');

    // Replace <div class="secoes" id="secoes">...</div>
    const secoesRegex = /<div class="secoes" id="secoes">[\s\S]*?<\/div>\s*<!-- =* 13\. RODAPÉ/i;
    const newSecoesBlock = `<div class="secoes" id="secoes">\n${secoesHtml.result.value}\n  </div>\n\n  <!-- =====================================================================\n       13. RODAPÉ`;
    indexContent = indexContent.replace(secoesRegex, newSecoesBlock);

    // Replace <footer class="rodape" id="rodape">...</footer>
    const rodapeRegex = /<footer class="rodape" id="rodape">[\s\S]*?<\/footer>/i;
    const newRodapeBlock = `<footer class="rodape" id="rodape">\n${rodapeHtml.result.value}\n  </footer>`;
    indexContent = indexContent.replace(rodapeRegex, newRodapeBlock);

    fs.writeFileSync(indexPath, indexContent, 'utf-8');
    console.log('Successfully pre-rendered secoes and rodape into index.html!');
  }

  ws.close();
  edge.kill();
  server.close();
});
