"use client";

import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Activity, GitCommit, GitPullRequest, AlertCircle } from 'lucide-react';

export function MetricsKPI({ data, filters, theme, realtimeData, expanded = false }) {
  // Calculate KPI metrics from data
  const calculateMetrics = () => {
    if (!data || data.length === 0) {
      return {
        totalEvents: 0,
        totalCommits: 0,
        totalPRs: 0,
        totalIssues: 0,
        avgDaily: 0,
        weeklyGrowth: 0
      };
    }

    const filteredData = data.filter(item => {
      const dateMatch = !filters.dateRange || (
        new Date(item.date) >= filters.dateRange.start && 
        new Date(item.date) <= filters.dateRange.end
      );
      const repoMatch = !filters.repositories?.length || filters.repositories.includes(item.repository);
      const eventMatch = !filters.eventTypes?.length || filters.eventTypes.includes(item.eventType);
      
      return dateMatch && repoMatch && eventMatch;
    });

    const totalCommits = filteredData.reduce((sum, item) => sum + (item.commits || 0), 0);
    const totalPRs = filteredData.reduce((sum, item) => sum + (item.pullRequests || 0), 0);
    const totalIssues = filteredData.reduce((sum, item) => sum + (item.issues || 0), 0);
    const totalEvents = totalCommits + totalPRs + totalIssues;
    
    const avgDaily = Math.round(totalEvents / Math.max(filteredData.length, 1));
    
    // Calculate weekly growth (mock calculation)
    const weeklyGrowth = Math.random() > 0.5 ? Math.random() * 15 + 5 : -Math.random() * 10;

    return {
      totalEvents,
      totalCommits,
      totalPRs,
      totalIssues,
      avgDaily,
      weeklyGrowth: Math.round(weeklyGrowth * 10) / 10
    };
  };

  const metrics = calculateMetrics();

  const kpiCards = [
    {
      title: 'Total Events',
      value: metrics.totalEvents.toLocaleString(),
      icon: Activity,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      change: '+12.5%',
      trend: 'up'
    },
    {
      title: 'Commits',
      value: metrics.totalCommits.toLocaleString(),
      icon: GitCommit,
      color: 'green',
      gradient: 'from-green-500 to-green-600',
      change: '+8.2%',
      trend: 'up'
    },
    {
      title: 'Pull Requests',
      value: metrics.totalPRs.toLocaleString(),
      icon: GitPullRequest,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      change: '+15.1%',
      trend: 'up'
    },
    {
      title: 'Issues',
      value: metrics.totalIssues.toLocaleString(),
      icon: AlertCircle,
      color: 'red',
      gradient: 'from-red-500 to-red-600',
      change: '-5.3%',
      trend: 'down'
    },
    {
      title: 'Daily Average',
      value: metrics.avgDaily.toString(),
      icon: TrendingUp,
      color: 'indigo',
      gradient: 'from-indigo-500 to-indigo-600',
      change: `${metrics.weeklyGrowth > 0 ? '+' : ''}${metrics.weeklyGrowth}%`,
      trend: metrics.weeklyGrowth > 0 ? 'up' : 'down'
    },
    {
      title: 'Active Repositories',
      value: new Set(data?.map(d => d.repository) || []).size.toString(),
      icon: Activity,
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600',
      change: '+2',
      trend: 'up'
    }
  ];

  const gridCols = expanded ? 'grid-cols-3' : 'grid-cols-2';

  return (
    <div className={`h-full ${expanded ? 'p-6' : ''}`}>
      <motion.div
        className={`grid ${gridCols} gap-4 h-full`}
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {kpiCards.slice(0, expanded ? 6 : 4).map((kpi, index) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <motion.div
              key={kpi.title}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
              variants={{
                hidden: { opacity: 0, scale: 0.8, y: 20 },
                visible: { 
                  opacity: 1, 
                  scale: 1, 
                  y: 0,
                  transition: { duration: 0.5, delay: index * 0.1 }
                }
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between h-full">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 bg-gradient-to-r ${kpi.gradient} rounded-lg shadow-sm`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      {kpi.title}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="text-2xl font-bold text-gray-900 dark:text-white"
                    >
                      {kpi.value}
                    </motion.div>
                    
                    <div className={`flex items-center gap-1 text-xs font-medium ${
                      kpi.trend === 'up' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      <TrendIcon className="w-3 h-3" />
                      {kpi.change}
                      <span className="text-gray-500 dark:text-gray-400 ml-1">vs last period</span>
                    </div>
                  </div>
                </div>

                {/* Live indicator for real-time data */}
                {realtimeData && (
                  <motion.div
                    className="w-2 h-2 bg-green-500 rounded-full self-start mt-2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>

              {/* Hover effect overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${kpi.gradient} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`} />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Real-time update indicator */}
      {realtimeData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live data updated
          </div>
        </motion.div>
      )}
    </div>
  );
}