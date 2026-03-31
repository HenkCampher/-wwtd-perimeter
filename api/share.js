import { put } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { input, output, level, format } = req.body;
  if (!output) return res.status(400).json({ error: "No output to share" });

  const id = Math.random().toString(36).slice(2, 10);
  const data = JSON.stringify({ id, input, output, level, format, ts: new Date().toISOString() });

  await put(`shares/${id}.json`, data, { access: "public" });

  res.status(200).json({ id });
}
