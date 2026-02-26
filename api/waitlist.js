export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  const trimmed = email.trim().toLowerCase();
  if (!trimmed) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return res.status(500).json({ error: 'Server not configured. Add SUPABASE_URL and SUPABASE_ANON_KEY in Vercel.' });
  }

  try {
    const response = await fetch(`${url}/rest/v1/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ email: trimmed }),
    });

    if (response.status === 409) {
      return res.status(409).json({ error: 'already_exists' });
    }
    if (!response.ok) {
      const text = await response.text();
      console.error('Supabase error:', response.status, text);
      return res.status(500).json({ error: text || 'Failed to save email' });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Waitlist error:', err);
    return res.status(500).json({ error: err.message || 'Failed to save email' });
  }
}
