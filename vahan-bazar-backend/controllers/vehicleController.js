import { Op } from 'sequelize';
import { Vehicle, User, Review, Favorite } from '../models/index.js';
import Joi from 'joi';

// Validation schema for vehicle creation/update
const vehicleSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  brand: Joi.string().min(2).max(50).required(),
  model: Joi.string().min(1).max(50).required(),
  category: Joi.string().valid('bike', 'scooter', 'ev').required(),
  fuel_type: Joi.string().valid('petrol', 'electric', 'hybrid').required(),
  price: Joi.number().min(0).required(),
  ex_showroom_price: Joi.number().min(0).optional(),
  on_road_price: Joi.number().min(0).optional(),
  engine_capacity: Joi.number().integer().min(0).optional(),
  power: Joi.number().min(0).optional(),
  torque: Joi.number().min(0).optional(),
  mileage: Joi.number().min(0).optional(),
  top_speed: Joi.number().integer().min(0).optional(),
  fuel_tank_capacity: Joi.number().min(0).optional(),
  battery_capacity: Joi.number().min(0).optional(),
  range: Joi.number().integer().min(0).optional(),
  charging_time: Joi.string().optional(),
  transmission: Joi.string().valid('manual', 'automatic', 'cvt').optional(),
  brakes_front: Joi.string().optional(),
  brakes_rear: Joi.string().optional(),
  suspension_front: Joi.string().optional(),
  suspension_rear: Joi.string().optional(),
  wheel_type: Joi.string().optional(),
  tyre_front: Joi.string().optional(),
  tyre_rear: Joi.string().optional(),
  dimensions_length: Joi.number().min(0).optional(),
  dimensions_width: Joi.number().min(0).optional(),
  dimensions_height: Joi.number().min(0).optional(),
  wheelbase: Joi.number().min(0).optional(),
  ground_clearance: Joi.number().min(0).optional(),
  seat_height: Joi.number().min(0).optional(),
  kerb_weight: Joi.number().min(0).optional(),
  images: Joi.array().items(Joi.string()).optional(),
  colors_available: Joi.array().items(Joi.string()).optional(),
  key_features: Joi.array().items(Joi.string()).optional(),
  description: Joi.string().optional(),
  status: Joi.string().valid('active', 'inactive', 'discontinued').optional(),
  launch_date: Joi.date().optional(),
  is_featured: Joi.boolean().optional()
});

export const getAllVehicles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      brand,
      fuel_type,
      min_price,
      max_price,
      sortBy = 'created_at',
      sortOrder = 'desc',
      search,
      is_featured
    } = req.query;

    const offset = (page - 1) * limit;
    const whereCondition = { status: 'active' };

    // Apply filters
    if (category) {
      // Map plural categories from frontend to singular categories in database
      const categoryMap = {
        'bikes': 'bike',
        'scooters': 'scooter', 
        'evs': 'ev'
      };
      whereCondition.category = categoryMap[category] || category;
    }
    if (brand) whereCondition.brand = brand;
    if (fuel_type) whereCondition.fuel_type = fuel_type;
    if (is_featured) whereCondition.is_featured = is_featured === 'true';

    // Price range filter
    if (min_price || max_price) {
      whereCondition.price = {};
      if (min_price) whereCondition.price[Op.gte] = min_price;
      if (max_price) whereCondition.price[Op.lte] = max_price;
    }

    // Search filter
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
          attributes: ['id', 'name', 'phone', 'email']
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
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

export const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const vehicle = await Vehicle.findByPk(id, {
      include: [
        {
          model: User,
          as: 'dealer',
          attributes: ['id', 'name', 'phone', 'email', 'city', 'address']
        },
        {
          model: Review,
          as: 'reviews',
          where: { is_approved: true },
          required: false,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['name']
            }
          ]
        }
      ]
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found'
      });
    }

    // Check if user has favorited this vehicle
    let is_favorite = false;
    if (userId) {
      const favorite = await Favorite.findOne({
        where: { user_id: userId, vehicle_id: id }
      });
      is_favorite = !!favorite;
    }

    res.json({
      success: true,
      data: {
        ...vehicle.toJSON(),
        is_favorite
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const createVehicle = async (req, res) => {
  try {
    const { error, value } = vehicleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Check if user is dealer or admin
    if (req.user.role !== 'dealer' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only dealers and admins can create vehicles'
      });
    }

    const vehicle = await Vehicle.create({
      ...value,
      dealer_id: req.user.userId
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = vehicleSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found'
      });
    }

    // Check if user owns this vehicle or is admin
    if (req.user.role !== 'admin' && vehicle.dealer_id !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only update your own vehicles'
      });
    }

    await vehicle.update(value);

    res.json({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found'
      });
    }

    // Check if user owns this vehicle or is admin
    if (req.user.role !== 'admin' && vehicle.dealer_id !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own vehicles'
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

export const getVehicleBrands = async (req, res) => {
  try {
    const brands = await Vehicle.findAll({
      attributes: ['brand'],
      group: ['brand'],
      where: { status: 'active' },
      order: [['brand', 'ASC']]
    });

    const brandList = brands.map(item => item.brand);

    res.json({
      success: true,
      data: brandList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getFeaturedVehicles = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const vehicles = await Vehicle.findAll({
      where: { 
        status: 'active',
        is_featured: true
      },
      include: [
        {
          model: User,
          as: 'dealer',
          attributes: ['id', 'name']
        }
      ],
      limit: parseInt(limit),
      order: [['rating', 'DESC'], ['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const searchVehicles = async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters long'
      });
    }

    const vehicles = await Vehicle.findAll({
      where: {
        status: 'active',
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { brand: { [Op.iLike]: `%${query}%` } },
          { model: { [Op.iLike]: `%${query}%` } }
        ]
      },
      attributes: ['id', 'name', 'brand', 'model', 'price', 'images'],
      limit: parseInt(limit),
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};