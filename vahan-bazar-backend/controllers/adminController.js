import { Op } from 'sequelize';
import { User, Vehicle, Booking, Favorite, Review } from '../models/index.js';
import bcrypt from 'bcryptjs';

// Get admin dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalDealers,
      totalVehicles,
      totalBookings,
      pendingBookings,
      activeVehicles
    ] = await Promise.all([
      User.count({ where: { role: 'user', is_active: true } }),
      User.count({ where: { role: 'dealer', is_active: true } }),
      Vehicle.count(),
      Booking.count(),
      Booking.count({ where: { status: 'pending' } }),
      Vehicle.count({ where: { status: 'active' } })
    ]);

    res.json({
      success: true,
      data: {
        users: totalUsers,
        dealers: totalDealers,
        vehicles: totalVehicles,
        bookings: totalBookings,
        pendingBookings,
        activeVehicles
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all users with pagination and filtering
export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      search,
      status = 'all'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereCondition = {};

    if (role && role !== 'all') {
      whereCondition.role = role;
    }

    if (status !== 'all') {
      whereCondition.is_active = status === 'active';
    }

    if (search) {
      whereCondition[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { rows: users, count } = await User.findAndCountAll({
      where: whereCondition,
      attributes: { exclude: ['password', 'reset_password_token', 'verification_token'] },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
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

// Update user status (activate/deactivate)
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { is_active } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Don't allow admin to deactivate themselves
    if (user.id === req.user.userId && !is_active) {
      return res.status(400).json({
        success: false,
        error: 'Cannot deactivate your own account'
      });
    }

    await user.update({ is_active });

    res.json({
      success: true,
      message: `User ${is_active ? 'activated' : 'deactivated'} successfully`,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_active: user.is_active
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create new user (including dealers)
export const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role = 'user',
      city,
      state,
      address
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      city,
      state,
      address,
      is_verified: true, // Admin-created users are pre-verified
      is_active: true
    });

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`,
      data: userResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all vehicles for admin management
export const getAllVehiclesAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = 'all',
      category,
      dealer_id,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const whereCondition = {};

    if (status !== 'all') {
      whereCondition.status = status;
    }

    if (category && category !== 'all') {
      whereCondition.category = category;
    }

    if (dealer_id) {
      whereCondition.dealer_id = dealer_id;
    }

    if (search) {
      whereCondition[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } },
        { model: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { rows: vehicles, count } = await Vehicle.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: 'dealer',
          attributes: ['id', 'name', 'email', 'phone', 'city']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        vehicles,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
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

// Update vehicle status
export const updateVehicleStatus = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive', 'discontinued'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be active, inactive, or discontinued'
      });
    }

    const vehicle = await Vehicle.findByPk(vehicleId, {
      include: [
        {
          model: User,
          as: 'dealer',
          attributes: ['name', 'email']
        }
      ]
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found'
      });
    }

    await vehicle.update({ status });

    res.json({
      success: true,
      message: `Vehicle status updated to ${status}`,
      data: {
        id: vehicle.id,
        name: vehicle.name,
        status: vehicle.status,
        dealer: vehicle.dealer
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all bookings for admin management
export const getAllBookings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = 'all',
      booking_type,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const whereCondition = {};

    if (status !== 'all') {
      whereCondition.status = status;
    }

    if (booking_type && booking_type !== 'all') {
      whereCondition.booking_type = booking_type;
    }

    if (search) {
      whereCondition[Op.or] = [
        { customer_name: { [Op.iLike]: `%${search}%` } },
        { customer_email: { [Op.iLike]: `%${search}%` } },
        { customer_phone: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { rows: bookings, count } = await Booking.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'name', 'brand', 'model', 'price'],
          include: [
            {
              model: User,
              as: 'dealer',
              attributes: ['id', 'name', 'email', 'phone']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
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

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, dealer_notes } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    const updateData = { status };
    if (dealer_notes) {
      updateData.dealer_notes = dealer_notes;
    }

    if (status === 'completed') {
      updateData.completed_at = new Date();
    }

    await booking.update(updateData);

    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete vehicle (admin only)
export const deleteVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found'
      });
    }

    // Check if vehicle has associated bookings or favorites
    const [bookingsCount, favoritesCount] = await Promise.all([
      Booking.count({ where: { vehicle_id: vehicleId } }),
      Favorite.count({ where: { vehicle_id: vehicleId } })
    ]);

    if (bookingsCount > 0 || favoritesCount > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete vehicle with existing bookings or favorites. Consider marking it as discontinued instead.'
      });
    }

    await vehicle.destroy();

    res.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};