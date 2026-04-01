import { put, head } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { event, level, format } = req.body;
    if (!event) return res.status(400).json({ error: "No event provided" });

    // Get existing stats or start fresh
    let stats = {
      total_rewrites: 0,
      levels: {},
      formats: {},
      sharpen_started: 0,
      sharpen_completed: 0,
      get_link: 0,
      last_updated: null
    };

    try {
      const blob = await head("stats/counts.json");
      const r = await fetch(blob.downloadUrl, {
        headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
      });
      if (r.ok) stats = await r.json();
    } catch(e) {
      // No stats file yet, use defaults
    }

    // Increment the right counter
    if (event === "rewrite") {
      stats.total_rewrites = (stats.total_rewrites || 0) + 1;
      if (level) stats.levels[level] = (stats.levels[level] || 0) + 1;
      if (format) stats.formats[format] = (stats.formats[format] || 0) + 1;
    } else if (event === "sharpen_started") {
      stats.sharpen_started = (stats.sharpen_started || 0) + 1;
    } else if (event === "sharpen_completed") {
      stats.sharpen_completed = (stats.sharpen_completed || 0) + 1;
    } else if (event === "get_link") {
      stats.get_link = (stats.get_link || 0) + 1;
    }

    stats.last_updated = new Date().toISOString();

    await put("stats/counts.json", JSON.stringify(stats), { access: "private" });

    res.status(200).json({ ok: true });
  } catch(e) {
    console.error("Track error:", e.message);
    res.status(500).json({ error: e.message });
  }
}
