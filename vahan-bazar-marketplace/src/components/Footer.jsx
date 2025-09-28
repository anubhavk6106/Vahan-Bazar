import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Youtube } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="text-2xl font-bold text-blue-400 mb-4">
              Vahan<span className="text-white">Bazar</span>
            </div>
            <p className="text-gray-300 mb-4">
              The ultimate bike inventory management platform for multi-shop vehicle dealerships. 
              Track sales, manage inventory, and grow your business effortlessly.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Browse Vehicles */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Browse Vehicles</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/browse/bikes" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Bikes
                </Link>
              </li>
              <li>
                <Link to="/browse/scooters" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Scooters
                </Link>
              </li>
              <li>
                <Link to="/browse/evs" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Electric Vehicles
                </Link>
              </li>
              <li>
                <Link to="/upcoming-launches" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Upcoming Launches
                </Link>
              </li>
              <li>
                <Link to="/comparison" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Compare Vehicles
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/test-ride" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Book Test Ride
                </Link>
              </li>
              <li>
                <Link to="/sell-bike" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Sell Your Bike
                </Link>
              </li>
              <li>
                <Link to="/calculators" className="text-gray-300 hover:text-blue-400 transition-colors">
                  EMI Calculator
                </Link>
              </li>
              <li>
                <Link to="/calculators" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Fuel Cost Calculator
                </Link>
              </li>
              <li>
                <Link to="/showrooms" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Find Showrooms
                </Link>
              </li>
            </ul>
            
            <h3 className="text-lg font-semibold mb-4 mt-6">Popular Brands</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/brand/honda" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Honda
                </Link>
              </li>
              <li>
                <Link to="/brand/yamaha" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Yamaha
                </Link>
              </li>
              <li>
                <Link to="/brand/tvs" className="text-gray-300 hover:text-blue-400 transition-colors">
                  TVS
                </Link>
              </li>
              <li>
                <Link to="/brand/bajaj" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Bajaj
                </Link>
              </li>
              <li>
                <Link to="/brand/hero" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Hero
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">contact@vahanbazar.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">+91 98765 43210</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5" />
                <span className="text-gray-300">
                  123 Business District,<br />
                  New Delhi, India - 110001
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-gray-700 rounded-lg p-6 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h4 className="text-lg font-semibold text-white mb-1">Stay Updated with Vahan Bazar</h4>
              <p className="text-gray-300">Get the latest updates on new vehicles, exclusive offers, and industry news</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent min-w-64"
              />
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Vahan Bazar. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer