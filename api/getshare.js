export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "No id provided" });

  try {
    const url = `https://public.blob.vercel-storage.com/shares/${id}.json`;
    const r = await fetch(url);
    if (!r.ok) return res.status(404).json({ error: "Not found" });
    const data = await r.json();
    res.status(200).json(data);
  } catch(e) {
    res.status(500).json({ error: "Failed to retrieve share" });
  }
}
