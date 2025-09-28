import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../services/api';
import {
  Search,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Car,
  Phone,
  Mail,
  MessageSquare,
  Edit
} from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    booking_type: 'all',
    page: 1,
    limit: 15
  });
  const [pagination, setPagination] = useState({});
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    dealer_notes: ''
  });

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllBookings(filters);
      if (response.success) {
        setBookings(response.data.bookings);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedBooking) return;

    try {
      const response = await adminAPI.updateBookingStatus(selectedBooking.id, statusUpdate);
      if (response.success) {
        setBookings(bookings.map(booking =>
          booking.id === selectedBooking.id
            ? { ...booking, status: statusUpdate.status, dealer_notes: statusUpdate.dealer_notes }
            : booking
        ));
        setShowStatusModal(false);
        setSelectedBooking(null);
        setStatusUpdate({ status: '', dealer_notes: '' });
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return CheckCircle;
      case 'completed':
        return CheckCircle;
      case 'cancelled':
        return XCircle;
      default:
        return Clock;
    }
  };

  const getBookingTypeLabel = (type) => {
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
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Monitor and manage all test ride bookings and inquiries across the platform.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="block w-full pr-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Booking Type
              </label>
              <select
                value={filters.booking_type}
                onChange={(e) => handleFilterChange('booking_type', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Types</option>
                <option value="test_ride">Test Rides</option>
                <option value="purchase_inquiry">Purchase Inquiries</option>
                <option value="emi_inquiry">EMI Inquiries</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Per Page
              </label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                className="mt-1 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value={15}>15</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {bookings.map((booking) => {
                const StatusIcon = getStatusIcon(booking.status);
                return (
                  <li key={booking.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4">
                        {/* Status Icon */}
                        <div className="flex-shrink-0">
                          <div className={`p-2 rounded-full ${getStatusColor(booking.status)}`}>
                            <StatusIcon className="h-4 w-4" />
                          </div>
                        </div>

                        {/* Booking Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">
                                {booking.customer_name}
                              </h3>
                              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {booking.customer_phone}
                                </div>
                                <div className="flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {booking.customer_email}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </div>
                              <div className="mt-1 text-xs text-gray-500">
                                {getBookingTypeLabel(booking.booking_type)}
                              </div>
                            </div>
                          </div>

                          {/* Vehicle Info */}
                          {booking.vehicle && (
                            <div className="mt-2 flex items-center text-sm text-gray-600">
                              <Car className="h-4 w-4 mr-2" />
                              <span>{booking.vehicle.name} - {booking.vehicle.brand} {booking.vehicle.model}</span>
                              <span className="ml-4 text-green-600 font-medium">
                                ₹{booking.vehicle.price?.toLocaleString()}
                              </span>
                            </div>
                          )}

                          {/* Dealer Info */}
                          {booking.vehicle?.dealer && (
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                              <User className="h-3 w-3 mr-1" />
                              <span>Dealer: {booking.vehicle.dealer.name}</span>
                            </div>
                          )}

                          {/* Date/Time */}
                          {booking.preferred_date && (
                            <div className="mt-2 flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>
                                Preferred: {formatDate(booking.preferred_date)}
                                {booking.preferred_time && (
                                  <span className="ml-2">at {formatTime(booking.preferred_time)}</span>
                                )}
                              </span>
                            </div>
                          )}

                          {/* Message */}
                          {booking.message && (
                            <div className="mt-2 flex items-start text-sm text-gray-600">
                              <MessageSquare className="h-4 w-4 mr-2 mt-0.5" />
                              <span className="italic">"{booking.message}"</span>
                            </div>
                          )}

                          {/* Dealer Notes */}
                          {booking.dealer_notes && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                              <strong>Dealer Notes:</strong> {booking.dealer_notes}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setStatusUpdate({ 
                              status: booking.status, 
                              dealer_notes: booking.dealer_notes || '' 
                            });
                            setShowStatusModal(true);
                          }}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Update
                        </button>
                        <div className="text-xs text-gray-500 text-center">
                          {formatDate(booking.created_at)}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
              {pagination.totalItems} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Update Booking Status
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer: {selectedBooking.customer_name}
                  </label>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle: {selectedBooking.vehicle?.name}
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={statusUpdate.status}
                    onChange={(e) => setStatusUpdate(prev => ({ ...prev, status: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={statusUpdate.dealer_notes}
                    onChange={(e) => setStatusUpdate(prev => ({ ...prev, dealer_notes: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Add notes about this booking..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowStatusModal(false);
                      setSelectedBooking(null);
                      setStatusUpdate({ status: '', dealer_notes: '' });
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStatusUpdate}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBookings;