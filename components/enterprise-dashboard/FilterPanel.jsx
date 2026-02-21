"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Filter, GitBranch, Activity, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function FilterPanel({ filters, onFiltersChange, className = '' }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const timeframes = [
    { value: '7d', label: 'Last 7 days', description: 'Recent activity' },
    { value: '30d', label: 'Last 30 days', description: 'Monthly overview' },
    { value: '90d', label: 'Last 3 months', description: 'Quarterly trends' },
    { value: 'custom', label: 'Custom range', description: 'Select dates' }
  ];

  const eventTypes = [
    { value: 'PushEvent', label: 'Push Events', icon: '📤', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    { value: 'PullRequestEvent', label: 'Pull Requests', icon: '🔄', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
    { value: 'IssuesEvent', label: 'Issues', icon: '🐛', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
    { value: 'CreateEvent', label: 'Create Events', icon: '✨', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
    { value: 'ReleaseEvent', label: 'Releases', icon: '🚀', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' }
  ];

  const sampleRepositories = [
    'portfolio-website',
    'data-pipeline',
    'analytics-dashboard',
    'ml-experiments',
    'api-gateway'
  ];

  const handleTimeframeChange = (timeframe) => {
    let dateRange = { ...filters.dateRange };
    
    switch (timeframe) {
      case '7d':
        dateRange = {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          end: new Date()
        };
        break;
      case '30d':
        dateRange = {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date()
        };
        break;
      case '90d':
        dateRange = {
          start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          end: new Date()
        };
        break;
    }

    onFiltersChange({
      ...filters,
      timeframe,
      dateRange
    });
  };

  const toggleEventType = (eventType) => {
    const currentTypes = filters.eventTypes || [];
    const updatedTypes = currentTypes.includes(eventType)
      ? currentTypes.filter(t => t !== eventType)
      : [...currentTypes, eventType];

    onFiltersChange({
      ...filters,
      eventTypes: updatedTypes
    });
  };

  const toggleRepository = (repo) => {
    const currentRepos = filters.repositories || [];
    const updatedRepos = currentRepos.includes(repo)
      ? currentRepos.filter(r => r !== repo)
      : [...currentRepos, repo];

    onFiltersChange({
      ...filters,
      repositories: updatedRepos
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date()
      },
      repositories: [],
      eventTypes: [],
      timeframe: '30d'
    });
  };

  const activeFiltersCount = (filters.repositories?.length || 0) + (filters.eventTypes?.length || 0);

  return (
    <motion.div
      className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Filter Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Filter className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activeFiltersCount > 0 ? `${activeFiltersCount} active` : 'No filters applied'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <RefreshCw className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Content */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-6 space-y-6">
          {/* Time Range Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Time Range
              </label>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {timeframes.map((timeframe) => (
                <motion.button
                  key={timeframe.value}
                  onClick={() => handleTimeframeChange(timeframe.value)}
                  className={`p-3 rounded-xl text-left transition-all duration-200 ${
                    filters.timeframe === timeframe.value
                      ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-400'
                      : 'bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {timeframe.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {timeframe.description}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Event Types Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Event Types
              </label>
            </div>
            <div className="space-y-2">
              {eventTypes.map((eventType) => (
                <motion.button
                  key={eventType.value}
                  onClick={() => toggleEventType(eventType.value)}
                  className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${
                    filters.eventTypes?.includes(eventType.value)
                      ? 'ring-2 ring-blue-500 dark:ring-blue-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{eventType.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {eventType.label}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${eventType.color}`}>
                      {filters.eventTypes?.includes(eventType.value) ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Repositories Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Repositories
              </label>
            </div>
            <div className="space-y-2">
              {sampleRepositories.map((repo) => (
                <motion.button
                  key={repo}
                  onClick={() => toggleRepository(repo)}
                  className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${
                    filters.repositories?.includes(repo)
                      ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500 dark:border-green-400'
                      : 'bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full transition-colors ${
                      filters.repositories?.includes(repo) 
                        ? 'bg-green-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {repo}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}