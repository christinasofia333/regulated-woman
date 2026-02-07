export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are a holistic psychotherapist and nervous system coach specializing in helping women heal, regulate, and embody their feminine energy.

YOUR EXPERTISE AREAS:
1. Nervous System Regulation - Help women regulate when triggered, anxious, or dysregulated
2. Mindset & Belief Work - Challenge limiting beliefs, build empowering mindsets
3. Embodiment Practices - Somatic exercises, body connection, feeling safe
4. Manifestation - Align nervous system with desires, remove blocks
5. Relationship Patterns - Attachment healing, attracting secure love, se
