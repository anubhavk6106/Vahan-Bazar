import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Bell, Star, ArrowRight } from 'lucide-react'

const UpcomingLaunches = () => {
  const [upcomingVehicles] = useState([
    {
      id: 1,
      name: 'Honda CB300F',
      brand: 'Honda',
      category: 'bike',
      launchDate: '2024-02-15',
      estimatedPrice: '₹1,85,000 - ₹2,05,000',
      keyFeatures: ['LED Headlight', 'Digital Console', 'ABS'],
      engine: '293cc, Single Cylinder',
      power: '24.5 HP',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
      status: 'upcoming',
      description: 'Honda\'s new entry in the 300cc segment promising exceptional performance and fuel efficiency.'
    },
    {
      id: 2,
      name: 'Yamaha Aerox 155',
      brand: 'Yamaha',
      category: 'scooter',
      launchDate: '2024-03-20',
      estimatedPrice: '₹1,25,000 - ₹1,40,000',
      keyFeatures: ['Smart Key', '155cc Engine', 'LED Lighting'],
      engine: '155cc, Liquid Cooled',
      power: '15 HP',
      image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&q=80',
      status: 'upcoming',
      description: 'Premium maxi-scooter with sportbike-inspired design and advanced features.'
    },
    {
      id: 3,
      name: 'Bajaj Pulsar N250',
      brand: 'Bajaj',
      category: 'bike',
      launchDate: '2024-01-30',
      estimatedPrice: '₹1,45,000 - ₹1,60,000',
      keyFeatures: ['Dual Channel ABS', 'LED DRL', 'USB Charging'],
      engine: '249cc, Oil Cooled',
      power: '24.5 HP',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
      status: 'launched',
      description: 'Latest addition to the popular Pulsar family with enhanced performance.'
    },
    {
      id: 4,
      name: 'Ola S1 Air',
      brand: 'Ola Electric',
      category: 'ev',
      launchDate: '2024-04-10',
      estimatedPrice: '₹85,000 - ₹95,000',
      keyFeatures: ['Keyless Start', '95km Range', 'Fast Charging'],
      engine: 'Electric Motor',
      power: '4.5 kW',
      image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&q=80',
      status: 'upcoming',
      description: 'Affordable electric scooter with impressive range and modern features.'
    },
    {
      id: 5,
      name: 'TVS Apache RR 310',
      brand: 'TVS',
      category: 'bike',
      launchDate: '2024-05-15',
      estimatedPrice: '₹2,75,000 - ₹3,00,000',
      keyFeatures: ['Track Mode', 'Quickshifter', 'TFT Display'],
      engine: '312cc, Liquid Cooled',
      power: '34 HP',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
      status: 'upcoming',
      description: 'Track-focused supersport motorcycle with advanced rider aids.'
    },
    {
      id: 6,
      name: 'Hero Vida V1 Plus',
      brand: 'Hero Electric',
      category: 'ev',
      launchDate: '2024-06-01',
      estimatedPrice: '₹1,25,000 - ₹1,45,000',
      keyFeatures: ['165km Range', 'Smart Dashboard', 'OTA Updates'],
      engine: 'Electric Motor',
      power: '6 kW',
      image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&q=80',
      status: 'upcoming',
      description: 'Premium electric scooter with extended range and connected features.'
    }
  ])

  const [filter, setFilter] = useState('all')
  const [filteredVehicles, setFilteredVehicles] = useState(upcomingVehicles)

  useEffect(() => {
    if (filter === 'all') {
      setFilteredVehicles(upcomingVehicles)
    } else {
      setFilteredVehicles(upcomingVehicles.filter(vehicle => vehicle.category === filter))
    }
  }, [filter, upcomingVehicles])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getDaysUntilLaunch = (dateString) => {
    const launchDate = new Date(dateString)
    const today = new Date()
    const diffTime = launchDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusBadge = (status, launchDate) => {
    const daysUntil = getDaysUntilLaunch(launchDate)
    
    if (status === 'launched' || daysUntil <= 0) {
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Launched</span>
    } else if (daysUntil <= 30) {
      return <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">Coming Soon</span>
    } else {
      return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Upcoming</span>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Upcoming Launches
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay ahead with the latest two-wheeler launches. Get notified about new models, features, and launch dates.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg p-1 shadow-sm border">
            {[
              { key: 'all', label: 'All Vehicles' },
              { key: 'bike', label: 'Bikes' },
              { key: 'scooter', label: 'Scooters' },
              { key: 'ev', label: 'Electric' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  filter === tab.key 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map(vehicle => (
            <div key={vehicle.id} className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-3 right-3">
                  {getStatusBadge(vehicle.status, vehicle.launchDate)}
                </div>
                <div className="absolute top-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  {vehicle.category.toUpperCase()}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{vehicle.name}</h3>
                    <p className="text-sm text-gray-600">{vehicle.brand}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(vehicle.launchDate)}</span>
                  {getDaysUntilLaunch(vehicle.launchDate) > 0 && (
                    <>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{getDaysUntilLaunch(vehicle.launchDate)} days to go</span>
                    </>
                  )}
                </div>

                <div className="mb-4">
                  <div className="text-lg font-bold text-blue-600 mb-2">
                    {vehicle.estimatedPrice}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {vehicle.description}
                  </p>
                </div>

                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Engine:</span>
                      <div className="font-medium">{vehicle.engine}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Power:</span>
                      <div className="font-medium">{vehicle.power}</div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {vehicle.keyFeatures.slice(0, 3).map((feature, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                    <Bell className="h-4 w-4" />
                    Notify Me
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                    <span>View Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No upcoming launches found
            </h3>
            <p className="text-gray-600">
              Check back later for new vehicle announcements
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UpcomingLaunches