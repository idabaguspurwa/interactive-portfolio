import { useEffect, useRef, useState } from 'react'

export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState({
    apiCalls: [],
    renderTimes: [],
    websocketStatus: 'disconnected',
    memoryUsage: 0,
    dataProcessingTime: 0
  })
  
  const performanceStartTime = useRef(null)
  const lastRenderTime = useRef(Date.now())

  // Track API call performance
  const trackApiCall = (endpoint, startTime, endTime, status = 'success') => {
    const duration = endTime - startTime
    
    setMetrics(prev => ({
      ...prev,
      apiCalls: [{
        endpoint,
        duration,
        timestamp: new Date(),
        status
      }, ...prev.apiCalls].slice(0, 20)
    }))

    // Notify global performance tracker if available
    if (window.playgroundPerformance) {
      window.playgroundPerformance.addApiCall(endpoint, duration, status)
    }
  }

  // Track data processing performance
  const trackDataProcessing = (operation, startTime, endTime) => {
    const duration = endTime - startTime
    
    setMetrics(prev => ({
      ...prev,
      dataProcessingTime: duration
    }))

    // Notify global performance tracker
    if (window.playgroundPerformance) {
      window.playgroundPerformance.addOperation(`Data: ${operation}`, duration)
    }
  }

  // Track chart rendering performance
  const trackChartRender = (chartType, startTime, endTime) => {
    const duration = endTime - startTime
    
    setMetrics(prev => ({
      ...prev,
      renderTimes: [{
        chartType,
        duration,
        timestamp: new Date()
      }, ...prev.renderTimes].slice(0, 10)
    }))

    // Notify global performance tracker
    if (window.playgroundPerformance) {
      window.playgroundPerformance.addOperation(`Chart: ${chartType}`, duration)
    }
  }

  // Update WebSocket connection status
  const updateWebSocketStatus = (status) => {
    setMetrics(prev => ({
      ...prev,
      websocketStatus: status
    }))

    // Notify global performance tracker
    if (window.playgroundPerformance) {
      window.playgroundPerformance.updateWebSocketStatus(status)
    }
  }

  // Utility function to time async operations
  const timeAsyncOperation = async (operation, label = 'Operation') => {
    const startTime = performance.now()
    
    try {
      const result = await operation()
      const endTime = performance.now()
      
      // Notify global performance tracker
      if (window.playgroundPerformance) {
        window.playgroundPerformance.addOperation(label, endTime - startTime)
      }
      
      return result
    } catch (error) {
      const endTime = performance.now()
      
      // Track failed operations too
      if (window.playgroundPerformance) {
        window.playgroundPerformance.addOperation(`${label} (Failed)`, endTime - startTime)
      }
      
      throw error
    }
  }

  // Monitor memory usage
  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateMemoryUsage = () => {
      if (performance.memory) {
        const usage = Math.round((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100)
        setMetrics(prev => ({
          ...prev,
          memoryUsage: usage
        }))
      }
    }

    updateMemoryUsage()
    const interval = setInterval(updateMemoryUsage, 5000)
    
    return () => clearInterval(interval)
  }, [])

  // Track component render performance
  useEffect(() => {
    const renderTime = Date.now() - lastRenderTime.current
    
    if (renderTime > 16) { // Only track renders that take longer than 16ms (60fps threshold)
      if (window.playgroundPerformance) {
        window.playgroundPerformance.addOperation('Component Render', renderTime)
      }
    }
    
    lastRenderTime.current = Date.now()
  })

  return {
    metrics,
    trackApiCall,
    trackDataProcessing,
    trackChartRender,
    updateWebSocketStatus,
    timeAsyncOperation,
    
    // Utility functions for easy tracking
    startTiming: () => performance.now(),
    endTiming: (startTime, label) => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      if (window.playgroundPerformance) {
        window.playgroundPerformance.addOperation(label, duration)
      }
      
      return duration
    }
  }
}