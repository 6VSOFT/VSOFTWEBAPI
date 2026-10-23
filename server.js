// Serves sales-invoice.html and forwards /api/* to the VSOFT gateway (avoids browser CORS).
// Run: node server.js   then open http://127.0.0.1:8765/sales-invoice.html
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8765;
const ALLOWED_HOST = 'vsoftapi.vsoft2u.my';

http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith('/api/')) {
      const base = req.headers['x-target-base'];
      let target;
      try { target = new URL(base); } catch { target = null; }
      if (!target || target.hostname !== ALLOWED_HOST) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        return res.end('X-Target-Base must be a ' + ALLOWED_HOST + ' URL');
      }
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const headers = {};
      for (const h of ['content-type', 'authorization', 'x-api-key', 'appid']) {
        if (req.headers[h]) headers[h] = req.headers[h];
      }
      const upstream = await fetch(target.origin + req.url, {
        method: req.method,
        headers,
        body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks)
      });
      const buf = Buffer.from(await upstream.arrayBuffer());
      res.writeHead(upstream.status, { 'Content-Type': upstream.headers.get('content-type') || 'application/json' });
      return res.end(buf);
    }
    const name = req.url.split('?')[0] === '/' ? '/sales-invoice.html' : req.url.split('?')[0];
    const file = path.join(__dirname, path.basename(name));
    if (!fs.existsSync(file) || !file.endsWith('.html')) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(file).pipe(res);
  } catch (e) {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Proxy error: ' + e.message);
  }
}).listen(PORT, '127.0.0.1', () => console.log('http://127.0.0.1:' + PORT + '/sales-invoice.html'));
