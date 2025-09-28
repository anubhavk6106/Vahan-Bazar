import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  vehicle_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'vehicles',
      key: 'id'
    }
  },
  booking_type: {
    type: DataTypes.ENUM('test_ride', 'purchase_inquiry', 'emi_inquiry'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  preferred_date: {
    type: DataTypes.DATEONLY
  },
  preferred_time: {
    type: DataTypes.TIME
  },
  customer_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customer_phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customer_email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  city: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.TEXT
  },
  message: {
    type: DataTypes.TEXT
  },
  dealer_notes: {
    type: DataTypes.TEXT
  },
  confirmed_date: {
    type: DataTypes.DATEONLY
  },
  confirmed_time: {
    type: DataTypes.TIME
  },
  completed_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'bookings',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['vehicle_id']
    },
    {
      fields: ['booking_type']
    },
    {
      fields: ['status']
    },
    {
      fields: ['preferred_date']
    }
  ]
});

export default Booking;