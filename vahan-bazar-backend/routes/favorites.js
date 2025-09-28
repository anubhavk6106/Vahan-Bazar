import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  checkFavoriteStatus
} from '../controllers/favoriteController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @desc    Add vehicle to favorites
// @route   POST /api/v1/favorites
// @access  Private
router.post('/', addToFavorites);

// @desc    Get user's favorites
// @route   GET /api/v1/favorites
// @access  Private
router.get('/', getUserFavorites);

// @desc    Check if vehicle is in favorites
// @route   GET /api/v1/favorites/check/:vehicle_id
// @access  Private
router.get('/check/:vehicle_id', checkFavoriteStatus);

// @desc    Remove vehicle from favorites
// @route   DELETE /api/v1/favorites/:vehicle_id
// @access  Private
router.delete('/:vehicle_id', removeFromFavorites);

export default router;