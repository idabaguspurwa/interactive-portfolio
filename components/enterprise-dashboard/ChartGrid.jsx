"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TimeSeriesChart } from './charts/TimeSeriesChart';
import { HeatmapChart } from './charts/HeatmapChart';
import { MetricsKPI } from './charts/MetricsKPI';
import { BarChart } from './charts/BarChart';
import { NetworkChart } from './charts/NetworkChart';
import { useWebSocketData } from './realtime/WebSocketProvider';
import { Maximize2, Minimize2, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ChartGrid({ filters, theme, className = '' }) {
  const { data: realtimeData, isConnected, lastUpdate } = useWebSocketData();
  const [expandedChart, setExpandedChart] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate sample data based on filters
  const generateSampleData = () => {
    const days = Math.floor((filters.dateRange.end - filters.dateRange.start) / (1000 * 60 * 60 * 24));
    const data = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(filters.dateRange.start.getTime() + i * 24 * 60 * 60 * 1000);
      data.push({
        date: date.toISOString().split('T')[0],
        timestamp: date,
        commits: Math.floor(Math.random() * 20) + 1,
        pullRequests: Math.floor(Math.random() * 8) + 1,
        issues: Math.floor(Math.random() * 5) + 1,
        repository: sampleRepos[Math.floor(Math.random() * sampleRepos.length)],
        eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)]
      });
    }
    
    return data;
  };

  const sampleRepos = ['portfolio-website', 'data-pipeline', 'analytics-dashboard', 'ml-experiments', 'api-gateway'];
  const eventTypes = ['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'CreateEvent', 'ReleaseEvent'];
  
  const [chartData] = useState(() => generateSampleData());

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const chartConfigs = [
    {
      id: 'kpi-metrics',
      title: 'Key Performance Indicators',
      component: MetricsKPI,
      size: 'col-span-2',
      description: 'Overview of GitHub activity metrics'
    },
    {
      id: 'activity-timeline',
      title: 'Activity Timeline',
      component: TimeSeriesChart,
      size: 'col-span-4',
      description: 'GitHub events over time'
    },
    {
      id: 'repository-comparison',
      title: 'Repository Activity',
      component: BarChart,
      size: 'col-span-2',
      description: 'Compare activity across repositories'
    },
    {
      id: 'activity-heatmap',
      title: 'Activity Heatmap',
      component: HeatmapChart,
      size: 'col-span-2',
      description: 'Activity patterns by day and hour'
    },
    {
      id: 'network-analysis',
      title: 'Repository Network',
      component: NetworkChart,
      size: 'col-span-2',
      description: 'Repository relationships and collaboration'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className={`space-y-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Grid Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Live Analytics Dashboard
          </h2>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            {lastUpdate && (
              <div>
                Last update: {new Date(lastUpdate).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Charts Grid */}
      <motion.div 
        className={`grid grid-cols-4 gap-6 ${expandedChart ? 'hidden' : ''}`}
        variants={containerVariants}
      >
        {chartConfigs.map((config) => {
          const ChartComponent = config.component;
          
          return (
            <motion.div
              key={config.id}
              className={`${config.size} h-80`}
              variants={chartVariants}
            >
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg h-full overflow-hidden">
                {/* Chart Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {config.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {config.description}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedChart(expandedChart === config.id ? null : config.id)}
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Chart Content */}
                <div className="p-4 h-64">
                  <ChartComponent
                    data={chartData}
                    filters={filters}
                    theme={theme}
                    realtimeData={realtimeData}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Expanded Chart View */}
      {expandedChart && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-4 z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {chartConfigs.find(c => c.id === expandedChart)?.title}
              </h3>
              <Button
                variant="outline"
                onClick={() => setExpandedChart(null)}
              >
                <Minimize2 className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
          </div>
          
          <div className="p-6 h-full">
            {(() => {
              const config = chartConfigs.find(c => c.id === expandedChart);
              const ChartComponent = config?.component;
              return ChartComponent ? (
                <ChartComponent
                  data={chartData}
                  filters={filters}
                  theme={theme}
                  realtimeData={realtimeData}
                  expanded={true}
                />
              ) : null;
            })()}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}