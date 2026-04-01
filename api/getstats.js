import { head } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const blob = await head("stats/counts.json");
    const r = await fetch(blob.downloadUrl, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
    });
    if (!r.ok) return res.status(404).json({ error: "No stats yet" });
    const data = await r.json();
    res.status(200).json(data);
  } catch(e) {
    res.status(404).json({ error: "No stats yet" });
  }
}
