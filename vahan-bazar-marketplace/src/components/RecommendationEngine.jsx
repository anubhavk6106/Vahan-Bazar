import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Eye, ShoppingCart, TrendingUp, Users, Zap, Fuel, IndianRupee, ChevronRight } from 'lucide-react';

const RecommendationEngine = ({ userId, userPreferences, viewedVehicles }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('for-you');

  // User preferences based on browsing behavior and profile
  const mockUserPreferences = {
    budgetRange: [75000, 180000],
    fuelTypes: ['petrol', 'electric'],
    brands: ['Honda', 'Yamaha', 'TVS', 'Hero', 'Bajaj'],
    vehicleTypes: ['bike', 'scooter', 'electric'],
    features: ['abs', 'bluetooth', 'led-lights', 'digital-display', 'disc-brakes'],
    usage: 'daily-commute',
    preferredCC: '125-200cc',
    location: 'Mumbai'
  };

  const mockViewedVehicles = [
    { id: 1, brand: 'Honda', model: 'CB Shine', price: 85000, category: 'bike' },
    { id: 2, brand: 'Yamaha', model: 'FZ-S', price: 115000, category: 'bike' },
    { id: 3, brand: 'TVS', model: 'Jupiter', price: 75000, category: 'scooter' }
  ];

  // Mock recommendations based on different algorithms
  const mockRecommendations = {
    'for-you': [
      {
        id: 101,
        name: 'Honda CB Hornet 2.0',
        brand: 'Honda',
        price: 125000,
        originalPrice: 135000,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
        rating: 4.5,
        reviews: 1250,
        fuelType: 'Petrol',
        mileage: '45 km/l',
        engine: '184cc',
        features: ['ABS', 'LED Headlight', 'Digital Display', 'Disc Brakes'],
        matchScore: 95,
        matchReasons: ['Based on your Honda preference', 'Within your budget range', 'Perfect for Mumbai traffic'],
        badgeText: 'Perfect Match',
        badgeColor: 'bg-green-500'
      },
      {
        id: 102,
        name: 'TVS Apache RTR 160 4V',
        brand: 'TVS',
        price: 115000,
        originalPrice: 120000,
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=300&h=200&fit=crop',
        rating: 4.3,
        reviews: 890,
        fuelType: 'Petrol',
        mileage: '50 km/l',
        engine: '159cc',
        features: ['ABS', 'Bluetooth', 'GTT Suspension', 'LED DRL'],
        matchScore: 92,
        matchReasons: ['TVS brand preference', 'Sport riding features', 'Great value for money'],
        badgeText: 'Best Value',
        badgeColor: 'bg-blue-500'
      },
      {
        id: 103,
        name: 'Yamaha MT-15 V2',
        brand: 'Yamaha',
        price: 165000,
        originalPrice: 170000,
        image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=300&h=200&fit=crop',
        rating: 4.6,
        reviews: 750,
        fuelType: 'Petrol',
        mileage: '52 km/l',
        engine: '155cc',
        features: ['ABS', 'USD Forks', 'LED Lights', 'Digital Display'],
        matchScore: 89,
        matchReasons: ['Premium Yamaha quality', 'Excellent handling', 'Modern features'],
        badgeText: 'Premium Choice',
        badgeColor: 'bg-purple-500'
      },
      {
        id: 104,
        name: 'Hero Xpulse 200T',
        brand: 'Hero',
        price: 135000,
        originalPrice: 140000,
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=300&h=200&fit=crop',
        rating: 4.2,
        reviews: 425,
        fuelType: 'Petrol',
        mileage: '45 km/l',
        engine: '200cc',
        features: ['ABS', 'Bluetooth', 'LED Lights', 'Adventure Ready'],
        matchScore: 86,
        matchReasons: ['Adventure touring capability', 'Hero reliability', 'Good for long rides'],
        badgeText: 'Adventure',
        badgeColor: 'bg-orange-500'
      }
    ],
    'trending': [
      {
        id: 201,
        name: 'Ola S1 Pro Gen 2',
        brand: 'Ola',
        price: 140000,
        originalPrice: 145000,
        image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=300&h=200&fit=crop',
        rating: 4.2,
        reviews: 1420,
        fuelType: 'Electric',
        mileage: '181 km/charge',
        engine: 'Electric Motor',
        features: ['App Connectivity', 'Reverse Mode', 'Fast Charging', 'Navigation'],
        matchScore: 88,
        matchReasons: ['Electric vehicle trend', 'Zero fuel cost', 'Government subsidies available'],
        badgeText: 'Electric Trend',
        badgeColor: 'bg-green-500',
        trendingData: { views: '25.2K', growth: '+45%' }
      },
      {
        id: 202,
        name: 'Bajaj Pulsar NS200 Fi',
        brand: 'Bajaj',
        price: 138000,
        originalPrice: 142000,
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=300&h=200&fit=crop',
        rating: 4.6,
        reviews: 2100,
        fuelType: 'Petrol',
        mileage: '40 km/l',
        engine: '199cc',
        features: ['Liquid Cooling', 'ABS', 'LED DRL', 'Digital Console'],
        matchScore: 84,
        matchReasons: ['Most searched this week', 'Strong performance', 'Excellent build quality'],
        badgeText: 'Hot Seller',
        badgeColor: 'bg-red-500',
        trendingData: { views: '18.8K', growth: '+28%' }
      },
      {
        id: 203,
        name: 'KTM Duke 200',
        brand: 'KTM',
        price: 175000,
        originalPrice: 180000,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
        rating: 4.7,
        reviews: 1650,
        fuelType: 'Petrol',
        mileage: '38 km/l',
        engine: '199cc',
        features: ['ABS', 'USD Forks', 'TFT Display', 'Slipper Clutch'],
        matchScore: 85,
        matchReasons: ['Premium European brand', 'Race-inspired design', 'Growing popularity'],
        badgeText: 'Rising Star',
        badgeColor: 'bg-orange-500',
        trendingData: { views: '16.5K', growth: '+35%' }
      }
    ],
    'similar': [
      {
        id: 301,
        name: 'Honda CB Shine SP',
        brand: 'Honda',
        price: 78000,
        originalPrice: 82000,
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=300&h=200&fit=crop',
        rating: 4.4,
        reviews: 1280,
        fuelType: 'Petrol',
        mileage: '65 km/l',
        engine: '125cc',
        features: ['CBS', 'LED Headlight', 'Alloy Wheels', 'Digital Console'],
        matchScore: 90,
        matchReasons: ['Same Honda family', 'Excellent fuel efficiency', 'Proven reliability'],
        badgeText: 'Same Brand',
        badgeColor: 'bg-blue-500',
        similarTo: 'Honda CB Hornet 2.0'
      },
      {
        id: 302,
        name: 'TVS Apache RTR 180',
        brand: 'TVS',
        price: 105000,
        originalPrice: 110000,
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=300&h=200&fit=crop',
        rating: 4.3,
        reviews: 950,
        fuelType: 'Petrol',
        mileage: '48 km/l',
        engine: '177cc',
        features: ['ABS', 'LED DRL', 'Bluetooth', 'Race Tuned'],
        matchScore: 87,
        matchReasons: ['Similar performance category', 'Sport commuter', 'Value for money'],
        badgeText: 'Similar Style',
        badgeColor: 'bg-gray-500',
        similarTo: 'TVS Apache RTR 160 4V'
      }
    ],
    'budget': [
      {
        id: 401,
        name: 'Hero Splendor Plus Xtec',
        brand: 'Hero',
        price: 72000,
        originalPrice: 75000,
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=300&h=200&fit=crop',
        rating: 4.2,
        reviews: 2500,
        fuelType: 'Petrol',
        mileage: '68 km/l',
        engine: '97cc',
        features: ['i3S Technology', 'LED DRL', 'Digital Console', 'USB Charger'],
        matchScore: 80,
        matchReasons: ['Best fuel economy', 'Affordable maintenance', 'Proven reliability'],
        badgeText: 'Best Economy',
        badgeColor: 'bg-green-500'
      },
      {
        id: 402,
        name: 'TVS Star City Plus',
        brand: 'TVS',
        price: 69000,
        originalPrice: 72000,
        image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=300&h=200&fit=crop',
        rating: 4.0,
        reviews: 1200,
        fuelType: 'Petrol',
        mileage: '65 km/l',
        engine: '109cc',
        features: ['EcoThrust Engine', 'LED Headlight', 'Alloy Wheels', 'Mobile Charging'],
        matchScore: 76,
        matchReasons: ['Great value for money', 'Good build quality', 'Modern features'],
        badgeText: 'Value Pick',
        badgeColor: 'bg-yellow-500'
      },
      {
        id: 403,
        name: 'Bajaj CT 100',
        brand: 'Bajaj',
        price: 65000,
        originalPrice: 67000,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
        rating: 3.9,
        reviews: 850,
        fuelType: 'Petrol',
        mileage: '70 km/l',
        engine: '102cc',
        features: ['Anti-Skid Brakes', 'Tubeless Tyres', 'Electric Start', 'Long Seat'],
        matchScore: 73,
        matchReasons: ['Most affordable option', 'Excellent mileage', 'Low running cost'],
        badgeText: 'Most Affordable',
        badgeColor: 'bg-red-500'
      }
    ]
  };

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { id: 'for-you', name: 'For You', icon: <Star className="h-4 w-4" />, count: mockRecommendations['for-you']?.length || 0 },
    { id: 'trending', name: 'Trending', icon: <TrendingUp className="h-4 w-4" />, count: mockRecommendations.trending?.length || 0 },
    { id: 'similar', name: 'Similar', icon: <Eye className="h-4 w-4" />, count: mockRecommendations.similar?.length || 0 },
    { id: 'budget', name: 'Budget Picks', icon: <IndianRupee className="h-4 w-4" />, count: mockRecommendations.budget?.length || 0 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const VehicleCard = ({ vehicle }) => (
    <div className="card hover:shadow-lg transition-all duration-200 group cursor-pointer" onClick={() => window.location.href = `/vehicle/${vehicle.id}`}>
      {/* Image and Badge */}
      <div className="relative">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-200"
        />
        <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium text-white ${vehicle.badgeColor}`}>
          {vehicle.badgeText}
        </span>
        {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
          <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
            Save {formatCurrency(vehicle.originalPrice - vehicle.price)}
          </span>
        )}
        {vehicle.matchScore && (
          <div className={`absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(vehicle.matchScore)}`}>
            {vehicle.matchScore}% Match
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {vehicle.name}
          </h3>
          <Heart className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span>{vehicle.rating}</span>
            <span>({vehicle.reviews})</span>
          </div>
          <div className="flex items-center space-x-1">
            <Fuel className="h-4 w-4" />
            <span>{vehicle.mileage}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
          <div><strong>Engine:</strong> {vehicle.engine}</div>
          <div><strong>Fuel:</strong> {vehicle.fuelType}</div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-3">
          {vehicle.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
              {feature}
            </span>
          ))}
          {vehicle.features.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
              +{vehicle.features.length - 3}
            </span>
          )}
        </div>

        {/* Match Reasons */}
        {vehicle.matchReasons && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-700 mb-1">Why this matches:</p>
            <ul className="text-xs text-gray-600">
              {vehicle.matchReasons.slice(0, 2).map((reason, index) => (
                <li key={index} className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Trending Data */}
        {vehicle.trendingData && (
          <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
            <div className="flex items-center space-x-2">
              <Users className="h-3 w-3" />
              <span>{vehicle.trendingData.views} views</span>
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>{vehicle.trendingData.growth}</span>
            </div>
          </div>
        )}

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(vehicle.price)}
              </span>
              {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(vehicle.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600">Starting price</p>
          </div>
          <Link 
            to={`/vehicle/${vehicle.id}`}
            className="btn-primary text-sm px-4 py-2 inline-flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="card animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Recommended for You
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({Object.values(mockRecommendations).flat().length} vehicles across 4 categories)
          </span>
        </h2>
        <p className="text-gray-600 mb-4">
          Personalized suggestions based on your preferences and browsing behavior
        </p>
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <span>👆 Click tabs below to explore:</span>
          <span className="font-medium">For You • Trending • Similar • Budget</span>
        </div>
      </div>

      {/* User Insights */}
      <div className="card p-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center space-x-3 mb-3">
          <Zap className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Your Profile Insights</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Budget Range:</span>
            <div className="font-medium">{formatCurrency(mockUserPreferences.budgetRange[0])} - {formatCurrency(mockUserPreferences.budgetRange[1])}</div>
          </div>
          <div>
            <span className="text-gray-600">Preferred Brands:</span>
            <div className="font-medium">{mockUserPreferences.brands.join(', ')}</div>
          </div>
          <div>
            <span className="text-gray-600">Usage:</span>
            <div className="font-medium capitalize">{mockUserPreferences.usage.replace('-', ' ')}</div>
          </div>
          <div>
            <span className="text-gray-600">Recently Viewed:</span>
            <div className="font-medium">{mockViewedVehicles.length} vehicles</div>
          </div>
        </div>
      </div>

      {/* Category Selection Call-to-Action */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="text-2xl">👆</div>
          <div className="text-center">
            <div className="font-semibold text-gray-900 text-lg">Explore All Categories</div>
            <div className="text-gray-600 text-sm">Click tabs below to see {Object.keys(mockRecommendations).length} different recommendation types</div>
          </div>
          <div className="text-2xl">👆</div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-1 rounded-xl border border-blue-200">
        <div className="flex space-x-1 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-white text-blue-600 shadow-md transform scale-105 ring-2 ring-blue-300'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-white/50 hover:transform hover:scale-105'
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
              {category.count > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  activeCategory === category.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-blue-200 text-blue-800'
                }`}>
                  {category.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations[activeCategory]?.map(vehicle => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        )) || (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <ShoppingCart className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
            <p className="text-gray-600">
              Browse more vehicles to get personalized recommendations
            </p>
          </div>
        )}
      </div>

      {/* Load More */}
      {recommendations[activeCategory]?.length > 0 && (
        <div className="text-center">
          <button className="btn-secondary">
            Load More Recommendations
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendationEngine;