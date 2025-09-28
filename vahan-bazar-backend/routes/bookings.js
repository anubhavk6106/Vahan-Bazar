import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getDealerBookings
} from '../controllers/bookingController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @desc    Create new booking
// @route   POST /api/v1/bookings
// @access  Private
router.post('/', createBooking);

// @desc    Get user's bookings
// @route   GET /api/v1/bookings
// @access  Private
router.get('/', getUserBookings);

// @desc    Get dealer's bookings
// @route   GET /api/v1/bookings/dealer
// @access  Private (Dealer/Admin only)
router.get('/dealer', getDealerBookings);

// @desc    Get booking by ID
// @route   GET /api/v1/bookings/:id
// @access  Private
router.get('/:id', getBookingById);

// @desc    Update booking status
// @route   PUT /api/v1/bookings/:id/status
// @access  Private (Dealer/Admin only)
router.put('/:id/status', updateBookingStatus);

// @desc    Cancel booking
// @route   PUT /api/v1/bookings/:id/cancel
// @access  Private
router.put('/:id/cancel', cancelBooking);

export default router;