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

server.listen(4180, async () => {
  const tempProfile = path.join(process.env.TEMP || 'C:\\Temp', 'edge_metrics_' + Date.now());
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${tempProfile}`,
    '--disable-gpu',
    'about:blank'
  ]);

  let targets = null;
  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 600));
    try {
      const res = await fetch('http://127.0.0.1:9223/json/list');
      if (res.ok) {
        targets = await res.json();
        if (targets && targets.length > 0) break;
      }
    } catch {}
  }

  if (!targets) {
    console.error('Edge failed to start');
    edge.kill();
    server.close();
    process.exit(1);
  }

  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
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
  await send('Network.enable');
  await send('Performance.enable');

  let totalBytes = 0;
  let requestsCount = 0;
  const mimeCounts = {};

  ws.addEventListener('message', (msg) => {
    const data = JSON.parse(msg.data);
    if (data.method === 'Network.responseReceived') {
      requestsCount++;
      const mime = data.params.response.mimeType || 'unknown';
      mimeCounts[mime] = (mimeCounts[mime] || 0) + 1;
    }
    if (data.method === 'Network.dataReceived') {
      totalBytes += data.params.dataLength;
    }
  });

  await send('Page.navigate', { url: 'http://localhost:4180' });
  await new Promise(r => setTimeout(r, 4000));

  const timing = await send('Runtime.evaluate', {
    expression: 'JSON.stringify(performance.getEntriesByType("navigation")[0])',
    returnByValue: true
  });

  const perfMetrics = await send('Performance.getMetrics');

  console.log('=== BASELINE PERFORMANCE METRICS ===');
  console.log('Total Transferred Bytes (4s window):', (totalBytes / 1024 / 1024).toFixed(2), 'MB');
  console.log('Total Requests:', requestsCount);
  console.log('Requests by MIME:', JSON.stringify(mimeCounts, null, 2));
  console.log('Navigation Timing:', timing.result.value);
  console.log('Performance Metrics:', JSON.stringify(perfMetrics.metrics.filter(m => ['Timestamp', 'Documents', 'Frames', 'JSEventListeners', 'Nodes', 'LayoutCount', 'RecalcStyleCount', 'LayoutDuration', 'RecalcStyleDuration', 'ScriptDuration', 'TaskDuration', 'JSHeapUsedSize'].map(k => k).includes(m.name)), null, 2));

  ws.close();
  edge.kill();
  server.close();
  process.exit(0);
});
