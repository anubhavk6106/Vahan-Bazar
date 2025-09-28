import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../services/api';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Car,
  Zap,
  DollarSign,
  User
} from 'lucide-react';

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    category: 'all',
    dealer_id: '',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllVehiclesAdmin(filters);
      if (response.success) {
        setVehicles(response.data.vehicles);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (vehicleId, newStatus) => {
    try {
      const response = await adminAPI.updateVehicleStatus(vehicleId, { status: newStatus });
      if (response.success) {
        setVehicles(vehicles.map(vehicle =>
          vehicle.id === vehicleId
            ? { ...vehicle, status: newStatus }
            : vehicle
        ));
      }
    } catch (error) {
      console.error('Error updating vehicle status:', error);
    }
  };

  const handleDeleteVehicle = async () => {
    if (!vehicleToDelete) return;

    try {
      const response = await adminAPI.deleteVehicle(vehicleToDelete.id);
      if (response.success) {
        setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleToDelete.id));
        setShowDeleteModal(false);
        setVehicleToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      // Show error message if vehicle cannot be deleted
      alert(error.response?.data?.error || 'Failed to delete vehicle');
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
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'discontinued':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return CheckCircle;
      case 'inactive':
        return Clock;
      case 'discontinued':
        return XCircle;
      default:
        return Clock;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'ev':
        return Zap;
      default:
        return Car;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-bold text-gray-900">Vehicle Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage all vehicles across dealers, approve new listings, and monitor status.
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
                  placeholder="Search vehicles..."
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Categories</option>
                <option value="bike">Bikes</option>
                <option value="scooter">Scooters</option>
                <option value="ev">Electric Vehicles</option>
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
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {vehicles.map((vehicle) => {
                const StatusIcon = getStatusIcon(vehicle.status);
                const CategoryIcon = getCategoryIcon(vehicle.category);
                return (
                  <div key={vehicle.id} className="bg-white overflow-hidden shadow-lg rounded-lg">
                    {/* Vehicle Image */}
                    <div className="aspect-w-16 aspect-h-10 bg-gray-200">
                      {vehicle.images && vehicle.images.length > 0 ? (
                        <img
                          src={vehicle.images[0]}
                          alt={vehicle.name}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                          <CategoryIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Vehicle Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {vehicle.name}
                        </h3>
                        <div className="flex items-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vehicle.status)}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {vehicle.status}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mb-2">
                        <div className="flex items-center justify-between">
                          <span>{vehicle.brand} {vehicle.model}</span>
                          <span className="capitalize">{vehicle.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-green-600">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span className="font-semibold">{formatPrice(vehicle.price)}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {vehicle.fuel_type}
                        </div>
                      </div>

                      {/* Dealer Info */}
                      {vehicle.dealer && (
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <User className="h-4 w-4 mr-1" />
                          <span className="truncate">{vehicle.dealer.name}</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <select
                            value={vehicle.status}
                            onChange={(e) => handleStatusChange(vehicle.id, e.target.value)}
                            className="text-xs border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="discontinued">Discontinued</option>
                          </select>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setVehicleToDelete(vehicle);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-800"
                            title="Delete Vehicle"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && vehicleToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="mt-2 text-center">
                <h3 className="text-lg font-medium text-gray-900">Delete Vehicle</h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Are you sure you want to delete "{vehicleToDelete.name}"?</p>
                  <p className="mt-1 text-red-600 font-medium">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-center space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setVehicleToDelete(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteVehicle}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminVehicles;