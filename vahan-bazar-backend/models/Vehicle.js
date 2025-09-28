import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50]
    }
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 50]
    }
  },
  category: {
    type: DataTypes.ENUM('bike', 'scooter', 'ev'),
    allowNull: false
  },
  fuel_type: {
    type: DataTypes.ENUM('petrol', 'electric', 'hybrid'),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  ex_showroom_price: {
    type: DataTypes.DECIMAL(10, 2)
  },
  on_road_price: {
    type: DataTypes.DECIMAL(10, 2)
  },
  engine_capacity: {
    type: DataTypes.INTEGER,
    comment: 'Engine capacity in CC'
  },
  power: {
    type: DataTypes.DECIMAL(5, 2),
    comment: 'Power in HP/kW'
  },
  torque: {
    type: DataTypes.DECIMAL(5, 2),
    comment: 'Torque in Nm'
  },
  mileage: {
    type: DataTypes.DECIMAL(5, 2),
    comment: 'Mileage in km/l or km/charge'
  },
  top_speed: {
    type: DataTypes.INTEGER,
    comment: 'Top speed in km/h'
  },
  fuel_tank_capacity: {
    type: DataTypes.DECIMAL(4, 2),
    comment: 'Fuel tank capacity in litres'
  },
  battery_capacity: {
    type: DataTypes.DECIMAL(5, 2),
    comment: 'Battery capacity in kWh (for electric vehicles)'
  },
  range: {
    type: DataTypes.INTEGER,
    comment: 'Range in km (for electric vehicles)'
  },
  charging_time: {
    type: DataTypes.STRING,
    comment: 'Charging time (for electric vehicles)'
  },
  transmission: {
    type: DataTypes.ENUM('manual', 'automatic', 'cvt'),
    defaultValue: 'manual'
  },
  brakes_front: {
    type: DataTypes.STRING
  },
  brakes_rear: {
    type: DataTypes.STRING
  },
  suspension_front: {
    type: DataTypes.STRING
  },
  suspension_rear: {
    type: DataTypes.STRING
  },
  wheel_type: {
    type: DataTypes.STRING
  },
  tyre_front: {
    type: DataTypes.STRING
  },
  tyre_rear: {
    type: DataTypes.STRING
  },
  dimensions_length: {
    type: DataTypes.DECIMAL(6, 2),
    comment: 'Length in mm'
  },
  dimensions_width: {
    type: DataTypes.DECIMAL(6, 2),
    comment: 'Width in mm'
  },
  dimensions_height: {
    type: DataTypes.DECIMAL(6, 2),
    comment: 'Height in mm'
  },
  wheelbase: {
    type: DataTypes.DECIMAL(6, 2),
    comment: 'Wheelbase in mm'
  },
  ground_clearance: {
    type: DataTypes.DECIMAL(5, 2),
    comment: 'Ground clearance in mm'
  },
  seat_height: {
    type: DataTypes.DECIMAL(5, 2),
    comment: 'Seat height in mm'
  },
  kerb_weight: {
    type: DataTypes.DECIMAL(5, 2),
    comment: 'Kerb weight in kg'
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  colors_available: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  key_features: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  description: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'discontinued'),
    defaultValue: 'active'
  },
  launch_date: {
    type: DataTypes.DATEONLY
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  review_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  dealer_id: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'vehicles',
  indexes: [
    {
      fields: ['brand']
    },
    {
      fields: ['category']
    },
    {
      fields: ['fuel_type']
    },
    {
      fields: ['price']
    },
    {
      fields: ['status']
    },
    {
      fields: ['is_featured']
    }
  ]
});

export default Vehicle;