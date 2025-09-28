import { Favorite, Vehicle, User } from '../models/index.js';

export const addToFavorites = async (req, res) => {
  try {
    const { vehicle_id } = req.body;
    const user_id = req.user.userId;

    if (!vehicle_id) {
      return res.status(400).json({
        success: false,
        error: 'Vehicle ID is required'
      });
    }

    // Check if vehicle exists
    const vehicle = await Vehicle.findByPk(vehicle_id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found'
      });
    }

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      where: { user_id, vehicle_id }
    });

    if (existingFavorite) {
      return res.status(409).json({
        success: false,
        error: 'Vehicle is already in favorites'
      });
    }

    // Add to favorites
    const favorite = await Favorite.create({
      user_id,
      vehicle_id
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle added to favorites',
      data: favorite
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const removeFromFavorites = async (req, res) => {
  try {
    const { vehicle_id } = req.params;
    const user_id = req.user.userId;

    const favorite = await Favorite.findOne({
      where: { user_id, vehicle_id }
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found in favorites'
      });
    }

    await favorite.destroy();

    res.json({
      success: true,
      message: 'Vehicle removed from favorites'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getUserFavorites = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { rows: favorites, count } = await Favorite.findAndCountAll({
      where: { user_id },
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: [
            'id', 'name', 'brand', 'model', 'category', 
            'fuel_type', 'price', 'images', 'rating'
          ],
          include: [
            {
              model: User,
              as: 'dealer',
              attributes: ['id', 'name']
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
        favorites,
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

export const checkFavoriteStatus = async (req, res) => {
  try {
    const { vehicle_id } = req.params;
    const user_id = req.user.userId;

    const favorite = await Favorite.findOne({
      where: { user_id, vehicle_id }
    });

    res.json({
      success: true,
      data: {
        is_favorite: !!favorite
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};