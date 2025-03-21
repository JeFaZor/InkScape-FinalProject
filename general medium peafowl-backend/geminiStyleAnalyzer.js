// geminiStyleAnalyzer.js - גרסה מצומצמת ומהירה
const { GoogleGenerativeAI } = require('@google/generative-ai');

// שמות תצוגה של סגנונות קעקועים
const styleDisplayNames = {
  'traditional': 'Traditional',
  'new_school': 'New School',
  'anime': 'Anime',
  'fineline': 'Fineline',
  'geometric': 'Geometric',
  'micro_realism': 'Micro Realism',
  'realism': 'Realism',
  'dot_work': 'Dot Work',
  'dark_art': 'Dark Art',
  'flowers': 'Floral',
  'surrealism': 'Surrealism',
  'trash_polka': 'Trash Polka',
  'watercolor': 'Watercolor',
  'japanese': 'Japanese Traditional',
  'blackwork': 'Blackwork'
};

/**
 * אנליזת סגנון קעקוע באמצעות Gemini API - גרסה מהירה ומצומצמת
 */
async function analyzeWithGemini(imageBuffer, requestedStyles = null) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const imageBase64 = imageBuffer.toString('base64');
    
    // פרומפט מצומצם עם הדגשת Trash Polka
    const prompt = `
    Identify the tattoo style from: ${Object.values(styleDisplayNames).join(', ')}.
    
    Note: Trash Polka style has RED and BLACK colors with chaotic elements. 
    Realism style is photorealistic without abstract elements.
    
    Return only the style name.
    `;
    
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg",
      },
    };
    
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text().trim();
    
    // חיפוש התאמה בסגנונות
    let matchedStyle = null;
    let styleDisplayName = text;
    
    // הדגשה מיוחדת ל-Trash Polka
    if (text.toLowerCase().includes('trash polka')) {
      matchedStyle = 'trash_polka';
      styleDisplayName = 'Trash Polka';
    } else {
      // חיפוש התאמה בשאר הסגנונות
      for (const [key, value] of Object.entries(styleDisplayNames)) {
        if (value.toLowerCase() === text.toLowerCase() || 
            text.toLowerCase().includes(value.toLowerCase())) {
          matchedStyle = key;
          styleDisplayName = value;
          break;
        }
      }
    }
    
    // אם לא נמצאה התאמה, השתמש בברירת מחדל
    if (!matchedStyle) {
      matchedStyle = 'realism';
      styleDisplayName = 'Realism';
    }
    
    return {
      matchedStyle,
      confidenceScore: 0.85,
      styleDisplayName,
      alternativeStyles: []
    };
  } catch (error) {
    console.error('Error in Gemini analysis:', error);
    return {
      matchedStyle: 'realism',
      confidenceScore: 0.5,
      styleDisplayName: 'Realism',
      alternativeStyles: []
    };
  }
}

/**
 * בדיקה מהירה האם התמונה היא Trash Polka
 */
async function quickTrashPolkaCheck(imageBuffer) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const imageBase64 = imageBuffer.toString('base64');
    
    const prompt = `
    Is this tattoo in Trash Polka style (characterized by red and black colors, chaos, collage style)?
    Answer only 'yes' or 'no'.
    `;
    
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg",
      },
    };
    
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text().trim().toLowerCase();
    
    return text.includes('yes');
  } catch (error) {
    console.error('Error in quick check:', error);
    return false;
  }
}

/**
 * שיטת ניתוח מהירה
 */
async function fastStyleAnalysis(imageBuffer, requestedStyles = null) {
  // בדיקה מהירה האם זה Trash Polka
  const isTrashPolka = await quickTrashPolkaCheck(imageBuffer);
  
  if (isTrashPolka) {
    return {
      matchedStyle: 'trash_polka',
      confidenceScore: 0.9,
      styleDisplayName: 'Trash Polka',
      alternativeStyles: []
    };
  }
  
  // אם לא, הפעל את הניתוח הרגיל
  return analyzeWithGemini(imageBuffer, requestedStyles);
}

/**
 * ניתוח מאפייני תמונה - גרסה מצומצמת
 */
async function extractImageFeaturesWithGemini(imageBuffer) {
  return {
    isColorful: true,
    isBlackAndGrey: false,
    detectedLines: ["mixed"],
    hasFaces: false,
    dominantColorFamily: "mixed",
    hasVibrantColors: true,
    isHighContrast: false,
    isDarkToned: false
  };
}

/**
 * ניתוח תגים - גרסה מצומצמת
 */
async function analyzeTagsWithGemini(imageBuffer) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const imageBase64 = imageBuffer.toString('base64');
    
    const prompt = `
    List 3-5 relevant tags for this tattoo. Only return the tags as a comma-separated list.
    `;
    
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg",
      },
    };
    
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text().trim();
    
    // פירוק התשובה לרשימת תגים
    return text.split(',').map(tag => tag.trim());
  } catch (error) {
    console.error('Error analyzing tags:', error);
    return ["tattoo", "art", "design"];
  }
}

module.exports = {
  analyzeWithGemini,
  extractImageFeaturesWithGemini,
  analyzeTagsWithGemini,
  fastStyleAnalysis,
  styleDisplayNames
};