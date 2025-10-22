import express from "express";
import fetch from "node-fetch";

const app = express();

// 🟢 Google Sheet ID
const SHEET_ID = "1YLwm-y_8wfLEJsMuBpqQtiptk3l3e8MLuoIOz_oV37Y";

// 🔹 Funktsioon, mis loeb ühe lehe CSV ja muudab JSONiks
async function readSheet(sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}&t=${Date.now()}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Sheet fetch failed: ${resp.status}`);
  const csv = await resp.text();

  const [headerLine, ...lines] = csv.trim().split("\n");
  const headers = headerLine.split(",").map(h => h.trim());
  const data = lines.map(line => {
    const values = line.split(",");
    const row = {};
    headers.forEach((h, i) => (row[h] = values[i] ? values[i].trim() : ""));
    return row;
  });

  return data;
}

// 🔹 Kõik lehed, mida soovime lugeda
const SHEETS = ["Products", "Orders", "Quotes", "Settings", "Shipping", "Invoices"];

// 🔹 Dünaamilised API teed
SHEETS.forEach(name => {
  app.get(`/${name.toLowerCase()}.json`, async (req, res) => {
    try {
      const data = await readSheet(name);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: `Cannot read sheet ${name}`, details: String(err) });
    }
  });
});

// 🔹 Testileht
app.get("/", (req, res) => {
  res.send(`
    <h2>✅ TiinaPood API töötab otse Google Sheetist!</h2>
    <ul>
      ${SHEETS.map(s => `<li><a href="/${s.toLowerCase()}.json">${s}</a></li>`).join("")}
    </ul>
  `);
});

export default app;
