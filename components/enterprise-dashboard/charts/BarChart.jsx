"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { BarChart3, GitBranch, TrendingUp } from 'lucide-react';

export function BarChart({ data, filters, theme, realtimeData, expanded = false }) {
  const containerRef = useRef(null);
  const [chartMode, setChartMode] = useState('repository'); // 'repository' | 'eventType'
  const [sortBy, setSortBy] = useState('totalActivity'); // 'totalActivity' | 'commits' | 'pullRequests'

  // Process data for bar chart
  const processBarData = () => {
    if (!data || data.length === 0) return [];

    const filteredData = data.filter(item => {
      const dateMatch = !filters.dateRange || (
        new Date(item.date) >= filters.dateRange.start && 
        new Date(item.date) <= filters.dateRange.end
      );
      const repoMatch = !filters.repositories?.length || filters.repositories.includes(item.repository);
      const eventMatch = !filters.eventTypes?.length || filters.eventTypes.includes(item.eventType);
      
      return dateMatch && repoMatch && eventMatch;
    });

    let aggregatedData = [];

    if (chartMode === 'repository') {
      // Group by repository
      const grouped = d3.group(filteredData, d => d.repository);
      
      aggregatedData = Array.from(grouped, ([repository, items]) => {
        const commits = d3.sum(items, d => d.commits || 0);
        const pullRequests = d3.sum(items, d => d.pullRequests || 0);
        const issues = d3.sum(items, d => d.issues || 0);
        
        return {
          category: repository,
          commits,
          pullRequests,
          issues,
          totalActivity: commits + pullRequests + issues,
          type: 'repository'
        };
      });
    } else {
      // Group by event type
      const eventTypeMap = {
        'PushEvent': 'commits',
        'PullRequestEvent': 'pullRequests', 
        'IssuesEvent': 'issues'
      };

      const grouped = d3.group(filteredData, d => d.eventType);
      
      aggregatedData = Array.from(grouped, ([eventType, items]) => {
        const count = items.length;
        
        return {
          category: eventType,
          value: count,
          commits: eventType === 'PushEvent' ? count : 0,
          pullRequests: eventType === 'PullRequestEvent' ? count : 0,
          issues: eventType === 'IssuesEvent' ? count : 0,
          totalActivity: count,
          type: 'eventType'
        };
      });
    }

    // Sort by selected criteria
    return aggregatedData.sort((a, b) => b[sortBy] - a[sortBy]).slice(0, expanded ? 10 : 5);
  };

  const barData = processBarData();

  // Create Observable Plot bar chart
  useEffect(() => {
    if (!containerRef.current || barData.length === 0) return;

    // Clear previous chart
    d3.select(containerRef.current).selectAll("*").remove();

    const width = containerRef.current.clientWidth;
    const height = expanded ? 400 : 160;

    const plot = Plot.plot({
      width,
      height,
      style: {
        backgroundColor: 'transparent',
        overflow: 'visible'
      },
      marginTop: 20,
      marginRight: 40,
      marginBottom: expanded ? 80 : 60,
      marginLeft: 80,

      // Color configuration
      color: {
        type: "ordinal",
        domain: barData.map(d => d.category),
        range: theme === 'dark' 
          ? ["#60A5FA", "#34D399", "#F472B6", "#FBBF24", "#A78BFA", "#FB7185", "#38BDF8", "#4ADE80", "#FACC15", "#C084FC"]
          : ["#3B82F6", "#10B981", "#EC4899", "#F59E0B", "#8B5CF6", "#EF4444", "#06B6D4", "#22C55E", "#EAB308", "#A855F7"]
      },

      // Axes
      x: {
        label: chartMode === 'repository' ? "Repository" : "Event Type",
        labelAnchor: "center",
        tickRotate: expanded ? 0 : 45
      },
      y: {
        label: "Activity Count",
        labelAnchor: "center",
        grid: true
      },

      marks: [
        // Main bars
        Plot.barY(barData, {
          x: "category",
          y: sortBy === 'totalActivity' ? "totalActivity" : sortBy,
          fill: "category",
          title: d => `${d.category}\n${sortBy}: ${d[sortBy]}\nCommits: ${d.commits}\nPRs: ${d.pullRequests}\nIssues: ${d.issues}`,
          rx: 6
        }),

        // Value labels on top of bars
        ...(expanded ? [
          Plot.text(barData, {
            x: "category",
            y: sortBy === 'totalActivity' ? "totalActivity" : sortBy,
            text: d => d[sortBy] > 0 ? d[sortBy] : '',
            dy: -8,
            fill: theme === 'dark' ? "#E5E7EB" : "#374151",
            fontSize: 11,
            fontWeight: "bold",
            textAnchor: "middle"
          })
        ] : [])
      ]
    });

    containerRef.current.appendChild(plot);

    return () => {
      if (containerRef.current && plot.parentNode) {
        plot.remove();
      }
    };
  }, [barData, theme, expanded, sortBy, chartMode]);

  const chartModes = [
    { value: 'repository', label: 'By Repository', icon: GitBranch },
    { value: 'eventType', label: 'By Event Type', icon: BarChart3 }
  ];

  const sortOptions = [
    { value: 'totalActivity', label: 'Total Activity' },
    { value: 'commits', label: 'Commits' },
    { value: 'pullRequests', label: 'Pull Requests' }
  ];

  return (
    <div className="h-full relative">
      {/* Chart Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Repository Comparison
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {barData.length} repositories • Sorted by {sortOptions.find(o => o.value === sortBy)?.label}
          </p>
        </div>

        {expanded && (
          <div className="flex items-center gap-2">
            {/* Chart Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {chartModes.map(mode => (
                <button
                  key={mode.value}
                  onClick={() => setChartMode(mode.value)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    chartMode === mode.value
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <mode.icon className="w-3 h-3 mr-1 inline" />
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-gray-900 dark:text-white"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Chart Container */}
      <div className="relative bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50 overflow-hidden">
        {barData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center space-y-2">
              <BarChart3 className="w-8 h-8 mx-auto opacity-50" />
              <p className="text-sm">No data available for comparison</p>
            </div>
          </div>
        ) : (
          <motion.div
            ref={containerRef}
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ height: expanded ? '400px' : '160px' }}
          />
        )}
      </div>

      {/* Top Performers (Expanded View) */}
      {expanded && barData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Top Performers
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {barData.slice(0, 3).map((item, index) => (
              <div
                key={item.category}
                className="p-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item.category}
                  </span>
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {item[sortBy].toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {sortOptions.find(o => o.value === sortBy)?.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Real-time update indicator */}
      {realtimeData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium"
        >
          Updated
        </motion.div>
      )}
    </div>
  );
}