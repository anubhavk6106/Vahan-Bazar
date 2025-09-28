import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, IndianRupee, Fuel, Settings, Calendar, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Favorites = () => {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, currentPage]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/favorites?page=${currentPage}&limit=12`);
      
      if (response.data.success) {
        setFavorites(response.data.data.favorites);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (vehicleId) => {
    try {
      const response = await api.delete(`/favorites/${vehicleId}`);
      
      if (response.data.success) {
        setFavorites(favorites.filter(fav => fav.vehicle.id !== vehicleId));
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const getFuelTypeIcon = (fuelType) => {
    switch (fuelType?.toLowerCase()) {
      case 'electric':
        return '⚡';
      case 'petrol':
        return '⛽';
      case 'hybrid':
        return '🔋';
      default:
        return '⛽';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign in to view favorites</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to see your favorite vehicles.</p>
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
              onClick={fetchFavorites}
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
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Heart className="h-8 w-8 text-red-500 mr-3" />
            My Favorites
          </h1>
          <p className="text-gray-600 mt-2">
            Vehicles you've saved for later
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="mx-auto h-20 w-20 text-gray-300 mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">
              Start browsing and add vehicles to your favorites to see them here.
            </p>
            <Link
              to="/browse"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Browse Vehicles
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((favorite) => {
                const vehicle = favorite.vehicle;
                return (
                  <div key={favorite.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                    {/* Image */}
                    <div className="relative">
                      <img
                        src={vehicle.images?.[0] || 'https://via.placeholder.com/400x250?text=No+Image'}
                        alt={vehicle.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      
                      {/* Remove from favorites button */}
                      <button
                        onClick={() => removeFromFavorites(vehicle.id)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                        title="Remove from favorites"
                      >
                        <Heart className="h-5 w-5 text-red-500 fill-current" />
                      </button>

                      {/* Category badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full capitalize">
                          {vehicle.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                        {vehicle.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">{vehicle.brand}</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-lg">{getFuelTypeIcon(vehicle.fuel_type)}</span>
                          <span className="text-sm text-gray-600 capitalize">{vehicle.fuel_type}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center mb-4">
                        <IndianRupee className="h-5 w-5 text-green-600 mr-1" />
                        <span className="text-xl font-bold text-green-600">
                          {formatPrice(vehicle.price)}
                        </span>
                      </div>

                      {/* Rating */}
                      {vehicle.rating > 0 && (
                        <div className="flex items-center mb-4">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-sm ${
                                  star <= vehicle.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                            <span className="text-sm text-gray-600 ml-2">
                              ({vehicle.rating})
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Link
                          to={`/vehicle/${vehicle.id}`}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors text-center flex items-center justify-center"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                        <button className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Added date */}
                      <div className="mt-3 text-xs text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Added {new Date(favorite.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <span className="px-4 py-2 text-sm text-gray-700">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default Favorites;