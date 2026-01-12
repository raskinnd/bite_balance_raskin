# 🍽️ BiteBalance - מנתח תזונה חכם

אפליקציה לניתוח ארוחות ומתן המלצות תזונתיות מבוססות AI.

🎉 **משתמש ב-Google Gemini - חינמי לגמרי!**

## 🚀 פריסה ל-Vercel (חינמי!)

### שלב 1: הכנה
1. צור חשבון ב-[Vercel](https://vercel.com) (חינמי)
2. צור חשבון ב-[Google AI Studio](https://aistudio.google.com) (חינמי)

### שלב 2: קבל מפתח API של Gemini (חינמי!)
1. גש ל-[Google AI Studio](https://aistudio.google.com/app/apikey)
2. לחץ **"Create API Key"**
3. בחר פרויקט קיים או צור חדש
4. **העתק את המפתח** - זה נראה כך: `AIzaSy...`
5. שמור את המפתח - תצטרך אותו בשלב הבא

💡 **זה חינמי לגמרי! אין צורך בכרטיס אשראי!**

### שלב 3: פריסה

#### אופציה A: דרך הממשק (מומלץ למתחילים)
1. העלה את כל הקבצים ל-GitHub repository
2. גש ל-[Vercel](https://vercel.com)
3. לחץ על "Add New Project"
4. בחר את ה-repository שלך
5. בהגדרות Environment Variables הוסף:
   - **שם**: `GEMINI_API_KEY`
   - **ערך**: המפתח שקיבלת מ-Google AI Studio
6. לחץ על "Deploy"

#### אופציה B: דרך CLI
1. פתח terminal בתיקיית הפרויקט
2. הרץ:
   ```bash
   vercel
   ```
3. עקוב אחר ההוראות
4. הוסף את המפתח:
   ```bash
   vercel env add GEMINI_API_KEY
   ```
5. הדבק את המפתח של Gemini
6. Deploy:
   ```bash
   vercel --prod
   ```

### שלב 4: זהו! 🎉
האפליקציה שלך עכשיו חיה באינטרנט!
Vercel ייתן לך כתובת URL כמו: `https://your-app-name.vercel.app`

## 📁 מבנה הקבצים

```
├── nutrition-analyzer.html    # האפליקציה הראשית
├── vercel.json                # הגדרות Vercel
└── api/
    ├── analyze.js            # ניתוח ארוחות (Gemini)
    ├── recognize.js          # זיהוי תמונות (Gemini)
    └── recipe.js             # יצירת מתכונים (Gemini)
```

## ⚙️ איך זה עובד?

1. **Frontend** (HTML) - מריץ בדפדפן של המשתמש
2. **Serverless Functions** (api/*.js) - רצות ב-Vercel
3. **Google Gemini API** - מספק את ה-AI (חינמי!)

המפתח נשמר בצורה מאובטחת ב-Vercel ולא נחשף למשתמשים!

## 💰 עלויות

- **Vercel**: חינמי לגמרי לפרויקטים אישיים
- **Google Gemini**: 
  - ✅ **חינמי לגמרי!**
  - ✅ 15 בקשות לדקה
  - ✅ 1,500 בקשות ליום
  - ✅ ללא צורך בכרטיס אשראי
  - ✅ מספיק למאות משתמשים

## 🔒 אבטחה

- מפתח ה-API נשמר רק בשרת (Vercel)
- המשתמשים לא יכולים לראות או לגשת למפתח
- כל הקריאות ל-API עוברות דרך השרת שלך

## 🛠️ פתרון בעיות

**בעיה**: "API key not configured"
- **פתרון**: וודא שהוספת את `GEMINI_API_KEY` ב-Environment Variables

**בעיה**: האפליקציה לא עובדת
- **פתרון**: בדוק ב-Vercel Logs (Dashboard → Your Project → Logs)

**בעיה**: שגיאה 429 (Too Many Requests)
- **פתרון**: המתן מעט - הגעת למגבלת ה-API (15 בקשות לדקה)

## 📞 תמיכה

- [Vercel Docs](https://vercel.com/docs)
- [Google AI Studio Docs](https://ai.google.dev/tutorials/get_started_web)

---

**נוצר עם ❤️ בעזרת Claude**
