"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { Activity } from 'lucide-react';

export function TimeSeriesChart({ data, filters, theme, realtimeData, expanded = false }) {
  const containerRef = useRef(null);
  const [selectedData, setSelectedData] = useState(null);
  const [chartData, setChartData] = useState([]);

  // Process and filter data
  useEffect(() => {
    if (!data || data.length === 0) return;

    const processedData = data
      .filter(item => {
        const dateMatch = !filters.dateRange || (
          new Date(item.date) >= filters.dateRange.start && 
          new Date(item.date) <= filters.dateRange.end
        );
        const repoMatch = !filters.repositories?.length || filters.repositories.includes(item.repository);
        const eventMatch = !filters.eventTypes?.length || filters.eventTypes.includes(item.eventType);
        
        return dateMatch && repoMatch && eventMatch;
      })
      .map(item => ({
        ...item,
        totalActivity: (item.commits || 0) + (item.pullRequests || 0) + (item.issues || 0),
        date: new Date(item.date)
      }))
      .sort((a, b) => a.date - b.date);

    setChartData(processedData);
  }, [data, filters]);

  // Update with real-time data
  useEffect(() => {
    if (realtimeData && realtimeData.length > 0) {
      setChartData(prev => {
        const updated = [...prev];
        realtimeData.forEach(newItem => {
          const existingIndex = updated.findIndex(item => 
            item.date.toDateString() === new Date(newItem.date).toDateString() &&
            item.repository === newItem.repository
          );
          
          if (existingIndex >= 0) {
            updated[existingIndex] = {
              ...updated[existingIndex],
              ...newItem,
              totalActivity: (newItem.commits || 0) + (newItem.pullRequests || 0) + (newItem.issues || 0)
            };
          } else {
            updated.push({
              ...newItem,
              date: new Date(newItem.date),
              totalActivity: (newItem.commits || 0) + (newItem.pullRequests || 0) + (newItem.issues || 0)
            });
          }
        });
        return updated.sort((a, b) => a.date - b.date);
      });
    }
  }, [realtimeData]);

  // Create Observable Plot chart
  useEffect(() => {
    if (!containerRef.current || chartData.length === 0) return;

    // Clear previous chart
    d3.select(containerRef.current).selectAll("*").remove();

    const width = containerRef.current.clientWidth;
    const height = expanded ? 600 : 200;

    // Group data by repository for multiple lines
    const groupedData = d3.group(chartData, d => d.repository);
    const repositories = Array.from(groupedData.keys());

    const plot = Plot.plot({
      width,
      height,
      style: {
        backgroundColor: theme === 'dark' ? 'transparent' : 'transparent',
        overflow: 'visible'
      },
      marginTop: 20,
      marginRight: 40,
      marginBottom: 40,
      marginLeft: 60,
      
      // Color scale for repositories
      color: {
        type: "categorical",
        domain: repositories,
        range: theme === 'dark' 
          ? ["#60A5FA", "#34D399", "#F472B6", "#FBBF24", "#A78BFA"]
          : ["#3B82F6", "#10B981", "#EC4899", "#F59E0B", "#8B5CF6"]
      },

      // Grid and axes
      grid: true,
      x: {
        type: "time",
        label: "Date",
        labelAnchor: "center",
        tickFormat: expanded ? "%b %d" : "%m/%d",
        ticks: expanded ? 8 : 4
      },
      y: {
        label: "Activity Count",
        labelAnchor: "center",
        grid: true
      },

      marks: [
        // Area charts for each repository (background)
        ...repositories.map(repo => 
          Plot.areaY(
            Array.from(groupedData.get(repo)), 
            {
              x: "date",
              y: "totalActivity",
              fill: repo,
              fillOpacity: 0.1,
              curve: "catmull-rom"
            }
          )
        ),

        // Line charts for each repository
        ...repositories.map(repo => 
          Plot.line(
            Array.from(groupedData.get(repo)), 
            {
              x: "date",
              y: "totalActivity",
              stroke: repo,
              strokeWidth: expanded ? 3 : 2,
              curve: "catmull-rom",
              marker: expanded ? "circle" : null,
              title: d => `${repo}\n${d.date.toLocaleDateString()}\nActivity: ${d.totalActivity}`
            }
          )
        ),

        // Interactive dots on hover
        Plot.dot(chartData, {
          x: "date",
          y: "totalActivity",
          fill: "repository",
          r: 4,
          fillOpacity: 0,
          stroke: "repository",
          strokeWidth: 2,
          title: d => `${d.repository}\n${d.date.toLocaleDateString()}\nCommits: ${d.commits}\nPRs: ${d.pullRequests}\nIssues: ${d.issues}`
        }),

        // Crosshair for interactivity
        Plot.crosshair(chartData, {
          x: "date",
          y: "totalActivity"
        })
      ]
    });

    // Add click handling for drill-down (scoped to chart only)
    plot.addEventListener('click', (event) => {
      // Only handle clicks if they're specifically on chart elements, not navigation links
      if (event.target.closest('a') || event.target.closest('nav') || event.target.closest('[data-navigation]')) {
        return; // Let navigation links work normally
      }
      
      // Prevent event from bubbling to avoid interfering with navigation
      event.stopPropagation();
      
      // Find closest data point
      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Simple drill-down simulation
      const clickedData = {
        x: x / width,
        y: y / height,
        timestamp: new Date()
      };
      
      setSelectedData(clickedData);
    });

    containerRef.current.appendChild(plot);

    return () => {
      if (containerRef.current && plot.parentNode) {
        plot.remove();
      }
    };
  }, [chartData, theme, expanded]);

  return (
    <div className="h-full relative">
      {/* Chart Title and Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            GitHub Activity Timeline
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {chartData.length} data points • Real-time updates
          </p>
        </div>

        {/* Real-time indicator */}
        {realtimeData && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-medium"
          >
            <motion.div
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Live
          </motion.div>
        )}
      </div>

      {/* Chart Container */}
      <div className="relative bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50 overflow-hidden">
        {chartData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center space-y-2">
              <Activity className="w-8 h-8 mx-auto opacity-50" />
              <p className="text-sm">No data available for selected filters</p>
            </div>
          </div>
        ) : (
          <motion.div
            ref={containerRef}
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ height: expanded ? '600px' : '200px' }}
          />
        )}

        {/* Loading overlay for real-time updates */}
        {realtimeData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg px-3 py-1 shadow-lg">
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Updating...
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Selected Data Info */}
      {selectedData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
        >
          <div className="text-sm">
            <span className="font-medium text-blue-900 dark:text-blue-100">
              Chart clicked at: 
            </span>
            <span className="text-blue-700 dark:text-blue-300 ml-2">
              {selectedData.timestamp.toLocaleTimeString()}
            </span>
          </div>
        </motion.div>
      )}

      {/* Legend for expanded view */}
      {expanded && chartData.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {Array.from(new Set(chartData.map(d => d.repository))).slice(0, 5).map((repo, index) => (
            <div key={repo} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: theme === 'dark' 
                    ? ["#60A5FA", "#34D399", "#F472B6", "#FBBF24", "#A78BFA"][index]
                    : ["#3B82F6", "#10B981", "#EC4899", "#F59E0B", "#8B5CF6"][index]
                }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{repo}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}