import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Only POST allowed" });
  }

  try {
    console.log("📦 Saabunud tellimus:", req.body);

    const GAS_URL =
      "https://script.google.com/macros/s/AKfycbxqhWKuOBvzu4FycrcNW6oJ-U0n1LbdA-Gibu1gj3bM_3yjJUh6olF2i_0vycxLLxrQ0A/exec?action=checkout";

    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();
    console.log("✅ Google Script vastas:", text);

    try {
      const json = JSON.parse(text);
      return res.status(200).json(json);
    } catch {
      return res.status(200).send(text);
    }
  } catch (err) {
    console.error("❌ Checkout viga:", err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
