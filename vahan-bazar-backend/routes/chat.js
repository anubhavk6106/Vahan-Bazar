import express from 'express';
import { body, validationResult } from 'express-validator';
import geminiService from '../services/geminiService.js';

const router = express.Router();

// Validation middleware for chat messages
const validateChatMessage = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  
  body('conversationId')
    .optional()
    .isString()
    .withMessage('Conversation ID must be a string'),
  
  body('conversationHistory')
    .optional()
    .isArray({ max: 20 })
    .withMessage('Conversation history must be an array with max 20 messages'),
  
  body('conversationHistory.*.text')
    .optional()
    .isString()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Each message text must be between 1 and 1000 characters'),
  
  body('conversationHistory.*.sender')
    .optional()
    .isIn(['user', 'bot'])
    .withMessage('Message sender must be either "user" or "bot"'),
  
  body('conversationHistory.*.timestamp')
    .optional()
    .isISO8601()
    .withMessage('Message timestamp must be a valid ISO date')
];

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// POST /api/v1/chat/message - Send a message to the chatbot
router.post('/message', validateChatMessage, handleValidationErrors, async (req, res) => {
  try {
    const { message, conversationHistory = [], conversationId } = req.body;
    
    console.log(`[CHAT] Received message: "${message}"`);
    
    // Generate response using Gemini AI
    const aiResponse = await geminiService.generateResponse(message, conversationHistory);
    
    if (!aiResponse.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate AI response',
        error: 'AI service temporarily unavailable'
      });
    }

    // Create response object
    const response = {
      success: true,
      data: {
        message: aiResponse.message,
        timestamp: new Date().toISOString(),
        conversationId: conversationId || `chat_${Date.now()}`,
        sender: 'bot'
      }
    };

    console.log(`[CHAT] Generated response: "${aiResponse.message}"`);

    res.json(response);
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// POST /api/v1/chat/vehicle-recommendation - Get vehicle recommendations
router.post('/vehicle-recommendation', [
  body('budget')
    .isNumeric({ min: 10000, max: 10000000 })
    .withMessage('Budget must be between ₹10,000 and ₹1,00,00,000'),
  
  body('category')
    .isIn(['bike', 'scooter', 'electric', 'motorcycle'])
    .withMessage('Category must be one of: bike, scooter, electric, motorcycle'),
  
  body('usage')
    .isIn(['commuting', 'long rides', 'sports', 'city', 'touring'])
    .withMessage('Usage must be one of: commuting, long rides, sports, city, touring')
], handleValidationErrors, async (req, res) => {
  try {
    const { budget, category, usage } = req.body;
    
    console.log(`[CHAT] Vehicle recommendation request: ${category}, ₹${budget}, ${usage}`);
    
    const recommendation = await geminiService.getVehicleRecommendation(budget, category, usage);
    
    res.json({
      success: true,
      data: {
        message: recommendation,
        timestamp: new Date().toISOString(),
        type: 'vehicle_recommendation',
        parameters: { budget, category, usage }
      }
    });
  } catch (error) {
    console.error('Vehicle recommendation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate vehicle recommendation',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// GET /api/v1/chat/health - Check chatbot service health
router.get('/health', (req, res) => {
  const isGeminiAvailable = geminiService.isAvailable();
  
  res.json({
    success: true,
    data: {
      status: 'healthy',
      geminiApiAvailable: isGeminiAvailable,
      timestamp: new Date().toISOString(),
      features: [
        'Natural language processing',
        'Vehicle recommendations',
        'Context-aware responses',
        'Conversation history support',
        isGeminiAvailable ? 'Gemini AI powered' : 'Rule-based fallback'
      ]
    }
  });
});

// GET /api/v1/chat/suggestions - Get conversation starter suggestions
router.get('/suggestions', (req, res) => {
  const suggestions = [
    {
      text: "I need a bike under ₹1 lakh",
      category: "vehicle_recommendation",
      icon: "🏍️"
    },
    {
      text: "How do I book a test drive?",
      category: "help",
      icon: "🚗"
    },
    {
      text: "What are the financing options?",
      category: "financing",
      icon: "💰"
    },
    {
      text: "Best electric scooters in 2024",
      category: "electric_vehicles",
      icon: "⚡"
    },
    {
      text: "Compare Honda vs Yamaha bikes",
      category: "comparison",
      icon: "⚖️"
    },
    {
      text: "Help with my account",
      category: "account",
      icon: "👤"
    }
  ];

  res.json({
    success: true,
    data: suggestions
  });
});

// POST /api/v1/chat/feedback - Submit chat feedback
router.post('/feedback', [
  body('conversationId')
    .isString()
    .withMessage('Conversation ID is required'),
  
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Comment must not exceed 500 characters')
], handleValidationErrors, (req, res) => {
  try {
    const { conversationId, rating, comment } = req.body;
    
    // In a real application, you would save this feedback to a database
    console.log(`[CHAT FEEDBACK] Conversation: ${conversationId}, Rating: ${rating}, Comment: ${comment || 'None'}`);
    
    res.json({
      success: true,
      message: 'Thank you for your feedback! We use it to improve our chatbot.',
      data: {
        conversationId,
        rating,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Chat feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

export default router;