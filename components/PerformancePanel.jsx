'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Database, 
  Clock, 
  Activity, 
  Wifi, 
  WifiOff,
  BarChart3,
  Cpu,
  RefreshCw
} from 'lucide-react'

export function PerformancePanel({ className = "" }) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [metrics, setMetrics] = useState({
    operations: [],
    websocketStatus: 'disconnected',
    memoryUsage: 0,
    renderTimes: [],
    apiCalls: [],
    performanceScore: 0
  })
  const [isCollecting, setIsCollecting] = useState(false)
  const performanceObserver = useRef(null)
  const startTime = useRef(Date.now())

  // Initialize performance monitoring
  useEffect(() => {
    if (typeof window === 'undefined') return

    setIsCollecting(true)
    
    // Monitor memory usage if available
    const updateMemoryUsage = () => {
      if (performance.memory) {
        setMetrics(prev => ({
          ...prev,
          memoryUsage: Math.round((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100)
        }))
      }
    }

    // Initial memory check
    updateMemoryUsage()
    
    // Update memory usage every 5 seconds
    const memoryInterval = setInterval(updateMemoryUsage, 5000)

    // Performance Observer for navigation and paint metrics
    if ('PerformanceObserver' in window) {
      try {
        performanceObserver.current = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          
          entries.forEach(entry => {
            if (entry.entryType === 'navigation') {
              addOperation('Page Load', entry.loadEventEnd - entry.loadEventStart)
            } else if (entry.entryType === 'paint') {
              addOperation(entry.name, entry.startTime)
            } else if (entry.entryType === 'measure') {
              addOperation(entry.name, entry.duration)
            }
          })
        })
        
        performanceObserver.current.observe({ entryTypes: ['navigation', 'paint', 'measure'] })
      } catch (error) {
        console.warn('Performance Observer not fully supported:', error)
      }
    }

    // Calculate initial performance score
    calculatePerformanceScore()

    return () => {
      clearInterval(memoryInterval)
      if (performanceObserver.current) {
        performanceObserver.current.disconnect()
      }
    }
  }, [])

  const addOperation = (name, duration) => {
    const operation = {
      id: Date.now() + Math.random(),
      name,
      duration: Math.round(duration),
      timestamp: new Date(),
      status: duration < 100 ? 'good' : duration < 500 ? 'warning' : 'error'
    }

    setMetrics(prev => ({
      ...prev,
      operations: [operation, ...prev.operations].slice(0, 10)
    }))
    
    // Recalculate performance score
    calculatePerformanceScore()
  }

  const addApiCall = (endpoint, duration, status = 'success') => {
    const apiCall = {
      id: Date.now() + Math.random(),
      endpoint,
      duration: Math.round(duration),
      timestamp: new Date(),
      status
    }

    setMetrics(prev => ({
      ...prev,
      apiCalls: [apiCall, ...prev.apiCalls].slice(0, 10)
    }))
  }

  const updateWebSocketStatus = (status) => {
    setMetrics(prev => ({
      ...prev,
      websocketStatus: status
    }))
  }

  const calculatePerformanceScore = () => {
    const recentOps = metrics.operations.slice(0, 5)
    if (recentOps.length === 0) return

    const avgDuration = recentOps.reduce((sum, op) => sum + op.duration, 0) / recentOps.length
    const memoryScore = Math.max(0, 100 - metrics.memoryUsage)
    const speedScore = Math.max(0, 100 - (avgDuration / 10))
    
    const score = Math.round((memoryScore + speedScore) / 2)
    
    setMetrics(prev => ({
      ...prev,
      performanceScore: score
    }))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-600 dark:text-green-400'
      case 'warning': return 'text-amber-600 dark:text-amber-400'
      case 'error': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-amber-600 dark:text-amber-400'
    return 'text-red-600 dark:text-red-400'
  }

  // Expose functions for external use
  useEffect(() => {
    window.playgroundPerformance = {
      addOperation,
      addApiCall,
      updateWebSocketStatus
    }
    
    return () => {
      delete window.playgroundPerformance
    }
  }, [])

  return (
    <div className={`fixed bottom-4 left-4 z-50 max-w-sm ${className}`}>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isCollecting ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Performance Monitor
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`text-sm font-mono ${getScoreColor(metrics.performanceScore)}`}>
              {metrics.performanceScore}
            </div>
            {isCollapsed ? 
              <ChevronUp className="w-4 h-4 text-gray-400" /> : 
              <ChevronDown className="w-4 h-4 text-gray-400" />
            }
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <Cpu className="w-3 h-3 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
                    <div className="text-gray-900 dark:text-white font-mono">
                      {metrics.memoryUsage}%
                    </div>
                    <div className="text-gray-500">Memory</div>
                  </div>
                  
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    {metrics.websocketStatus === 'connected' ? 
                      <Wifi className="w-3 h-3 mx-auto mb-1 text-green-500" /> :
                      <WifiOff className="w-3 h-3 mx-auto mb-1 text-gray-400" />
                    }
                    <div className="text-gray-900 dark:text-white font-mono text-xs">
                      {metrics.websocketStatus === 'connected' ? 'ON' : 'OFF'}
                    </div>
                    <div className="text-gray-500">WebSocket</div>
                  </div>
                  
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <BarChart3 className="w-3 h-3 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
                    <div className="text-gray-900 dark:text-white font-mono">
                      {metrics.operations.length}
                    </div>
                    <div className="text-gray-500">Operations</div>
                  </div>
                </div>

                {/* Recent Operations */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-medium text-gray-900 dark:text-white">
                      Recent Operations
                    </h4>
                    <Clock className="w-3 h-3 text-gray-400" />
                  </div>
                  
                  <div className="space-y-1">
                    {metrics.operations.slice(0, 5).map((operation) => (
                      <div key={operation.id} className="flex items-center justify-between text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="text-gray-900 dark:text-white truncate flex-1">
                          {operation.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className={`font-mono ${getStatusColor(operation.status)}`}>
                            {operation.duration}ms
                          </span>
                          <div className={`w-1 h-1 rounded-full ${
                            operation.status === 'good' ? 'bg-green-500' :
                            operation.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                          }`} />
                        </div>
                      </div>
                    ))}
                    
                    {metrics.operations.length === 0 && (
                      <div className="text-xs text-gray-500 text-center py-2">
                        No operations recorded yet
                      </div>
                    )}
                  </div>
                </div>

                {/* API Calls */}
                {metrics.apiCalls.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-medium text-gray-900 dark:text-white">
                        API Calls
                      </h4>
                      <Database className="w-3 h-3 text-gray-400" />
                    </div>
                    
                    <div className="space-y-1">
                      {metrics.apiCalls.slice(0, 3).map((call) => (
                        <div key={call.id} className="flex items-center justify-between text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <span className="text-gray-900 dark:text-white truncate flex-1">
                            {call.endpoint}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className={`font-mono ${getStatusColor(call.status)}`}>
                              {call.duration}ms
                            </span>
                            <div className={`w-1 h-1 rounded-full ${
                              call.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}