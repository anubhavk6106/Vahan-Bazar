import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  createUser,
  getAllVehiclesAdmin,
  updateVehicleStatus,
  deleteVehicle,
  getAllBookings,
  updateBookingStatus
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// User Management
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.patch('/users/:userId/status', updateUserStatus);

// Vehicle Management
router.get('/vehicles', getAllVehiclesAdmin);
router.patch('/vehicles/:vehicleId/status', updateVehicleStatus);
router.delete('/vehicles/:vehicleId', deleteVehicle);

// Booking Management
router.get('/bookings', getAllBookings);
router.patch('/bookings/:bookingId/status', updateBookingStatus);

export default router;