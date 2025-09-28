import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const FAQ = sequelize.define('FAQ', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 500]
    }
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [20, 2000]
    }
  },
  category: {
    type: DataTypes.ENUM(
      'general',
      'account',
      'vehicles',
      'booking',
      'payment',
      'technical',
      'policies'
    ),
    allowNull: false
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  helpful_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  created_by: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  updated_by: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'faqs',
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['sort_order']
    },
    {
      fields: ['view_count']
    }
  ]
});

export default FAQ;