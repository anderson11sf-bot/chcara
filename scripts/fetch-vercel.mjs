const res = await fetch('https://chcara.vercel.app/?nocache=' + Date.now(), {
  headers: { 'Cache-Control': 'no-cache' }
});
const html = await res.text();
console.log('HTML status:', res.status);
console.log('HTML length on Vercel:', html.length);
const secoesMatch = html.match(/<div class="secoes" id="secoes">([\s\S]*?)<\/div>/i);
console.log('Secoes match length:', secoesMatch ? secoesMatch[1].length : 'none');
const scripts = html.match(/<script[^>]*src="([^"]+)"/g);
console.log('Scripts:', scripts);
