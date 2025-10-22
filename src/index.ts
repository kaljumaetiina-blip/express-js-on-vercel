import express from "express";
import fetch from "node-fetch";

const app = express();
const SHEET_ID = "1YLwm-y_8wfLEJsMuBpqQtiptk3l3e8MLuoIOz_oV37Y";

// universaalne funktsioon, mis loeb mis tahes lehe
async function readSheet(sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(sheetName)}&t=${Date.now()}`;
  const txt = await fetch(url).then(r => r.text());
  const json = JSON.parse(txt.substring(txt.indexOf("{"), txt.lastIndexOf("}") + 1));
  const headers = json.table.cols.map(c => c.label);
  const rows = json.table.rows.map(r =>
    Object.fromEntries(
      headers.map((h, i) => [h, r.c[i] ? r.c[i].v : ""])
    )
  );
  return rows.filter(r => r.SKU || r.Name); // välista tühjad
}

// /products.json → loeb Products lehe
app.get("/products.json", async (req, res) => {
  try {
    const data = await readSheet("Products");
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Viga Google Sheeti lugemisel" });
  }
});

// /quotes.json → loeb Quotes lehe
app.get("/quotes.json", async (req, res) => {
  try {
    const data = await readSheet("Quotes");
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Quotes lehe lugemine ebaõnnestus" });
  }
});

// test
app.get("/", (req, res) => {
  res.send("✅ Server töötab ja loeb andmeid otse Google Sheetist!");
});

export default app;
