module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only POST
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const { mealDescription } = req.body || {};
    if (!mealDescription) {
      res.status(400).json({ success: false, error: 'Missing meal description' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ success: false, error: 'API key not configured' });
      return;
    }
    const model = "models/gemini-2.5-flash";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    'אתה תזונאי מומחה. נתח את הארוחה הבאה: ' +
                    mealDescription +
                    '. ספק ניתוח מפורט בעברית עם דירוג, המלצות ותחליפים.',
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 900,
          },
        }),
      }
    );

    const data = await response.json();

    // חשוב: נראה את המבנה שחוזר בפועל
    console.log('Gemini status:', response.status);
    console.log('Gemini raw response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(data?.error?.message || `API request failed (status ${response.status})`);
    }

    // חילוץ טקסט בצורה עמידה
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const analysis = parts
      .map((p) => p?.text)
      .filter(Boolean)
      .join('\n')
      .trim();

    if (!analysis) {
      // לעזור בדיבוג: להראות מה כן הגיע
      throw new Error('No analysis returned');
    }

    res.status(200).json({ success: true, analysis });
  } catch (error) {
    console.error('Analyze error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Internal server error',
    });
  }
};
