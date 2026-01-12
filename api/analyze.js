module.exports = async function handler(req, res) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Only POST
  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

  try {
    const { mealDescription } = req.body || {};
    if (!mealDescription || typeof mealDescription !== "string") {
      res.status(400).json({ success: false, error: "Missing meal description" });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ success: false, error: "API key not configured" });
      return;
    }

    const model = "models/gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1/${model}:generateContent?key=${apiKey}`;

    // Timeout guard
    const controller = new AbortController();
    const timeoutMs = 15000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  "אתה תזונאי מומחה. נתח את הארוחה הבאה: " +
                  mealDescription +
                  ". ספק ניתוח מפורט בעברית עם: (1) פירוט רכיבים ומשמעויות, (2) הערכת מאקרו משוערת (חלבון/פחמימות/שומן), (3) דירוג 1-10, (4) המלצות לשיפור, (5) תחליפים בריאים. כתוב ברור וקצר בסעיפים."
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 900
        }
      })
    });

    clearTimeout(timeoutId);

    // Read raw text first (prevents "Unexpected end of JSON input" crash)
    const raw = await response.text();

    console.log("Gemini status:", response.status);
    console.log("Gemini raw body (first 2000 chars):", (raw || "").slice(0, 2000));

    // Try parse JSON safely
    let data = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch (e) {
      throw new Error(`Gemini returned non-JSON response (status ${response.status})`);
    }

    if (!response.ok) {
      const msg = data?.error?.message || `API request failed (status ${response.status})`;
      throw new Error(msg);
    }

    // Extract text robustly
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const analysis = parts
      .map((p) => (typeof p?.text === "string" ? p.text : ""))
      .filter(Boolean)
      .join("\n")
      .trim();

    if (!analysis) {
      throw new Error("No analysis returned");
    }

    res.status(200).json({ success: true, analysis });
  } catch (error) {
    // Handle abort
    if (error && String(error.name) === "AbortError") {
      res.status(504).json({ success: false, error: "Gemini request timed out" });
      return;
    }

    console.error("Analyze error:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Internal server error"
    });
  }
};
