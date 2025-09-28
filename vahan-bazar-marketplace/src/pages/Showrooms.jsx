import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Star, MapPin, Phone, Mail, Clock, Award, Users, ExternalLink } from 'lucide-react';

// Mock showroom data - in a real app, this would come from an API
const mockShowrooms = [
  {
    id: 1,
    name: 'Premium Motors Delhi',
    brand: 'Multi-Brand',
    address: 'Sector 18, Noida, Delhi NCR',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    phone: '+91 98765 43210',
    email: 'delhi@premiummotors.com',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    rating: 4.8,
    reviews: 156,
    established: '2015',
    specialties: ['Royal Enfield', 'Honda', 'Yamaha', 'TVS'],
    services: ['Sales', 'Service', 'Spare Parts', 'Insurance', 'Finance'],
    openHours: 'Mon-Sun: 9:00 AM - 8:00 PM',
    distance: '2.3 km',
    features: ['Test Ride', 'Exchange', 'EMI', 'Home Delivery'],
    dealerType: 'Authorized Dealer',
    certification: 'ISO 9001:2015',
    awards: ['Best Dealer 2023', 'Customer Choice Award'],
    inventory: 150,
    website: 'www.premiummotors.com'
  },
  {
    id: 2,
    name: 'Electric Avenue Mumbai',
    brand: 'EV Specialist',
    address: 'Bandra West, Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    phone: '+91 87654 32109',
    email: 'mumbai@electricavenue.com',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop',
    rating: 4.9,
    reviews: 89,
    established: '2020',
    specialties: ['Ather', 'TVS iQube', 'Bajaj Chetak', 'Simple One'],
    services: ['Sales', 'Service', 'Charging Station', 'Battery Service'],
    openHours: 'Mon-Sun: 10:00 AM - 9:00 PM',
    distance: '5.1 km',
    features: ['Fast Charging', 'EV Consultation', 'Battery Warranty'],
    dealerType: 'EV Specialist',
    certification: 'Green Energy Certified',
    awards: ['Best EV Dealer 2023', 'Sustainability Award'],
    inventory: 80,
    website: 'www.electricavenue.com'
  },
  {
    id: 3,
    name: 'Speed Motors Chennai',
    brand: 'Performance Bikes',
    address: 'T. Nagar, Chennai, Tamil Nadu',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600017',
    phone: '+91 76543 21098',
    email: 'chennai@speedmotors.com',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    rating: 4.7,
    reviews: 234,
    established: '2010',
    specialties: ['Yamaha', 'Kawasaki', 'Bajaj', 'KTM'],
    services: ['Sales', 'Service', 'Racing Parts', 'Track Events'],
    openHours: 'Mon-Sat: 9:00 AM - 7:00 PM, Sun: 10:00 AM - 6:00 PM',
    distance: '8.2 km',
    features: ['Track Events', 'Performance Tuning', 'Racing Gear'],
    dealerType: 'Performance Specialist',
    certification: 'Racing Association Certified',
    awards: ['Racing Excellence Award', 'Customer Satisfaction 2023'],
    inventory: 200,
    website: 'www.speedmotors.com'
  },
  {
    id: 4,
    name: 'City Scooters Pune',
    brand: 'Scooter Specialist',
    address: 'FC Road, Pune, Maharashtra',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411005',
    phone: '+91 65432 10987',
    email: 'pune@cityscooters.com',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop',
    rating: 4.6,
    reviews: 178,
    established: '2018',
    specialties: ['Honda Activa', 'TVS Jupiter', 'Suzuki Access', 'Hero Pleasure'],
    services: ['Sales', 'Service', 'Accessories', 'Extended Warranty'],
    openHours: 'Mon-Sun: 9:30 AM - 8:30 PM',
    distance: '3.7 km',
    features: ['Women-Friendly', 'Student Discounts', 'Easy Finance'],
    dealerType: 'Family Friendly',
    certification: 'Customer Service Excellence',
    awards: ['Family Choice Award', 'Best Service 2023'],
    inventory: 120,
    website: 'www.cityscooters.com'
  },
  {
    id: 5,
    name: 'Royal Bikes Bangalore',
    brand: 'Royal Enfield',
    address: 'Koramangala, Bangalore, Karnataka',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560034',
    phone: '+91 54321 09876',
    email: 'bangalore@royalbikes.com',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    rating: 4.8,
    reviews: 312,
    established: '2012',
    specialties: ['Royal Enfield Classic', 'Royal Enfield Bullet', 'Royal Enfield Himalayan'],
    services: ['Sales', 'Service', 'Customization', 'Touring Accessories'],
    openHours: 'Mon-Sun: 9:00 AM - 8:00 PM',
    distance: '6.5 km',
    features: ['Customization', 'Touring Support', 'Club Membership'],
    dealerType: 'Brand Specialist',
    certification: 'Royal Enfield Certified',
    awards: ['Brand Excellence Award', 'Customization Expert 2023'],
    inventory: 95,
    website: 'www.royalbikes.com'
  }
];

const cities = ['All Cities', 'Delhi', 'Mumbai', 'Chennai', 'Pune', 'Bangalore', 'Hyderabad'];
const specialties = ['All Brands', 'Royal Enfield', 'Honda', 'Yamaha', 'TVS', 'Bajaj', 'EV Specialist'];
const services = ['All Services', 'Sales', 'Service', 'Finance', 'Insurance', 'Test Ride'];

const Showrooms = () => {
  const [showrooms, setShowrooms] = useState(mockShowrooms);
  const [filteredShowrooms, setFilteredShowrooms] = useState(mockShowrooms);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Brands');
  const [selectedService, setSelectedService] = useState('All Services');
  const [sortBy, setSortBy] = useState('distance');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showFilters, setShowFilters] = useState(false);
  const [selectedShowroom, setSelectedShowroom] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...showrooms];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(showroom => 
        showroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        showroom.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        showroom.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        showroom.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // City filter
    if (selectedCity !== 'All Cities') {
      filtered = filtered.filter(showroom => showroom.city === selectedCity);
    }

    // Specialty filter
    if (selectedSpecialty !== 'All Brands') {
      filtered = filtered.filter(showroom => 
        showroom.specialties.includes(selectedSpecialty) ||
        showroom.brand.includes(selectedSpecialty)
      );
    }

    // Service filter
    if (selectedService !== 'All Services') {
      filtered = filtered.filter(showroom => 
        showroom.services.includes(selectedService)
      );
    }

    // Sorting
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'distance':
        filtered.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'established':
        filtered.sort((a, b) => parseInt(a.established) - parseInt(b.established));
        break;
      default:
        filtered.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    }

    setFilteredShowrooms(filtered);
  }, [showrooms, searchTerm, selectedCity, selectedSpecialty, selectedService, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCity('All Cities');
    setSelectedSpecialty('All Brands');
    setSelectedService('All Services');
    setSortBy('distance');
  };

  const ShowroomCard = ({ showroom }) => (
    <div className="card hover-lift group">
      {/* Showroom Image */}
      <div className="relative overflow-hidden rounded-t-xl">
        <img
          src={showroom.image}
          alt={showroom.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Distance Badge */}
        <div className="absolute top-4 left-4">
          <span className="badge-blue">
            {showroom.distance}
          </span>
        </div>
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold">{showroom.rating}</span>
          </div>
        </div>
      </div>

      {/* Showroom Info */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {showroom.name}
            </h3>
            <span className="badge-gray text-xs">{showroom.dealerType}</span>
          </div>
          <p className="text-blue-600 font-semibold">{showroom.brand}</p>
        </div>

        {/* Location */}
        <div className="flex items-start space-x-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{showroom.address}</span>
        </div>

        {/* Contact */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{showroom.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{showroom.openHours}</span>
          </div>
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{showroom.rating}</span>
            <span className="text-sm text-gray-500">({showroom.reviews} reviews)</span>
          </div>
          <span className="text-sm text-gray-500">Since {showroom.established}</span>
        </div>

        {/* Specialties */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
          <div className="flex flex-wrap gap-1">
            {showroom.specialties.slice(0, 3).map(specialty => (
              <span key={specialty} className="badge-gray text-xs">
                {specialty}
              </span>
            ))}
            {showroom.specialties.length > 3 && (
              <span className="badge-gray text-xs">
                +{showroom.specialties.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Services */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Services:</p>
          <div className="flex flex-wrap gap-1">
            {showroom.services.slice(0, 4).map(service => (
              <span key={service} className="badge-blue text-xs">
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
          <div className="flex flex-wrap gap-1">
            {showroom.features.map(feature => (
              <span key={feature} className="badge-green text-xs">
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <button 
            className="btn-primary btn-sm flex-1"
            onClick={() => setSelectedShowroom(showroom)}
          >
            View Details
          </button>
          <button 
            className="btn-outline btn-sm flex-1"
            onClick={() => {
              setSelectedShowroom(showroom);
              setShowBookingModal(true);
            }}
          >
            Book Visit
          </button>
        </div>
      </div>
    </div>
  );

  const ShowroomModal = () => (
    <>
      {selectedShowroom && !showBookingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedShowroom.image}
                alt={selectedShowroom.name}
                className="w-full h-64 object-cover rounded-t-xl"
              />
              <button
                onClick={() => setSelectedShowroom(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedShowroom.name}</h2>
                    <p className="text-blue-600 font-semibold text-lg">{selectedShowroom.brand}</p>
                    <p className="text-gray-600">{selectedShowroom.dealerType}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">{selectedShowroom.address}</p>
                        <p className="text-sm text-gray-500">{selectedShowroom.city}, {selectedShowroom.state} - {selectedShowroom.pincode}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span>{selectedShowroom.phone}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span>{selectedShowroom.email}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span>{selectedShowroom.openHours}</span>
                    </div>

                    {selectedShowroom.website && (
                      <div className="flex items-center space-x-2">
                        <ExternalLink className="h-5 w-5 text-gray-400" />
                        <a href={`https://${selectedShowroom.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {selectedShowroom.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-lg">{selectedShowroom.rating}</span>
                      <span className="text-gray-500">({selectedShowroom.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">Since {selectedShowroom.established}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedShowroom.specialties.map(specialty => (
                        <span key={specialty} className="badge-blue">{specialty}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Services</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedShowroom.services.map(service => (
                        <span key={service} className="badge-green">{service}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedShowroom.features.map(feature => (
                        <span key={feature} className="badge-gray">{feature}</span>
                      ))}
                    </div>
                  </div>

                  {selectedShowroom.awards.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Awards & Recognition</h4>
                      <div className="space-y-2">
                        {selectedShowroom.awards.map(award => (
                          <div key={award} className="flex items-center space-x-2">
                            <Award className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">{award}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowBookingModal(true);
                  }}
                  className="btn-primary flex-1"
                >
                  Book a Visit
                </button>
                <button className="btn-outline flex-1">
                  Get Directions
                </button>
                <button className="btn-secondary flex-1">
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  const BookingModal = () => (
    <>
      {showBookingModal && selectedShowroom && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Book Visit to {selectedShowroom.name}</h3>
              
              <form className="space-y-4">
                <div>
                  <label className="form-label">Your Name</label>
                  <input type="text" className="form-input" placeholder="Enter your name" />
                </div>
                
                <div>
                  <label className="form-label">Phone Number</label>
                  <input type="tel" className="form-input" placeholder="Enter your phone" />
                </div>
                
                <div>
                  <label className="form-label">Preferred Date</label>
                  <input type="date" className="form-input" />
                </div>
                
                <div>
                  <label className="form-label">Preferred Time</label>
                  <select className="form-select">
                    <option>Morning (9 AM - 12 PM)</option>
                    <option>Afternoon (12 PM - 4 PM)</option>
                    <option>Evening (4 PM - 8 PM)</option>
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Interest</label>
                  <select className="form-select">
                    <option>Test Ride</option>
                    <option>Vehicle Purchase</option>
                    <option>Service</option>
                    <option>General Inquiry</option>
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Message (Optional)</label>
                  <textarea className="form-textarea" rows="3" placeholder="Any specific requirements..."></textarea>
                </div>
              </form>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedShowroom(null);
                    // Here you would typically submit the booking
                  }}
                  className="btn-primary flex-1"
                >
                  Book Visit
                </button>
              </div>
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
            Find Showrooms & Dealers
          </h1>
          <p className="text-xl text-gray-600">
            Discover authorized dealers and premium showrooms near you
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search showrooms, brands, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input w-full pl-12 pr-4 py-4 text-lg"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Filters */}
        <section className="mb-8">
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

          {/* Filter Controls */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="card p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* City Filter */}
                <div>
                  <label className="form-label">City</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="form-select"
                  >
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Specialty Filter */}
                <div>
                  <label className="form-label">Brand/Specialty</label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="form-select"
                  >
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>

                {/* Service Filter */}
                <div>
                  <label className="form-label">Services</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="form-select"
                  >
                    {services.map(service => (
                      <option key={service} value={service}>{service}</option>
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
                    <option value="distance">Distance</option>
                    <option value="rating">Rating</option>
                    <option value="name">Name</option>
                    <option value="established">Year Established</option>
                  </select>
                </div>
              </div>

              {/* Results Info & Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {filteredShowrooms.length} showrooms found
                  </span>
                  
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear Filters
                  </button>
                </div>
                
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
        </section>

        {/* Showrooms Grid */}
        <section>
          {filteredShowrooms.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredShowrooms.map(showroom => (
                <ShowroomCard key={showroom.id} showroom={showroom} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏪</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No showrooms found</h3>
              <p className="text-gray-600 mb-8">Try adjusting your filters or search term</p>
              <button
                onClick={clearFilters}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>

        {/* Modals */}
        <ShowroomModal />
        <BookingModal />
      </div>
    </div>
  );
};

export default Showrooms;