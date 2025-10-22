import express from "express";
import fetch from "node-fetch";

const app = express();

// 🔹 Google Sheet andmete allikas
const SHEET_ID = "1YLwm-y_8wfLEJsMuBpqQtiptk3l3e8MLuoIOz_oV37Y";
const SHEET_NAME = "Products";

// 🔹 JSON API – loeb otse Google Sheetist
app.get("/products.json", async (req, res) => {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;
    const response = await fetch(url);
    const text = await response.text();
    const json = JSON.parse(text.substr(47).slice(0, -2));
    const rows = json.table.rows;

    const items = rows
      .map((r) => r.c.map((c) => (c ? c.v : "")))
      .filter((r) => r[0] && String(r[6]).toUpperCase() === "TRUE")
      .map((v) => ({
        sku: v[0],
        name: v[1],
        price: Number(v[2]) || 0,
        stock: Number(v[3]) || 0,
        image: v[4],
        category: v[5],
        active: true,
        url: v[7],
        ship_fee: Number(v[8]) || 0,
        ship_fee_courier: Number(v[9]) || 0,
        shipClass: v[10],
        size: v[11],
        material: v[12],
        story: v[13],
        bullets: v[14],
        care: v[15],
        description: v[16],
        notice: v[17],
        subcategory: v[18],
        highlight: String(v[19]).toUpperCase() === "TRUE",
        blog_url: v[20],
        category_url: v[21],
        category_label: v[22],
      }));

    res.json(items);
  } catch (err) {
    console.error("❌ API viga:", err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

// Avaleht
app.get("/", (req, res) => {
  res.type("html").send(`
    <h1>Tiina Butiigi API</h1>
    <p>✅ Ühendatud Google Sheetiga (${SHEET_NAME})</p>
    <p><a href="/products.json" target="_blank">Vaata kõiki tooteid JSON-kujul</a></p>
  `);
});

export default app;
