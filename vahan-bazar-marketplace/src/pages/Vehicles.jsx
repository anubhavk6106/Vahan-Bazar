import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Star, MapPin, Heart, Zap, Fuel, Settings } from 'lucide-react';

// Mock vehicle data - in a real app, this would come from an API
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
    mileage: '35 kmpl',
    engine: '349cc',
    transmission: 'Manual',
    isNew: true,
    discount: '8% OFF',
    features: ['ABS', 'Electric Start', 'LED Headlight'],
    location: 'Delhi',
    dealer: 'Premium Motors'
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
    mileage: '60 kmpl',
    engine: '109cc',
    transmission: 'Automatic',
    isNew: false,
    discount: '6% OFF',
    features: ['Eco Mode', 'Mobile Charger', 'LED DRL'],
    location: 'Mumbai',
    dealer: 'City Scooters'
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
    mileage: '146 km range',
    engine: 'Electric Motor',
    transmission: 'Automatic',
    isNew: true,
    discount: null,
    features: ['Smart Dashboard', 'Fast Charging', 'OTA Updates'],
    location: 'Bangalore',
    dealer: 'EV Hub'
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
    mileage: '50 kmpl',
    engine: '149cc',
    transmission: 'Manual',
    isNew: false,
    discount: '7% OFF',
    features: ['FI Engine', 'LED Headlight', 'Single Channel ABS'],
    location: 'Chennai',
    dealer: 'Speed Motors'
  },
  {
    id: 5,
    name: 'TVS iQube Electric',
    brand: 'TVS',
    category: 'ev',
    fuelType: 'electric',
    price: 115000,
    originalPrice: 120000,
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop',
    rating: 4.5,
    reviews: 654,
    mileage: '75 km range',
    engine: 'Electric Motor',
    transmission: 'Automatic',
    isNew: true,
    discount: '4% OFF',
    features: ['Smart Connectivity', 'Navigation', 'Regenerative Braking'],
    location: 'Hyderabad',
    dealer: 'Electric Avenue'
  },
  {
    id: 6,
    name: 'Suzuki Access 125',
    brand: 'Suzuki',
    category: 'scooter',
    fuelType: 'petrol',
    price: 85000,
    originalPrice: 90000,
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop',
    rating: 4.4,
    reviews: 2134,
    mileage: '64 kmpl',
    engine: '124cc',
    transmission: 'Automatic',
    isNew: false,
    discount: '6% OFF',
    features: ['Bluetooth Connectivity', 'LED Headlamp', 'Boot Light'],
    location: 'Pune',
    dealer: 'Metro Suzuki'
  }
];

const brands = ['All', 'Royal Enfield', 'Honda', 'Yamaha', 'TVS', 'Suzuki', 'Ather', 'Bajaj', 'Hero'];
const categories = ['All', 'bike', 'scooter', 'ev'];
const fuelTypes = ['All', 'petrol', 'electric', 'hybrid'];
const priceRanges = ['All', '0-50000', '50000-100000', '100000-150000', '150000-200000', '200000+'];

const Vehicles = () => {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [filteredVehicles, setFilteredVehicles] = useState(mockVehicles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFuelType, setSelectedFuelType] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showFilters, setShowFilters] = useState(false);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...vehicles];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(vehicle => 
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Brand filter
    if (selectedBrand !== 'All') {
      filtered = filtered.filter(vehicle => vehicle.brand === selectedBrand);
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(vehicle => vehicle.category === selectedCategory);
    }

    // Fuel type filter
    if (selectedFuelType !== 'All') {
      filtered = filtered.filter(vehicle => vehicle.fuelType === selectedFuelType);
    }

    // Price range filter
    if (selectedPriceRange !== 'All') {
      const [min, max] = selectedPriceRange.split('-').map(p => p.replace('+', ''));
      filtered = filtered.filter(vehicle => {
        if (selectedPriceRange === '200000+') {
          return vehicle.price >= 200000;
        }
        return vehicle.price >= parseInt(min) && vehicle.price <= parseInt(max);
      });
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'mileage':
        filtered.sort((a, b) => {
          const aMileage = parseInt(a.mileage.split(' ')[0]);
          const bMileage = parseInt(b.mileage.split(' ')[0]);
          return bMileage - aMileage;
        });
        break;
      default: // featured
        filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm, selectedBrand, selectedCategory, selectedFuelType, selectedPriceRange, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedBrand('All');
    setSelectedCategory('All');
    setSelectedFuelType('All');
    setSelectedPriceRange('All');
    setSortBy('featured');
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

  const VehicleCard = ({ vehicle }) => (
    <div className="card hover-lift group relative">
      {/* Discount Badge */}
      {vehicle.discount && (
        <div className="absolute top-4 left-4 z-10">
          <span className="badge-green">
            {vehicle.discount}
          </span>
        </div>
      )}

      {/* New Badge */}
      {vehicle.isNew && (
        <div className="absolute top-4 right-4 z-10">
          <span className="badge-blue">
            NEW
          </span>
        </div>
      )}

      {/* Vehicle Image */}
      <div className="relative overflow-hidden rounded-t-xl">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-2">
            <button className="btn-primary btn-sm">
              View Details
            </button>
            <button className="btn-secondary btn-sm">
              Compare
            </button>
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="p-6 space-y-4">
        {/* Category & Brand */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{getCategoryIcon(vehicle.category)}</span>
            <span className="badge-gray uppercase text-xs font-semibold">
              {vehicle.category}
            </span>
          </div>
          <span className="text-sm text-gray-500">{vehicle.brand}</span>
        </div>

        {/* Vehicle Name */}
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {vehicle.name}
        </h3>

        {/* Rating & Reviews */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-900">{vehicle.rating}</span>
          </div>
          <span className="text-sm text-gray-500">({vehicle.reviews} reviews)</span>
        </div>

        {/* Key Specs */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Fuel className="h-4 w-4 text-green-600" />
            <span className="text-gray-700">{vehicle.mileage}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-blue-600" />
            <span className="text-gray-700">{vehicle.engine}</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1">
          {vehicle.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="badge-gray text-xs">
              {feature}
            </span>
          ))}
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(vehicle.price)}
              </span>
              {vehicle.originalPrice > vehicle.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(vehicle.originalPrice)}
                </span>
              )}
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="h-3 w-3 mr-1" />
              {vehicle.location} • {vehicle.dealer}
            </div>
          </div>
          
          <div className="space-y-2">
            <button className="btn-primary btn-sm w-full">
              Buy Now
            </button>
            <button className="btn-outline btn-sm w-full">
              Test Drive
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <section className="py-12">
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Find Your Perfect Vehicle
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse thousands of bikes, scooters & electric vehicles from trusted dealers across India
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by vehicle name or brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input w-full pl-12 pr-20 py-4 text-lg"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary btn-sm">
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8">
          {/* Filter Toggle (Mobile) */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary w-full flex items-center justify-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
          </div>

          {/* Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="card p-6 space-y-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Brand Filter */}
                <div>
                  <label className="form-label">Brand</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="form-select"
                  >
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="form-label">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="form-select"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'All' ? 'All' : `${getCategoryIcon(category)} ${category.toUpperCase()}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fuel Type Filter */}
                <div>
                  <label className="form-label">Fuel Type</label>
                  <select
                    value={selectedFuelType}
                    onChange={(e) => setSelectedFuelType(e.target.value)}
                    className="form-select"
                  >
                    {fuelTypes.map(fuel => (
                      <option key={fuel} value={fuel}>{fuel}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="form-label">Price Range</label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="form-select"
                  >
                    {priceRanges.map(range => (
                      <option key={range} value={range}>
                        {range === 'All' ? 'All Prices' : 
                         range === '200000+' ? '₹2L+' :
                         `₹${parseInt(range.split('-')[0])/1000}K - ₹${parseInt(range.split('-')[1])/1000}K`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="form-label">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="form-select"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="mileage">Best Mileage</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters & Results Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <button
                  onClick={clearFilters}
                  className="btn-secondary text-red-600 hover:bg-red-50"
                >
                  Clear All Filters
                </button>
                
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {filteredVehicles.length} vehicles found
                  </span>
                  
                  {/* View Mode Toggle */}
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            {filteredVehicles.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredVehicles.map(vehicle => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No vehicles found</h3>
                <p className="text-gray-600 mb-8">Try adjusting your filters or search term</p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Vehicles;