// מיפוי תגים משופר
const tagMap = {
    'black': 'Black & Grey',
    'gray': 'Black & Grey',
    'grey': 'Black & Grey',
    'monochrome': 'Black & Grey',
    
    'color': 'Color',
    'colorful': 'Color',
    'vibrant': 'Color',
    
    'cover': 'Cover Up',
    'cover-up': 'Cover Up',
    
    'small': 'Small',
    'tiny': 'Small',
    'minimal': 'Small',
    
    'large': 'Large',
    'big': 'Large',
    'sleeve': 'Large',
    'back piece': 'Large',
    
    'lettering': 'Lettering',
    'text': 'Lettering',
    'typography': 'Lettering',
    'calligraphy': 'Lettering',
    
    'portrait': 'Portrait',
    'face': 'Portrait',
    'realistic face': 'Portrait',
    
    'minimalist': 'Minimalist',
    'simple': 'Minimalist',
    
    'watercolor': 'Watercolor',
    'water color': 'Watercolor',
    'paint': 'Watercolor',
    
    'animal': 'Animals',
    'wildlife': 'Animals',
    'bird': 'Animals',
    'snake': 'Animals',
    
    'flower': 'Floral',
    'floral': 'Floral',
    'rose': 'Floral',
    'botanical': 'Floral',
    
    'geometric': 'Geometric',
    'geometry': 'Geometric',
    'mandala': 'Geometric',
    
    'dark': 'Dark Art',
    'horror': 'Dark Art',
    'skull': 'Dark Art',
    'gothic': 'Dark Art'
  };
  
  /**
   * זיהוי תגים מתאימים לתמונת קעקוע
   * @param {Array} labels - תוויות שזוהו בתמונה
   * @param {Array} objects - אובייקטים שזוהו בתמונה
   * @param {Array} colors - צבעים דומיננטיים בתמונה
   * @param {Boolean} hasText - האם זוהה טקסט בתמונה
   * @param {Object} imageFeatures - מאפייני התמונה
   * @returns {Array} - רשימת תגים רלוונטיים
   */
  function detectTags(labels, objects, colors, hasText, imageFeatures) {
    const detectedTags = new Set();
    
    // הוסף תגי צבע
    if (imageFeatures.isBlackAndGrey) {
      detectedTags.add('Black & Grey');
    } else {
      detectedTags.add('Color');
    }
    
    // הוסף תג גודל בהתבסס על אומדן של גודל הקעקוע
    const hasLargeObject = objects.some(obj => obj.boundingPoly && 
      (obj.boundingPoly.normalizedVertices[2].x - obj.boundingPoly.normalizedVertices[0].x) > 0.5 &&
      (obj.boundingPoly.normalizedVertices[2].y - obj.boundingPoly.normalizedVertices[0].y) > 0.5
    );
    
    if (hasLargeObject) {
      detectedTags.add('Large');
    } else {
      detectedTags.add('Small');
    }
    
    // אם זיהינו טקסט, הוסף את תג "Lettering"
    if (hasText) {
      detectedTags.add('Lettering');
    }
    
    // הוסף תגים ספציפיים בהתבסס על תוכן
    if (imageFeatures.hasFaces || objects.some(obj => ['Face', 'Person'].includes(obj.name))) {
      detectedTags.add('Portrait');
    }
    
    if (objects.some(obj => ['Flower', 'Rose', 'Plant'].includes(obj.name)) || 
        labels.some(l => l.description.toLowerCase().includes('flower') || 
                       l.description.toLowerCase().includes('floral'))) {
      detectedTags.add('Floral');
    }
    
    if (labels.some(l => l.description.toLowerCase().includes('animal') || 
                       l.description.toLowerCase().includes('wildlife')) ||
        objects.some(obj => ['Animal', 'Bird', 'Dog', 'Cat', 'Snake'].includes(obj.name))) {
      detectedTags.add('Animals');
    }
    
    if (labels.some(l => l.description.toLowerCase().includes('minimal') || 
                       l.description.toLowerCase().includes('simple'))) {
      detectedTags.add('Minimalist');
    }
    
    if (imageFeatures.hasVibrantColors && 
        labels.some(l => l.description.toLowerCase().includes('paint') || 
                       l.description.toLowerCase().includes('splash'))) {
      detectedTags.add('Watercolor');
    }
    
    if (labels.some(l => l.description.toLowerCase().includes('geometric') || 
                       l.description.toLowerCase().includes('mandala'))) {
      detectedTags.add('Geometric');
    }
    
    if (labels.some(l => l.description.toLowerCase().includes('dark') || 
                       l.description.toLowerCase().includes('skull') ||
                       l.description.toLowerCase().includes('gothic'))) {
      detectedTags.add('Dark Art');
    }
    
    // זיהוי תגים נוספים מתויות
    for (const label of labels) {
      const labelText = label.description.toLowerCase();
      for (const [keyword, tag] of Object.entries(tagMap)) {
        if (labelText.includes(keyword.toLowerCase())) {
          detectedTags.add(tag);
        }
      }
    }
    
    // הגבלת מספר התגיות ל-3
    return Array.from(detectedTags).slice(0, 3);
  }
  
  /**
   * מחלץ מילות מפתח מתיאורי תוויות
   * @param {Array} labels - תוויות שזוהו בתמונה
   * @returns {Array} - מילות מפתח שזוהו
   */
  function extractKeywordsFromLabels(labels) {
    const keywords = new Set();
    
    for (const label of labels) {
      const words = label.description.toLowerCase().split(/\s+/);
      for (const word of words) {
        if (word.length > 3) { // התעלם ממילים קצרות מדי
          keywords.add(word);
        }
      }
    }
    
    return Array.from(keywords);
  }
  
  /**
   * זיהוי תגים נוספים בהתבסס על מידע חיצוני
   * @param {Array} labels - תוויות שזוהו בתמונה
   * @param {Array} objects - אובייקטים שזוהו בתמונה
   * @returns {Array} - תגים נוספים
   */
  function detectAdditionalTags(labels, objects) {
    const additionalTags = new Set();
    
    // בדוק אם יש אזכור לכיסוי קעקוע קיים
    if (labels.some(l => 
      l.description.toLowerCase().includes('cover') || 
      l.description.toLowerCase().includes('coverup'))) {
      additionalTags.add('Cover Up');
    }
    
    // זיהוי סגנונות אופנתיים
    if (labels.some(l => 
      l.description.toLowerCase().includes('trendy') || 
      l.description.toLowerCase().includes('popular'))) {
      additionalTags.add('Trending');
    }
    
    return Array.from(additionalTags);
  }
  
  module.exports = {
    detectTags,
    extractKeywordsFromLabels,
    detectAdditionalTags,
    tagMap
  };