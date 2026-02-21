"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { Clock, Calendar } from 'lucide-react';

export function HeatmapChart({ data, filters, theme, realtimeData, expanded = false }) {
  const containerRef = useRef(null);
  const [hoveredCell, setHoveredCell] = useState(null);

  // Process data for heatmap
  const processHeatmapData = () => {
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

    // Create heatmap data: day of week vs hour of day
    const heatmapData = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Initialize all combinations
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        heatmapData.push({
          day_of_week: dayNames[day],
          hour_of_day: hour,
          activity_count: 0,
          day_num: day,
          commits: 0,
          pullRequests: 0,
          issues: 0
        });
      }
    }

    // Aggregate actual data
    filteredData.forEach(item => {
      const date = new Date(item.date);
      const dayOfWeek = date.getDay();
      const hourOfDay = date.getHours();
      
      const cell = heatmapData.find(h => h.day_num === dayOfWeek && h.hour_of_day === hourOfDay);
      if (cell) {
        cell.activity_count += (item.commits || 0) + (item.pullRequests || 0) + (item.issues || 0);
        cell.commits += item.commits || 0;
        cell.pullRequests += item.pullRequests || 0;
        cell.issues += item.issues || 0;
      }
    });

    return heatmapData;
  };

  const heatmapData = processHeatmapData();

  // Create Observable Plot heatmap
  useEffect(() => {
    if (!containerRef.current || heatmapData.length === 0) return;

    // Clear previous chart
    d3.select(containerRef.current).selectAll("*").remove();

    const width = containerRef.current.clientWidth;
    const height = expanded ? 400 : 180;

    const plot = Plot.plot({
      width,
      height,
      style: {
        backgroundColor: 'transparent',
        overflow: 'visible'
      },
      marginTop: 30,
      marginRight: 80,
      marginBottom: 60,
      marginLeft: 80,

      // Color scale
      color: {
        type: "sequential",
        scheme: theme === 'dark' ? "Blues" : "YlOrRd",
        domain: [0, d3.max(heatmapData, d => d.activity_count) || 1],
        label: "Activity Count"
      },

      // Axes
      x: {
        label: "Hour of Day",
        domain: d3.range(24),
        ticks: expanded ? 24 : 8,
        tickFormat: d => `${d}:00`
      },
      y: {
        label: "Day of Week",
        domain: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      },

      marks: [
        // Heatmap cells
        Plot.cell(heatmapData, {
          x: "hour_of_day",
          y: "day_of_week",
          fill: "activity_count",
          stroke: theme === 'dark' ? "#374151" : "#E5E7EB",
          strokeWidth: 1,
          rx: 4,
          title: d => `${d.day_of_week}, ${d.hour_of_day}:00\nTotal Activity: ${d.activity_count}\nCommits: ${d.commits}\nPRs: ${d.pullRequests}\nIssues: ${d.issues}`
        }),

        // Text labels for expanded view
        ...(expanded ? [
          Plot.text(heatmapData.filter(d => d.activity_count > 0), {
            x: "hour_of_day",
            y: "day_of_week",
            text: "activity_count",
            fill: theme === 'dark' ? "white" : "black",
            fontSize: 10,
            textAnchor: "middle"
          })
        ] : [])
      ]
    });

    // Add interactivity
    plot.addEventListener('mouseover', (event) => {
      const target = event.target;
      if (target.tagName === 'rect') {
        setHoveredCell({
          x: event.clientX,
          y: event.clientY,
          data: target.__data__
        });
      }
    });

    plot.addEventListener('mouseout', () => {
      setHoveredCell(null);
    });

    containerRef.current.appendChild(plot);

    return () => {
      const container = containerRef.current;
      if (container && plot.parentNode) {
        plot.remove();
      }
    };
  }, [heatmapData, theme, expanded]);

  const maxActivity = d3.max(heatmapData, d => d.activity_count) || 0;
  const totalActivity = d3.sum(heatmapData, d => d.activity_count);

  return (
    <div className="h-full relative">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Activity Heatmap
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Activity by day and hour • Peak: {maxActivity} events
          </p>
        </div>

        {/* Stats */}
        <div className="text-right space-y-1">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            {totalActivity.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total Events
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50 overflow-hidden">
        {heatmapData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center space-y-2">
              <Calendar className="w-8 h-8 mx-auto opacity-50" />
              <p className="text-sm">No activity data available</p>
            </div>
          </div>
        ) : (
          <motion.div
            ref={containerRef}
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{ height: expanded ? '400px' : '180px' }}
          />
        )}
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed z-50 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg p-3 shadow-lg pointer-events-none"
          style={{
            left: hoveredCell.x + 10,
            top: hoveredCell.y - 50
          }}
        >
          <div className="space-y-1">
            <div className="font-semibold">{hoveredCell.data?.day_of_week}, {hoveredCell.data?.hour_of_day}:00</div>
            <div>Total Activity: {hoveredCell.data?.activity_count}</div>
            <div className="text-blue-300">Commits: {hoveredCell.data?.commits}</div>
            <div className="text-green-300">PRs: {hoveredCell.data?.pullRequests}</div>
            <div className="text-red-300">Issues: {hoveredCell.data?.issues}</div>
          </div>
        </motion.div>
      )}

      {/* Color Scale Legend */}
      {expanded && maxActivity > 0 && (
        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600 dark:text-gray-400">Less</span>
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-sm"
                  style={{
                    backgroundColor: d3.interpolateYlOrRd(i / 4),
                    opacity: theme === 'dark' ? 0.8 : 1
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">More</span>
          </div>
        </div>
      )}

      {/* Activity Insights */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 grid grid-cols-2 gap-4"
        >
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Peak Activity Time
            </h5>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Most active during business hours (9 AM - 5 PM)
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h5 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
              Weekly Pattern
            </h5>
            <p className="text-xs text-green-700 dark:text-green-300">
              Higher activity on weekdays vs weekends
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}