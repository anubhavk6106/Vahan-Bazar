import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Support = sequelize.define('Support', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  ticket_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    validate: {
      is: /^[0-9+\-\s()]+$/
    }
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, 200]
    }
  },
  category: {
    type: DataTypes.ENUM(
      'account', 
      'vehicles', 
      'booking', 
      'payment', 
      'technical', 
      'feedback', 
      'other'
    ),
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
    defaultValue: 'open'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  admin_response: {
    type: DataTypes.TEXT
  },
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  assigned_to: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  resolved_at: {
    type: DataTypes.DATE
  },
  closed_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'support_tickets',
  indexes: [
    {
      unique: true,
      fields: ['ticket_id']
    },
    {
      fields: ['category']
    },
    {
      fields: ['status']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['user_id']
    }
  ],
  hooks: {
    beforeCreate: async (support) => {
      // Generate ticket ID
      const timestamp = Date.now().toString();
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      support.ticket_id = `VB${timestamp.slice(-6)}${random}`;
    }
  }
});

export default Support;