import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Plus, X, TrendingDown, TrendingUp, AlertCircle, Check } from 'lucide-react';

const PriceAlerts = ({ vehicleId, currentPrice, vehicleName }) => {
  const [alerts, setAlerts] = useState([]);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({
    targetPrice: '',
    alertType: 'below', // 'below' or 'above'
    isActive: true
  });

  // Realistic price alerts for Indian two-wheeler market
  const mockAlerts = [
    {
      id: 1,
      vehicleId: 1,
      vehicleName: 'Honda CB Hornet 2.0',
      currentPrice: 125000,
      targetPrice: 120000,
      alertType: 'below',
      isActive: true,
      createdAt: '2024-01-15',
      triggeredAt: null,
      priceHistory: [
        { date: '2024-01-01', price: 127000 },
        { date: '2024-01-15', price: 126000 },
        { date: '2024-02-01', price: 125500 },
        { date: '2024-02-15', price: 125000 },
        { date: '2024-03-01', price: 124500 },
        { date: '2024-03-15', price: 125000 }
      ]
    },
    {
      id: 2,
      vehicleId: 2,
      vehicleName: 'TVS Apache RTR 160 4V',
      currentPrice: 115000,
      targetPrice: 110000,
      alertType: 'below',
      isActive: true,
      createdAt: '2024-02-01',
      triggeredAt: '2024-03-10',
      priceHistory: [
        { date: '2024-02-01', price: 115000 },
        { date: '2024-02-15', price: 113000 },
        { date: '2024-03-01', price: 111000 },
        { date: '2024-03-10', price: 109000 },
        { date: '2024-03-20', price: 110500 },
        { date: '2024-03-25', price: 115000 }
      ]
    },
    {
      id: 3,
      vehicleId: 3,
      vehicleName: 'Yamaha MT-15 V2',
      currentPrice: 165000,
      targetPrice: 170000,
      alertType: 'above',
      isActive: true,
      createdAt: '2024-02-10',
      triggeredAt: null,
      priceHistory: [
        { date: '2024-02-10', price: 163000 },
        { date: '2024-02-20', price: 164000 },
        { date: '2024-03-01', price: 165000 },
        { date: '2024-03-15', price: 164500 },
        { date: '2024-03-25', price: 165000 }
      ]
    },
    {
      id: 4,
      vehicleId: 4,
      vehicleName: 'Hero Splendor Plus Xtec',
      currentPrice: 72000,
      targetPrice: 70000,
      alertType: 'below',
      isActive: false,
      createdAt: '2024-01-20',
      triggeredAt: '2024-02-15',
      priceHistory: [
        { date: '2024-01-20', price: 73000 },
        { date: '2024-02-01', price: 72000 },
        { date: '2024-02-15', price: 69500 },
        { date: '2024-03-01', price: 71000 },
        { date: '2024-03-15', price: 72000 }
      ]
    }
  ];

  useEffect(() => {
    // In a real app, fetch alerts from API
    setAlerts(mockAlerts);
  }, []);

  const handleCreateAlert = (e) => {
    e.preventDefault();
    const alertData = {
      id: Date.now(),
      vehicleId: vehicleId || 1,
      vehicleName: vehicleName || 'Selected Vehicle',
      currentPrice: currentPrice || 85000,
      targetPrice: parseInt(newAlert.targetPrice),
      alertType: newAlert.alertType,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      triggeredAt: null,
      priceHistory: []
    };

    setAlerts(prev => [...prev, alertData]);
    setNewAlert({
      targetPrice: '',
      alertType: 'below',
      isActive: true
    });
    setShowCreateAlert(false);
  };

  const toggleAlert = (alertId) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const deleteAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAlertStatus = (alert) => {
    if (!alert.isActive) return 'inactive';
    if (alert.triggeredAt) return 'triggered';
    
    if (alert.alertType === 'below') {
      return alert.currentPrice <= alert.targetPrice ? 'triggered' : 'active';
    } else {
      return alert.currentPrice >= alert.targetPrice ? 'triggered' : 'active';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'triggered': return 'text-green-600 bg-green-100';
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'triggered': return <Check className="h-4 w-4" />;
      case 'active': return <Bell className="h-4 w-4" />;
      case 'inactive': return <BellOff className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Price Alerts</h3>
          <p className="text-gray-600 text-sm">Get notified when vehicle prices change</p>
        </div>
        <button
          onClick={() => setShowCreateAlert(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Alert</span>
        </button>
      </div>

      {/* Active Alerts */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="card p-8 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Price Alerts</h4>
            <p className="text-gray-600 mb-4">
              Create your first price alert to track vehicle price changes
            </p>
            <button
              onClick={() => setShowCreateAlert(true)}
              className="btn-primary"
            >
              Create Alert
            </button>
          </div>
        ) : (
          alerts.map(alert => {
            const status = getAlertStatus(alert);
            const statusColor = getStatusColor(status);
            const statusIcon = getStatusIcon(status);
            const priceDiff = alert.currentPrice - alert.targetPrice;

            return (
              <div key={alert.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{alert.vehicleName}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${statusColor}`}>
                        {statusIcon}
                        <span className="capitalize">{status}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Current Price:</span>
                        <div className="font-semibold text-lg">{formatCurrency(alert.currentPrice)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Target Price:</span>
                        <div className="font-semibold text-lg flex items-center space-x-1">
                          <span>{formatCurrency(alert.targetPrice)}</span>
                          {alert.alertType === 'below' ? (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          ) : (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Difference:</span>
                        <div className={`font-semibold text-lg ${
                          status === 'triggered' ? 'text-green-600' : 'text-gray-900'
                        }`}>
                          {priceDiff > 0 ? '+' : ''}{formatCurrency(Math.abs(priceDiff))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Created: {formatDate(alert.createdAt)}
                      {alert.triggeredAt && (
                        <span> • Triggered: {formatDate(alert.triggeredAt)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        alert.isActive
                          ? 'text-blue-600 bg-blue-100 hover:bg-blue-200'
                          : 'text-gray-400 bg-gray-100 hover:bg-gray-200'
                      }`}
                      title={alert.isActive ? 'Disable Alert' : 'Enable Alert'}
                    >
                      {alert.isActive ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="p-2 text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                      title="Delete Alert"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Price History Chart (Mini) */}
                {alert.priceHistory.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                      <span>Price History</span>
                      <span>Last {alert.priceHistory.length} records</span>
                    </div>
                    <div className="flex items-end space-x-1 h-16">
                      {alert.priceHistory.map((record, index) => {
                        const maxPrice = Math.max(...alert.priceHistory.map(r => r.price));
                        const minPrice = Math.min(...alert.priceHistory.map(r => r.price));
                        const heightPercent = ((record.price - minPrice) / (maxPrice - minPrice)) * 100;
                        
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center group">
                            <div
                              className="bg-blue-500 w-full rounded-t transition-all group-hover:bg-blue-600"
                              style={{ height: `${heightPercent}%` }}
                              title={`${formatDate(record.date)}: ${formatCurrency(record.price)}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Create Alert Modal */}
      {showCreateAlert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Create Price Alert</h3>
                <button
                  onClick={() => setShowCreateAlert(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {vehicleName && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">{vehicleName}</h4>
                  <p className="text-sm text-blue-700">Current Price: {formatCurrency(currentPrice || 0)}</p>
                </div>
              )}

              <form onSubmit={handleCreateAlert} className="space-y-4">
                <div>
                  <label className="form-label">Alert Type</label>
                  <select
                    value={newAlert.alertType}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, alertType: e.target.value }))}
                    className="form-select"
                  >
                    <option value="below">Notify when price drops below</option>
                    <option value="above">Notify when price goes above</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Target Price (₹)</label>
                  <input
                    type="number"
                    value={newAlert.targetPrice}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, targetPrice: e.target.value }))}
                    className="form-input"
                    placeholder="Enter target price"
                    required
                    min="1000"
                    max="5000000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You'll be notified via email and in-app notification when the price target is reached
                  </p>
                </div>

                {currentPrice && newAlert.targetPrice && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Current Price:</span>
                      <span className="font-medium">{formatCurrency(currentPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Target Price:</span>
                      <span className="font-medium">{formatCurrency(parseInt(newAlert.targetPrice) || 0)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200 mt-2">
                      <span className="text-gray-600">Difference:</span>
                      <span className={`font-medium ${
                        parseInt(newAlert.targetPrice) < currentPrice ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {parseInt(newAlert.targetPrice) < currentPrice ? '-' : '+'}
                        {formatCurrency(Math.abs(currentPrice - (parseInt(newAlert.targetPrice) || 0)))}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateAlert(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Create Alert
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceAlerts;