'use client'

import { useState, useEffect, useRef, createContext, useContext } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const DataStreamContext = createContext({
  data: [],
  isConnected: false,
  isLoading: true,
  error: null,
  lastUpdate: null,
  connectionStatus: 'disconnected'
})

export const DataStreamProvider = ({ 
  children, 
  wsUrl,
  reconnectInterval = 5000,
  maxReconnectAttempts = 10
}) => {
  // Use client-side env var access to avoid server-client serialization issues
  const actualWsUrl = wsUrl || (typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_PYTHON_WS_URL || 'ws://localhost:8000/ws/github-events') : 'ws://localhost:8000/ws/github-events')
  const [data, setData] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  
  const wsRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)
  const reconnectAttemptsRef = useRef(0)
  const queryClient = useQueryClient()

  const connect = () => {
    try {
      setConnectionStatus('connecting')
      setError(null)
      
      console.log('🔗 Connecting to WebSocket URL:', actualWsUrl)
      wsRef.current = new WebSocket(actualWsUrl)
      
      wsRef.current.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        setConnectionStatus('connected')
        setError(null)
        reconnectAttemptsRef.current = 0
      }
      
      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          
          if (message.type === 'github_events') {
            setData(message.data)
            setLastUpdate(new Date())
            
            // Update React Query cache
            queryClient.setQueryData(['github-events'], message.data)
          } else if (message.type === 'error') {
            setError(message.error)
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err)
          setError('Failed to parse data from server')
        }
      }
      
      wsRef.current.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        setIsConnected(false)
        setConnectionStatus('disconnected')
        
        // Attempt to reconnect unless it was a clean close
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          setConnectionStatus('reconnecting')
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++
            connect()
          }, reconnectInterval)
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setError('Maximum reconnection attempts reached')
          setConnectionStatus('failed')
        }
      }
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error)
        setError('WebSocket connection error')
      }
    } catch (err) {
      console.error('Failed to create WebSocket connection:', err)
      setError('Failed to connect to data stream')
      setConnectionStatus('failed')
    }
  }

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected')
    }
    
    setIsConnected(false)
    setConnectionStatus('disconnected')
    reconnectAttemptsRef.current = 0
  }

  const reconnect = () => {
    disconnect()
    setTimeout(connect, 1000)
  }

  useEffect(() => {
    connect()
    
    return () => {
      disconnect()
    }
  }, [actualWsUrl])

  return (
    <DataStreamContext.Provider value={{
      data,
      isConnected,
      isLoading: connectionStatus === 'connecting',
      error,
      lastUpdate,
      connectionStatus,
      reconnect
    }}>
      {children}
    </DataStreamContext.Provider>
  )
}

export const useDataStream = () => {
  const context = useContext(DataStreamContext)
  if (!context) {
    throw new Error('useDataStream must be used within a DataStreamProvider')
  }
  return context
}

export const DataStreamStatus = ({ className = "" }) => {
  const { isConnected, connectionStatus, error, lastUpdate, reconnect } = useDataStream()

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600 dark:text-green-400'
      case 'connecting': 
      case 'reconnecting': return 'text-yellow-600 dark:text-yellow-400'
      case 'disconnected':
      case 'failed': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Live Data Connected'
      case 'connecting': return 'Connecting...'
      case 'reconnecting': return 'Reconnecting...'
      case 'disconnected': return 'Disconnected'
      case 'failed': return 'Connection Failed'
      default: return 'Unknown'
    }
  }

  return (
    <div className={`flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 
                    rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500 animate-pulse' : 
            connectionStatus === 'connecting' || connectionStatus === 'reconnecting' ? 'bg-yellow-500 animate-pulse' :
            'bg-red-500'
          }`} />
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        
        {lastUpdate && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Last update: {lastUpdate.toLocaleTimeString()}
          </span>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-red-600 dark:text-red-400 max-w-xs truncate">
            {error}
          </span>
          <button
            onClick={reconnect}
            className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  )
}

export const useRealtimeQuery = (queryKey, fallbackFetcher, options = {}) => {
  const { data: streamData, isConnected, error: streamError } = useDataStream()
  
  return useQuery({
    queryKey,
    queryFn: fallbackFetcher,
    enabled: !isConnected, // Only fetch if WebSocket is not connected
    refetchInterval: isConnected ? false : 30000, // Poll every 30s when disconnected
    initialData: streamData,
    ...options
  })
}

export default DataStreamProvider