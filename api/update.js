import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Only POST allowed" });
  }

  try {
    const filePath = path.join(process.cwd(), "public", "products.json");

    if (!fs.existsSync(path.join(process.cwd(), "public"))) {
      fs.mkdirSync(path.join(process.cwd(), "public"));
    }

    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));

    console.log("✅ products.json uuendatud", new Date().toISOString());

    return res.status(200).json({ ok: true, message: "Products updated successfully" });
  } catch (err) {
    console.error("❌ Viga update.js failis:", err);
    return res.status(500).json({ ok: false, message: err.message });
  }
}
