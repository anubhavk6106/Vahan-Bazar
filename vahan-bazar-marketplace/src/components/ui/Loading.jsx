import React from 'react'
import { Loader2 } from 'lucide-react'

// Loading Spinner Component
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-luxury-500 drop-shadow-lg`} />
    </div>
  )
}

// Loading Overlay Component
export const LoadingOverlay = ({ isLoading, children, message = 'Loading...' }) => {
  if (!isLoading) return children

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-50">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-neutral-600 font-medium">{message}</p>
        </div>
      </div>
    </div>
  )
}

// Luxury Skeleton Loader Components
export const SkeletonCard = ({ className = '' }) => (
  <div className={`card-luxury ${className}`}>
    <div className="bg-white/20 animate-pulse h-48 w-full rounded-t-3xl"></div>
    <div className="p-8 space-y-6">
      <div className="bg-white/20 animate-pulse h-6 w-3/4 rounded-xl"></div>
      <div className="bg-white/10 animate-pulse h-4 w-full rounded-lg"></div>
      <div className="bg-white/10 animate-pulse h-4 w-2/3 rounded-lg"></div>
      <div className="flex justify-between items-center pt-4">
        <div className="bg-gradient-luxury animate-pulse h-8 w-20 rounded-xl"></div>
        <div className="bg-gradient-gold animate-pulse h-12 w-28 rounded-2xl"></div>
      </div>
    </div>
  </div>
)

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div 
        key={i} 
        className={`loading-skeleton h-4 ${
          i === lines - 1 ? 'w-3/4' : 'w-full'
        }`} 
      />
    ))}
  </div>
)

export const SkeletonVehicleGrid = ({ count = 9 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
)

// Page Loading Component
export const PageLoading = ({ message = 'Loading page...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-neutral-50">
    <div className="text-center">
      <div className="mb-8">
        <div className="relative">
          <div className="loading-spinner h-16 w-16 mx-auto"></div>
          <div className="absolute inset-0 loading-spinner h-16 w-16 mx-auto opacity-20" style={{ animationDelay: '0.15s' }}></div>
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-neutral-800 mb-2">Vahan Bazar</h2>
      <p className="text-neutral-600">{message}</p>
    </div>
  </div>
)

export default LoadingSpinner