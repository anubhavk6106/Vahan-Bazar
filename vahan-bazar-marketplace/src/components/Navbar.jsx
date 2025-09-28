import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Heart, User, Menu, X, Settings, LogOut, Calendar, Shield, Bell, HelpCircle, MessageSquare } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Button from './ui/Button'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const userMenuRef = useRef(null)

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'Browse Vehicles', path: '/vehicles' },
    { name: 'Compare', path: '/compare' },
    { name: 'Test Ride', path: '/test-ride' },
    { name: 'Calculators', path: '/calculators' },
    { name: 'Showrooms', path: '/showrooms' },
    { name: 'Features', path: '/features' },
    { name: 'Sell Vehicle', path: '/sell' },
    { name: 'Help', path: '/help' },
  ]

  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="nav-glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <div className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Vahan Bazar
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`${
                    isActiveRoute(item.path) ? 'nav-link-active' : 'nav-link-inactive'
                  } px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Search and Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search vehicles..."
                className="w-64 pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Heart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">
                3
              </span>
            </button>
            
            <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block text-sm font-medium">{user?.name}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{user?.name}</h3>
                          <p className="text-sm text-gray-500">Member</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4 mr-3 text-gray-500" />
                        Profile Settings
                      </Link>
                      
                      <Link
                        to="/favorites"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Heart className="h-4 w-4 mr-3 text-gray-500" />
                        Favorites
                        <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">3</span>
                      </Link>
                      
                      <Link
                        to="/bookings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Calendar className="h-4 w-4 mr-3 text-gray-500" />
                        My Bookings
                      </Link>
                      
                      <Link
                        to="/help"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <HelpCircle className="h-4 w-4 mr-3 text-gray-500" />
                        Help & Support
                      </Link>
                      
                      <Link
                        to="/contact"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <MessageSquare className="h-4 w-4 mr-3 text-gray-500" />
                        Contact Us
                      </Link>
                      
                      {isAdmin && (
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <Link
                            to="/admin"
                            className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Shield className="h-4 w-4 mr-3" />
                            Admin Panel
                          </Link>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  as={Link}
                  to="/login"
                  className="text-sm"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  as={Link}
                  to="/register"
                  className="text-sm"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActiveRoute(item.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {!isAuthenticated && (
              <div className="border-t border-gray-200 pt-4 mt-4 flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  as={Link}
                  to="/login"
                  className="flex-1 text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  as={Link}
                  to="/register"
                  className="flex-1 text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar