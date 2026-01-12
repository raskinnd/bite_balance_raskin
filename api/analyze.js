//export default async function handler(req, res) {
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { mealDescription } = req.body;
    if (!mealDescription) {
      return res.status(400).json({ error: 'Missing meal description' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'אתה תזונאי מומחה. נתח את הארוחה הבאה: ' + mealDescription + '. ספק ניתוח מפורט בעברית עם דירוג, המלצות ותחליפים.'
          }]
        }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'API request failed');
    }

    const analysis = data.candidates[0].content.parts[0].text;

    res.status(200).json({
      success: true,
      analysis: analysis
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Internal server error' 
    });
  }
}