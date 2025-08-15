'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// Performance monitoring hook
export function usePerformanceMonitor() {
  const [performance, setPerformance] = useState({
    isLowPower: false,
    connectionSpeed: 'fast',
    deviceMemory: 'high',
    hardwareConcurrency: 4
  })

  useEffect(() => {
    const checkPerformance = () => {
      const perfData = {
        isLowPower: false,
        connectionSpeed: 'fast',
        deviceMemory: 'high',
        hardwareConcurrency: navigator.hardwareConcurrency || 4
      }

      // Check connection speed
      if (navigator.connection) {
        const effectiveType = navigator.connection.effectiveType
        perfData.connectionSpeed = ['slow-2g', '2g'].includes(effectiveType) ? 'slow' : 
                                  ['3g'].includes(effectiveType) ? 'medium' : 'fast'
      }

      // Check device memory
      if (navigator.deviceMemory) {
        perfData.deviceMemory = navigator.deviceMemory < 4 ? 'low' : 
                               navigator.deviceMemory < 8 ? 'medium' : 'high'
      }

      // Check for low power mode indicators
      perfData.isLowPower = navigator.hardwareConcurrency <= 2 || 
                           navigator.deviceMemory <= 2 ||
                           window.matchMedia('(prefers-reduced-motion: reduce)').matches

      setPerformance(perfData)
    }

    checkPerformance()
    
    // Listen for connection changes
    if (navigator.connection) {
      navigator.connection.addEventListener('change', checkPerformance)
      return () => navigator.connection.removeEventListener('change', checkPerformance)
    }
  }, [])

  return performance
}

// Adaptive 3D component
export function Adaptive3DCanvas({ 
  children, 
  fallback, 
  className = '',
  ...props 
}) {
  const performance = usePerformanceMonitor()
  const prefersReducedMotion = useReducedMotion()
  const [shouldRender3D, setShouldRender3D] = useState(true)

  useEffect(() => {
    const should3D = !performance.isLowPower && 
                     performance.connectionSpeed !== 'slow' &&
                     !prefersReducedMotion &&
                     performance.hardwareConcurrency > 2

    setShouldRender3D(should3D)
  }, [performance, prefersReducedMotion])

  if (!shouldRender3D && fallback) {
    return (
      <div className={`${className} flex items-center justify-center`} {...props}>
        {fallback}
      </div>
    )
  }

  return shouldRender3D ? (
    <div className={className} {...props}>
      {children}
    </div>
  ) : null
}

// Optimized image component
export function OptimizedImage({ 
  src, 
  alt, 
  className = '',
  priority = false,
  ...props 
}) {
  const performance = usePerformanceMonitor()
  const [imageSrc, setImageSrc] = useState('')

  useEffect(() => {
    // Use appropriate image quality based on connection speed
    const quality = performance.connectionSpeed === 'slow' ? 'low' : 
                   performance.connectionSpeed === 'medium' ? 'medium' : 'high'
    
    // You would implement actual image optimization here
    // For now, using original src
    setImageSrc(src)
  }, [src, performance.connectionSpeed])

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} ${performance.connectionSpeed === 'slow' ? 'loading' : ''}`}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...props}
    />
  )
}

// Adaptive animation wrapper
export function AdaptiveMotion({ 
  children, 
  disabled = false,
  animation = {},
  className = '',
  ...props 
}) {
  const prefersReducedMotion = useReducedMotion()
  const performance = usePerformanceMonitor()

  const shouldAnimate = !disabled && 
                       !prefersReducedMotion && 
                       !performance.isLowPower

  if (!shouldAnimate) {
    return <div className={className} {...props}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      {...animation}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Progressive enhancement loader
export function ProgressiveLoader({ 
  component: Component, 
  fallback, 
  loadCondition = true,
  delay = 0,
  ...props 
}) {
  const [shouldLoad, setShouldLoad] = useState(false)
  const performance = usePerformanceMonitor()

  useEffect(() => {
    if (!loadCondition) return

    const timer = setTimeout(() => {
      // Only load if performance allows
      if (performance.connectionSpeed !== 'slow' && !performance.isLowPower) {
        setShouldLoad(true)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [loadCondition, delay, performance])

  if (!shouldLoad) {
    return fallback || <div>Loading...</div>
  }

  return <Component {...props} />
}

// Viewport-based lazy loading
export function LazySection({ children, className = '', threshold = 0.1 }) {
  const [isVisible, setIsVisible] = useState(false)
  const [ref, setRef] = useState(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref, threshold])

  return (
    <div 
      ref={setRef} 
      className={className}
      style={{ minHeight: isVisible ? 'auto' : '100px' }}
    >
      {isVisible ? children : <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-24" />}
    </div>
  )
}
