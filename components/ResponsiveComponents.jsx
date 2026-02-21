'use client'

import { motion } from 'motion/react'
import { useIsMobile } from './MobileOptimizations'

// Responsive heading component
export function ResponsiveHeading({ 
  level = 1, 
  children, 
  className = '',
  variant = 'default',
  ...props 
}) {
  const isMobile = useIsMobile()
  
  const baseClasses = {
    1: isMobile 
      ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight'
      : 'text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight',
    2: isMobile
      ? 'text-2xl sm:text-3xl md:text-4xl font-heading font-bold leading-tight'
      : 'text-3xl md:text-4xl font-heading font-bold leading-tight',
    3: isMobile
      ? 'text-xl sm:text-2xl md:text-3xl font-heading font-semibold leading-tight'
      : 'text-2xl md:text-3xl font-heading font-semibold leading-tight',
    4: isMobile
      ? 'text-lg sm:text-xl md:text-2xl font-heading font-semibold'
      : 'text-xl md:text-2xl font-heading font-semibold',
  }

  const variantClasses = {
    default: '',
    gradient: 'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent',
    accent: 'text-accent',
    primary: 'text-primary',
  }

  const Tag = `h${level}`
  
  return (
    <Tag 
      className={`${baseClasses[level]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}

// Responsive text component
export function ResponsiveText({ 
  size = 'base',
  children, 
  className = '',
  variant = 'default',
  ...props 
}) {
  const isMobile = useIsMobile()
  
  const sizeClasses = {
    sm: isMobile ? 'text-sm leading-relaxed' : 'text-sm leading-relaxed',
    base: isMobile ? 'text-base sm:text-lg leading-relaxed' : 'text-lg leading-relaxed',
    lg: isMobile ? 'text-lg sm:text-xl leading-relaxed' : 'text-xl leading-relaxed',
    xl: isMobile ? 'text-xl sm:text-2xl leading-relaxed' : 'text-2xl leading-relaxed',
  }

  const variantClasses = {
    default: 'text-gray-900 dark:text-gray-100',
    secondary: 'text-gray-600 dark:text-gray-400',
    muted: 'text-gray-500 dark:text-gray-500',
    primary: 'text-primary',
    accent: 'text-accent',
  }

  return (
    <p 
      className={`${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </p>
  )
}

// Responsive container component
export function ResponsiveContainer({ 
  children, 
  className = '',
  size = 'default',
  ...props 
}) {
  const isMobile = useIsMobile()
  
  const sizeClasses = {
    sm: isMobile ? 'max-w-2xl mx-auto px-4' : 'max-w-3xl mx-auto px-6',
    default: isMobile ? 'max-w-6xl mx-auto px-4 sm:px-6' : 'max-w-7xl mx-auto px-6 lg:px-8',
    lg: isMobile ? 'max-w-7xl mx-auto px-4 sm:px-6' : 'max-w-8xl mx-auto px-6 lg:px-12',
    full: isMobile ? 'w-full px-4 sm:px-6' : 'w-full px-6 lg:px-8',
  }

  return (
    <div 
      className={`${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

// Responsive spacing component
export function ResponsiveSection({ 
  children, 
  className = '',
  spacing = 'default',
  ...props 
}) {
  const isMobile = useIsMobile()
  
  const spacingClasses = {
    sm: isMobile ? 'py-8 sm:py-12' : 'py-12',
    default: isMobile ? 'py-12 sm:py-16 md:py-20' : 'py-20',
    lg: isMobile ? 'py-16 sm:py-20 md:py-24' : 'py-24',
    xl: isMobile ? 'py-20 sm:py-24 md:py-32' : 'py-32',
  }

  return (
    <section 
      className={`${spacingClasses[spacing]} ${className}`}
      {...props}
    >
      {children}
    </section>
  )
}

// Responsive grid component
export function ResponsiveGrid({ 
  children, 
  className = '',
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'default',
  ...props 
}) {
  const gapClasses = {
    sm: 'gap-4',
    default: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-10',
  }

  const gridClasses = `grid grid-cols-${cols.mobile} md:grid-cols-${cols.tablet} lg:grid-cols-${cols.desktop} ${gapClasses[gap]}`

  return (
    <div 
      className={`${gridClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

// Mobile-optimized animation wrapper
export function MobileAnimation({ 
  children, 
  animation = 'fadeUp',
  delay = 0,
  className = '',
  ...props 
}) {
  const isMobile = useIsMobile()
  
  const animations = {
    fadeUp: {
      initial: { opacity: 0, y: isMobile ? 20 : 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: isMobile ? 0.4 : 0.6, delay }
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: isMobile ? 0.3 : 0.5, delay }
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: isMobile ? 0.3 : 0.4, delay }
    },
    slideIn: {
      initial: { opacity: 0, x: isMobile ? -20 : -30 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: isMobile ? 0.4 : 0.5, delay }
    }
  }

  return (
    <motion.div
      className={className}
      {...animations[animation]}
      {...props}
    >
      {children}
    </motion.div>
  )
}
