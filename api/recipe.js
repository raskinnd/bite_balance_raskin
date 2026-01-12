// Vercel Serverless Function for Recipe Generation - Google Gemini (Free!)
//export default async function handler(req, res) {
module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { mealDescription } = req.body;

    if (!mealDescription) {
      return res.status(400).json({ error: 'Missing meal description' });
    }

    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Call Google Gemini API for recipe generation
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `אתה שף מומחה. צור מתכון מפורט לארוחה הבאה: ${mealDescription}

חשוב מאוד: המתכון חייב לעמוד בקווים המנחים הבאים:
- תזונה מאוזנת עם עומס גליקמי נמוך
- עדיפות למזון מלא ולא מעובד
- איזון בין חלבונים, פחמימות מורכבות ושומנים בריאים
- הימנעות ממזון מעובד, סוכר מוסף ופחמימות פשוטות

ספק מתכון הכולל:
1. שם המנה
2. זמן הכנה
3. מרכיבים (כמויות מדויקות)
4. הוראות הכנה צעד אחר צעד
5. טיפים תזונתיים

וודא שכל המרכיבים מופיעים ברשימת המזונות המותרים!`
          }]
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'API request failed');
    }

    // Extract recipe from Gemini response
    const recipe = data.candidates[0].content.parts[0].text;

    // Return the recipe
    res.status(200).json({
      success: true,
      recipe: recipe
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Internal server error' 
    });
  }
}
