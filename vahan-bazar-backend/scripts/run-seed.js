import dotenv from 'dotenv';
import { sequelize, testConnection } from '../config/database.js';
import '../models/index.js'; // Initialize models
import seedData from './seed-data.js';

// Load environment variables
dotenv.config();

async function runSeeding() {
  try {
    console.log('🔌 Connecting to database...');
    
    // Test database connection
    await testConnection();
    
    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('📊 Database synchronized successfully.');
    
    // Run seeding
    await seedData();
    
  } catch (error) {
    console.error('❌ Error running seeding:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await sequelize.close();
    console.log('🔐 Database connection closed.');
  }
}

runSeeding();