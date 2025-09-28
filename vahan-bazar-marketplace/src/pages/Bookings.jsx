import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Phone, Mail, MapPin, Car, X, CheckCircle, AlertCircle, Eye, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Bookings = () => {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, activeTab, currentPage]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const statusFilter = activeTab === 'all' ? '' : `&status=${activeTab}`;
      const response = await api.get(`/bookings?page=${currentPage}&limit=10${statusFilter}`);
      
      if (response.data.success) {
        setBookings(response.data.data.bookings);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/cancel`);
      
      if (response.data.success) {
        fetchBookings(); // Refresh the bookings
      }
    } catch (error) {
      console.error('Error canceling booking:', error);
      alert('Failed to cancel booking');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'cancelled':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBookingTypeDisplay = (type) => {
    switch (type) {
      case 'test_ride':
        return 'Test Ride';
      case 'purchase_inquiry':
        return 'Purchase Inquiry';
      case 'emi_inquiry':
        return 'EMI Inquiry';
      default:
        return type;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { key: 'all', label: 'All Bookings' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign in to view bookings</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to see your bookings.</p>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 text-red-800 p-4 rounded-lg">
            <p>{error}</p>
            <button 
              onClick={fetchBookings}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                My Bookings
              </h1>
              <p className="text-gray-600 mt-2">
                Track and manage your test rides and inquiries
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            </div>
          </div>
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="card p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'all' ? 'No bookings yet' : `No ${activeTab} bookings`}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {activeTab === 'all' 
                ? 'Start browsing vehicles and book test rides or make inquiries to see them here.'
                : `You don't have any ${activeTab} bookings at the moment.`
              }
            </p>
            <Link
              to="/browse"
              className="btn-primary inline-flex items-center"
            >
              <Car className="h-4 w-4 mr-2" />
              Browse Vehicles
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="card hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Left side - Vehicle and booking info */}
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        {/* Vehicle image */}
                        <div className="relative">
                          <img
                            src={booking.vehicle.images?.[0] || '/api/placeholder/120/100'}
                            alt={booking.vehicle.name}
                            className="w-24 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                          <span className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        
                        {/* Vehicle details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {booking.vehicle.name}
                          </h3>
                          
                          <p className="text-sm text-gray-600 mb-3">
                            {booking.vehicle.brand} • {booking.vehicle.category}
                          </p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Car className="h-4 w-4 text-blue-500" />
                              <span>{getBookingTypeDisplay(booking.booking_type)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span>{formatDate(booking.preferred_date)}</span>
                            </div>
                            {booking.preferred_time && (
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <span>{formatTime(booking.preferred_time)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Customer details */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-2 flex-shrink-0 text-green-600" />
                            <span>{booking.customer_phone}</span>
                          </div>
                          {booking.customer_email && (
                            <div className="flex items-center text-gray-600">
                              <Mail className="h-4 w-4 mr-2 flex-shrink-0 text-blue-600" />
                              <span className="truncate">{booking.customer_email}</span>
                            </div>
                          )}
                          {booking.city && (
                            <div className="flex items-center text-gray-600">
                              <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-red-600" />
                              <span>{booking.city}</span>
                            </div>
                          )}
                        </div>

                        {booking.message && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium text-gray-900">Message:</span> {booking.message}
                            </p>
                          </div>
                        )}

                        {booking.dealer_notes && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                            <p className="text-sm text-blue-800">
                              <span className="font-medium text-blue-900">Dealer Notes:</span> {booking.dealer_notes}
                            </p>
                          </div>
                        )}

                        {booking.confirmed_date && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                            <p className="text-sm text-green-800">
                              <span className="font-medium text-green-900">Confirmed for:</span> {formatDate(booking.confirmed_date)}
                              {booking.confirmed_time && ` at ${formatTime(booking.confirmed_time)}`}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex flex-col space-y-3 lg:w-40">
                      <Link
                        to={`/vehicle/${booking.vehicle.id}`}
                        className="btn-secondary text-sm flex items-center justify-center"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Vehicle
                      </Link>
                      
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to cancel this booking?')) {
                              cancelBooking(booking.id);
                            }
                          }}
                          className="btn-outline-red text-sm flex items-center justify-center"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </button>
                      )}

                      <div className="flex items-center justify-center text-xs text-gray-500 pt-2 border-t">
                        {getStatusIcon(booking.status)}
                        <span className="ml-1">
                          {formatDate(booking.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="card p-2 flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className="btn-secondary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-2 px-4">
                    <span className="text-sm text-gray-600">Page</span>
                    <span className="text-sm font-semibold text-blue-600">{pagination.currentPage}</span>
                    <span className="text-sm text-gray-600">of</span>
                    <span className="text-sm font-semibold">{pagination.totalPages}</span>
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="btn-secondary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Bookings;