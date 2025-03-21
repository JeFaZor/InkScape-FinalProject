// מיפוי סגנונות קעקועים עם מילות מפתח והגדרות
const tattooStylesMap = {
    'traditional': {
      keywords: ['traditional tattoo', 'old school tattoo', 'american traditional', 'classic tattoo', 'sailor jerry', 'bold lines', 'bold outlines', 'nautical', 'anchor tattoo', 'eagle tattoo', 'sailor tattoo', 'classic american'],
      negativeKeywords: ['fine line', 'realistic', 'watercolor', 'geometric', 'dot work', 'gothic', 'horror'],
      weight: 1.3  // הגדלת המשקל לסגנון traditional
    },
    'new_school': {
      keywords: ['new school', 'cartoon tattoo', 'colorful cartoon', 'exaggerated', 'bold cartoon', 'caricature', 'graffiti style', 'comic tattoo', 'animated', 'vibrant cartoon'],
      negativeKeywords: ['traditional', 'realistic', 'fine line'],
      weight: 1.1
    },
    'anime': {
      keywords: ['anime', 'manga', 'japanese animation', 'anime character', 'anime style', 'manga style', 'otaku', 'anime portrait', 'cartoon japanese', 'anime eyes'],
      negativeKeywords: ['traditional', 'realistic'],
      weight: 1.2
    },
    'fineline': {
      keywords: ['fine line', 'thin line', 'minimal tattoo', 'delicate lines', 'subtle tattoo', 'dainty tattoo', 'minimalist line', 'single needle', 'fine work', 'continuous line'],
      negativeKeywords: ['bold lines', 'traditional', 'thick lines'],
      weight: 1.2
    },
    'geometric': {
      keywords: [
          'geometric', 
          'geometry', 
          'shapes', 
          'mandala', 
          'sacred geometry', 
          'polygons', 
          'symmetrical pattern', 
          'geometric pattern', 
          'triangle tattoo', 
          'geometric design', 
          'line geometry', 
          'mechanical', 
          'biomechanical', 
          'tech tattoo', 
          'dotwork', 
          'linework', 
          'abstract lines', 
          'isometric design', 
          'circuitry', 
          'anatomical illustration', 
          'science tattoo', 
          'futuristic tattoo', 
          'cyber tattoo', 
          'precision lines'
        ],
      negativeKeywords: ['organic', 'realistic'],
      weight: 1.1
    },
    'micro_realism': {
      keywords: ['micro realism', 'micro realistic', 'miniature realistic', 'small realistic', 'tiny portrait', 'small photorealistic', 'detailed small', 'micro portrait', 'realism small scale'],
      negativeKeywords: ['abstract', 'traditional'],
      weight: 1.2
    },
    'realism': {
      keywords: ['realism', 'realistic', 'photorealistic', 'portrait', 'lifelike', 'hyper realistic', 'photo quality', 'detailed portrait', 'skin texture', 'realistic shading', 'photo reference'],
      negativeKeywords: ['cartoon', 'traditional', 'abstract'],
      weight: 1.2
    },
    'dot_work': {
      keywords: ['dotwork', 'stippling', 'pointillism', 'dot technique', 'dots', 'pointillist', 'dot pattern', 'stipple shading', 'dot shading', 'stipple tattoo','Symmetry','dotwork tattoo','Triangle','dotwork design','dotwork mandala','dotwork pattern','dotwork style','dotwork technique','dotwork art','dotwork illustration','dotwork linework','dotwork geometric','dotwork blackwork','dotwork dotwork','dotwork sacred geometry','dotwork tattooing','dotwork artist','dotwork dotwork tattoo','dotwork dotwork style','dotwork dotwork technique','dotwork dotwork art','dotwork dotwork illustration','dotwork dotwork linework','dotwork dotwork geometric','dotwork dotwork blackwork','dotwork dotwork dotwork','dotwork dotwork sacred geometry','dotwork dotwork tattooing','dotwork dotwork artist'],
      negativeKeywords: ['solid lines', 'solid fill'],
      weight: 1.1
    },
    'dark_art': {
      keywords: ['dark art', 'horror', 'gothic', 'skull', 'macabre', 'creepy', 'dark theme', 'horror theme', 'grim', 'death', 'morbid', 'dark fantasy', 'nightmare'],
      negativeKeywords: ['traditional', 'old school', 'american traditional', 'classic tattoo'], // הוספת מילות מפתח שליליות לסגנון dark art
      weight: 1.0
    },
    'flowers': {
      keywords: ['flower', 'floral', 'botanical', 'rose', 'peony', 'chrysanthemum', 'lotus', 'flower tattoo', 'botanical illustration', 'garden', 'petals', 'floral design'],
      negativeKeywords: [],
      weight: 1.0
    },
    'surrealism': {
      keywords: ['surreal', 'surrealism', 'abstract', 'dream', 'dreamlike', 'salvador dali', 'fantasy', 'psychedelic', 'bizarre', 'strange composition', 'illogical', 'imaginative', 'weird'],
      negativeKeywords: ['realistic', 'traditional'],
      weight: 1.1
    },
    'trash_polka': {
      keywords: ['trash polka', 'red black','Red','neo realism', 'buena vista tattoo', 'chaotic design', 'collage style', 'abstract realism', 'red black tattoo', 'smudge', 'graphic design', 'photorealism mixed'],
      negativeKeywords: ['traditional', 'fine line'],
      weight: 1.2
    },
    'watercolor': {
      keywords: ['watercolor', 'water color', 'paint', 'watercolor effect', 'splash', 'color splash', 'watercolor technique', 'paint splatter', 'color wash', 'no outline', 'gradient color'],
      negativeKeywords: ['traditional', 'bold outline'],
      weight: 1.1
    },
    'japanese': {
      keywords: ['irezumi', 'japanese', 'japanese traditional', 'oriental', 'ukiyo-e', 'dragon', 'koi fish', 'hannya mask', 'japanese waves', 'geisha', 'samurai', 'oni', 'cherry blossom'],
      negativeKeywords: ['western', 'american traditional'],
      weight: 1.1
    },
    'blackwork': {
      keywords: ['blackwork', 'solid black', 'black fill', 'black tattoo', 'heavy black', 'black ink', 'blackout', 'black pattern', 'tribal inspired', 'negative space'],
      negativeKeywords: ['color', 'colorful','red black','Red'],
      weight: 1.1
    }
  };
  
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
   * מחלץ מאפיינים חזותיים מתמונת הקעקוע
   * @param {Array} labels - תוויות שזוהו בתמונה
   * @param {Array} colors - צבעים דומיננטיים בתמונה
   * @param {Array} faces - פנים שזוהו בתמונה
   * @returns {Object} - אובייקט עם מאפייני התמונה
   */
  function extractImageFeatures(labels, colors, faces) {
    const detectedLines = detectLineCharacteristics(labels);
    
    // זיהוי צבעים בסיסיים בתמונה
    const colorFeatures = analyzeColors(colors);
    
    return {
      hasFaces: faces.length > 0,
      isColorful: colors.length > 5,
      hasVibrantColors: colors.some(c => {
        const max = Math.max(c.color.red, c.color.green, c.color.blue);
        const min = Math.min(c.color.red, c.color.green, c.color.blue);
        return (max - min) > 100 && c.score > 0.1;
      }),
      isHighContrast: calculateContrastRatio(colors) > 5,
      isDarkToned: colors.sort((a, b) => b.score - a.score)[0].color.red + 
                  colors.sort((a, b) => b.score - a.score)[0].color.green + 
                  colors.sort((a, b) => b.score - a.score)[0].color.blue < 382, // 127*3
      isBlackAndGrey: colors.every(color => {
        const r = color.color.red;
        const g = color.color.green;
        const b = color.color.blue;
        return Math.abs(r - g) < 20 && Math.abs(r - b) < 20 && Math.abs(g - b) < 20;
      }),
      detectedLines: detectedLines,
      hasSimpleColors: colorFeatures.hasSimpleColors,
      hasPrimaryColors: colorFeatures.hasPrimaryColors,
      dominantColorFamily: colorFeatures.dominantColorFamily,
      // הוספת מאפיין חדש - בדיקה אם הקעקוע הוא בסגנון Traditional
      hasTraditionalLook: detectedLines.includes('bold') && colorFeatures.hasPrimaryColors && !colorFeatures.isComplexColorScheme
    };
  }
  
  /**
   * ניתוח מעמיק של צבעים בתמונה
   * @param {Array} colors - מערך צבעים
   * @returns {Object} - מאפייני צבע מורחבים
   */
  function analyzeColors(colors) {
    // מיין צבעים לפי דומיננטיות
    const sortedColors = [...colors].sort((a, b) => b.score - a.score);
    
    // בדוק אם יש צבעים פשוטים (לא גוונים מורכבים)
    const simpleColors = sortedColors.filter(color => {
      const r = color.color.red;
      const g = color.color.green;
      const b = color.color.blue;
      
      // בדוק אם אחד הערוצים דומיננטי משמעותית
      const maxChannel = Math.max(r, g, b);
      const otherChannelsAvg = (r + g + b - maxChannel) / 2;
      
      return maxChannel > otherChannelsAvg * 1.5;
    });
    
    // בדוק אם יש צבעים ראשוניים (אדום, כחול, צהוב, שחור)
    const primaryColors = sortedColors.filter(color => {
      const r = color.color.red;
      const g = color.color.green;
      const b = color.color.blue;
      
      // אדום
      if (r > 200 && g < 100 && b < 100) return true;
      // כחול
      if (b > 200 && r < 100 && g < 100) return true;
      // צהוב
      if (r > 200 && g > 200 && b < 100) return true;
      // שחור
      if (r < 50 && g < 50 && b < 50) return true;
      // ירוק
      if (g > 200 && r < 100 && b < 100) return true;
      
      return false;
    });
    
    // זיהוי משפחת הצבע הדומיננטית
    let dominantColorFamily = "mixed";
    if (sortedColors.length > 0) {
      const topColor = sortedColors[0].color;
      
      if (topColor.red > Math.max(topColor.green, topColor.blue) + 50) {
        dominantColorFamily = "red";
      } else if (topColor.green > Math.max(topColor.red, topColor.blue) + 50) {
        dominantColorFamily = "green";
      } else if (topColor.blue > Math.max(topColor.red, topColor.green) + 50) {
        dominantColorFamily = "blue";
      } else if (topColor.red < 100 && topColor.green < 100 && topColor.blue < 100) {
        dominantColorFamily = "black";
      } else if (topColor.red > 200 && topColor.green > 200 && topColor.blue < 150) {
        dominantColorFamily = "yellow";
      }
    }
    
    return {
      hasSimpleColors: simpleColors.length >= sortedColors.length * 0.4,
      hasPrimaryColors: primaryColors.length >= 2,
      isComplexColorScheme: colors.length > 7,
      dominantColorFamily: dominantColorFamily
    };
  }
  
  /**
   * זיהוי מאפייני קווים בתמונה
   * @param {Array} labels - תוויות שזוהו בתמונה
   * @returns {Array} - מערך של סוגי קווים שזוהו
   */
  function detectLineCharacteristics(labels) {
    const lineTypes = [];
    
    if (labels.some(l => 
      l.description.toLowerCase().includes('bold') || 
      l.description.toLowerCase().includes('thick') ||
      l.description.toLowerCase().includes('strong lines'))) {
      lineTypes.push('bold');
    }
    
    if (labels.some(l => 
      l.description.toLowerCase().includes('fine') || 
      l.description.toLowerCase().includes('thin') ||
      l.description.toLowerCase().includes('delicate'))) {
      lineTypes.push('fine');
    }
    
    return lineTypes;
  }
  
  /**
   * חישוב יחס ניגודיות בין צבעים
   * @param {Array} colors - מערך צבעים
   * @returns {Number} - יחס ניגודיות
   */
  function calculateContrastRatio(colors) {
    if (colors.length < 2) return 1;
    
    // מיין לפי בולטות
    const sortedColors = [...colors].sort((a, b) => b.score - a.score);
    
    // קבל את שני הצבעים הבולטים ביותר
    const color1 = sortedColors[0].color;
    const color2 = sortedColors[1].color;
    
    // חשב בהירות
    const luminance1 = (0.299 * color1.red + 0.587 * color1.green + 0.114 * color1.blue) / 255;
    const luminance2 = (0.299 * color2.red + 0.587 * color2.green + 0.114 * color2.blue) / 255;
    
    // חשב יחס ניגודיות
    const lightest = Math.max(luminance1, luminance2);
    const darkest = Math.min(luminance1, luminance2);
    
    return (lightest + 0.05) / (darkest + 0.05);
  }
  
  /**
   * חישוב ציוני סגנון עם לוגיקה ייחודית לכל סגנון
   * @param {String} combinedText - טקסט משולב מכל התוויות והאובייקטים
   * @param {Array} labels - תוויות שזוהו בתמונה
   * @param {Array} objects - אובייקטים שזוהו בתמונה
   * @param {Array} colors - צבעים דומיננטיים בתמונה
   * @param {Object} imageFeatures - מאפייני התמונה שחולצו
   * @param {Array} requestedStyles - סגנונות מבוקשים (אופציונלי)
   * @returns {Object} - ציוני סגנון מחושבים
   */
  function calculateStyleScores(
    combinedText, 
    labels, 
    objects, 
    colors, 
    imageFeatures,
    requestedStyles = null
  ) {
    const styleScores = {};
    
    // סנן סגנונות אם יש רשימת סגנונות מבוקשים
    const stylesToEvaluate = requestedStyles 
      ? Object.keys(tattooStylesMap).filter(style => requestedStyles.includes(style))
      : Object.keys(tattooStylesMap);
    
    // הערך כל סגנון
    for (const style of stylesToEvaluate) {
      const styleInfo = tattooStylesMap[style];
      let score = 0;
      
      // בדוק מילות מפתח חיוביות
      for (const keyword of styleInfo.keywords) {
        if (combinedText.includes(keyword.toLowerCase())) {
          // מצא את התווית עם הציון הגבוה ביותר שמכילה את מילת המפתח
          const matchingLabels = labels.filter(label => 
            label.description.toLowerCase().includes(keyword.toLowerCase())
          );
          
          if (matchingLabels.length > 0) {
            const highestScore = Math.max(...matchingLabels.map(l => l.score));
            score += highestScore * 1.5; // הגדל את חשיבות מילות המפתח הישירות
          } else {
            score += 0.5; // ציון נמוך יותר אם המילה נמצאה רק באובייקטים
          }
        }
      }
      
      // הפחת ציון עבור מילות מפתח שליליות
      for (const negKeyword of styleInfo.negativeKeywords) {
        if (combinedText.includes(negKeyword.toLowerCase())) {
          score -= 0.5; // הגדלת הפחתת הציון למילות מפתח שליליות
        }
      }
      
      // החל לוגיקת ניקוד ספציפית לסגנון
      switch (style) {
        case 'traditional':
          // הגדל משמעותית את הציון אם יש סימנים ברורים לקעקוע Traditional
          if (imageFeatures.detectedLines.includes('bold')) score += 1.0;
          if (!imageFeatures.isBlackAndGrey) score += 0.8; // לרוב צבעוני
          if (imageFeatures.hasPrimaryColors) score += 1.0; // צבעים בסיסיים הם מאפיין חשוב ב-Traditional
          
          // בדוק אם יש אלמנטים אופייניים ל-Traditional
          if (combinedText.includes('anchor') || 
              combinedText.includes('eagle') || 
              combinedText.includes('rose') || 
              combinedText.includes('skull') || 
              combinedText.includes('dagger') || 
              combinedText.includes('sailor') ||
              combinedText.includes('nautical')) {
            score += 1.2;
          }
          
          // אם כל המאפיינים העיקריים קיימים, הוסף בונוס גדול
          if (imageFeatures.detectedLines.includes('bold') && 
              imageFeatures.hasPrimaryColors && 
              !imageFeatures.isBlackAndGrey) {
            score += 2.0;
          }
          break;
          
        case 'realism':
          if (imageFeatures.hasFaces) score += 1.0;
          if (imageFeatures.isBlackAndGrey) score += 0.5;
          if (objects.some(obj => ['Person', 'Animal'].includes(obj.name))) score += 0.5;
          // הפחת ציון אם יש סימנים של Traditional
          if (imageFeatures.hasTraditionalLook) score -= 1.0;
          break;
          
        case 'micro_realism':
          if (imageFeatures.hasFaces) score += 0.8;
          if (imageFeatures.isBlackAndGrey) score += 0.6;
          if (imageFeatures.detectedLines.includes('fine')) score += 0.7;
          // הפחת ציון אם יש קווים בולדים (סימן נגד מיקרו-ריאליזם)
          if (imageFeatures.detectedLines.includes('bold')) score -= 1.0;
          break;
          
        case 'fineline':
          if (imageFeatures.detectedLines.includes('fine')) score += 1.0;
          if (imageFeatures.isBlackAndGrey) score += 0.4;
          // הפחת ציון אם יש קווים בולדים
          if (imageFeatures.detectedLines.includes('bold')) score -= 1.0;
          break;
          
        case 'watercolor':
          if (imageFeatures.hasVibrantColors) score += 1.0;
          if (!imageFeatures.detectedLines.includes('bold')) score += 0.5;
          if (labels.some(l => l.description.toLowerCase().includes('paint') || 
                           l.description.toLowerCase().includes('watercolor'))) {
            score += 1.0;
          }
          // הפחת ציון אם יש קווים בולדים וצבעים פשוטים (סימן ל-Traditional)
          if (imageFeatures.detectedLines.includes('bold') && imageFeatures.hasPrimaryColors) {
            score -= 1.0;
          }
          break;
          
        case 'dark_art':
          if (imageFeatures.isDarkToned) score += 0.7;
          if (labels.some(l => 
            l.description.toLowerCase().includes('dark') || 
            l.description.toLowerCase().includes('skull') ||
            l.description.toLowerCase().includes('horror') ||
            l.description.toLowerCase().includes('gothic'))) {
            score += 0.8;
          }
          
          // המפתח: הפחת ציון אם יש סימנים ברורים של Traditional
          if (imageFeatures.hasTraditionalLook) {
            score -= 1.5;
          }
          
          // הפחת אם יש צבעים בהירים ופשוטים (לא אופייני ל-Dark Art)
          if (imageFeatures.hasPrimaryColors && !imageFeatures.isDarkToned) {
            score -= 1.0;
          }
          break;
          
        case 'blackwork':
          if (imageFeatures.isDarkToned && 
              !imageFeatures.hasVibrantColors && 
              imageFeatures.isBlackAndGrey) {
            score += 1.0;
          }
          // הפחת ציון אם יש צבעים (לא אופייני ל-Blackwork)
          if (!imageFeatures.isBlackAndGrey) {
            score -= 1.5;
          }
          break;
          
        case 'trash_polka':
          // טראש פולקה לרוב יש אדום ושחור
          const hasRed = colors.some(c => c.color.red > 200 && c.color.green < 100 && c.color.blue < 100);
          if (hasRed && imageFeatures.isHighContrast) {
            score += 1.0;
          }
          // הפחת ציון אם יש צבעים אחרים חוץ מאדום ושחור
          if (colors.some(c => 
            c.color.green > 150 || 
            c.color.blue > 150 ||
            (c.color.red > 150 && c.color.green > 150))) {
            score -= 0.5;
          }
          break;
          
        case 'dot_work':
          if (labels.some(l => 
            l.description.toLowerCase().includes('dot') || 
            l.description.toLowerCase().includes('stippling'))) {
            score += 1.0;
          }
          // הפחת ציון אם יש קווים בולטים (לא אופייני ל-Dot Work)
          if (imageFeatures.detectedLines.includes('bold')) {
            score -= 0.5;
          }
          break;
          
        case 'flowers':
          if (objects.some(obj => ['Flower', 'Rose', 'Plant'].includes(obj.name))) {
            score += 1.0;
          }
          break;
          
        case 'geometric':
          if (labels.some(l => 
            l.description.toLowerCase().includes('geometric') || 
            l.description.toLowerCase().includes('geometry') ||
            l.description.toLowerCase().includes('mandala'))) {
            score += 0.8;
          }
          break;
          
        case 'japanese':
          if (labels.some(l => 
            l.description.toLowerCase().includes('japanese') || 
            l.description.toLowerCase().includes('oriental') ||
            l.description.toLowerCase().includes('asian'))) {
            score += 0.7;
          }
          // יש אלמנטים ספציפיים לסגנון היפני
          if (labels.some(l => 
            l.description.toLowerCase().includes('dragon') || 
            l.description.toLowerCase().includes('koi') ||
            l.description.toLowerCase().includes('hannya') ||
            l.description.toLowerCase().includes('waves') ||
            l.description.toLowerCase().includes('cherry blossom'))) {
            score += 0.8;
          }
          break;
      }
      
      // כפול במשקל הייחודי של הסגנון
      score *= styleInfo.weight;
      
      // שמור רק ציונים חיוביים
      if (score > 0) {
        styleScores[style] = score;
      }
    }
    
    return styleScores;
  }
  
  /**
   * זיהוי הסגנון הטוב ביותר בהתבסס על ציוני הסגנון
   * @param {Object} styleScores - ציוני סגנון מחושבים
   * @param {Object} imageFeatures - מאפייני התמונה
   * @returns {Object} - הסגנון המזוהה, רמת הביטחון ואלטרנטיבות
   */
  function identifyBestStyle(styleScores, imageFeatures) {
    let matchedStyle = null;
    let confidenceScore = 0;
    
    if (Object.keys(styleScores).length > 0) {
      const sortedStyles = Object.entries(styleScores)
        .sort((a, b) => b[1] - a[1]);
      
      matchedStyle = sortedStyles[0][0];
      confidenceScore = sortedStyles[0][1];
      
      // אם יש ספק (הפרש קטן מדי בין הציון הראשון והשני), ציין זאת
      if (sortedStyles.length > 1 && 
          sortedStyles[0][1] - sortedStyles[1][1] < 0.3) {
        console.log('Close match between:', matchedStyle, 'and', sortedStyles[1][0]);
      }
      
      // חשב סגנונות אלטרנטיביים
      const alternativeStyles = Object.entries(styleScores).length > 1 ? 
        Object.entries(styleScores)
          .sort((a, b) => b[1] - a[1])
          .slice(1, 3)
          .map(([style, score]) => ({ 
            style: styleDisplayNames[style], 
            confidence: score.toFixed(2) 
          })) : 
        [];
        
      return {
        matchedStyle,
        confidenceScore,
        styleDisplayName: styleDisplayNames[matchedStyle],
        alternativeStyles
      };
    } else {
      // לוגיקת ברירת מחדל משופרת כאשר אין התאמת סגנון
      
     // לוגיקת ברירת מחדל משופרת כאשר אין התאמת סגנון
    
    // בדיקה מיוחדת לזיהוי Traditional
    if (imageFeatures.detectedLines.includes('bold') && 
    imageFeatures.hasPrimaryColors && 
    !imageFeatures.isBlackAndGrey) {
  matchedStyle = 'traditional';
  confidenceScore = 0.7; // ביטחון גבוה יותר כי יש מאפיינים מובהקים
} else if (imageFeatures.isBlackAndGrey && imageFeatures.hasFaces) {
  matchedStyle = 'realism';
} else if (imageFeatures.isBlackAndGrey && imageFeatures.detectedLines.includes('fine')) {
  matchedStyle = 'fineline';
} else if (imageFeatures.hasVibrantColors && !imageFeatures.hasPrimaryColors) {
  matchedStyle = 'watercolor';
} else if (imageFeatures.isDarkToned && imageFeatures.isBlackAndGrey) {
  matchedStyle = 'blackwork';
} else {
  // ברירת מחדל חדשה - אם יש קווים בולטים וצבעים פשוטים, זה כנראה Traditional
  if (imageFeatures.detectedLines.includes('bold') || imageFeatures.hasPrimaryColors) {
    matchedStyle = 'traditional';
  } else {
    matchedStyle = 'realism'; // ברירת מחדל אחרונה
  }
}

confidenceScore = confidenceScore || 0.4; // ציון ביטחון נמוך כי זה ניחוש

return {
  matchedStyle,
  confidenceScore,
  styleDisplayName: styleDisplayNames[matchedStyle],
  alternativeStyles: []
};
}
}

module.exports = {
extractImageFeatures,
calculateStyleScores,
identifyBestStyle,
tattooStylesMap,
styleDisplayNames,
analyzeColors
};