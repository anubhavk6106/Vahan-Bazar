import { User, Vehicle } from '../models/index.js';
import bcrypt from 'bcryptjs';

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@vahanbazar.com',
    password: 'admin123',
    phone: '+91-9999999999',
    role: 'admin',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Vahan Bazar Head Office, Mumbai',
    is_verified: true,
    is_active: true
  },
  {
    name: 'Honda Dealer Mumbai',
    email: 'honda.mumbai@vahanbazar.com',
    password: 'dealer123',
    phone: '+91-9876543210',
    role: 'dealer',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Plot No. 123, Andheri East, Mumbai',
    is_verified: true,
    is_active: true
  },
  {
    name: 'Bajaj Dealer Delhi',
    email: 'bajaj.delhi@vahanbazar.com',
    password: 'dealer123',
    phone: '+91-9876543211',
    role: 'dealer',
    city: 'Delhi',
    state: 'Delhi',
    address: 'Sector 18, Noida, Delhi',
    is_verified: true,
    is_active: true
  },
  {
    name: 'John Customer',
    email: 'john.customer@gmail.com',
    password: 'user123',
    phone: '+91-9876543212',
    role: 'user',
    city: 'Bangalore',
    state: 'Karnataka',
    address: 'HSR Layout, Bangalore',
    is_verified: true,
    is_active: true
  }
];

const sampleVehicles = [
  // Bikes
  {
    name: 'Honda CB Shine',
    brand: 'Honda',
    model: 'CB Shine',
    category: 'bike',
    fuel_type: 'petrol',
    price: 75000,
    ex_showroom_price: 72000,
    on_road_price: 82000,
    engine_capacity: 125,
    power: 10.5,
    torque: 10.3,
    mileage: 65,
    top_speed: 95,
    fuel_tank_capacity: 10.5,
    transmission: 'manual',
    brakes_front: 'Disc',
    brakes_rear: 'Drum',
    suspension_front: 'Telescopic Fork',
    suspension_rear: 'Dual Spring Loaded Hydraulic Shock Absorbers',
    wheel_type: 'Alloy',
    kerb_weight: 123,
    colors_available: ['Black', 'Red', 'Blue'],
    key_features: ['Electric Start', 'LED Headlight', 'Digital Console'],
    description: 'Honda CB Shine is a reliable and fuel-efficient motorcycle perfect for daily commuting.',
    status: 'active',
    is_featured: true,
    rating: 4.2,
    review_count: 156
  },
  {
    name: 'Bajaj Pulsar NS200',
    brand: 'Bajaj',
    model: 'Pulsar NS200',
    category: 'bike',
    fuel_type: 'petrol',
    price: 145000,
    ex_showroom_price: 140000,
    on_road_price: 160000,
    engine_capacity: 199,
    power: 24.5,
    torque: 18.5,
    mileage: 35,
    top_speed: 136,
    fuel_tank_capacity: 12,
    transmission: 'manual',
    brakes_front: 'Disc',
    brakes_rear: 'Disc',
    suspension_front: 'Telescopic Fork',
    suspension_rear: 'Nitrox Mono Shock',
    wheel_type: 'Alloy',
    kerb_weight: 154,
    colors_available: ['Red', 'Black', 'White', 'Blue'],
    key_features: ['Liquid Cooling', 'Digital Console', 'ABS'],
    description: 'Bajaj Pulsar NS200 is a powerful naked bike with aggressive styling and performance.',
    status: 'active',
    is_featured: true,
    rating: 4.5,
    review_count: 243
  },
  {
    name: 'Royal Enfield Classic 350',
    brand: 'Royal Enfield',
    model: 'Classic 350',
    category: 'bike',
    fuel_type: 'petrol',
    price: 195000,
    ex_showroom_price: 190000,
    on_road_price: 215000,
    engine_capacity: 349,
    power: 20.2,
    torque: 27,
    mileage: 40,
    top_speed: 110,
    fuel_tank_capacity: 13.5,
    transmission: 'manual',
    brakes_front: 'Disc',
    brakes_rear: 'Drum',
    suspension_front: 'Telescopic Fork',
    suspension_rear: 'Twin Gas Charged Shock Absorbers',
    wheel_type: 'Spoke',
    kerb_weight: 195,
    colors_available: ['Black', 'Chrome Red', 'Stealth Black'],
    key_features: ['Retro Design', 'Tripper Navigation', 'Electric Start'],
    description: 'Royal Enfield Classic 350 combines vintage charm with modern engineering.',
    status: 'active',
    is_featured: true,
    rating: 4.3,
    review_count: 187
  },
  
  // Scooters
  {
    name: 'Honda Activa 6G',
    brand: 'Honda',
    model: 'Activa 6G',
    category: 'scooter',
    fuel_type: 'petrol',
    price: 72000,
    ex_showroom_price: 69000,
    on_road_price: 79000,
    engine_capacity: 109,
    power: 7.8,
    torque: 8.8,
    mileage: 60,
    top_speed: 85,
    fuel_tank_capacity: 5.3,
    transmission: 'automatic',
    brakes_front: 'Drum',
    brakes_rear: 'Drum',
    suspension_front: 'Telescopic Fork',
    suspension_rear: 'Spring Loaded Hydraulic Type',
    wheel_type: 'Alloy',
    kerb_weight: 109,
    colors_available: ['White', 'Black', 'Red', 'Grey'],
    key_features: ['LED Headlight', 'Silent Start', 'Smart Key System'],
    description: 'Honda Activa 6G is India\'s most trusted scooter with advanced features.',
    status: 'active',
    is_featured: true,
    rating: 4.4,
    review_count: 298
  },
  {
    name: 'TVS Jupiter',
    brand: 'TVS',
    model: 'Jupiter',
    category: 'scooter',
    fuel_type: 'petrol',
    price: 68000,
    ex_showroom_price: 65000,
    on_road_price: 75000,
    engine_capacity: 109,
    power: 7.8,
    torque: 8.4,
    mileage: 62,
    top_speed: 87,
    fuel_tank_capacity: 6,
    transmission: 'automatic',
    brakes_front: 'Drum',
    brakes_rear: 'Drum',
    suspension_front: 'Telescopic Fork',
    suspension_rear: 'Gas Filled Shock Absorber',
    wheel_type: 'Alloy',
    kerb_weight: 108,
    colors_available: ['Blue', 'Black', 'Red', 'White'],
    key_features: ['External Fuel Filler', 'Largest Boot Space', 'Mobile Charging Port'],
    description: 'TVS Jupiter offers comfort, convenience and class-leading mileage.',
    status: 'active',
    is_featured: false,
    rating: 4.1,
    review_count: 167
  },

  // Electric Vehicles
  {
    name: 'Ola S1 Pro',
    brand: 'Ola',
    model: 'S1 Pro',
    category: 'ev',
    fuel_type: 'electric',
    price: 130000,
    ex_showroom_price: 125000,
    on_road_price: 140000,
    power: 8.5,
    torque: 58,
    top_speed: 116,
    battery_capacity: 3.97,
    range: 181,
    charging_time: '4 hours (Normal), 18 minutes (Fast)',
    transmission: 'automatic',
    brakes_front: 'Disc',
    brakes_rear: 'Disc',
    suspension_front: 'Telescopic Fork',
    suspension_rear: 'Mono Shock',
    wheel_type: 'Alloy',
    kerb_weight: 118,
    colors_available: ['Red', 'Black', 'White', 'Blue'],
    key_features: ['Touchscreen Display', 'Reverse Mode', 'Hill Hold Assist'],
    description: 'Ola S1 Pro is a premium electric scooter with advanced tech features.',
    status: 'active',
    is_featured: true,
    rating: 4.0,
    review_count: 89
  },
  {
    name: 'TVS iQube Electric',
    brand: 'TVS',
    model: 'iQube Electric',
    category: 'ev',
    fuel_type: 'electric',
    price: 115000,
    ex_showroom_price: 110000,
    on_road_price: 125000,
    power: 4.4,
    torque: 140,
    top_speed: 78,
    battery_capacity: 2.25,
    range: 75,
    charging_time: '5 hours',
    transmission: 'automatic',
    brakes_front: 'Disc',
    brakes_rear: 'Drum',
    suspension_front: 'Telescopic Fork',
    suspension_rear: 'Coil Spring with Hydraulic Damper',
    wheel_type: 'Alloy',
    kerb_weight: 118,
    colors_available: ['White', 'Blue', 'Orange'],
    key_features: ['Smart Connectivity', 'TFT Display', 'Navigation'],
    description: 'TVS iQube Electric is an intelligent electric scooter with smart features.',
    status: 'active',
    is_featured: false,
    rating: 3.9,
    review_count: 45
  }
];

async function seedData() {
  try {
    console.log('🌱 Starting data seeding...');

    // Create sample users
    console.log('Creating sample dealers...');
    const createdUsers = [];
    
    for (const userData of sampleUsers) {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      
      createdUsers.push(user);
      console.log(`✅ Created dealer: ${user.name}`);
    }

    // Create sample vehicles
    console.log('Creating sample vehicles...');
    for (let i = 0; i < sampleVehicles.length; i++) {
      const vehicleData = sampleVehicles[i];
      
      // Assign dealer_id (alternate between the created dealers)
      const dealerIndex = i % createdUsers.length;
      vehicleData.dealer_id = createdUsers[dealerIndex].id;
      
      const vehicle = await Vehicle.create(vehicleData);
      console.log(`✅ Created vehicle: ${vehicle.name}`);
    }

    console.log('🎉 Data seeding completed successfully!');
    
    console.log('\n📊 Summary:');
    console.log(`- ${createdUsers.length} dealers created`);
    console.log(`- ${sampleVehicles.length} vehicles created`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedData();
}

export default seedData;