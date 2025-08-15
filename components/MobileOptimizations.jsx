'use client'

import { useEffect, useState } from 'react'

// Hook to detect mobile devices
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const mobileKeywords = ['mobile', 'tablet', 'ipad', 'android', 'touch']
      const isMobileUserAgent = mobileKeywords.some(keyword => userAgent.includes(keyword))
      const isTouchDevice = 'ontouchstart' in window
      const hasSmallScreen = window.innerWidth <= 768
      
      setIsMobile(isMobileUserAgent || isTouchDevice || hasSmallScreen)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return isMobile
}

// Enhanced button component for mobile
export function MobileOptimizedButton({ 
  children, 
  className = '', 
  size = 'default',
  ...props 
}) {
  const isMobile = useIsMobile()
  
  const sizeClasses = {
    sm: isMobile ? 'px-4 py-3 text-sm min-h-[44px]' : 'px-3 py-2 text-sm',
    default: isMobile ? 'px-6 py-4 text-base min-h-[48px]' : 'px-4 py-2 text-base',
    lg: isMobile ? 'px-8 py-5 text-lg min-h-[52px]' : 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`
        ${sizeClasses[size]}
        ${className}
        ${isMobile ? 'active:scale-95 touch-manipulation' : 'hover:scale-105'}
        transition-all duration-200 font-medium rounded-lg
        focus:outline-none focus:ring-2 focus:ring-primary/50
      `}
      {...props}
    >
      {children}
    </button>
  )
}

// Mobile-optimized card component
export function MobileCard({ children, className = '', ...props }) {
  const isMobile = useIsMobile()
  
  return (
    <div
      className={`
        ${className}
        ${isMobile ? 'p-4 active:scale-[0.98]' : 'p-6 hover:scale-[1.02]'}
        transition-all duration-200 rounded-lg bg-white dark:bg-gray-800 shadow-lg
        ${isMobile ? 'hover:shadow-lg' : 'hover:shadow-xl'}
        cursor-pointer
      `}
      {...props}
    >
      {children}
    </div>
  )
}

// Mobile navigation helper
export function MobileNavOverlay({ isOpen, onClose, children }) {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

// Performance optimization for mobile 3D content
export function Mobile3DWrapper({ children, fallback = null }) {
  const isMobile = useIsMobile()
  const [shouldRender3D, setShouldRender3D] = useState(false)

  useEffect(() => {
    if (!isMobile) {
      setShouldRender3D(true)
      return
    }

    // For mobile, check device capabilities
    const checkMobileCapabilities = () => {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      
      if (!gl) {
        setShouldRender3D(false)
        return
      }

      // Check for sufficient memory and performance
      const isHighPerformance = navigator.hardwareConcurrency > 4 || 
                               navigator.deviceMemory > 4 ||
                               !navigator.connection ||
                               navigator.connection.effectiveType === '4g'
      
      setShouldRender3D(isHighPerformance)
    }

    checkMobileCapabilities()
  }, [isMobile])

  if (!shouldRender3D && fallback) {
    return fallback
  }

  return shouldRender3D ? children : null
}
