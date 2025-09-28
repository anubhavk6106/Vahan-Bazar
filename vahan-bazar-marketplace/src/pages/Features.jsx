import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Bell, Target, ChevronRight, Home, Car, Calendar } from 'lucide-react';
import Reviews from '../components/Reviews';
import PriceAlerts from '../components/PriceAlerts';
import RecommendationEngine from '../components/RecommendationEngine';

const Features = () => {
  const mockVehicleData = {
    id: 1,
    name: 'Honda CB Hornet 2.0',
    currentPrice: 125000
  };

  const features = [
    {
      id: 'recommendations',
      title: 'Smart Recommendations',
      description: 'AI-powered vehicle suggestions based on your preferences and browsing behavior',
      icon: <Target className="h-8 w-8 text-blue-600" />,
      component: <RecommendationEngine userId={1} />,
      liveLocation: {
        page: 'Home Page',
        url: '/',
        section: 'Scroll down after categories section'
      }
    },
    {
      id: 'reviews',
      title: 'Reviews & Ratings',
      description: 'Complete review system with filtering, sorting, and customer feedback',
      icon: <Star className="h-8 w-8 text-yellow-600" />,
      component: <Reviews vehicleId={1} />,
      liveLocation: {
        page: 'Vehicle Detail Pages',
        url: '/vehicle/1',
        section: 'Scroll down after specifications'
      }
    },
    {
      id: 'price-alerts',
      title: 'Price Alerts',
      description: 'Smart price monitoring with historical data and notifications',
      icon: <Bell className="h-8 w-8 text-green-600" />,
      component: (
        <PriceAlerts 
          vehicleId={mockVehicleData.id}
          currentPrice={mockVehicleData.currentPrice}
          vehicleName={mockVehicleData.name}
        />
      ),
      liveLocation: {
        page: 'Vehicle Detail Pages',
        url: '/vehicle/1',
        section: 'Below reviews section'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ✨ Advanced Features
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the powerful features that make Vahan Bazar the best platform 
            for buying and selling two-wheelers in India.
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature) => (
            <div key={feature.id} className="card p-8 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {feature.description}
              </p>
              <div className="bg-blue-50 rounded-lg p-4 text-sm">
                <div className="font-medium text-blue-900 mb-2">
                  🔍 Find this feature on:
                </div>
                <Link
                  to={feature.liveLocation.url}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center space-x-1"
                >
                  <span>{feature.liveLocation.page}</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <div className="text-gray-600 mt-1">
                  {feature.liveLocation.section}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Feature Demonstrations */}
        <div className="space-y-16">
          {features.map((feature) => (
            <div key={feature.id} className="card p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  {feature.icon}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {feature.title}
                    </h2>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <Link
                  to={feature.liveLocation.url}
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>View Live</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              
              <div className="border-t border-gray-200 pt-8">
                {feature.component}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Navigation */}
        <div className="mt-16 card p-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            🚀 Quick Access to All Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/"
              className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <Home className="h-6 w-6 text-blue-600" />
              <div>
                <div className="font-semibold text-gray-900">Home Page</div>
                <div className="text-sm text-gray-600">Smart Recommendations</div>
              </div>
            </Link>
            
            <Link
              to="/vehicle/1"
              className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <Car className="h-6 w-6 text-green-600" />
              <div>
                <div className="font-semibold text-gray-900">Vehicle Details</div>
                <div className="text-sm text-gray-600">Reviews & Price Alerts</div>
              </div>
            </Link>
            
            <Link
              to="/bookings"
              className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <Calendar className="h-6 w-6 text-purple-600" />
              <div>
                <div className="font-semibold text-gray-900">My Bookings</div>
                <div className="text-sm text-gray-600">Redesigned Interface</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;