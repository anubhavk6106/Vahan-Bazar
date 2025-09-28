import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Browse from './pages/Browse'
import Vehicles from './pages/Vehicles'
import Compare from './pages/Compare'
import VehicleDetail from './pages/VehicleDetail'
import Calculators from './pages/Calculators'
import Showrooms from './pages/Showrooms'
import SellVehicle from './pages/SellVehicle'
import Login from './pages/Login'
import Register from './pages/Register'
import Favorites from './pages/Favorites'
import Bookings from './pages/Bookings'
import Profile from './pages/Profile'
import UpcomingLaunches from './pages/UpcomingLaunches'
import TestRide from './pages/TestRide'
import SellBike from './pages/SellBike'
import Features from './pages/Features'
import Help from './pages/Help'
import Contact from './pages/Contact'
import ChatBot from './components/ChatBot'

// Admin Components
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminVehicles from './pages/admin/AdminVehicles'
import AdminBookings from './pages/admin/AdminBookings'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-neutral-50">
          <Navbar />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/browse/:category" element={<Browse />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/vehicle/:id" element={<VehicleDetail />} />
              <Route path="/calculators" element={<Calculators />} />
              <Route path="/showrooms" element={<Showrooms />} />
              <Route path="/sell" element={<SellVehicle />} />
              <Route path="/upcoming-launches" element={<UpcomingLaunches />} />
              <Route path="/test-ride" element={<TestRide />} />
              <Route path="/sell-bike" element={<SellBike />} />
              <Route path="/features" element={<Features />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/dealers" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/vehicles" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminVehicles />
                </ProtectedRoute>
              } />
              <Route path="/admin/bookings" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminBookings />
                </ProtectedRoute>
              } />
              <Route path="/help" element={<Help />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <ChatBot />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
