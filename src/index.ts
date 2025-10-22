import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 🟢 Serveeri avaliku kausta sisu (nt products.json, logo, CSS)
app.use(express.static(path.join(__dirname, '..', 'public')));

// 🏠 Avaleht (lihtne test HTML)
app.get('/', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html lang="et">
      <head>
        <meta charset="utf-8"/>
        <title>Tiina Express API</title>
        <style>
          body { font-family: Georgia, serif; margin: 40px; color: #333; background: #faf7f5; }
          nav a { margin-right: 15px; color: #4b2e2e; text-decoration: none; font-weight: bold; }
          nav a:hover { text-decoration: underline; }
          code { background: #f1f1f1; padding: 2px 6px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <nav>
          <a href="/">Avaleht</a>
          <a href="/products.json">Tooted JSON</a>
          <a href="/api/healthz">Tervis</a>
        </nav>
        <h1>🧶 Tiina Butiigi API töötab!</h1>
        <p>Proovi <a href="/products.json">/products.json</a> – näed tooteandmeid otse Vercelist.</p>
      </body>
    </html>
  `);
});

// ❤️ Kontroll, et server töötab
app.get('/api/healthz', (req, res) => {
  res.status(200).json({
    status: 'ok',
    time: new Date().toISOString(),
  });
});

// ⚙️ Kui keegi läheb tundmatule aadressile
app.use((req, res) => {
  res.status(404).json({ error: 'Lehte ei leitud' });
});

export default app;
