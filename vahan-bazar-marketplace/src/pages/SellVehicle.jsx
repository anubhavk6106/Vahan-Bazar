import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Upload, 
  X, 
  Check, 
  Camera, 
  FileText, 
  MapPin, 
  Phone, 
  Mail,
  Star,
  Info,
  DollarSign
} from 'lucide-react';

const SellVehicle = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    vehicleType: '',
    brand: '',
    model: '',
    variant: '',
    year: '',
    fuelType: '',
    transmission: '',
    
    // Vehicle Details
    kmDriven: '',
    owners: '1',
    condition: '',
    engineCapacity: '',
    mileage: '',
    
    // Location & Pricing
    location: '',
    city: '',
    state: '',
    expectedPrice: '',
    negotiable: true,
    
    // Contact Information
    ownerName: '',
    phone: '',
    email: '',
    availableTime: '',
    
    // Additional Details
    description: '',
    features: [],
    reasons: '',
    urgency: 'normal',
    
    // Documents & Photos
    images: [],
    documents: []
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(null);

  const vehicleTypes = [
    { value: 'bike', label: 'Bike', icon: '🏍️', description: 'Motorcycles & Sports Bikes' },
    { value: 'scooter', label: 'Scooter', icon: '🛵', description: 'Scooters & Mopeds' },
    { value: 'ev', label: 'Electric Vehicle', icon: '⚡', description: 'Electric Bikes & Scooters' }
  ];

  const brands = {
    bike: ['Royal Enfield', 'Honda', 'Yamaha', 'Bajaj', 'TVS', 'KTM', 'Kawasaki', 'Suzuki'],
    scooter: ['Honda', 'TVS', 'Suzuki', 'Hero', 'Bajaj', 'Yamaha'],
    ev: ['Ather', 'TVS', 'Bajaj', 'Hero Electric', 'Okinawa', 'Simple One']
  };

  const fuelTypes = ['Petrol', 'Electric', 'CNG', 'Hybrid'];
  const transmissions = ['Manual', 'Automatic', 'CVT'];
  const conditions = ['Excellent', 'Good', 'Fair', 'Needs Work'];
  const ownerOptions = ['1', '2', '3', '4+'];

  const features = [
    'ABS', 'Electric Start', 'Kick Start', 'LED Headlight', 'Digital Console',
    'Bluetooth Connectivity', 'USB Charging', 'Anti-theft Alarm', 'Alloy Wheels',
    'Disc Brakes', 'Tubeless Tyres', 'Gear Indicator', 'Side Stand Indicator'
  ];

  const urgencyOptions = [
    { value: 'normal', label: 'Normal', icon: '🕐', description: 'Sell within 30-45 days' },
    { value: 'urgent', label: 'Urgent', icon: '⚡', description: 'Sell within 15 days' },
    { value: 'immediate', label: 'Immediate', icon: '🔥', description: 'Sell within 7 days' }
  ];

  const steps = [
    { id: 1, title: 'Basic Info', icon: '🏍️' },
    { id: 2, title: 'Vehicle Details', icon: '📝' },
    { id: 3, title: 'Location & Price', icon: '💰' },
    { id: 4, title: 'Contact Info', icon: '📞' },
    { id: 5, title: 'Photos & Docs', icon: '📸' },
    { id: 6, title: 'Review', icon: '✅' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-calculate estimated price for demonstration
    if (['brand', 'year', 'kmDriven', 'condition'].includes(field)) {
      calculateEstimatedPrice();
    }
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    
    setUploadedImages(prev => [...prev, ...newImages].slice(0, 10)); // Max 10 images
  };

  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const calculateEstimatedPrice = () => {
    // Simple price estimation logic for demonstration
    const { brand, year, kmDriven, condition } = formData;
    
    if (brand && year && kmDriven && condition) {
      let basePrice = 100000; // Base price
      
      // Adjust for brand
      const brandMultipliers = {
        'Royal Enfield': 1.2,
        'Honda': 1.1,
        'Yamaha': 1.1,
        'KTM': 1.3,
        'TVS': 1.0,
        'Bajaj': 1.0
      };
      
      basePrice *= (brandMultipliers[brand] || 1.0);
      
      // Adjust for year
      const currentYear = new Date().getFullYear();
      const age = currentYear - parseInt(year);
      const depreciation = Math.pow(0.85, age); // 15% depreciation per year
      basePrice *= depreciation;
      
      // Adjust for condition
      const conditionMultipliers = {
        'Excellent': 1.0,
        'Good': 0.85,
        'Fair': 0.7,
        'Needs Work': 0.5
      };
      
      basePrice *= (conditionMultipliers[condition] || 0.85);
      
      // Adjust for km driven
      const kmDrivenNum = parseInt(kmDriven);
      if (kmDrivenNum > 50000) {
        basePrice *= 0.8;
      } else if (kmDrivenNum > 30000) {
        basePrice *= 0.9;
      }
      
      setEstimatedPrice(Math.round(basePrice));
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formData);
    console.log('Uploaded images:', uploadedImages);
    setShowSuccessModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Step Components
  const Step1BasicInfo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">What type of vehicle are you selling?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vehicleTypes.map(type => (
            <button
              key={type.value}
              onClick={() => handleInputChange('vehicleType', type.value)}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                formData.vehicleType === type.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <div className="text-3xl mb-2">{type.icon}</div>
              <div className="font-semibold">{type.label}</div>
              <div className="text-sm text-gray-500">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {formData.vehicleType && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Brand</label>
            <select
              value={formData.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              className="form-select"
            >
              <option value="">Select Brand</option>
              {brands[formData.vehicleType]?.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Model</label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
              className="form-input"
              placeholder="e.g., Classic 350, Activa 6G"
            />
          </div>

          <div>
            <label className="form-label">Year of Manufacture</label>
            <select
              value={formData.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
              className="form-select"
            >
              <option value="">Select Year</option>
              {Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Fuel Type</label>
            <select
              value={formData.fuelType}
              onChange={(e) => handleInputChange('fuelType', e.target.value)}
              className="form-select"
            >
              <option value="">Select Fuel Type</option>
              {fuelTypes.map(fuel => (
                <option key={fuel} value={fuel}>{fuel}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Transmission</label>
            <select
              value={formData.transmission}
              onChange={(e) => handleInputChange('transmission', e.target.value)}
              className="form-select"
            >
              <option value="">Select Transmission</option>
              {transmissions.map(trans => (
                <option key={trans} value={trans}>{trans}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );

  const Step2VehicleDetails = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Kilometers Driven</label>
          <input
            type="number"
            value={formData.kmDriven}
            onChange={(e) => handleInputChange('kmDriven', e.target.value)}
            className="form-input"
            placeholder="e.g., 25000"
          />
        </div>

        <div>
          <label className="form-label">Number of Owners</label>
          <select
            value={formData.owners}
            onChange={(e) => handleInputChange('owners', e.target.value)}
            className="form-select"
          >
            {ownerOptions.map(owner => (
              <option key={owner} value={owner}>{owner} Owner{owner !== '1' ? 's' : ''}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Vehicle Condition</label>
          <select
            value={formData.condition}
            onChange={(e) => handleInputChange('condition', e.target.value)}
            className="form-select"
          >
            <option value="">Select Condition</option>
            {conditions.map(condition => (
              <option key={condition} value={condition}>{condition}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Engine Capacity (cc)</label>
          <input
            type="number"
            value={formData.engineCapacity}
            onChange={(e) => handleInputChange('engineCapacity', e.target.value)}
            className="form-input"
            placeholder="e.g., 350"
          />
        </div>

        <div>
          <label className="form-label">Mileage (kmpl / km/kWh)</label>
          <input
            type="number"
            value={formData.mileage}
            onChange={(e) => handleInputChange('mileage', e.target.value)}
            className="form-input"
            placeholder="e.g., 35"
          />
        </div>
      </div>

      <div>
        <label className="form-label">Features Available</label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
          {features.map(feature => (
            <label key={feature} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.features.includes(feature)}
                onChange={() => handleFeatureToggle(feature)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{feature}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="form-label">Additional Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="form-textarea"
          rows="4"
          placeholder="Describe your vehicle's condition, modifications, service history, etc..."
        />
      </div>
    </div>
  );

  const Step3LocationPrice = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Location & Pricing</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="form-input"
            placeholder="e.g., Mumbai"
          />
        </div>

        <div>
          <label className="form-label">State</label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className="form-input"
            placeholder="e.g., Maharashtra"
          />
        </div>

        <div className="md:col-span-2">
          <label className="form-label">Detailed Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="form-input"
            placeholder="e.g., Bandra West, near Linking Road"
          />
        </div>

        <div>
          <label className="form-label">Expected Price (₹)</label>
          <input
            type="number"
            value={formData.expectedPrice}
            onChange={(e) => handleInputChange('expectedPrice', e.target.value)}
            className="form-input"
            placeholder="e.g., 85000"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="negotiable"
            checked={formData.negotiable}
            onChange={(e) => handleInputChange('negotiable', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="negotiable" className="text-gray-700">Price is negotiable</label>
        </div>
      </div>

      {estimatedPrice && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900">Estimated Market Price</h4>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {formatCurrency(estimatedPrice)}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Based on brand, year, condition, and mileage. Actual market value may vary.
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="form-label">How urgent is the sale?</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {urgencyOptions.map(option => (
            <button
              key={option.value}
              onClick={() => handleInputChange('urgency', option.value)}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                formData.urgency === option.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <div className="text-2xl mb-1">{option.icon}</div>
              <div className="font-semibold">{option.label}</div>
              <div className="text-sm text-gray-500">{option.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const Step4ContactInfo = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Owner Name</label>
          <input
            type="text"
            value={formData.ownerName}
            onChange={(e) => handleInputChange('ownerName', e.target.value)}
            className="form-input"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="form-input"
            placeholder="+91 98765 43210"
          />
        </div>

        <div>
          <label className="form-label">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="form-input"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label className="form-label">Best Time to Contact</label>
          <select
            value={formData.availableTime}
            onChange={(e) => handleInputChange('availableTime', e.target.value)}
            className="form-select"
          >
            <option value="">Select Time</option>
            <option value="morning">Morning (9 AM - 12 PM)</option>
            <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
            <option value="evening">Evening (5 PM - 8 PM)</option>
            <option value="anytime">Anytime</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="form-label">Reason for Selling (Optional)</label>
          <textarea
            value={formData.reasons}
            onChange={(e) => handleInputChange('reasons', e.target.value)}
            className="form-textarea"
            rows="3"
            placeholder="e.g., Upgrading to a new vehicle, relocating, etc."
          />
        </div>
      </div>
    </div>
  );

  const Step5PhotosDocs = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Photos & Documents</h3>
      
      <div>
        <label className="form-label">Upload Photos (Max 10)</label>
        <div className="mt-2">
          <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
            <div className="space-y-1 text-center">
              <Camera className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                  <span>Upload photos</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
            </div>
          </div>
        </div>

        {uploadedImages.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Uploaded Photos ({uploadedImages.length}/10)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {uploadedImages.map(image => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-700">
            <h4 className="font-semibold mb-1">Photo Tips</h4>
            <ul className="space-y-1">
              <li>• Take photos in good lighting</li>
              <li>• Include front, back, sides, and interior views</li>
              <li>• Show any damage or wear clearly</li>
              <li>• Include photos of documents if possible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const Step6Review = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Review Your Listing</h3>
      
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-gray-700">Vehicle:</span>
            <span className="ml-2 text-gray-900">
              {formData.brand} {formData.model} {formData.year}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Type:</span>
            <span className="ml-2 text-gray-900 capitalize">{formData.vehicleType}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Condition:</span>
            <span className="ml-2 text-gray-900">{formData.condition}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">KM Driven:</span>
            <span className="ml-2 text-gray-900">{formData.kmDriven?.toLocaleString()} km</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Location:</span>
            <span className="ml-2 text-gray-900">{formData.city}, {formData.state}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Expected Price:</span>
            <span className="ml-2 text-gray-900 font-semibold">
              ₹{formData.expectedPrice?.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Contact:</span>
            <span className="ml-2 text-gray-900">{formData.ownerName}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Phone:</span>
            <span className="ml-2 text-gray-900">{formData.phone}</span>
          </div>
        </div>
        
        {formData.features.length > 0 && (
          <div>
            <span className="font-medium text-gray-700">Features:</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {formData.features.map(feature => (
                <span key={feature} className="badge-blue text-xs">{feature}</span>
              ))}
            </div>
          </div>
        )}
        
        {formData.description && (
          <div>
            <span className="font-medium text-gray-700">Description:</span>
            <p className="mt-1 text-gray-900 text-sm">{formData.description}</p>
          </div>
        )}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-green-700">
            <h4 className="font-semibold mb-1">Ready to Submit</h4>
            <p>
              Your listing will be reviewed and published within 24 hours. You'll receive notifications
              when buyers show interest in your vehicle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const SuccessModal = () => (
    <>
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
            <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Listing Submitted Successfully!
            </h3>
            <p className="text-gray-600 mb-6">
              Your vehicle listing has been submitted for review. We'll notify you once it's published.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  // Reset form or navigate
                }}
                className="btn-primary w-full"
              >
                Create Another Listing
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="btn-secondary w-full"
              >
                View My Listings
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <Step1BasicInfo />;
      case 2: return <Step2VehicleDetails />;
      case 3: return <Step3LocationPrice />;
      case 4: return <Step4ContactInfo />;
      case 5: return <Step5PhotosDocs />;
      case 6: return <Step6Review />;
      default: return <Step1BasicInfo />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sell Your Vehicle
          </h1>
          <p className="text-xl text-gray-600">
            List your bike, scooter, or EV and connect with genuine buyers
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                <div className="ml-2 hidden sm:block">
                  <div className={`text-sm font-semibold ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden md:block w-12 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="card p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <div className="text-sm text-gray-500">
            Step {currentStep} of {steps.length}
          </div>

          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 btn-primary"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center space-x-2 btn-primary"
            >
              <span>Submit Listing</span>
              <Check className="h-4 w-4" />
            </button>
          )}
        </div>

        <SuccessModal />
      </div>
    </div>
  );
};

export default SellVehicle;