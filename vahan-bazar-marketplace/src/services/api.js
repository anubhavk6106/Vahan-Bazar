import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Handle common error cases
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Vehicle API endpoints
export const vehicleAPI = {
  // Get all vehicles with filtering and pagination
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add pagination
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    // Add filters
    if (params.category) queryParams.append('category', params.category);
    if (params.brand) queryParams.append('brand', params.brand);
    if (params.fuelType) queryParams.append('fuelType', params.fuelType);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice);
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
    if (params.search) queryParams.append('search', params.search);
    
    // Add sorting
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    const queryString = queryParams.toString();
    const url = `/vehicles${queryString ? `?${queryString}` : ''}`;
    
    return api.get(url);
  },

  // Get single vehicle by ID
  getById: (id) => api.get(`/vehicles/${id}`),

  // Get vehicle brands
  getBrands: () => api.get('/vehicles/meta/brands'),

  // Get vehicle categories
  getCategories: () => api.get('/vehicles/meta/categories'),

  // Get similar vehicles
  getSimilar: (id, limit = 4) => api.get(`/vehicles/${id}/similar?limit=${limit}`),
};

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

// User API endpoints
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
};

// Admin API endpoints
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  
  // User Management
  getAllUsers: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.role) queryParams.append('role', params.role);
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    return api.get(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },
  createUser: (userData) => api.post('/admin/users', userData),
  updateUserStatus: (userId, statusData) => api.patch(`/admin/users/${userId}/status`, statusData),
  
  // Vehicle Management
  getAllVehiclesAdmin: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.category) queryParams.append('category', params.category);
    if (params.dealer_id) queryParams.append('dealer_id', params.dealer_id);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    return api.get(`/admin/vehicles${queryString ? `?${queryString}` : ''}`);
  },
  updateVehicleStatus: (vehicleId, statusData) => api.patch(`/admin/vehicles/${vehicleId}/status`, statusData),
  deleteVehicle: (vehicleId) => api.delete(`/admin/vehicles/${vehicleId}`),
  
  // Booking Management
  getAllBookings: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.booking_type) queryParams.append('booking_type', params.booking_type);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    return api.get(`/admin/bookings${queryString ? `?${queryString}` : ''}`);
  },
  updateBookingStatus: (bookingId, statusData) => api.patch(`/admin/bookings/${bookingId}/status`, statusData)
};

// Utility function for handling API errors
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.error || error.response.data?.message || 'An error occurred';
    return {
      message,
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request was made but no response
    return {
      message: 'Network error - please check your connection',
      status: null,
      data: null,
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: null,
      data: null,
    };
  }
};

export default api;
