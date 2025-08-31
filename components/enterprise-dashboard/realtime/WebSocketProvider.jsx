"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const WebSocketContext = createContext({
  data: null,
  isConnected: false,
  lastUpdate: null,
  connectionStatus: 'disconnected',
  reconnect: () => {},
  subscribe: () => {},
  unsubscribe: () => {}
});

export function WebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [subscribers, setSubscribers] = useState(new Set());

  const PYTHON_WS_URL = process.env.NEXT_PUBLIC_PYTHON_WS_URL || 
                       (process.env.NODE_ENV === 'production' 
                         ? 'wss://events-backend.fly.dev/ws/github-events'
                         : 'ws://localhost:8000/ws/github-events');

  const connect = useCallback(() => {
    if (socket?.readyState === WebSocket.OPEN) return;

    setConnectionStatus('connecting');
    
    try {
      const newSocket = new WebSocket(PYTHON_WS_URL);

      newSocket.onopen = () => {
        console.log('🔗 Connected to GitHub Events WebSocket');
        setIsConnected(true);
        setConnectionStatus('connected');
        setReconnectAttempts(0);
        
        // Notify performance monitor
        if (window.playgroundPerformance) {
          window.playgroundPerformance.updateWebSocketStatus('connected');
        }
      };

      newSocket.onclose = (event) => {
        console.log('❌ Disconnected from WebSocket:', event.code, event.reason);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        
        // Notify performance monitor
        if (window.playgroundPerformance) {
          window.playgroundPerformance.updateWebSocketStatus('disconnected');
        }
      };

      newSocket.onerror = (error) => {
        console.error('🚨 WebSocket connection error:', error);
        setConnectionStatus('error');
        setReconnectAttempts(prev => prev + 1);
      };

      newSocket.onmessage = (event) => {
        const messageStartTime = performance.now();
        
        try {
          const message = JSON.parse(event.data);
          console.log('📊 Received WebSocket message:', message);
          
          // Handle different message types from FastAPI backend
          if (message.type === 'initial_data' || message.type === 'data_update') {
            setData(message.data);
            setLastUpdate(new Date());
            
            // Notify all subscribers
            subscribers.forEach(callback => {
              if (typeof callback === 'function') {
                callback(message.data);
              }
            });
            
            // Track WebSocket message processing performance
            const processingTime = performance.now() - messageStartTime;
            if (window.playgroundPerformance) {
              window.playgroundPerformance.addOperation('WebSocket Message', processingTime);
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          
          // Track error processing time
          const processingTime = performance.now() - messageStartTime;
          if (window.playgroundPerformance) {
            window.playgroundPerformance.addOperation('WebSocket Error', processingTime);
          }
        }
      };

      setSocket(newSocket);

      return () => {
        if (newSocket && newSocket.readyState === WebSocket.OPEN) {
          newSocket.close();
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setConnectionStatus('error');
      setReconnectAttempts(prev => prev + 1);
    }
  }, [PYTHON_WS_URL, subscribers]);

  const reconnect = useCallback(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
    setTimeout(connect, 1000);
  }, [socket, connect]);

  const subscribe = useCallback((callback) => {
    if (typeof callback === 'function') {
      setSubscribers(prev => new Set([...prev, callback]));
      return () => {
        setSubscribers(prev => {
          const newSet = new Set(prev);
          newSet.delete(callback);
          return newSet;
        });
      };
    }
  }, []);

  const unsubscribe = useCallback((callback) => {
    setSubscribers(prev => {
      const newSet = new Set(prev);
      newSet.delete(callback);
      return newSet;
    });
  }, []);

  // Initial connection
  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [socket]);

  // Auto-reconnect with exponential backoff
  useEffect(() => {
    if (connectionStatus === 'error' && reconnectAttempts < 5) {
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
      const timer = setTimeout(() => {
        console.log(`🔄 Attempting reconnection (${reconnectAttempts + 1}/5)...`);
        reconnect();
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [connectionStatus, reconnectAttempts, reconnect]);

  const contextValue = {
    data,
    isConnected,
    lastUpdate,
    connectionStatus,
    reconnect,
    subscribe,
    unsubscribe,
    reconnectAttempts,
    maxReconnectAttempts: 5
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketData() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketData must be used within a WebSocketProvider');
  }
  return context;
}

// Connection status hook
export function useConnectionStatus() {
  const { isConnected, connectionStatus, reconnectAttempts, maxReconnectAttempts, reconnect } = useWebSocketData();
  
  return {
    isConnected,
    status: connectionStatus,
    canReconnect: reconnectAttempts < maxReconnectAttempts,
    reconnectAttempts,
    maxReconnectAttempts,
    reconnect
  };
}

// Data subscription hook
export function useWebSocketSubscription(callback) {
  const { subscribe } = useWebSocketData();
  
  useEffect(() => {
    const unsubscribe = subscribe(callback);
    return unsubscribe;
  }, [subscribe, callback]);
}