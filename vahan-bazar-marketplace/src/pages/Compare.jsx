import React, { useState, useEffect } from 'react';
import { X, Plus, Search, Star, Zap, CheckCircle, AlertCircle } from 'lucide-react';

// Mock vehicle data for comparison
const mockVehicles = [
  {
    id: 1,
    name: 'Royal Enfield Classic 350',
    brand: 'Royal Enfield',
    category: 'bike',
    fuelType: 'petrol',
    price: 198000,
    originalPrice: 215000,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    rating: 4.8,
    reviews: 2456,
    specs: {
      engine: '349cc',
      power: '20.2 bhp',
      torque: '27 Nm',
      mileage: '35 kmpl',
      fuelCapacity: '13 L',
      weight: '195 kg',
      transmission: 'Manual',
      brakes: 'Disc/Drum',
      abs: 'Yes',
      topSpeed: '120 kmph'
    },
    features: ['ABS', 'Electric Start', 'LED Headlight', 'Digital Console', 'Kick Start'],
    pros: ['Classic Design', 'Strong Build Quality', 'Great Sound', 'Good Resale Value'],
    cons: ['Heavy Weight', 'Average Mileage', 'Vibrations at High RPM']
  },
  {
    id: 2,
    name: 'Honda Activa 6G',
    brand: 'Honda',
    category: 'scooter',
    fuelType: 'petrol',
    price: 75000,
    originalPrice: 80000,
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop',
    rating: 4.6,
    reviews: 3421,
    specs: {
      engine: '109cc',
      power: '7.68 bhp',
      torque: '8.79 Nm',
      mileage: '60 kmpl',
      fuelCapacity: '5.3 L',
      weight: '109 kg',
      transmission: 'CVT',
      brakes: 'Drum/Drum',
      abs: 'No',
      topSpeed: '83 kmph'
    },
    features: ['Eco Mode', 'Mobile Charger', 'LED DRL', 'External Fuel Fill', 'Under Seat Storage'],
    pros: ['Excellent Mileage', 'Reliable', 'Easy Maintenance', 'Comfortable Ride'],
    cons: ['Lacks Power', 'Basic Design', 'No ABS']
  },
  {
    id: 3,
    name: 'Ather 450X',
    brand: 'Ather',
    category: 'ev',
    fuelType: 'electric',
    price: 145000,
    originalPrice: 145000,
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop',
    rating: 4.9,
    reviews: 892,
    specs: {
      engine: 'Electric Motor',
      power: '6.2 kW',
      torque: '26 Nm',
      mileage: '146 km range',
      fuelCapacity: '2.9 kWh Battery',
      weight: '108 kg',
      transmission: 'Direct Drive',
      brakes: 'Disc/Disc',
      abs: 'Yes',
      topSpeed: '90 kmph'
    },
    features: ['Smart Dashboard', 'Fast Charging', 'OTA Updates', 'GPS Navigation', 'Anti-theft'],
    pros: ['Zero Emissions', 'Smart Features', 'Low Running Cost', 'Quick Acceleration'],
    cons: ['Limited Range', 'Charging Infrastructure', 'High Initial Cost']
  },
  {
    id: 4,
    name: 'Yamaha FZ-S V3',
    brand: 'Yamaha',
    category: 'bike',
    fuelType: 'petrol',
    price: 110000,
    originalPrice: 118000,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    rating: 4.7,
    reviews: 1876,
    specs: {
      engine: '149cc',
      power: '12.4 bhp',
      torque: '13.3 Nm',
      mileage: '50 kmpl',
      fuelCapacity: '13 L',
      weight: '135 kg',
      transmission: 'Manual',
      brakes: 'Disc/Drum',
      abs: 'Single Channel',
      topSpeed: '110 kmph'
    },
    features: ['FI Engine', 'LED Headlight', 'Single Channel ABS', 'Digital Console', 'Side Stand Engine Cut-off'],
    pros: ['Sporty Design', 'Good Performance', 'Fuel Efficient', 'Easy Handling'],
    cons: ['Rear Drum Brake', 'Hard Seat', 'No Kickstart']
  }
];

const Compare = () => {
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState(mockVehicles);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAvailable, setFilteredAvailable] = useState(mockVehicles);
  const [showAddModal, setShowAddModal] = useState(false);
  const [comparisonView, setComparisonView] = useState('overview'); // overview, specs, features

  useEffect(() => {
    const filtered = availableVehicles.filter(vehicle => 
      !selectedVehicles.find(selected => selected.id === vehicle.id) &&
      (vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredAvailable(filtered);
  }, [availableVehicles, selectedVehicles, searchTerm]);

  const addVehicle = (vehicle) => {
    if (selectedVehicles.length < 4) {
      setSelectedVehicles([...selectedVehicles, vehicle]);
      setShowAddModal(false);
      setSearchTerm('');
    }
  };

  const removeVehicle = (vehicleId) => {
    setSelectedVehicles(selectedVehicles.filter(v => v.id !== vehicleId));
  };

  const clearAll = () => {
    setSelectedVehicles([]);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'bike': return '🏍️';
      case 'scooter': return '🛵';
      case 'ev': return '⚡';
      default: return '🚗';
    }
  };

  const getWinner = (values, higher = true) => {
    if (!values || values.length === 0) return -1;
    const numericValues = values.map(v => {
      if (typeof v === 'string') {
        return parseFloat(v.replace(/[^\d.]/g, '')) || 0;
      }
      return v || 0;
    });
    const bestValue = higher ? Math.max(...numericValues) : Math.min(...numericValues);
    return numericValues.indexOf(bestValue);
  };

  const AddVehicleModal = () => (
    <>
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Add Vehicle to Compare</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Search */}
              <div className="mt-4 relative">
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input w-full pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="grid grid-cols-1 gap-4">
                {filteredAvailable.map(vehicle => (
                  <div
                    key={vehicle.id}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => addVehicle(vehicle)}
                  >
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{vehicle.name}</h4>
                      <p className="text-sm text-gray-500">{vehicle.brand} • {getCategoryIcon(vehicle.category)} {vehicle.category}</p>
                      <p className="text-lg font-bold text-blue-600">{formatPrice(vehicle.price)}</p>
                    </div>
                    <Plus className="h-5 w-5 text-blue-600" />
                  </div>
                ))}
              </div>
              
              {filteredAvailable.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No vehicles available to add</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Compare Vehicles
          </h1>
          <p className="text-xl text-gray-600">
            Compare up to 4 vehicles side by side to make the best choice
          </p>
        </div>

        {/* Vehicle Selection */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Selected Vehicles ({selectedVehicles.length}/4)
            </h2>
            {selectedVehicles.length > 0 && (
              <button
                onClick={clearAll}
                className="btn-secondary text-red-600 hover:bg-red-50"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Selected Vehicles */}
            {selectedVehicles.map((vehicle, index) => (
              <div key={vehicle.id} className="card hover-lift relative">
                <button
                  onClick={() => removeVehicle(vehicle.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                >
                  <X className="h-4 w-4" />
                </button>
                
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-40 object-cover rounded-t-xl"
                />
                
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getCategoryIcon(vehicle.category)}</span>
                    <span className="badge-gray text-xs">{vehicle.category}</span>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-1">{vehicle.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{vehicle.brand}</p>
                  
                  <div className="flex items-center space-x-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{vehicle.rating}</span>
                    <span className="text-xs text-gray-500">({vehicle.reviews})</span>
                  </div>
                  
                  <p className="text-xl font-bold text-gray-900">
                    {formatPrice(vehicle.price)}
                  </p>
                </div>
              </div>
            ))}

            {/* Add Vehicle Placeholder */}
            {selectedVehicles.length < 4 && (
              <div
                onClick={() => setShowAddModal(true)}
                className="card hover-lift cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors"
              >
                <div className="h-40 flex items-center justify-center bg-gray-50 rounded-t-xl">
                  <Plus className="h-12 w-12 text-gray-400" />
                </div>
                
                <div className="p-4 text-center">
                  <h3 className="font-medium text-gray-700 mb-2">Add Vehicle</h3>
                  <p className="text-sm text-gray-500">Click to add a vehicle for comparison</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Views */}
        {selectedVehicles.length >= 2 && (
          <div className="card p-6">
            {/* View Tabs */}
            <div className="flex space-x-1 mb-6 border-b border-gray-200">
              {['overview', 'specs', 'features'].map(view => (
                <button
                  key={view}
                  onClick={() => setComparisonView(view)}
                  className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                    comparisonView === view
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>

            {/* Overview Comparison */}
            {comparisonView === 'overview' && (
              <div className="space-y-6">
                {[
                  { key: 'price', label: 'Price', format: formatPrice, lower: true },
                  { key: 'rating', label: 'Rating' },
                  { key: 'mileage', label: 'Mileage', getValue: (v) => v.specs?.mileage }
                ].map(({ key, label, format, getValue, lower = false }) => (
                  <div key={key} className="border-b border-gray-100 pb-4">
                    <h4 className="font-semibold text-gray-900 mb-3">{label}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedVehicles.map((vehicle, index) => {
                        const value = getValue ? getValue(vehicle) : vehicle[key];
                        const displayValue = format ? format(value) : value;
                        const isWinner = getWinner(
                          selectedVehicles.map(v => getValue ? getValue(v) : v[key]),
                          !lower
                        ) === index;
                        
                        return (
                          <div
                            key={vehicle.id}
                            className={`text-center p-3 rounded-lg ${
                              isWinner ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                            }`}
                          >
                            <p className="text-sm text-gray-600 mb-1">{vehicle.name}</p>
                            <p className={`font-bold ${isWinner ? 'text-green-700' : 'text-gray-900'}`}>
                              {displayValue}
                              {isWinner && <CheckCircle className="inline-block h-4 w-4 ml-1" />}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Specs Comparison */}
            {comparisonView === 'specs' && (
              <div className="space-y-4">
                {Object.keys(selectedVehicles[0]?.specs || {}).map(specKey => (
                  <div key={specKey} className="border-b border-gray-100 pb-4">
                    <h4 className="font-semibold text-gray-900 mb-3 capitalize">
                      {specKey.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedVehicles.map(vehicle => (
                        <div key={vehicle.id} className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">{vehicle.name}</p>
                          <p className="font-medium text-gray-900">
                            {vehicle.specs[specKey] || 'N/A'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Features Comparison */}
            {comparisonView === 'features' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Key Features</h4>
                  <div className="space-y-4">
                    {selectedVehicles.map(vehicle => (
                      <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-3">{vehicle.name}</h5>
                        <div className="flex flex-wrap gap-2">
                          {vehicle.features.map(feature => (
                            <span key={feature} className="badge-blue text-sm">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Pros & Cons</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedVehicles.map(vehicle => (
                      <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-3">{vehicle.name}</h5>
                        
                        <div className="mb-4">
                          <h6 className="text-sm font-medium text-green-700 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Pros
                          </h6>
                          <ul className="space-y-1">
                            {vehicle.pros.map(pro => (
                              <li key={pro} className="text-sm text-gray-600">• {pro}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h6 className="text-sm font-medium text-red-700 mb-2 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Cons
                          </h6>
                          <ul className="space-y-1">
                            {vehicle.cons.map(con => (
                              <li key={con} className="text-sm text-gray-600">• {con}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {selectedVehicles.length < 2 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚖️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Select Vehicles to Compare
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Add at least 2 vehicles to start comparing their specifications, features, and pricing side by side.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              Add Vehicles
            </button>
          </div>
        )}

        <AddVehicleModal />
      </div>
    </div>
  );
};

export default Compare;