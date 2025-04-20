// geminiStyleAnalyzer.js - compact and fast version
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Display names of tattoo styles
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
 * Tattoo style analysis using Gemini API - fast and compact version
 */
async function analyzeWithGemini(imageBuffer, requestedStyles = null) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const imageBase64 = imageBuffer.toString('base64');
    
    // Compact prompt with emphasis on Trash Polka
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
    
    // Search for style match
    let matchedStyle = null;
    let styleDisplayName = text;
    
    // Special emphasis on Trash Polka
    if (text.toLowerCase().includes('trash polka')) {
      matchedStyle = 'trash_polka';
      styleDisplayName = 'Trash Polka';
    } else {
      // Search for matches in other styles
      for (const [key, value] of Object.entries(styleDisplayNames)) {
        if (value.toLowerCase() === text.toLowerCase() || 
            text.toLowerCase().includes(value.toLowerCase())) {
          matchedStyle = key;
          styleDisplayName = value;
          break;
        }
      }
    }
    
    // If no match found, use default
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
 * Quick check if the image is Trash Polka
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
 * Fast analysis method
 */
async function fastStyleAnalysis(imageBuffer, requestedStyles = null) {
  // Quick check if it's Trash Polka
  const isTrashPolka = await quickTrashPolkaCheck(imageBuffer);
  
  if (isTrashPolka) {
    return {
      matchedStyle: 'trash_polka',
      confidenceScore: 0.9,
      styleDisplayName: 'Trash Polka',
      alternativeStyles: []
    };
  }
  
  // If not, run the regular analysis
  return analyzeWithGemini(imageBuffer, requestedStyles);
}

/**
 * Image feature analysis - compact version
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
 * Tag analysis - compact version
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
    
    // Parse response into list of tags
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