'use client'

import { createContext, useContext, useEffect, useState, useRef, Component } from 'react'
import { usePageTransition } from './PageTransition'

// Simplified Error Boundary for Three.js components
class ThreeJSErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Only catch critical WebGL errors, let Three.js handle precision issues
    if (error.message?.includes('webglcontextlost') || 
        error.message?.includes('WebGL context')) {
      return { hasError: true }
    }
    return null
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Three.js Error Boundary caught critical error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className={`${this.props.className || ''} flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg`}>
          <div className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">3D</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              3D visualization temporarily disabled
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// WebGL Context Manager
const WebGLContext = createContext({
  isWebGLEnabled: true,
  webglError: null,
  resetWebGL: () => {}
})

export function WebGLProvider({ children }) {
  const [isWebGLEnabled, setIsWebGLEnabled] = useState(true)
  const [webglError, setWebglError] = useState(null)
  const { isTransitioning } = usePageTransition()
  const contextLostRef = useRef(false)

  // Keep WebGL enabled during transitions for better UX
  const effectiveWebGLEnabled = isWebGLEnabled

  const resetWebGL = () => {
    setWebglError(null)
    setIsWebGLEnabled(true)
    contextLostRef.current = false
  }

  useEffect(() => {
    // Handle WebGL context lost events globally
    const handleContextLost = (event) => {
      console.warn('WebGL context lost, disabling 3D components')
      event.preventDefault()
      setIsWebGLEnabled(false)
      setWebglError('WebGL context was lost. 3D components have been disabled.')
      contextLostRef.current = true
    }

    const handleContextRestored = () => {
      console.log('WebGL context restored')
      if (contextLostRef.current) {
        resetWebGL()
      }
    }

    // Less aggressive global error handler
    const handleGlobalError = (event) => {
      const error = event.error || event.reason
      // Only disable for critical WebGL context errors, not precision errors
      if (error && error.message?.includes('webglcontextlost')) {
        console.warn('WebGL context lost globally:', error)
        setIsWebGLEnabled(false)
        setWebglError('WebGL context was lost')
        event.preventDefault()
      }
    }

    // Add global listeners for WebGL context events
    document.addEventListener('webglcontextlost', handleContextLost, false)
    document.addEventListener('webglcontextrestored', handleContextRestored, false)
    
    // Add global error handlers
    window.addEventListener('error', handleGlobalError, false)
    window.addEventListener('unhandledrejection', handleGlobalError, false)

    // Test WebGL availability (less aggressive)
    const testWebGL = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 1
        canvas.height = 1
        
        const gl = canvas.getContext('webgl2', { 
          powerPreference: 'default',
          antialias: false,
          alpha: false,
          depth: false,
          stencil: false,
          preserveDrawingBuffer: false
        }) || canvas.getContext('webgl', {
          powerPreference: 'default',
          antialias: false,
          alpha: false,
          depth: false,
          stencil: false,
          preserveDrawingBuffer: false
        })

        if (!gl) {
          console.warn('WebGL not available, disabling 3D components')
          setIsWebGLEnabled(false)
          setWebglError('WebGL is not supported on this device')
        } else {
          console.log('WebGL available, enabling 3D components')
          // Don't test precision format as it's causing issues
          // Just ensure basic WebGL works
          
          // Immediately dispose of test context
          const loseContext = gl.getExtension('WEBGL_lose_context')
          if (loseContext) {
            loseContext.loseContext()
          }
        }
        
        canvas.remove()
      } catch (error) {
        console.warn('WebGL test failed:', error)
        // Don't disable WebGL for minor errors, let Three.js handle it
        console.log('Allowing Three.js to handle WebGL initialization')
      }
    }

    testWebGL()

    return () => {
      document.removeEventListener('webglcontextlost', handleContextLost)
      document.removeEventListener('webglcontextrestored', handleContextRestored)
      window.removeEventListener('error', handleGlobalError)
      window.removeEventListener('unhandledrejection', handleGlobalError)
    }
  }, [])

  // Remove aggressive WebGL cleanup during transitions

  return (
    <WebGLContext.Provider value={{
      isWebGLEnabled: effectiveWebGLEnabled,
      webglError,
      resetWebGL
    }}>
      {children}
    </WebGLContext.Provider>
  )
}

export const useWebGL = () => {
  const context = useContext(WebGLContext)
  if (!context) {
    throw new Error('useWebGL must be used within WebGLProvider')
  }
  return context
}

// Safe Three.js Canvas wrapper with error boundary
export function SafeCanvas({ children, fallback, className = '', ...props }) {
  const { isWebGLEnabled, webglError } = useWebGL()
  const [renderError, setRenderError] = useState(null)

  if (!isWebGLEnabled || renderError) {
    if (webglError || renderError) {
      console.warn('WebGL disabled:', webglError || renderError)
    }
    
    return fallback || (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg`}>
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">3D</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            3D visualization temporarily disabled for optimal performance
          </p>
          {renderError && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              WebGL capabilities not available
            </p>
          )}
        </div>
      </div>
    )
  }

  try {
    // Dynamic import of Canvas to avoid loading Three.js when disabled
    const { Canvas } = require('@react-three/fiber')

    return (
      <ThreeJSErrorBoundary className={className} fallback={fallback}>
        <Canvas
          className={className}
          gl={{
            powerPreference: 'default',
            antialias: false,
            alpha: false,
            preserveDrawingBuffer: false
          }}
          dpr={[1, 1.5]} // Limit DPI scaling
          performance={{ min: 0.5 }} // Lower performance threshold
          onCreated={({ gl }) => {
            // Basic WebGL validation - let Three.js handle precision issues
            console.log('Three.js Canvas created successfully')
          }}
          onError={(error) => {
            console.warn('Three.js render error:', error)
            setRenderError('3D rendering failed')
          }}
          {...props}
        >
          {children}
        </Canvas>
      </ThreeJSErrorBoundary>
    )
  } catch (error) {
    console.warn('Three.js Canvas creation failed:', error)
    setRenderError('Canvas creation failed')
    return fallback || (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg`}>
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">3D</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            3D visualization temporarily disabled for optimal performance
          </p>
        </div>
      </div>
    )
  }
}
