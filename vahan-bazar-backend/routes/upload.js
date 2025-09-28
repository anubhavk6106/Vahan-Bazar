import express from 'express';
import { authenticate } from '../middleware/auth.js';
import upload, { deleteImage, getPublicIdFromUrl } from '../config/cloudinary.js';
import { Vehicle } from '../models/index.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @desc    Upload vehicle images
// @route   POST /api/v1/upload/vehicle-images/:vehicleId
// @access  Private (Dealer/Admin only)
router.post('/vehicle-images/:vehicleId', upload.array('images', 10), async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No images uploaded'
      });
    }

    // Check if vehicle exists and user has permission
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found'
      });
    }

    // Check permission (owner or admin)
    if (req.user.role !== 'admin' && vehicle.dealer_id !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only upload images for your own vehicles'
      });
    }

    // Process uploaded files
    const imageUrls = files.map(file => file.path);
    
    // Get existing images
    const existingImages = vehicle.images || [];
    
    // Combine existing and new images
    const updatedImages = [...existingImages, ...imageUrls];
    
    // Update vehicle with new images
    await vehicle.update({ images: updatedImages });

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: {
        uploaded: imageUrls.length,
        total: updatedImages.length,
        images: updatedImages
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Delete vehicle image
// @route   DELETE /api/v1/upload/vehicle-images/:vehicleId
// @access  Private (Dealer/Admin only)
router.delete('/vehicle-images/:vehicleId', async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Image URL is required'
      });
    }

    // Check if vehicle exists and user has permission
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found'
      });
    }

    // Check permission (owner or admin)
    if (req.user.role !== 'admin' && vehicle.dealer_id !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete images for your own vehicles'
      });
    }

    const existingImages = vehicle.images || [];
    const imageIndex = existingImages.indexOf(imageUrl);
    
    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Image not found in vehicle'
      });
    }

    // Remove image from Cloudinary
    try {
      const publicId = getPublicIdFromUrl(imageUrl);
      if (publicId) {
        await deleteImage(publicId);
      }
    } catch (cloudinaryError) {
      console.error('Error deleting from Cloudinary:', cloudinaryError);
      // Continue even if Cloudinary deletion fails
    }

    // Remove image from vehicle
    const updatedImages = existingImages.filter((_, index) => index !== imageIndex);
    await vehicle.update({ images: updatedImages });

    res.json({
      success: true,
      message: 'Image deleted successfully',
      data: {
        remaining: updatedImages.length,
        images: updatedImages
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Upload single image (general purpose)
// @route   POST /api/v1/upload/single
// @access  Private
router.post('/single', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No image uploaded'
      });
    }

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: file.path,
        publicId: file.filename
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Upload multiple images (general purpose)
// @route   POST /api/v1/upload/multiple
// @access  Private
router.post('/multiple', upload.array('images', 10), async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No images uploaded'
      });
    }

    const imageUrls = files.map(file => ({
      url: file.path,
      publicId: file.filename
    }));

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: {
        count: imageUrls.length,
        images: imageUrls
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size too large. Maximum size is 5MB per file.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files. Maximum 10 files allowed.'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }

  next(error);
});

export default router;