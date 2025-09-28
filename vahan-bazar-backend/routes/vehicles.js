import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicleBrands,
  getFeaturedVehicles,
  searchVehicles
} from '../controllers/vehicleController.js';

const router = express.Router();

// Public routes
router.get('/', getAllVehicles);
router.get('/search', searchVehicles);
router.get('/featured', getFeaturedVehicles);
router.get('/meta/brands', getVehicleBrands);
router.get('/:id', getVehicleById);

// Protected routes (require authentication)
router.post('/', authenticate, createVehicle);
router.put('/:id', authenticate, updateVehicle);
router.delete('/:id', authenticate, deleteVehicle);

export default router;