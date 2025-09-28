import sequelize from '../config/database.js';
import User from './User.js';
import Vehicle from './Vehicle.js';
import Booking from './Booking.js';
import Favorite from './Favorite.js';
import Review from './Review.js';
import Support from './Support.js';
import FAQ from './FAQ.js';

// Define associations
User.hasMany(Vehicle, { foreignKey: 'dealer_id', as: 'vehicles' });
Vehicle.belongsTo(User, { foreignKey: 'dealer_id', as: 'dealer' });

User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Vehicle.hasMany(Booking, { foreignKey: 'vehicle_id', as: 'bookings' });
Booking.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });

User.hasMany(Favorite, { foreignKey: 'user_id', as: 'favorites' });
Favorite.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Vehicle.hasMany(Favorite, { foreignKey: 'vehicle_id', as: 'favorites' });
Favorite.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });

User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Vehicle.hasMany(Review, { foreignKey: 'vehicle_id', as: 'reviews' });
Review.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });

// Many-to-many relationship through favorites
User.belongsToMany(Vehicle, { 
  through: Favorite, 
  foreignKey: 'user_id', 
  otherKey: 'vehicle_id',
  as: 'favoriteVehicles'
});

Vehicle.belongsToMany(User, { 
  through: Favorite, 
  foreignKey: 'vehicle_id', 
  otherKey: 'user_id',
  as: 'favoriteUsers'
});

// Support ticket associations
User.hasMany(Support, { foreignKey: 'user_id', as: 'support_tickets' });
Support.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Support, { foreignKey: 'assigned_to', as: 'assigned_tickets' });
Support.belongsTo(User, { foreignKey: 'assigned_to', as: 'assigned_admin' });

// FAQ associations
User.hasMany(FAQ, { foreignKey: 'created_by', as: 'created_faqs' });
FAQ.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(FAQ, { foreignKey: 'updated_by', as: 'updated_faqs' });
FAQ.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });

const models = {
  User,
  Vehicle,
  Booking,
  Favorite,
  Review,
  Support,
  FAQ,
  sequelize
};

export default models;
export { User, Vehicle, Booking, Favorite, Review, Support, FAQ, sequelize };
