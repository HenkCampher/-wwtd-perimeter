import { head } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "No id provided" });

  try {
    const blob = await head(`shares/${id}.json`);
    if (!blob) return res.status(404).json({ error: "Not found" });

    const r = await fetch(blob.downloadUrl, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`
      }
    });
    if (!r.ok) {
      const errText = await r.text();
      console.error("Fetch error:", r.status, errText);
      return res.status(404).json({ error: "Could not fetch blob", status: r.status });
    }
    const data = await r.json();
    res.status(200).json(data);
  } catch(e) {
    console.error("Getshare error:", e.message);
    res.status(500).json({ error: e.message });
  }
}
