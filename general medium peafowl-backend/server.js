const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import analyzers
const geminiAnalyzer = require('./geminiStyleAnalyzer');
const tagAnalyzer = require('./tagAnalyzer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is working!' });
});

app.post('/api/analyze-tattoo', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const requestedStyles = req.body.styles ? JSON.parse(req.body.styles) : null;
    
    console.log('Analyzing tattoo with fast Gemini analysis');
    
    const { 
      matchedStyle, 
      confidenceScore, 
      styleDisplayName, 
      alternativeStyles 
    } = await geminiAnalyzer.fastStyleAnalysis(req.file.buffer, requestedStyles);
    
    const tags = await geminiAnalyzer.analyzeTagsWithGemini(req.file.buffer);
    
    console.log('Fast analysis results:');
    console.log('Matched style:', styleDisplayName);
    console.log('Confidence score:', confidenceScore);
    console.log('Tags:', tags);
    
    res.json({
      style: styleDisplayName,
      alternativeStyles: alternativeStyles || [],
      tags: tags,
      confidence: parseFloat(confidenceScore).toFixed(2)
    });
  } catch (error) {
    console.error('Error analyzing tattoo image:', error);
    res.status(500).json({ error: 'Failed to analyze image', details: error.message });
  }
});

// Endpoint for testing Trash Polka style detection
app.post('/api/test-trash-polka-detection', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    console.log('Testing Trash Polka detection...');
    
    const colorAnalysis = await geminiAnalyzer.analyzeColorScheme(req.file.buffer);
    const styleAnalysis = await geminiAnalyzer.analyzeWithGemini(req.file.buffer);
    const trashPolkaScore = calculateTrashPolkaScore(colorAnalysis, styleAnalysis);
    
    res.json({
      isTrashPolka: trashPolkaScore > 0.7,
      trashPolkaScore: trashPolkaScore.toFixed(2),
      colorAnalysis: colorAnalysis,
      styleAnalysis: {
        style: styleAnalysis.styleDisplayName,
        confidence: styleAnalysis.confidenceScore,
        explanation: styleAnalysis.explanation
      },
      detectionDetails: {
        hasRedBlackScheme: colorAnalysis.isRedAndBlack,
        hasHighContrast: colorAnalysis.hasHighContrast,
        styleContainsTrashPolka: styleAnalysis.styleDisplayName.toLowerCase().includes('trash') ||
                               styleAnalysis.explanation?.toLowerCase().includes('trash polka')
      }
    });
  } catch (error) {
    console.error('Error testing Trash Polka detection:', error);
    res.status(500).json({ error: 'Failed to analyze image', details: error.message });
  }
});

// Helper function to calculate Trash Polka style score
function calculateTrashPolkaScore(colorAnalysis, styleAnalysis) {
  let score = 0;
  
  if (colorAnalysis.isRedAndBlack) score += 0.5;
  if (colorAnalysis.hasHighContrast) score += 0.2;
  if (styleAnalysis.styleDisplayName.toLowerCase().includes('trash')) score += 0.3;
  if (styleAnalysis.explanation && styleAnalysis.explanation.toLowerCase().includes('trash polka')) {
    score += 0.2;
  }
  
  return Math.min(score, 1.0);
}

// Artists endpoint
app.get('/api/artists', (req, res) => {
  const sampleArtists = [
    { id: 1, name: 'John Doe', style: 'Traditional', location: 'New York' },
    { id: 2, name: 'Jane Smith', style: 'New School', location: 'Los Angeles' }
  ];
  res.json(sampleArtists);
});

// Endpoint to test Gemini API connection with updated model
app.get('/api/test-gemini', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'Missing GEMINI_API_KEY in environment variables',
        status: 'error'
      });
    }
    
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent("Hello, are you working?");
    const response = await result.response;
    const text = response.text();
    
    res.json({
      status: 'success',
      message: 'Gemini API is working with the updated model!',
      response: text.substring(0, 100)
    });
  } catch (error) {
    console.error('Error testing Gemini:', error);
    res.status(500).json({
      status: 'error',
      error: 'Failed to connect to Gemini API',
      details: error.message
    });
  }
});

// Server startup
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});