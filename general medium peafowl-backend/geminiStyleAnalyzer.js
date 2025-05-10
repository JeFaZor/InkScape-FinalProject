/**
 * Improved tattoo style analysis that leverages tag information
 */
async function completeStyleAnalysis(imageBuffer) {
  // Special case for Trash Polka (it's highly distinctive)
  const isTrashPolka = await quickTrashPolkaCheck(imageBuffer);
  if (isTrashPolka) {
    return {
      matchedStyle: 'trash_polka',
      confidenceScore: 0.95,
      styleDisplayName: 'Trash Polka',
      alternativeStyles: [],
      tags: ["trash polka", "red and black", "chaotic", "collage", "abstract"]
    };
  }
  
  // Get tags first to help guide style analysis
  const tags = await analyzeTagsWithGemini(imageBuffer);
  
  // Create tag to style mapping based on known correlations
  const tagToStyleHints = {
    // Flower related tags strongly suggest Flowers style
    'floral': 'flowers',
    'flower': 'flowers',
    'flowers': 'flowers',
    'botanical': 'flowers',
    'rose': 'flowers',
    'daisy': 'flowers',
    'petals': 'flowers',
    'flora': 'flowers',
    'blooms': 'flowers',
    
    // Surrealism related tags
    'surreal': 'surrealism',
    'dreamlike': 'surrealism',
    'dream': 'surrealism',
    'impossible': 'surrealism',
    'fantasy': 'surrealism',
    'distorted': 'surrealism',
    'illusion': 'surrealism',
    'abstract': 'surrealism',
    'ethereal': 'surrealism',
    
    // Geometric related tags
    'geometric': 'geometric',
    'geometry': 'geometric',
    'triangles': 'geometric',
    'shapes': 'geometric',
    'angles': 'geometric',
    'polygon': 'geometric',
    'pattern': 'geometric',
    'symmetrical': 'geometric',
    
    // Fineline specific tags - MUST be thin lines only with minimal detail
    'minimalist': 'fineline',
    'simple lines': 'fineline',
    'thin lines': 'fineline',
    'delicate': 'fineline',
    'elegant': 'fineline',
    
    // Realism specific tags
    'photorealistic': 'realism',
    'realistic': 'realism',
    'photograph': 'realism',
    'lifelike': 'realism',
    'portrait': 'realism'
  };
  
  // Check if any tags strongly suggest a particular style
  let styleHint = null;
  for (const tag of tags) {
    const lowercaseTag = tag.toLowerCase();
    
    // Look for exact matches first
    if (tagToStyleHints[lowercaseTag]) {
      styleHint = tagToStyleHints[lowercaseTag];
      break;
    }
    
    // Then check for partial matches
    for (const [tagKey, style] of Object.entries(tagToStyleHints)) {
      if (lowercaseTag.includes(tagKey) || tagKey.includes(lowercaseTag)) {
        styleHint = style;
        break;
      }
    }
    
    if (styleHint) break;
  }
  
  // Print debug information
  console.log(`Tags identified: ${tags.join(', ')}`);
  console.log(`Style hint from tags: ${styleHint || 'none'}`);
  
  // For other styles, use the enhanced two-stage analysis
  const analysisResult = await enhancedStyleAnalysis(imageBuffer);
  
  // DECISION LOGIC: Compare the style from analysis with the tag-based hint
  let finalStyle = analysisResult.matchedStyle;
  let confidenceScore = analysisResult.confidenceScore;
  
  // Tag-style conflict resolution
  if (styleHint && styleHint !== analysisResult.matchedStyle) {
    console.log(`Style conflict: Analysis suggests ${analysisResult.matchedStyle} but tags suggest ${styleHint}`);
    
    // Special cases for common confusions
    if (analysisResult.matchedStyle === 'fineline' && 
        (tags.some(tag => tag.toLowerCase().includes('flower') || 
                   tag.toLowerCase().includes('floral') || 
                   tag.toLowerCase().includes('botanical')))) {
      // If classified as fineline but has flower tags, prefer 'flowers'
      finalStyle = 'flowers';
      confidenceScore = 0.85;
      console.log(`Adjusting to Flowers style due to floral subject tags`);
    }
    else if (analysisResult.matchedStyle === 'realism' && 
             (tags.some(tag => tag.toLowerCase().includes('surreal') || 
                       tag.toLowerCase().includes('dream') || 
                       tag.toLowerCase().includes('fantasy') ||
                       tag.toLowerCase().includes('impossible')))) {
      // If classified as realism but has surreal tags, prefer 'surrealism'
      finalStyle = 'surrealism';
      confidenceScore = 0.85;
      console.log(`Adjusting to Surrealism style due to surreal/dreamlike tags`);
    }
    else if (analysisResult.matchedStyle === 'fineline' && 
             (tags.some(tag => tag.toLowerCase().includes('geometric') || 
                       tag.toLowerCase().includes('shapes') || 
                       tag.toLowerCase().includes('pattern')))) {
      // If classified as fineline but has geometric tags, prefer 'geometric'
      finalStyle = 'geometric';
      confidenceScore = 0.85;
      console.log(`Adjusting to Geometric style due to geometric pattern tags`);
    }
    else if (analysisResult.matchedStyle === 'micro_realism' && 
             (tags.some(tag => tag.toLowerCase().includes('surreal') || 
                       tag.toLowerCase().includes('dream')))) {
      // If classified as micro_realism but has surreal tags, prefer 'surrealism'
      finalStyle = 'surrealism';
      confidenceScore = 0.85;
      console.log(`Adjusting to Surrealism style due to surreal tags`);
    }
    else if ((analysisResult.matchedStyle === 'fineline' || analysisResult.matchedStyle === 'micro_realism') && 
             styleHint === 'geometric') {
      // Special case for geometric/fineline/micro_realism confusion
      finalStyle = 'geometric';
      confidenceScore = 0.85;
      console.log(`Adjusting to Geometric style due to tag-based evidence`);
    }
    // When in doubt between two equally likely styles, use the tag hint
    else if (confidenceScore < 0.8 && styleHint) {
      finalStyle = styleHint;
      confidenceScore = 0.75;
      console.log(`Using tag-based style hint due to low confidence in analysis`);
    }
  }
  
  // Return comprehensive result
  return {
    matchedStyle: finalStyle,
    styleDisplayName: styleDisplayNames[finalStyle],
    confidenceScore: confidenceScore,
    tags: tags,
    fullResponse: analysisResult.fullResponse
  };
}// improvedGeminiStyleAnalyzer.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Display names of tattoo styles
const styleDisplayNames = {
  'traditional': 'Traditional',
  'new_school': 'New School',
  'japanese': 'Japanese', // Includes both Japanese and anime styles
  'fineline': 'Fineline',
  'geometric': 'Geometric',
  'micro_realism': 'Micro Realism',
  'realism': 'Realism',
  'dot_work': 'Dot Work',
  'dark_art': 'Dark Art',
  'flowers': 'Flowers',
  'surrealism': 'Surrealism',
  'trash_polka': 'Trash Polka',
  'watercolor': 'Watercolor'
};

// Detailed style definitions to help with classification
const styleDefinitions = {
  'traditional': 'Bold black outlines, limited color palette (red, green, yellow, blue), classic American imagery (roses, eagles, anchors, skulls). Often solid fills.',
  'new_school': 'Exaggerated proportions, vibrant and bright colors, cartoon-like, graffiti influences, bold outlines, stylized characters.',
  'japanese': 'Traditional Japanese iconography (koi, dragons, waves, cherry blossoms), specific arrangements, bold outlines with detailed background, may include anime-inspired elements, clean lines, stylized features.',
  'fineline': 'ONLY extremely thin, delicate black lines with minimal to NO shading. Very minimalist, simple designs with clean single-stroke lines. No complex detailing or heavy shadowing. Often small scale, elegant, and uses negative space.',
  'geometric': 'Precise geometric shapes (triangles, circles, lines), patterns with mathematical precision, symmetry. Often black ink with structured, angular designs. Contains shapes and patterns rather than just thin lines.',
  'micro_realism': 'Highly detailed miniature images that look like tiny photographs, precise technique, often black and gray, small scale realism with intricate details.',
  'realism': 'Photorealistic technique that accurately reproduces real-world subjects. High detail, accurate shadows and highlights like a photograph. NO surreal elements or impossible combinations.',
  'dot_work': 'Images created using only dots (pointillism), no continuous lines, dots used for shading and depth, often black ink, detailed stippling.',
  'dark_art': 'Macabre themes, horror imagery, often gothic or occult elements, heavy black ink, dark subject matter.',
  'flowers': 'Botanical subject matter with floral designs as the primary focus. Can be realistic or stylized, often with detailed petals and leaves. NOT classified by technique but by the flower subject matter.',
  'surrealism': 'Dreamlike imagery that creates impossible scenarios. Distorted reality, fantasy elements. Often combines objects that dont belong together, creates optical illusions, or shows physically impossible scenes.',
  'trash_polka': 'Distinctive RED and BLACK color scheme ONLY . Chaotic composition combining realistic portraits with abstract elements. Collage style with text, splashes, and geometric shapes. Appears unplanned and disruptive.',
  'watercolor': 'Mimics watercolor painting, fluid appearance, splashes and drips, often without black outlines, soft color transitions and bleeding effects.'
};

/**
 * Create an improved prompt for style analysis
 */
function createEnhancedPrompt() {
  return `
Analyze this tattoo image and identify its primary style from the following options. Pay careful attention to the specific characteristics of each style:

${Object.entries(styleDefinitions).map(([key, definition]) => 
  `- ${styleDisplayNames[key]}: ${definition}`
).join('\n')}

Important distinctions to note:
1. Fineline refers to the technique (very thin lines) while Floral refers to subject matter (flowers).
2. Realism attempts to look like a photograph, while Surrealism deliberately includes impossible or dreamlike elements.
3. Trash Polka specifically uses RED and BLACK colors with collage and chaotic elements.
4. Watercolor mimics paint with soft color transitions, often without outlines.

First, describe what you see in the tattoo (subject, technique, colors, composition).
Then, provide the SINGLE style name that best matches the tattoo.
Return your answer as: "Style: [style name]"
`;
}

/**
 * Create a comparative analysis prompt for confusing style pairs
 */
function createComparisonPrompt(style1, style2) {
  return `
Compare this tattoo carefully. Is it more characteristic of ${styleDisplayNames[style1]} style or ${styleDisplayNames[style2]} style?

${styleDisplayNames[style1]} characteristics: ${styleDefinitions[style1]}
${styleDisplayNames[style2]} characteristics: ${styleDefinitions[style2]}

First, describe the specific features you observe in this tattoo.
Then, determine which style matches better and why.
Return only the name of the better matching style as: "Style: [style name]"
`;
}

/**
 * Improved tattoo style analysis using Gemini API
 */
async function analyzeWithGemini(imageBuffer) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const imageBase64 = imageBuffer.toString('base64');
    
    // Use enhanced prompt
    const prompt = createEnhancedPrompt();
    
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg",
      },
    };
    
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text().trim();
    
    // Print full response for debugging
    console.log("Gemini response:", text);
    
    // Extract style from response (looking for "Style: [style name]" pattern)
    let styleMatch = text.match(/Style:\s*([A-Za-z\s]+)/i);
    let extractedStyle = styleMatch ? styleMatch[1].trim() : null;
    
    if (!extractedStyle) {
      // If no "Style:" format found, take the last line or sentence as the style
      const lines = text.split(/[\n.!?]/);
      const nonEmptyLines = lines.filter(line => line.trim().length > 0);
      
      if (nonEmptyLines.length > 0) {
        extractedStyle = nonEmptyLines[nonEmptyLines.length - 1].trim();
      } else {
        extractedStyle = text; // Use the entire text if nothing else works
      }
    }
    
    console.log("Extracted style:", extractedStyle);
    
    // Search for style match
    let matchedStyle = null;
    let styleDisplayName = extractedStyle;
    
    // Normalize "Floral" to "Flowers" before matching
    if (extractedStyle.toLowerCase() === 'floral') {
      extractedStyle = 'Flowers';
    }
    
    // Match with known styles
    for (const [key, value] of Object.entries(styleDisplayNames)) {
      if (extractedStyle.toLowerCase().includes(value.toLowerCase()) || 
          value.toLowerCase() === extractedStyle.toLowerCase()) {
        matchedStyle = key;
        styleDisplayName = value;
        console.log(`Matched style: ${key} (${value})`);
        break;
      }
    }
    
    // Handle special cases based on content description
    
    // 1. If it mentions brain, circuitry, and geometric patterns - likely Geometric
    if (text.toLowerCase().includes('brain') && 
       (text.toLowerCase().includes('circuit') || 
        text.toLowerCase().includes('geometric') || 
        text.toLowerCase().includes('technical') || 
        text.toLowerCase().includes('mechanical'))) {
      matchedStyle = 'geometric';
      styleDisplayName = styleDisplayNames['geometric'];
      console.log("Corrected to Geometric based on brain+circuit/geometric content");
    }
    
    // 2. Special case correction for floral content
    if (extractedStyle.toLowerCase().includes('flower') || 
        extractedStyle.toLowerCase().includes('floral') || 
        extractedStyle.toLowerCase().includes('botanical') ||
        text.toLowerCase().includes('flower') || 
        text.toLowerCase().includes('floral') || 
        text.toLowerCase().includes('petal') || 
        text.toLowerCase().includes('botanical')) {
      matchedStyle = 'flowers';
      styleDisplayName = styleDisplayNames['flowers'];
      console.log("Corrected to Flowers based on floral content");
    }
    
    // 3. Special case for surreal content
    if (extractedStyle.toLowerCase().includes('surreal') || 
        extractedStyle.toLowerCase().includes('dream') || 
        extractedStyle.toLowerCase().includes('fantasy') ||
        text.toLowerCase().includes('surreal') || 
        text.toLowerCase().includes('dream') || 
        text.toLowerCase().includes('distort') || 
        text.toLowerCase().includes('impossible') ||
        text.toLowerCase().includes('fantasy')) {
      matchedStyle = 'surrealism';
      styleDisplayName = styleDisplayNames['surrealism'];
      console.log("Corrected to Surrealism based on surreal content");
    }
    
    // 4. Special case for geometric patterns
    if (extractedStyle.toLowerCase().includes('geometric') || 
        extractedStyle.toLowerCase().includes('shapes') || 
        extractedStyle.toLowerCase().includes('pattern') ||
        text.toLowerCase().includes('geometric') || 
        text.toLowerCase().includes('triangle') || 
        text.toLowerCase().includes('shapes') || 
        text.toLowerCase().includes('pattern') ||
        text.toLowerCase().includes('mathematical') ||
        text.toLowerCase().includes('symmetr')) {
      matchedStyle = 'geometric';
      styleDisplayName = styleDisplayNames['geometric'];
      console.log("Corrected to Geometric based on geometric content");
    }
    
    // If no match found, use default
    if (!matchedStyle) {
      matchedStyle = 'realism'; // Default to realism if no match found
      styleDisplayName = 'Realism';
      console.log("No match found, defaulting to Realism");
    }
    
    // Calculate a confidence score based on how directly the style was mentioned
    let confidenceScore = 0.7; // Base confidence
    
    if (styleMatch) {
      confidenceScore = 0.9; // Higher confidence if it used the "Style:" format
    }
    
    return {
      matchedStyle,
      confidenceScore,
      styleDisplayName,
      fullResponse: text
    };
  } catch (error) {
    console.error('Error in Gemini analysis:', error);
    return {
      matchedStyle: 'realism',
      confidenceScore: 0.5,
      styleDisplayName: 'Realism',
      fullResponse: null
    };
  }
}

/**
 * Run a comparison between two potentially confused styles
 */
async function compareStyles(imageBuffer, style1, style2) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const imageBase64 = imageBuffer.toString('base64');
    
    const prompt = createComparisonPrompt(style1, style2);
    
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg",
      },
    };
    
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text().trim();
    
    // Extract style from response
    let styleMatch = text.match(/Style:\s*([A-Za-z\s]+)/i);
    let extractedStyle = styleMatch ? styleMatch[1].trim() : null;
    
    if (!extractedStyle) {
      // If no "Style:" format found, look for style names directly
      for (const style of [style1, style2]) {
        const displayName = styleDisplayNames[style];
        if (text.toLowerCase().includes(displayName.toLowerCase())) {
          extractedStyle = displayName;
          break;
        }
      }
    }
    
    // Determine which style it matched
    let matchedStyle = null;
    
    if (extractedStyle) {
      if (styleDisplayNames[style1].toLowerCase() === extractedStyle.toLowerCase() ||
          extractedStyle.toLowerCase().includes(styleDisplayNames[style1].toLowerCase())) {
        matchedStyle = style1;
      } 
      else if (styleDisplayNames[style2].toLowerCase() === extractedStyle.toLowerCase() ||
               extractedStyle.toLowerCase().includes(styleDisplayNames[style2].toLowerCase())) {
        matchedStyle = style2;
      }
    }
    
    // Default to first style if no match found
    if (!matchedStyle) {
      matchedStyle = style1;
    }
    
    return {
      matchedStyle,
      confidenceScore: 0.85,
      fullResponse: text
    };
  } catch (error) {
    console.error('Error in style comparison:', error);
    return {
      matchedStyle: style1, // Default to first style on error
      confidenceScore: 0.6,
      fullResponse: null
    };
  }
}

/**
 * Define commonly confused style pairs for targeted comparison
 */
const confusedStylePairs = {
  'fineline': ['flowers', 'geometric'],
  'flowers': ['fineline'],
  'realism': ['surrealism', 'micro_realism'],
  'surrealism': ['realism'],
  'micro_realism': ['realism'],
  'geometric': ['fineline'],
  'traditional': ['new_school'],
  'new_school': ['traditional', 'japanese'],
  'japanese': ['new_school']
};

/**
 * Two-stage analysis for improved accuracy
 */
async function enhancedStyleAnalysis(imageBuffer) {
  // First stage: Basic style identification
  const initialAnalysis = await analyzeWithGemini(imageBuffer);
  
  // Check if this is a potentially confused style
  if (initialAnalysis.matchedStyle in confusedStylePairs) {
    // Get list of styles it might be confused with
    const potentiallyConfusedStyles = confusedStylePairs[initialAnalysis.matchedStyle];
    
    // If confidence is already very high, don't do further checks
    if (initialAnalysis.confidenceScore >= 0.9) {
      return initialAnalysis;
    }
    
    // Second stage: Run comparisons with commonly confused styles
    let highestConfidence = initialAnalysis.confidenceScore;
    let finalStyle = initialAnalysis.matchedStyle;
    
    for (const alternativeStyle of potentiallyConfusedStyles) {
      const comparisonResult = await compareStyles(
        imageBuffer, 
        initialAnalysis.matchedStyle, 
        alternativeStyle
      );
      
      // If the comparison indicates a different style with high confidence
      if (comparisonResult.matchedStyle !== initialAnalysis.matchedStyle && 
          comparisonResult.confidenceScore >= 0.8) {
        highestConfidence = comparisonResult.confidenceScore;
        finalStyle = comparisonResult.matchedStyle;
        break; // Exit the loop once we've found a better match
      }
    }
    
    // Update the style if changed
    if (finalStyle !== initialAnalysis.matchedStyle) {
      return {
        matchedStyle: finalStyle,
        confidenceScore: highestConfidence,
        styleDisplayName: styleDisplayNames[finalStyle],
        fullResponse: initialAnalysis.fullResponse
      };
    }
  }
  
  // Return the initial analysis if no changes
  return initialAnalysis;
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
    Is this tattoo in Trash Polka style? Trash Polka is characterized by:
    - RED and BLACK colors predominantly
    - Chaotic, collage-like composition
    - Mix of realistic and abstract elements
    - Often includes text, splashes, or geometric shapes
    
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
    console.error('Error in Trash Polka check:', error);
    return false;
  }
}

/**
 * Tag analysis with style hints - limited to 5 tags
 */
async function analyzeTagsWithGemini(imageBuffer) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const imageBase64 = imageBuffer.toString('base64');
    
    const prompt = `
    Analyze this tattoo image and provide EXACTLY 5 relevant tags total.
    Include a mix of:
    - Subject matter (what is depicted)
    - Technique (line style, shading method)
    - Visual qualities (color scheme, composition)
    
    Return ONLY a comma-separated list of 5 descriptive tags.
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
    
    // Parse response into list of tags (limit to 5)
    const tags = text.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .slice(0, 5); // Ensure maximum of 5 tags
    
    // If we have fewer than 5 tags, add generic ones to reach 5
    while (tags.length < 5) {
      const genericTags = ["tattoo", "body art", "design", "ink", "artwork"];
      for (const tag of genericTags) {
        if (!tags.includes(tag) && tags.length < 5) {
          tags.push(tag);
        }
      }
    }
    
    return tags;
  } catch (error) {
    console.error('Error analyzing tags:', error);
    return ["tattoo", "art", "design", "ink", "body art"];
  }
}

/**
 * Fast style analysis for quicker processing, with tag-based correction
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
  
  // Get tags to help guide classification
  const tags = await analyzeTagsWithGemini(imageBuffer);
  
  // For other styles, use the basic analysis (without the two-stage process for speed)
  const analysisResult = await analyzeWithGemini(imageBuffer);
  
  // Check if tags suggest a different style (tag-based correction)
  let finalStyle = analysisResult.matchedStyle;
  let confidenceScore = analysisResult.confidenceScore;
  
  // Normalize "Floral" to "Flowers" if present in tags
  const normalizedTags = tags.map(tag => 
    tag.toLowerCase() === 'floral' ? 'flowers' : tag
  );
  
  // Convert tags to lowercase for easier checking
  const lowerTags = normalizedTags.map(tag => tag.toLowerCase());
  
  // Special case for brain + circuitry/technical imagery - likely Geometric
  if (lowerTags.some(tag => tag.includes('brain')) && 
      (lowerTags.some(tag => tag.includes('circuit') || 
                      tag.includes('geometric') || 
                      tag.includes('mechanical') || 
                      tag.includes('technical')))) {
    finalStyle = 'geometric';
    confidenceScore = 0.9;
    console.log(`Fast analysis: Adjusted to Geometric based on brain + technical imagery`);
  }
  
  // Special case corrections based on tags
  if (finalStyle === 'fineline' && 
      lowerTags.some(tag => tag.includes('flower') || 
                tag.includes('floral') || 
                tag.includes('botanical') ||
                tag.includes('petal'))) {
    // If classified as fineline but has flower tags, prefer 'flowers'
    finalStyle = 'flowers';
    confidenceScore = 0.85;
    console.log(`Fast analysis: Corrected Fineline to Flowers based on tags`);
  }
  else if ((finalStyle === 'realism' || finalStyle === 'micro_realism') && 
           lowerTags.some(tag => tag.includes('surreal') || 
                     tag.includes('dream') || 
                     tag.includes('fantasy') ||
                     tag.includes('impossible'))) {
    // If classified as realism but has surreal tags, prefer 'surrealism'
    finalStyle = 'surrealism';
    confidenceScore = 0.85;
    console.log(`Fast analysis: Corrected Realism to Surrealism based on tags`);
  }
  else if ((finalStyle === 'fineline' || finalStyle === 'micro_realism' || finalStyle === 'realism') && 
           lowerTags.some(tag => tag.includes('geometric') || 
                     tag.includes('shapes') || 
                     tag.includes('pattern') ||
                     tag.includes('technical') ||
                     tag.includes('circuit'))) {
    // If classified as fineline/realism but has geometric tags, prefer 'geometric'
    finalStyle = 'geometric';
    confidenceScore = 0.85;
    console.log(`Fast analysis: Corrected to Geometric based on tags`);
  }
  
  // Return enhanced result
  return {
    matchedStyle: finalStyle,
    styleDisplayName: styleDisplayNames[finalStyle],
    confidenceScore: confidenceScore,
    alternativeStyles: [],
    tags: normalizedTags // Include tags in response
  };
}

module.exports = {
  analyzeWithGemini,
  enhancedStyleAnalysis,
  quickTrashPolkaCheck,
  analyzeTagsWithGemini,
  completeStyleAnalysis,
  fastStyleAnalysis,
  styleDisplayNames,
  styleDefinitions
};