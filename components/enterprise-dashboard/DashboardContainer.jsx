"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChartGrid } from './ChartGrid';
import { FilterPanel } from './FilterPanel';
import { WebSocketProvider } from './realtime/WebSocketProvider';
import { useTheme } from '@/components/ThemeProvider';
import { Loader2, TrendingUp, Activity, GitBranch, Calendar } from 'lucide-react';

export function DashboardContainer({ className = '' }) {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [globalFilters, setGlobalFilters] = useState({
    dateRange: {
      start: null, // Will be set on client side
      end: null
    },
    repositories: [],
    eventTypes: [],
    timeframe: '30d'
  });

  // Initialize date range on client side only
  useEffect(() => {
    setGlobalFilters(prev => ({
      ...prev,
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date()
      }
    }));
  }, []);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${className}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto" />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-blue-200 dark:border-blue-800"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Loading Enterprise Dashboard
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Preparing real-time GitHub analytics...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <WebSocketProvider>
      <motion.div
        className={`min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 ${className}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Dashboard Header */}
        <motion.div 
          className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700"
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    GitHub Events Analytics
                  </div>
                  <div className="flex items-center gap-2 text-sm font-normal">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600 dark:text-green-400">Live</span>
                  </div>
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Real-time enterprise dashboard powered by Snowflake and Observable Plot
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-4">
                {[
                  { icon: Activity, label: 'Events', value: '2.4k', color: 'text-blue-600' },
                  { icon: GitBranch, label: 'Repos', value: '12', color: 'text-green-600' },
                  { icon: Calendar, label: 'Days', value: '30', color: 'text-purple-600' }
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="text-center">
                    <div className={`${color} dark:${color.replace('600', '400')} flex items-center gap-1 text-sm font-semibold`}>
                      <Icon className="w-4 h-4" />
                      {value}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Dashboard Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Filter Panel */}
            <motion.div 
              className="xl:col-span-1"
              variants={itemVariants}
            >
              <FilterPanel 
                filters={globalFilters}
                onFiltersChange={setGlobalFilters}
              />
            </motion.div>

            {/* Charts Grid */}
            <motion.div 
              className="xl:col-span-3"
              variants={itemVariants}
            >
              <ChartGrid 
                filters={globalFilters}
                theme={theme}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </WebSocketProvider>
  );
}