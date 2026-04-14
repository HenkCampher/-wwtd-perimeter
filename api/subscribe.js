export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Invalid email' });

  const response = await fetch('https://api.beehiiv.com/v2/publications/pub_96fded85-c4dd-44bd-8f74-97d344b1f94a/subscriptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`,
    },
    body: JSON.stringify({
      email,
      send_welcome_email: true,
      double_opt_override: 'off',
      utm_source: 'wwtd-tool',
      utm_medium: 'tool-signup',
      utm_campaign: 'beta',
    }),
  });

  const data = await response.json();
  if (!response.ok) return res.status(500).json({ error: data });
  return res.status(200).json({ success: true });
}
