import { Booking, Vehicle, User } from '../models/index.js';
import Joi from 'joi';

// Validation schema for booking creation
const bookingSchema = Joi.object({
  vehicle_id: Joi.string().uuid().required(),
  booking_type: Joi.string().valid('test_ride', 'purchase_inquiry', 'emi_inquiry').required(),
  preferred_date: Joi.date().min('now').required(),
  preferred_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  customer_name: Joi.string().min(2).max(50).required(),
  customer_phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).required(),
  customer_email: Joi.string().email().optional(),
  city: Joi.string().min(2).max(50).optional(),
  address: Joi.string().max(500).optional(),
  message: Joi.string().max(1000).optional()
});

export const createBooking = async (req, res) => {
  try {
    const { error, value } = bookingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const user_id = req.user.userId;

    // Check if vehicle exists
    const vehicle = await Vehicle.findByPk(value.vehicle_id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found'
      });
    }

    // Check for duplicate bookings on the same day
    const existingBooking = await Booking.findOne({
      where: {
        user_id,
        vehicle_id: value.vehicle_id,
        preferred_date: value.preferred_date,
        status: ['pending', 'confirmed']
      }
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        error: 'You already have a booking for this vehicle on the selected date'
      });
    }

    const booking = await Booking.create({
      ...value,
      user_id
    });

    // Fetch the created booking with related data
    const bookingWithDetails = await Booking.findByPk(booking.id, {
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'name', 'brand', 'model', 'images']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: bookingWithDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const whereCondition = { user_id };
    if (status) whereCondition.status = status;

    const { rows: bookings, count } = await Booking.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: [
            'id', 'name', 'brand', 'model', 'category', 
            'fuel_type', 'price', 'images'
          ],
          include: [
            {
              model: User,
              as: 'dealer',
              attributes: ['id', 'name', 'phone', 'email']
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit),
          hasNextPage: page * limit < count,
          hasPreviousPage: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.userId;

    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: [
            'id', 'name', 'brand', 'model', 'category',
            'fuel_type', 'price', 'images'
          ],
          include: [
            {
              model: User,
              as: 'dealer',
              attributes: ['id', 'name', 'phone', 'email', 'address']
            }
          ]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if user owns this booking or is dealer/admin
    if (booking.user_id !== user_id && 
        req.user.role !== 'admin' && 
        booking.vehicle.dealer_id !== user_id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, confirmed_date, confirmed_time, dealer_notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['dealer_id']
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if user is dealer/admin
    if (req.user.role !== 'admin' && booking.vehicle.dealer_id !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Only dealers and admins can update booking status'
      });
    }

    const updateData = { status };
    if (confirmed_date) updateData.confirmed_date = confirmed_date;
    if (confirmed_time) updateData.confirmed_time = confirmed_time;
    if (dealer_notes) updateData.dealer_notes = dealer_notes;
    if (status === 'completed') updateData.completed_at = new Date();

    await booking.update(updateData);

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.userId;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.user_id !== user_id) {
      return res.status(403).json({
        success: false,
        error: 'You can only cancel your own bookings'
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel this booking'
      });
    }

    await booking.update({ status: 'cancelled' });

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getDealerBookings = async (req, res) => {
  try {
    const dealer_id = req.user.userId;
    const { page = 1, limit = 10, status, booking_type } = req.query;
    const offset = (page - 1) * limit;

    // Check if user is dealer
    if (req.user.role !== 'dealer' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const whereCondition = {};
    if (status) whereCondition.status = status;
    if (booking_type) whereCondition.booking_type = booking_type;

    const { rows: bookings, count } = await Booking.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          where: { dealer_id },
          attributes: ['id', 'name', 'brand', 'model', 'images']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'phone', 'email']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit),
          hasNextPage: page * limit < count,
          hasPreviousPage: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};