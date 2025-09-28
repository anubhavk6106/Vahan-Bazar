import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../services/api';
import {
  Users,
  Car,
  Calendar,
  TrendingUp,
  UserCheck,
  AlertTriangle,
  Clock,
  CheckCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    dealers: 0,
    vehicles: 0,
    bookings: 0,
    pendingBookings: 0,
    activeVehicles: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Total Users',
      value: stats.users,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Active Dealers',
      value: stats.dealers,
      icon: UserCheck,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Total Vehicles',
      value: stats.vehicles,
      icon: Car,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'Active Vehicles',
      value: stats.activeVehicles,
      icon: CheckCircle,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      name: 'Total Bookings',
      value: stats.bookings,
      icon: Calendar,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      name: 'Pending Bookings',
      value: stats.pendingBookings,
      icon: Clock,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-2">{error}</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Overview of your Vahan Bazar marketplace
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value.toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
              <Users className="h-8 w-8 text-blue-500 mb-2" />
              <h3 className="text-sm font-medium text-gray-900">Manage Users</h3>
              <p className="text-xs text-gray-600 mt-1">View and manage all users</p>
            </button>

            <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
              <Car className="h-8 w-8 text-green-500 mb-2" />
              <h3 className="text-sm font-medium text-gray-900">Manage Vehicles</h3>
              <p className="text-xs text-gray-600 mt-1">Review and approve vehicles</p>
            </button>

            <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
              <Calendar className="h-8 w-8 text-purple-500 mb-2" />
              <h3 className="text-sm font-medium text-gray-900">View Bookings</h3>
              <p className="text-xs text-gray-600 mt-1">Monitor test ride requests</p>
            </button>

            <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
              <TrendingUp className="h-8 w-8 text-yellow-500 mb-2" />
              <h3 className="text-sm font-medium text-gray-900">Analytics</h3>
              <p className="text-xs text-gray-600 mt-1">View platform analytics</p>
            </button>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">System Overview</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {((stats.activeVehicles / stats.vehicles) * 100 || 0).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Vehicles Active</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {((stats.pendingBookings / stats.bookings) * 100 || 0).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Pending Bookings</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {(stats.vehicles / stats.dealers || 0).toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Avg Vehicles/Dealer</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {(stats.bookings / stats.users || 0).toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Avg Bookings/User</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;