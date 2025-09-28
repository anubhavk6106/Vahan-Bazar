import React, { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, Phone, User, Mail, Car, CheckCircle } from 'lucide-react'
import { vehicleAPI } from '../services/api'

const TestRide = () => {
  const [vehicles, setVehicles] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState('')
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    city: '',
    dealership: '',
    message: ''
  })

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await vehicleAPI.getAll({ limit: 12 })
      if (response?.data && Array.isArray(response.data)) {
        setVehicles(response.data)
      } else {
        // Fallback to static data if API fails
        setVehicles([
          { id: 1, name: 'Honda CB Shine', brand: 'Honda', price: 75000, category: 'bike', engine: '124cc', fuelType: 'Petrol' },
          { id: 2, name: 'Yamaha FZ-S', brand: 'Yamaha', price: 110000, category: 'bike', engine: '149cc', fuelType: 'Petrol' },
          { id: 3, name: 'TVS Jupiter', brand: 'TVS', price: 65000, category: 'scooter', engine: '109cc', fuelType: 'Petrol' },
          { id: 4, name: 'Bajaj Pulsar 150', brand: 'Bajaj', price: 95000, category: 'bike', engine: '149cc', fuelType: 'Petrol' }
        ])
      }
    } catch (error) {
      // API failed, using fallback data
      // Always provide fallback data
      setVehicles([
        { id: 1, name: 'Honda CB Shine', brand: 'Honda', price: 75000, category: 'bike', engine: '124cc', fuelType: 'Petrol' },
        { id: 2, name: 'Yamaha FZ-S', brand: 'Yamaha', price: 110000, category: 'bike', engine: '149cc', fuelType: 'Petrol' },
        { id: 3, name: 'TVS Jupiter', brand: 'TVS', price: 65000, category: 'scooter', engine: '109cc', fuelType: 'Petrol' },
        { id: 4, name: 'Bajaj Pulsar 150', brand: 'Bajaj', price: 95000, category: 'bike', engine: '149cc', fuelType: 'Petrol' }
      ])
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle)
    setShowBookingForm(true)
  }

  const handleBookingSubmit = (e) => {
    e.preventDefault()
    // Simulate booking submission
    setTimeout(() => {
      setBookingSuccess(true)
      setShowBookingForm(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        preferredDate: '',
        preferredTime: '',
        city: '',
        dealership: '',
        message: ''
      })
    }, 1000)
  }

  const timeSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ]

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad', 'Kolkata', 'Ahmedabad']

  const dealerships = {
    Mumbai: ['Honda Wing World - Andheri', 'Yamaha Showroom - Bandra', 'Bajaj Auto - Goregaon'],
    Delhi: ['Hero MotoCorp - Connaught Place', 'TVS Motor - Karol Bagh', 'Honda - Rajouri Garden'],
    Bangalore: ['Yamaha - Whitefield', 'Bajaj - Koramangala', 'Honda - Indiranagar']
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-4">
            Your test ride for {selectedVehicle.name} has been booked successfully.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            You will receive a confirmation email shortly with all the details.
          </p>
          <button
            onClick={() => setBookingSuccess(false)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Book Another Test Ride
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Book a Test Ride
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience your dream bike before you buy. Book a test ride at your nearest dealership.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showBookingForm ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Choose Your Vehicle
            </h2>
            
            {(!Array.isArray(vehicles) || vehicles.length === 0) ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <Car className="h-16 w-16 mx-auto" />
                </div>
                <p className="text-gray-600">Loading vehicles...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.isArray(vehicles) && vehicles.map(vehicle => (
                  <div 
                    key={vehicle.id} 
                    className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleVehicleSelect(vehicle)}
                  >
                    <div className="relative">
                      <img
                        src={vehicle.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80'}
                        alt={vehicle.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                        {vehicle.category?.toUpperCase() || 'BIKE'}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {vehicle.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{vehicle.brand}</p>
                      <div className="text-lg font-bold text-blue-600 mb-3">
                        ₹{vehicle.price?.toLocaleString() || 'N/A'}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
                        <div>
                          <span className="font-medium">{vehicle.engine || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="font-medium">{vehicle.fuelType || 'N/A'}</span>
                        </div>
                      </div>
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Book Test Ride
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="text-gray-400 hover:text-gray-600 mr-4"
                >
                  ← Back
                </button>
                <h2 className="text-2xl font-bold text-gray-900">Book Test Ride</h2>
              </div>

              {/* Selected Vehicle */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedVehicle.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&q=80'}
                    alt={selectedVehicle.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedVehicle.name}</h3>
                    <p className="text-sm text-gray-600">{selectedVehicle.brand}</p>
                    <p className="text-lg font-bold text-blue-600">
                      ₹{selectedVehicle.price?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="h-4 w-4 inline mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="h-4 w-4 inline mr-2" />
                      City *
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select City</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="h-4 w-4 inline mr-2" />
                      Preferred Time *
                    </label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Time</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  {formData.city && dealerships[formData.city] && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Dealership
                      </label>
                      <select
                        name="dealership"
                        value={formData.dealership}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Dealership</option>
                        {dealerships[formData.city].map(dealer => (
                          <option key={dealer} value={dealer}>{dealer}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any specific requirements or questions..."
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Book Test Ride
                  </button>
                </div>

                <div className="mt-4 text-sm text-gray-600 text-center">
                  <p>By booking a test ride, you agree to our terms and conditions.</p>
                  <p>You will receive a confirmation email with the dealership contact details.</p>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TestRide