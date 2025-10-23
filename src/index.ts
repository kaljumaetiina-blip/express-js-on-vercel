import express from "express";
import fetch from "node-fetch";

const app = express();

// 🔹 Google Sheet JSON URL
const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1YLwm-y_8wfLEJsMuBpqQtiptk3l3e8MLuoIOz_oV37Y/gviz/tq?tqx=out:json&tq&gid=0";

// 🔹 Andmete laadimine Google Sheetist
app.get("/products.json", async (req, res) => {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();

    // puhastame Google'i JSON-i (ta algab "/*O_o*/" ja lõppeb ")")
    const json = JSON.parse(text.substr(47).slice(0, -2));

    const rows = json.table.rows.map((r) =>
      r.c.map((c) => (c ? c.v : ""))
    );

    const headers = json.table.cols.map((c) => c.label);
    const items = rows.map((r) => {
      let obj: any = {};
      headers.forEach((h, i) => (obj[h] = r[i]));
      return obj;
    });

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Tabelit ei õnnestunud lugeda" });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("✅ Tiina Butiigi API töötab. Ava /products.json, et näha tooteid!");
});

export default app;
