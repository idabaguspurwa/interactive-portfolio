"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

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
                         ? 'wss://events-backend.fly.dev'
                         : 'ws://localhost:8000');

  const connect = useCallback(() => {
    if (socket?.connected) return;

    setConnectionStatus('connecting');
    
    const newSocket = io(PYTHON_WS_URL, {
      transports: ['websocket'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      maxReconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('🔗 Connected to GitHub Events WebSocket');
      setIsConnected(true);
      setConnectionStatus('connected');
      setReconnectAttempts(0);
      
      // Subscribe to GitHub events
      newSocket.emit('subscribe', { channel: 'github-events' });
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from WebSocket:', reason);
      setIsConnected(false);
      setConnectionStatus('disconnected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('🚨 WebSocket connection error:', error);
      setConnectionStatus('error');
      setReconnectAttempts(prev => prev + 1);
    });

    // Listen for GitHub events data
    newSocket.on('github-events', (eventData) => {
      console.log('📊 Received GitHub events data:', eventData);
      setData(eventData);
      setLastUpdate(new Date());
      
      // Notify all subscribers
      subscribers.forEach(callback => {
        if (typeof callback === 'function') {
          callback(eventData);
        }
      });
    });

    // Listen for metrics updates
    newSocket.on('metrics-update', (metricsData) => {
      console.log('📈 Received metrics update:', metricsData);
      setData(prevData => ({
        ...prevData,
        metrics: metricsData
      }));
      setLastUpdate(new Date());
    });

    // Listen for repository updates
    newSocket.on('repositories-update', (repoData) => {
      console.log('🏢 Received repositories update:', repoData);
      setData(prevData => ({
        ...prevData,
        repositories: repoData
      }));
      setLastUpdate(new Date());
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [PYTHON_WS_URL, subscribers]);

  const reconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
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
      if (socket) {
        socket.disconnect();
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