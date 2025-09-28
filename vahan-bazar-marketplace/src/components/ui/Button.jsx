import React from 'react'
import { LoadingSpinner } from './Loading'

const Button = ({ 
  children, 
  variant = 'vibrant', 
  size = 'md', 
  loading = false, 
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  as: Component = 'button',
  ...props 
}) => {
  const baseClasses = 'btn'
  
  const variants = {
    vibrant: 'btn-vibrant',
    neon: 'btn-neon', 
    energy: 'btn-energy',
    hot: 'btn-hot',
    electric: 'btn-electric',
    cta: 'btn-cta',
    buyNow: 'btn-buy-now',
    ghost: 'bg-transparent hover:bg-gradient-vibrant/20 text-white/80 hover:text-white border-0 shadow-none backdrop-blur-xl animate-pulse-bright',
    link: 'bg-transparent text-vibrant-500 hover:text-neon-400 underline-offset-4 hover:underline border-0 shadow-none p-0 animate-rainbow-text'
  }

  const sizes = {
    sm: 'btn-sm',
    md: '', // default size
    lg: 'btn-lg',
    xl: 'btn-xl'
  }

  const classes = [
    baseClasses,
    variants[variant],
    sizes[size],
    className
  ].filter(Boolean).join(' ')

  return (
    <Component
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      
      {children}
      
      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </Component>
  )
}

// Icon Button Component
export const IconButton = ({ 
  icon, 
  size = 'md',
  variant = 'ghost',
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  }

  return (
    <Button
      variant={variant}
      className={`${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon}
    </Button>
  )
}

// Button Group Component  
export const ButtonGroup = ({ children, className = '' }) => (
  <div className={`inline-flex rounded-lg shadow-sm ${className}`}>
    {React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return child
      
      const isFirst = index === 0
      const isLast = index === React.Children.count(children) - 1
      
      let roundedClasses = 'rounded-none'
      if (isFirst) roundedClasses = 'rounded-l-lg rounded-r-none'
      if (isLast) roundedClasses = 'rounded-r-lg rounded-l-none'
      if (isFirst && isLast) roundedClasses = 'rounded-lg'
      
      return React.cloneElement(child, {
        className: `${child.props.className || ''} ${roundedClasses} border-r-0 last:border-r`
      })
    })}
  </div>
)

// Floating Action Button
export const FloatingActionButton = ({ 
  children, 
  position = 'bottom-right',
  className = '',
  ...props 
}) => {
  const positions = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  }

  return (
    <Button
      variant="primary"
      size="lg"
      className={`${positions[position]} rounded-full p-4 shadow-strong hover:shadow-lg z-50 ${className}`}
      {...props}
    >
      {children}
    </Button>
  )
}

export default Button