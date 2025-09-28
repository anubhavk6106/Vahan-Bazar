import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Review = sequelize.define('Review', {
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
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  title: {
    type: DataTypes.STRING,
    validate: {
      len: [5, 100]
    }
  },
  review_text: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 2000]
    }
  },
  pros: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  cons: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  ownership_duration: {
    type: DataTypes.STRING,
    comment: 'How long they have owned the vehicle'
  },
  purchase_year: {
    type: DataTypes.INTEGER
  },
  verified_purchase: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  helpful_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'reviews',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['vehicle_id']
    },
    {
      fields: ['rating']
    },
    {
      fields: ['is_approved']
    }
  ]
});

export default Review;