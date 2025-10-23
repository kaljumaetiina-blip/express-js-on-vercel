import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Only POST allowed" });
  }

  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return res.status(400).json({ ok: false, message: "GitHub token missing" });
    }

    // GitHub repo info
    const owner = "kaljumaetiina-blip"; // ← sinu GitHub kasutajanimi
    const repo = "express-js-on-vercel"; // ← repo nimi
    const path = "products.json"; // faili nimi repogaas (praegu on otse juurkaustas)

    // toome olemasoleva faili info, et saada sha
    const getFile = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: { Authorization: `token ${token}` },
    });
    const fileData = await getFile.json();
    const sha = fileData.sha;

    // saadud JSON kirjutatakse GitHubi faili
    const update = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Auto update products.json",
        content: Buffer.from(JSON.stringify(req.body, null, 2)).toString("base64"),
        sha: sha,
      }),
    });

    if (update.ok) {
      console.log("✅ GitHubis products.json uuendatud");
      return res.status(200).json({ ok: true, message: "Products updated in GitHub" });
    } else {
      const text = await update.text();
      console.error("❌ GitHub update error:", text);
      return res.status(500).json({ ok: false, message: "GitHub update failed", detail: text });
    }
  } catch (err) {
    console.error("❌ Server error:", err);
    return res.status(500).json({ ok: false, message: err.message });
  }
}
