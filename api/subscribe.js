export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  try {
    const response = await fetch('https://api.beehiiv.com/v2/publications/pub_96fded85-c4dd-44bd-8f74-97d344b1f94a/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`
      },
      body: JSON.stringify({ email, reactivate_existing: false, send_welcome_email: false })
    });
    if (response.ok) return res.status(200).json({ success: true });
    const err = await response.json();
    return res.status(400).json({ error: err });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
