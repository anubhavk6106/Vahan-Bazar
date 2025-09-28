import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Heart,
  Share2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Fuel,
  Gauge,
  Users,
  Shield,
  Star,
  ChevronLeft,
  ChevronRight,
  Info,
  Check,
  X,
  Camera,
  Calculator,
  MessageCircle,
  Eye,
  Clock,
  Award,
  Bell
} from 'lucide-react';
import Reviews from '../components/Reviews';
import PriceAlerts from '../components/PriceAlerts';

const VehicleDetail = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showEMICalculator, setShowEMICalculator] = useState(false);
  
  // Mock vehicle data - in a real app, this would be fetched based on the ID
  const vehicle = {
    id: id || 1,
    title: "Royal Enfield Classic 350 Stealth Black",
    price: 185000,
    originalPrice: 210000,
    savings: 25000,
    year: 2022,
    kmDriven: 8500,
    fuelType: "Petrol",
    transmission: "Manual",
    owners: 1,
    location: "Bandra West, Mumbai",
    condition: "Excellent",
    engineCapacity: 349,
    mileage: 35,
    brand: "Royal Enfield",
    model: "Classic 350",
    variant: "Stealth Black",
    registrationYear: 2022,
    insurance: "Valid till Mar 2025",
    seller: {
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      email: "rajesh.kumar@email.com",
      type: "Individual",
      rating: 4.8,
      totalListings: 3,
      responseTime: "within 2 hours",
      lastSeen: "Online now"
    },
    features: [
      "ABS", "Electric Start", "Kick Start", "LED Headlight", 
      "Digital Console", "Alloy Wheels", "Disc Brakes", "Tubeless Tyres"
    ],
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop"
    ],
    description: `
      This Royal Enfield Classic 350 in Stealth Black is in excellent condition with regular servicing. 
      Single owner vehicle with all documents clear. Well maintained with genuine parts only. 
      Perfect for city riding and long tours. Reason for selling: upgrading to a bigger bike.
      
      Recent maintenance:
      • Engine oil changed (1000 km ago)
      • New tyres installed
      • Battery replaced
      • Complete service done at authorized dealer
    `,
    specifications: {
      engine: "349cc, Single Cylinder, Air-cooled",
      power: "19.1 BHP @ 5250 rpm",
      torque: "28 Nm @ 4000 rpm",
      topSpeed: "115 kmph",
      fuelCapacity: "13.5 litres",
      weight: "195 kg",
      seatHeight: "805 mm",
      groundClearance: "170 mm"
    },
    serviceHistory: [
      { date: "Jan 2024", km: 7500, type: "Regular Service", dealer: "RE Mumbai" },
      { date: "Jul 2023", km: 5000, type: "First Service", dealer: "RE Mumbai" },
      { date: "Mar 2023", km: 2500, type: "Running-in Service", dealer: "RE Mumbai" }
    ],
    pros: [
      "Single owner with full service history",
      "Excellent condition, no accidents",
      "All original parts and accessories",
      "Insurance valid till March 2025",
      "Ready to transfer ownership"
    ],
    cons: [
      "Minor scratches on exhaust",
      "Some wear on seat edges (normal use)"
    ],
    similarVehicles: [
      { id: 2, title: "RE Classic 350 Desert Storm", price: 175000, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop" },
      { id: 3, title: "RE Classic 500", price: 225000, image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=300&h=200&fit=crop" },
      { id: 4, title: "RE Bullet 350", price: 165000, image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=300&h=200&fit=crop" }
    ]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === vehicle.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? vehicle.images.length - 1 : prev - 1
    );
  };

  const ContactForm = () => (
    <>
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Contact Seller</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{vehicle.seller.name}</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{vehicle.seller.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{vehicle.seller.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Responds {vehicle.seller.responseTime}</span>
                  </div>
                </div>
              </div>

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
                  <label className="form-label">Message</label>
                  <textarea 
                    className="form-textarea" 
                    rows="3" 
                    placeholder="Hi, I'm interested in this Royal Enfield Classic 350..."
                    defaultValue={`Hi, I'm interested in your ${vehicle.title}. Is it still available?`}
                  />
                </div>
              </form>

              <div className="flex gap-3 mt-6">
                <button className="btn-secondary flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </button>
                <button className="btn-primary flex-1">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="card overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={vehicle.images[currentImageIndex]}
                  alt={vehicle.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {vehicle.images.length}
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                    isFavorite 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/90 text-gray-600 hover:bg-white'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Thumbnail Images */}
              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {vehicle.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        currentImageIndex === index 
                          ? 'border-blue-500' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${vehicle.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{vehicle.title}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{vehicle.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>1,234 views</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center space-x-6 mb-6">
                <div className="text-3xl font-bold text-green-600">{formatCurrency(vehicle.price)}</div>
                {vehicle.savings > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg text-gray-500 line-through">{formatCurrency(vehicle.originalPrice)}</span>
                    <span className="badge-green">Save {formatCurrency(vehicle.savings)}</span>
                  </div>
                )}
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                  <div className="font-semibold text-gray-900">{vehicle.year}</div>
                  <div className="text-sm text-gray-500">Year</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Gauge className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                  <div className="font-semibold text-gray-900">{vehicle.kmDriven.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">KM</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Fuel className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                  <div className="font-semibold text-gray-900">{vehicle.fuelType}</div>
                  <div className="text-sm text-gray-500">Fuel</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                  <div className="font-semibold text-gray-900">{vehicle.owners}</div>
                  <div className="text-sm text-gray-500">Owner</div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map(feature => (
                    <span key={feature} className="badge-blue text-sm">{feature}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {vehicle.description}
              </div>
            </div>

            {/* Specifications */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(vehicle.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Service History */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service History</h3>
              <div className="space-y-3">
                {vehicle.serviceHistory.map((service, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{service.type}</div>
                      <div className="text-sm text-gray-500">{service.date} • {service.km.toLocaleString()} km • {service.dealer}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Pros</span>
                </h3>
                <ul className="space-y-2">
                  {vehicle.pros.map((pro, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Info className="h-5 w-5 text-orange-500" />
                  <span>Things to Note</span>
                </h3>
                <ul className="space-y-2">
                  {vehicle.cons.map((con, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>Reviews & Ratings</span>
                </h3>
              </div>
              <Reviews vehicleId={vehicle.id} />
            </div>

            {/* Price Alerts Section */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-blue-500" />
                  <span>Price Alerts</span>
                </h3>
              </div>
              <PriceAlerts 
                vehicleId={vehicle.id} 
                currentPrice={vehicle.price} 
                vehicleName={vehicle.title}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price & Contact Card */}
            <div className="card p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-green-600 mb-1">{formatCurrency(vehicle.price)}</div>
                {vehicle.savings > 0 && (
                  <div className="text-sm text-gray-500">
                    <span className="line-through">{formatCurrency(vehicle.originalPrice)}</span>
                    <span className="text-green-600 ml-2 font-medium">Save {formatCurrency(vehicle.savings)}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setShowContactForm(true)}
                  className="btn-primary w-full"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Seller
                </button>
                
                <button className="btn-secondary w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </button>
                
                <button 
                  onClick={() => setShowEMICalculator(true)}
                  className="btn-outline w-full"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  EMI Calculator
                </button>
              </div>
            </div>

            {/* Seller Info */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
              
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-blue-600">
                    {vehicle.seller.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{vehicle.seller.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{vehicle.seller.rating}</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{vehicle.seller.totalListings} listings</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Seller Type:</span>
                  <span className="text-gray-900 font-medium">{vehicle.seller.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Response Time:</span>
                  <span className="text-gray-900 font-medium">{vehicle.seller.responseTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Status:</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 font-medium">{vehicle.seller.lastSeen}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Vehicles */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Vehicles</h3>
              <div className="space-y-4">
                {vehicle.similarVehicles.map(similar => (
                  <div key={similar.id} className="flex space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <img
                      src={similar.image}
                      alt={similar.title}
                      className="w-16 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{similar.title}</h4>
                      <div className="text-green-600 font-semibold">{formatCurrency(similar.price)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
};

export default VehicleDetail;