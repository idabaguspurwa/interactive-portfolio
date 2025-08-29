"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from "d3";
import { Network, GitBranch, Users, Zap } from 'lucide-react';

export function NetworkChart({ data, filters, theme, realtimeData, expanded = false }) {
  const svgRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [simulation, setSimulation] = useState(null);

  // Process data for network visualization
  const processNetworkData = () => {
    if (!data || data.length === 0) return { nodes: [], links: [] };

    const filteredData = data.filter(item => {
      const dateMatch = !filters.dateRange || (
        new Date(item.date) >= filters.dateRange.start && 
        new Date(item.date) <= filters.dateRange.end
      );
      const repoMatch = !filters.repositories?.length || filters.repositories.includes(item.repository);
      const eventMatch = !filters.eventTypes?.length || filters.eventTypes.includes(item.eventType);
      
      return dateMatch && repoMatch && eventMatch;
    });

    // Create nodes (repositories)
    const repositoryStats = d3.group(filteredData, d => d.repository);
    const nodes = Array.from(repositoryStats, ([repository, items]) => {
      const totalActivity = d3.sum(items, d => (d.commits || 0) + (d.pullRequests || 0) + (d.issues || 0));
      const commits = d3.sum(items, d => d.commits || 0);
      const pullRequests = d3.sum(items, d => d.pullRequests || 0);
      const issues = d3.sum(items, d => d.issues || 0);
      
      return {
        id: repository,
        group: Math.floor(Math.random() * 3) + 1, // Random grouping for demo
        totalActivity,
        commits,
        pullRequests,
        issues,
        size: Math.sqrt(totalActivity) * 3 + 10,
        type: 'repository'
      };
    });

    // Create links (relationships based on similar activity patterns)
    const links = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const node1 = nodes[i];
        const node2 = nodes[j];
        
        // Create link if repositories have similar activity levels
        const activityDiff = Math.abs(node1.totalActivity - node2.totalActivity);
        const maxActivity = Math.max(node1.totalActivity, node2.totalActivity);
        const similarity = 1 - (activityDiff / Math.max(maxActivity, 1));
        
        if (similarity > 0.3) { // Threshold for creating links
          links.push({
            source: node1.id,
            target: node2.id,
            value: similarity,
            strength: similarity * 50
          });
        }
      }
    }

    return { nodes, links };
  };

  const networkData = processNetworkData();

  // Create D3 force simulation network
  useEffect(() => {
    if (!svgRef.current || networkData.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = expanded ? 400 : 160;

    // Update SVG dimensions
    svg.attr("width", width).attr("height", height);

    // Create simulation
    const sim = d3.forceSimulation(networkData.nodes)
      .force("link", d3.forceLink(networkData.links)
        .id(d => d.id)
        .strength(d => d.value * 0.5)
        .distance(expanded ? 100 : 50))
      .force("charge", d3.forceManyBody().strength(expanded ? -400 : -200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => d.size + 5));

    setSimulation(sim);

    // Create links
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(networkData.links)
      .join("line")
      .attr("stroke", theme === 'dark' ? "#4B5563" : "#9CA3AF")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.sqrt(d.value) * 3);

    // Create nodes
    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(networkData.nodes)
      .join("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .call(d3.drag()
        .on("start", (event, d) => {
          if (!event.active) sim.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) sim.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Node circles
    node.append("circle")
      .attr("r", d => d.size)
      .attr("fill", (d, i) => {
        const colors = theme === 'dark' 
          ? ["#60A5FA", "#34D399", "#F472B6", "#FBBF24", "#A78BFA"]
          : ["#3B82F6", "#10B981", "#EC4899", "#F59E0B", "#8B5CF6"];
        return colors[d.group % colors.length];
      })
      .attr("stroke", theme === 'dark' ? "#1F2937" : "#FFFFFF")
      .attr("stroke-width", 2);

    // Node labels (for expanded view)
    if (expanded) {
      node.append("text")
        .text(d => d.id.length > 12 ? d.id.substring(0, 12) + "..." : d.id)
        .attr("x", 0)
        .attr("y", d => d.size + 15)
        .attr("text-anchor", "middle")
        .attr("fill", theme === 'dark' ? "#E5E7EB" : "#374151")
        .attr("font-size", "10px")
        .attr("font-weight", "500");
    }

    // Node activity indicators
    node.append("text")
      .text(d => d.totalActivity)
      .attr("x", 0)
      .attr("y", 4)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", expanded ? "10px" : "8px")
      .attr("font-weight", "bold");

    // Mouse events
    node.on("mouseover", function(event, d) {
      setSelectedNode(d);
      d3.select(this).select("circle")
        .transition()
        .duration(200)
        .attr("r", d.size * 1.2);
    })
    .on("mouseout", function(event, d) {
      setSelectedNode(null);
      d3.select(this).select("circle")
        .transition()
        .duration(200)
        .attr("r", d.size);
    });

    // Update positions on tick
    sim.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    return () => {
      if (sim) {
        sim.stop();
      }
    };
  }, [networkData, theme, expanded]);

  const totalNodes = networkData.nodes.length;
  const totalConnections = networkData.links.length;
  const avgActivity = totalNodes > 0 
    ? Math.round(d3.mean(networkData.nodes, d => d.totalActivity) || 0)
    : 0;

  return (
    <div className="h-full relative">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Network className="w-4 h-4" />
            Repository Network
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {totalNodes} repositories • {totalConnections} connections
          </p>
        </div>

        <div className="text-right space-y-1">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            {avgActivity}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Avg Activity
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50 overflow-hidden">
        {networkData.nodes.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center space-y-2">
              <Network className="w-8 h-8 mx-auto opacity-50" />
              <p className="text-sm">No network data available</p>
            </div>
          </div>
        ) : (
          <svg
            ref={svgRef}
            className="w-full"
            style={{ height: expanded ? '400px' : '160px' }}
          />
        )}
      </div>

      {/* Selected Node Info */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 bg-gray-900/90 dark:bg-gray-700/90 backdrop-blur-sm text-white rounded-lg p-3 shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h6 className="font-semibold">{selectedNode.id}</h6>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-blue-300">Commits:</span>
                  <span className="font-medium ml-1">{selectedNode.commits}</span>
                </div>
                <div>
                  <span className="text-green-300">PRs:</span>
                  <span className="font-medium ml-1">{selectedNode.pullRequests}</span>
                </div>
                <div>
                  <span className="text-red-300">Issues:</span>
                  <span className="font-medium ml-1">{selectedNode.issues}</span>
                </div>
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="text-lg font-bold">{selectedNode.totalActivity}</div>
              <div className="text-xs opacity-75">Total Activity</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Network Statistics (Expanded View) */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 grid grid-cols-3 gap-4"
        >
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <GitBranch className="w-5 h-5 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
            <div className="text-lg font-bold text-blue-900 dark:text-blue-100">{totalNodes}</div>
            <div className="text-xs text-blue-700 dark:text-blue-300">Repositories</div>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
            <Zap className="w-5 h-5 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
            <div className="text-lg font-bold text-purple-900 dark:text-purple-100">{totalConnections}</div>
            <div className="text-xs text-purple-700 dark:text-purple-300">Connections</div>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <Users className="w-5 h-5 mx-auto mb-2 text-green-600 dark:text-green-400" />
            <div className="text-lg font-bold text-green-900 dark:text-green-100">{Math.round(avgActivity)}</div>
            <div className="text-xs text-green-700 dark:text-green-300">Avg Activity</div>
          </div>
        </motion.div>
      )}

      {/* Real-time pulse effect */}
      {realtimeData && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      )}
    </div>
  );
}