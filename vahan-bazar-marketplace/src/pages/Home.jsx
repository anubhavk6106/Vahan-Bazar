import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Calculator, MapPin, TrendingUp, Users, Star, ChevronRight, Zap, Shield, Clock, Award } from 'lucide-react'
import { vehicleAPI } from '../services/api'
import Button from '../components/ui/Button'
import { LoadingSpinner } from '../components/ui/Loading'
import RecommendationEngine from '../components/RecommendationEngine'

const Home = () => {
  const [categoryCounts, setCategoryCounts] = useState({
    bikes: 0,
    scooters: 0,
    evs: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);

  const categories = [
    {
      name: 'Motorcycles',
      subtitle: 'Performance & Style',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      count: `${categoryCounts.bikes}`,
      path: '/browse/bikes',
      icon: '🏍️',
      gradient: 'from-blue-600 to-purple-600',
      description: 'Discover premium motorcycles'
    },
    {
      name: 'Scooters',
      subtitle: 'Urban Mobility',
      image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80',
      count: `${categoryCounts.scooters}`,
      path: '/browse/scooters',
      icon: '🛵',
      gradient: 'from-green-600 to-teal-600',
      description: 'Perfect for city commuting'
    },
    {
      name: 'Electric Vehicles',
      subtitle: 'Future Ready',
      image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80',
      count: `${categoryCounts.evs}`,
      path: '/browse/evs',
      icon: '⚡',
      gradient: 'from-yellow-500 to-orange-600',
      description: 'Eco-friendly electric options'
    }
  ]

  const features = [
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find your perfect vehicle with our intelligent search and filtering system.',
      color: 'text-blue-600'
    },
    {
      icon: Shield,
      title: 'Verified Dealers',
      description: 'All our dealers are verified and certified for your peace of mind.',
      color: 'text-green-600'
    },
    {
      icon: Calculator,
      title: 'EMI Calculator',
      description: 'Calculate your EMI and plan your purchase with our easy-to-use tools.',
      color: 'text-purple-600'
    },
    {
      icon: Award,
      title: 'Best Prices',
      description: 'Get the best deals and competitive prices on all vehicle categories.',
      color: 'text-orange-600'
    }
  ]

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch category counts
        const [bikeCount, scooterCount, electricCount, brandsData] = await Promise.all([
          vehicleAPI.getAll({ category: 'bikes', limit: 1 }),
          vehicleAPI.getAll({ category: 'scooters', limit: 1 }),
          vehicleAPI.getAll({ category: 'evs', limit: 1 }),
          vehicleAPI.getBrands()
        ]);
        
        setCategoryCounts({
          bikes: bikeCount.data?.pagination?.totalItems || 0,
          scooters: scooterCount.data?.pagination?.totalItems || 0,
          evs: electricCount.data?.pagination?.totalItems || 0,
          total: (bikeCount.data?.pagination?.totalItems || 0) + (scooterCount.data?.pagination?.totalItems || 0) + (electricCount.data?.pagination?.totalItems || 0)
        });
        
        setBrands(Array.isArray(brandsData?.data) ? brandsData.data.slice(0, 8) : []); // Get first 8 brands
        
      } catch (error) {
        console.error('Error fetching home data:', error);
        // Fallback to default brands if API fails
        setBrands(['Honda', 'Yamaha', 'Bajaj', 'TVS', 'Hero', 'Royal Enfield', 'KTM', 'Suzuki']);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const popularBrands = brands.length > 0 ? brands : [
    'Honda', 'Yamaha', 'Bajaj', 'TVS', 'Hero', 'Royal Enfield', 'KTM', 'Suzuki'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8">
              <Star className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="text-sm font-semibold">India's Premier Two-Wheeler Marketplace</span>
            </div>
            
            <h1 className="font-bold text-5xl sm:text-6xl lg:text-7xl mb-6 leading-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Two-Wheeler
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl mb-12 max-w-4xl mx-auto text-blue-100 leading-relaxed">
              Discover premium motorcycles, scooters, and electric vehicles from trusted dealers across India
            </p>
            
            {/* Search Section */}
            <div className="max-w-4xl mx-auto mb-16">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex flex-col lg:flex-row items-center gap-4">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search for bikes, scooters, brands..."
                      className="w-full pl-12 pr-4 py-4 text-lg bg-white rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="primary" 
                      size="lg"
                      rightIcon={<Search className="h-5 w-5" />}
                      className="font-semibold px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Search
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="lg"
                      leftIcon={<Zap className="h-5 w-5" />}
                      className="font-semibold px-6 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
                    >
                      AI Match
                    </Button>
                  </div>
                </div>
                
                {/* Quick Search Tags */}
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {['Sports Bikes', 'Scooters', 'Electric', 'Budget Friendly', 'Premium'].map((tag) => (
                    <button
                      key={tag}
                      className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-sm font-medium hover:bg-white/30 transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Popular Brands */}
            <div className="text-center mb-12">
              <p className="text-blue-200 mb-6 text-lg">Trusted by leading brands</p>
              <div className="flex flex-wrap justify-center items-center gap-8 max-w-4xl mx-auto">
                {popularBrands.map((brand, index) => (
                  <div
                    key={brand}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all"
                  >
                    <span className="text-white font-semibold">{brand}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                variant="primary" 
                size="xl"
                as={Link}
                to="/browse"
                leftIcon={<Search className="h-6 w-6" />}
                className="font-semibold bg-white text-blue-600 hover:bg-gray-100"
              >
                Browse Vehicles
              </Button>
              <Button 
                variant="secondary" 
                size="xl"
                as={Link}
                to="/calculators"
                leftIcon={<Calculator className="h-6 w-6" />}
                className="font-semibold bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
              >
                EMI Calculator
              </Button>
              <Button 
                variant="secondary" 
                size="xl"
                as={Link}
                to="/showrooms"
                leftIcon={<MapPin className="h-6 w-6" />}
                className="font-semibold bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
              >
                Find Dealers
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Explore Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find the perfect vehicle for your needs from our extensive collection
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={category.path}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative overflow-hidden rounded-t-2xl">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                  
                  {/* Icon */}
                  <div className="absolute top-6 right-6">
                    <div className="h-12 w-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl shadow-lg">
                      {category.icon}
                    </div>
                  </div>
                  
                  {/* Count Badge */}
                  <div className="absolute bottom-6 left-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                      <p className="text-gray-800 font-bold">{category.count}+ Models</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-blue-600 font-semibold mb-3">{category.subtitle}</p>
                  <p className="text-gray-600 leading-relaxed">{category.description}</p>
                  
                  <div className="flex items-center justify-between mt-6">
                    <span className="text-blue-600 font-semibold group-hover:text-blue-700">
                      Explore Now
                    </span>
                    <ChevronRight className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RecommendationEngine userId={1} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Vahan Bazar?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make buying your dream vehicle simple, secure, and satisfying
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={feature.title} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl mb-4">
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">{categoryCounts.total}K+</div>
              <div className="text-blue-200">Vehicles Listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Verified Dealers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-200">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-blue-200">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Find Your Dream Vehicle?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Start your journey today and discover the perfect two-wheeler for you
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant="primary" 
              size="xl"
              as={Link}
              to="/browse"
              className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Start Shopping
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              as={Link}
              to="/sell"
              className="font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Sell Your Vehicle
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home