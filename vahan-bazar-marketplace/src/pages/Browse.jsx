import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Filter, Grid, List, Search, Star, Heart, Loader2 } from 'lucide-react'
import { vehicleAPI, handleAPIError } from '../services/api'

const Browse = () => {
  const { category } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // State
  const [vehicles, setVehicles] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || category || '',
    brand: searchParams.get('brand') || '',
    fuelType: searchParams.get('fuelType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'created_at',
    sortOrder: searchParams.get('sortOrder') || 'desc'
  })
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  
  const categories = {
    bikes: 'Bikes',
    scooters: 'Scooters', 
    evs: 'Electric Vehicles'
  }
  
  const fuelTypes = ['Petrol', 'Electric', 'Diesel', 'CNG']
  
  const priceRanges = [
    { label: 'Under ₹50,000', min: 0, max: 50000 },
    { label: '₹50,000 - ₹1,00,000', min: 50000, max: 100000 },
    { label: '₹1,00,000 - ₹2,00,000', min: 100000, max: 200000 },
    { label: '₹2,00,000 - ₹5,00,000', min: 200000, max: 500000 },
    { label: 'Above ₹5,00,000', min: 500000, max: Infinity }
  ]

  // Fetch vehicles from API
  const fetchVehicles = async (params = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      const apiParams = {
        page: pagination.page,
        limit: 12,
        ...params
      }
      
      // Add filters
      if (filters.category) apiParams.category = filters.category
      if (filters.brand) apiParams.brand = filters.brand
      if (filters.fuelType) apiParams.fuelType = filters.fuelType
      if (filters.minPrice) apiParams.minPrice = filters.minPrice
      if (filters.maxPrice) apiParams.maxPrice = filters.maxPrice
      if (searchQuery) apiParams.search = searchQuery
      if (filters.sortBy) apiParams.sortBy = filters.sortBy
      if (filters.sortOrder) apiParams.sortOrder = filters.sortOrder
      
      const response = await vehicleAPI.getAll(apiParams)
      
      setVehicles(response.data?.vehicles || [])
      setPagination({
        page: response.data?.pagination?.currentPage || 1,
        totalPages: response.data?.pagination?.totalPages || 1,
        total: response.data?.pagination?.totalItems || 0
      })
      
    } catch (err) {
      const errorInfo = handleAPIError(err)
      setError(errorInfo.message)
      console.error('Error fetching vehicles:', err)
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch brands
  const fetchBrands = async () => {
    try {
      const brandsData = await vehicleAPI.getBrands()
      setBrands(Array.isArray(brandsData?.data) ? brandsData.data : [])
    } catch (err) {
      console.error('Error fetching brands:', err)
    }
  }
  
  // Update URL params when filters change
  const updateURLParams = () => {
    const params = new URLSearchParams()
    
    if (filters.category) params.set('category', filters.category)
    if (filters.brand) params.set('brand', filters.brand)
    if (filters.fuelType) params.set('fuelType', filters.fuelType)
    if (filters.minPrice) params.set('minPrice', filters.minPrice)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    if (filters.sortBy) params.set('sortBy', filters.sortBy)
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder)
    if (searchQuery) params.set('search', searchQuery)
    
    setSearchParams(params)
  }
  
  // Update filters when URL parameters change
  useEffect(() => {
    const newCategory = searchParams.get('category') || category || ''
    const newBrand = searchParams.get('brand') || ''
    const newFuelType = searchParams.get('fuelType') || ''
    const newMinPrice = searchParams.get('minPrice') || ''
    const newMaxPrice = searchParams.get('maxPrice') || ''
    const newSortBy = searchParams.get('sortBy') || 'created_at'
    const newSortOrder = searchParams.get('sortOrder') || 'desc'
    const newSearchQuery = searchParams.get('search') || ''
    
    setFilters({
      category: newCategory,
      brand: newBrand,
      fuelType: newFuelType,
      minPrice: newMinPrice,
      maxPrice: newMaxPrice,
      sortBy: newSortBy,
      sortOrder: newSortOrder
    })
    setSearchQuery(newSearchQuery)
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page
  }, [searchParams, category])

  // Initial load
  useEffect(() => {
    fetchBrands()
    fetchVehicles()
  }, [])
  
  // Refetch when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchVehicles()
      updateURLParams()
    }, 500) // Debounce API calls
    
    return () => clearTimeout(timeoutId)
  }, [filters, searchQuery, pagination.page])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page when filters change
  }
  
  const handlePriceRangeChange = (range) => {
    if (range && range.min !== undefined && range.max !== undefined) {
      setFilters(prev => ({
        ...prev, 
        minPrice: range.min === 0 ? '' : range.min.toString(),
        maxPrice: range.max === Infinity ? '' : range.max.toString()
      }))
    } else {
      setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }))
    }
    setPagination(prev => ({ ...prev, page: 1 }))
  }
  
  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      fuelType: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    })
    setSearchQuery('')
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const VehicleCard = ({ vehicle }) => (
    <div className="card hover:shadow-lg transition-all duration-300 group">
      <div className="relative overflow-hidden">
        <img
          src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80'}
          alt={vehicle.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
          <Heart className="h-4 w-4 text-gray-600" />
        </button>
        <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium capitalize">
          {vehicle.fuelType}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
              {vehicle.name}
            </h3>
            <p className="text-sm text-gray-600">{vehicle.brand} • {vehicle.category}</p>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600">{vehicle.rating || '4.5'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Engine:</span>
            <div className="font-medium">{vehicle.engineCapacity || 'N/A'}</div>
          </div>
          <div>
            <span className="text-gray-500">Mileage:</span>
            <div className="font-medium">{vehicle.mileage || 'N/A'}</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-blue-600">
            {formatPrice(vehicle.price)}
          </div>
          <Link to={`/vehicle/${vehicle.id}`} className="btn-primary text-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {filters.category ? categories[filters.category] || 'Vehicles' : 'All Vehicles'}
              </h1>
              <p className="text-gray-600 mt-1">
                {loading ? 'Loading...' : `${pagination.total} vehicles found`}
              </p>
              {error && (
                <p className="text-red-600 text-sm mt-1">{error}</p>
              )}
            </div>

            {/* Search Bar */}
            <div className="mt-4 md:mt-0 max-w-md w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="bikes">Bikes</option>
                  <option value="scooters">Scooters</option>
                  <option value="evs">Electric Vehicles</option>
                </select>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Brands</option>
                  {Array.isArray(brands) && brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Fuel Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type
                </label>
                <select
                  value={filters.fuelType}
                  onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  {fuelTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  value={`${filters.minPrice}-${filters.maxPrice}`}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === 'all') {
                      handlePriceRangeChange(null)
                    } else {
                      const range = priceRanges.find(r => `${r.min === 0 ? '' : r.min}-${r.max === Infinity ? '' : r.max}` === value)
                      if (range) handlePriceRangeChange(range)
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Prices</option>
                  {priceRanges.map(range => (
                    <option key={range.label} value={`${range.min === 0 ? '' : range.min}-${range.max === Infinity ? '' : range.max}`}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden btn-secondary flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${
                      viewMode === 'grid' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${
                      viewMode === 'list' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-')
                    setFilters(prev => ({ ...prev, sortBy, sortOrder }))
                  }}
                  className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="created_at-desc">Latest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>

            {/* Vehicle Grid */}
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600 mb-4" />
                <p className="text-gray-600">Loading vehicles...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="max-w-sm mx-auto">
                  <div className="text-red-400 mb-4">
                    <Search className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Error loading vehicles
                  </h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button onClick={() => fetchVehicles()} className="btn-primary">
                    Retry
                  </button>
                </div>
              </div>
            ) : vehicles.length > 0 ? (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {vehicles.map(vehicle => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>
                
                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-300">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                        disabled={pagination.page === pagination.totalPages}
                        className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-sm mx-auto">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No vehicles found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <button onClick={clearFilters} className="btn-primary">
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Browse