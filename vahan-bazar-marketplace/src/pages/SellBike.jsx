import React, { useState } from 'react'
import { Camera, Upload, Calendar, MapPin, Phone, User, Mail, Car, DollarSign, CheckCircle, Info } from 'lucide-react'

const SellBike = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Vehicle Details
    brand: '',
    model: '',
    year: '',
    variant: '',
    fuelType: '',
    transmission: '',
    kmDriven: '',
    owners: '1',
    
    // Vehicle Condition
    condition: '',
    insurance: '',
    accidentHistory: 'no',
    modifications: 'no',
    
    // Owner Details
    ownerName: '',
    email: '',
    phone: '',
    city: '',
    
    // Additional Details
    expectedPrice: '',
    description: '',
    urgentSale: false,
    
    // Documents
    hasRC: true,
    hasInsurance: true,
    hasPUC: true,
    
    // Images
    images: []
  })
  
  const [estimatedPrice, setEstimatedPrice] = useState(null)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    // Simulate image upload
    const newImages = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      url: URL.createObjectURL(file)
    }))
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 8) // Max 8 images
    }))
  }

  const removeImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }))
  }

  const calculateEstimatedPrice = () => {
    // Simplified price estimation logic
    const basePrice = {
      'Honda': 50000,
      'Yamaha': 45000,
      'Bajaj': 40000,
      'TVS': 35000,
      'Hero': 30000,
      'KTM': 80000,
      'Royal Enfield': 70000
    }
    
    let price = basePrice[formData.brand] || 40000
    
    // Adjust for year
    const currentYear = new Date().getFullYear()
    const age = currentYear - parseInt(formData.year)
    price = price * Math.pow(0.9, age)
    
    // Adjust for kilometers
    const km = parseInt(formData.kmDriven)
    if (km > 50000) price *= 0.8
    else if (km > 20000) price *= 0.9
    
    // Adjust for condition
    if (formData.condition === 'excellent') price *= 1.1
    else if (formData.condition === 'poor') price *= 0.7
    
    // Adjust for owners
    if (formData.owners === '2') price *= 0.95
    else if (formData.owners === '3+') price *= 0.85
    
    setEstimatedPrice(Math.round(price))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate form submission
    setTimeout(() => {
      setSubmissionSuccess(true)
    }, 1000)
  }

  const nextStep = () => {
    if (currentStep === 2) {
      calculateEstimatedPrice()
    }
    setCurrentStep(prev => Math.min(prev + 1, 4))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const brands = ['Honda', 'Yamaha', 'Bajaj', 'TVS', 'Hero', 'KTM', 'Royal Enfield', 'Suzuki', 'Kawasaki']
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad', 'Kolkata', 'Ahmedabad']
  const fuelTypes = ['Petrol', 'Electric', 'CNG']
  const transmissions = ['Manual', 'Automatic', 'CVT']
  const conditions = ['Excellent', 'Good', 'Average', 'Poor']

  if (submissionSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Your bike listing has been submitted successfully.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Our team will review your listing and contact you within 24 hours.
          </p>
          <button
            onClick={() => {
              setSubmissionSuccess(false)
              setCurrentStep(1)
              setFormData({
                brand: '', model: '', year: '', variant: '', fuelType: '', transmission: '', kmDriven: '', owners: '1',
                condition: '', insurance: '', accidentHistory: 'no', modifications: 'no',
                ownerName: '', email: '', phone: '', city: '', expectedPrice: '', description: '', urgentSale: false,
                hasRC: true, hasInsurance: true, hasPUC: true, images: []
              })
              setEstimatedPrice(null)
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Sell Another Bike
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
              Sell Your Bike
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get the best price for your bike with our hassle-free selling process
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Vehicle Details</span>
            <span>Condition</span>
            <span>Owner Info</span>
            <span>Photos & Submit</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Vehicle Details */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                    <select
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Brand</option>
                      {brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., CB Shine, FZ, Pulsar"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Year</option>
                      {Array.from({length: 20}, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type *</label>
                    <select
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Fuel Type</option>
                      {fuelTypes.map(fuel => (
                        <option key={fuel} value={fuel}>{fuel}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transmission *</label>
                    <select
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Transmission</option>
                      {transmissions.map(trans => (
                        <option key={trans} value={trans}>{trans}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">KM Driven *</label>
                    <input
                      type="number"
                      name="kmDriven"
                      value={formData.kmDriven}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 15000"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Owners *</label>
                    <select
                      name="owners"
                      value={formData.owners}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="1">1st Owner</option>
                      <option value="2">2nd Owner</option>
                      <option value="3+">3+ Owners</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Variant</label>
                    <input
                      type="text"
                      name="variant"
                      value={formData.variant}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Standard, Deluxe, Sport"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Condition */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Condition</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Overall Condition *</label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Condition</option>
                      {conditions.map(condition => (
                        <option key={condition} value={condition.toLowerCase()}>{condition}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Status *</label>
                    <select
                      name="insurance"
                      value={formData.insurance}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="comprehensive">Comprehensive</option>
                      <option value="third-party">Third Party</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Accident History *</label>
                    <select
                      name="accidentHistory"
                      value={formData.accidentHistory}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="no">No Accidents</option>
                      <option value="minor">Minor Accidents</option>
                      <option value="major">Major Accidents</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Modifications *</label>
                    <select
                      name="modifications"
                      value={formData.modifications}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="no">No Modifications</option>
                      <option value="minor">Minor Modifications</option>
                      <option value="major">Major Modifications</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Available Documents</label>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="hasRC"
                          checked={formData.hasRC}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Registration Certificate (RC)
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="hasInsurance"
                          checked={formData.hasInsurance}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Insurance Papers
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="hasPUC"
                          checked={formData.hasPUC}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        PUC Certificate
                      </label>
                    </div>
                  </div>
                </div>

                {estimatedPrice && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">Estimated Price Range</h3>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{(estimatedPrice * 0.9).toLocaleString()} - ₹{(estimatedPrice * 1.1).toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      Based on market analysis and your vehicle details
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Owner Details */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Owner Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="h-4 w-4 inline mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select City</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Price</label>
                    <input
                      type="number"
                      name="expectedPrice"
                      value={formData.expectedPrice}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="₹ Enter your expected price"
                    />
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="urgentSale"
                        checked={formData.urgentSale}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Urgent Sale
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us more about your bike, its condition, service history, etc."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Photos */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Photos</h2>
                
                <div className="mb-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Upload clear photos of your bike (Max 8 photos)
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer inline-flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Choose Photos
                    </label>
                  </div>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {formData.images.map(image => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Photo Tips</h4>
                      <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                        <li>• Take photos in good lighting</li>
                        <li>• Include front, back, side views and dashboard</li>
                        <li>• Show any scratches or damages clearly</li>
                        <li>• Clean your bike before taking photos</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Final Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Listing Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Vehicle:</span>
                      <div className="font-medium">{formData.brand} {formData.model} {formData.year}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">KM Driven:</span>
                      <div className="font-medium">{formData.kmDriven?.toLocaleString()} km</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Condition:</span>
                      <div className="font-medium capitalize">{formData.condition}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Expected Price:</span>
                      <div className="font-medium">₹{formData.expectedPrice?.toLocaleString() || 'Not specified'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className={`px-6 py-2 rounded-lg border ${
                  currentStep === 1 
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                disabled={currentStep === 1}
              >
                Previous
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  Submit Listing
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SellBike