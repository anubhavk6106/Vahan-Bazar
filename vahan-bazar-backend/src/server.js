import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Import database
import { sequelize, testConnection } from '../config/database.js';
import '../models/index.js'; // Initialize models and associations

// Import routes
import vehicleRoutes from '../routes/vehicles.js';
import authRoutes from '../routes/auth.js';
import userRoutes from '../routes/users.js';
import favoriteRoutes from '../routes/favorites.js';
import bookingRoutes from '../routes/bookings.js';
import uploadRoutes from '../routes/upload.js';
import adminRoutes from '../routes/admin.js';
import supportRoutes from '../routes/support.js';
import chatRoutes from '../routes/chat.js';

// Import middleware
import errorHandler from '../middleware/errorHandler.js';
import notFound from '../middleware/notFound.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Security middleware
app.use(helmet());

// ✅ Updated CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,   // Your Render frontend URL (set in env)
  "http://localhost:5173"     // Local Vite dev server
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Vahan Bazar API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API documentation endpoint
app.get(`/api/${API_VERSION}`, (req, res) => {
  res.json({
    message: 'Welcome to Vahan Bazar API',
    version: API_VERSION,
    endpoints: {
      auth: `/api/${API_VERSION}/auth`,
      users: `/api/${API_VERSION}/users`,
      vehicles: `/api/${API_VERSION}/vehicles`,
      favorites: `/api/${API_VERSION}/favorites`,
      bookings: `/api/${API_VERSION}/bookings`,
      upload: `/api/${API_VERSION}/upload`,
      support: `/api/${API_VERSION}/support`,
      chat: `/api/${API_VERSION}/chat`
    },
    features: [
      'User Authentication & Authorization',
      'Vehicle Management with Advanced Filtering',
      'Favorites/Wishlist System',
      'Test Ride & Inquiry Bookings',
      'Role-based Access Control',
      'AI-Powered Chatbot with Gemini API',
      'Help & Support System',
      'FAQ Management',
      'Support Ticket Management',
      'Intelligent Vehicle Recommendations',
      'Database Integration',
      'Image Upload with Cloudinary Integration'
    ],
    documentation: 'https://api.vahanbazar.com/docs'
  });
});

// API Routes
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/vehicles`, vehicleRoutes);
app.use(`/api/${API_VERSION}/favorites`, favoriteRoutes);
app.use(`/api/${API_VERSION}/bookings`, bookingRoutes);
app.use(`/api/${API_VERSION}/upload`, uploadRoutes);
app.use(`/api/${API_VERSION}/admin`, adminRoutes);
app.use(`/api/${API_VERSION}/support`, supportRoutes);
app.use(`/api/${API_VERSION}/chat`, chatRoutes);

// 👇 Friendly root route
app.get("/", (req, res) => {
  res.status(200).send("🚀 Vahan Bazar API is running! Use /api/v1 for endpoints.");
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Sync database (create tables if they don't exist)
    await sequelize.sync({ force: false });
    console.log('📊 Database synchronized successfully.');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`
🚀 Vahan Bazar API Server is running!
📍 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Port: ${PORT}
📖 API Documentation: http://localhost:${PORT}/api/${API_VERSION}
💊 Health Check: http://localhost:${PORT}/health
📊 Database: Connected
  `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

export default app;
