"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
// Import only specific D3 functions to reduce bundle size
import {
  sum, mean, max, min, median, deviation,
  rollup, histogram, select,
  scaleBand, scaleLinear, scaleOrdinal, scaleSequential,
  axisBottom, axisLeft,
  pie, arc, line, area,
  schemeCategory10, interpolateBlues
} from "d3";
import { 
  Download,
  RefreshCw,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Award,
  Lightbulb,
  Zap,
  Eye,
  FileText,
  Image
} from "lucide-react";
import { Button } from "@/components/ui/Button";

// AI-powered dashboard generation using Gemini
const generateAIDashboard = async (data, structure) => {
  try {
    // Sample the data for AI analysis (first 100 rows to avoid token limits)
    const sampleData = data.slice(0, 100);
    const sampleRows = sampleData.map(row => 
      Object.entries(row).map(([key, value]) => `${key}: ${value}`).join(', ')
    ).slice(0, 10); // First 10 rows for context
    
    const prompt = `Based on this dataset, create a professional dashboard structure:

Dataset Info:
- Columns: ${structure.columns.join(', ')}
- Data Types: ${Object.entries(structure.types).map(([col, type]) => `${col}(${type})`).join(', ')}
- Sample Rows: ${sampleRows.join('\n')}
- Total Records: ${data.length}

Please create a professional dashboard with:
1. Dashboard Title (professional, business-like)
2. 3-4 Key Metrics (most important numbers with labels and icons)
3. 2-3 Chart Types (what visualizations would tell the story best)
4. Dashboard Story (what business insights this data reveals)
5. Recommended Layout (how to organize the dashboard)

Format as JSON:
{
  "title": "Professional Dashboard Title",
  "subtitle": "Brief description of what this dashboard shows",
  "keyMetrics": [
    {"label": "Metric Label", "value": "metric_value", "icon": "📊", "description": "What this metric means"}
  ],
  "charts": [
    {"type": "chart_type", "title": "Chart Title", "description": "What this chart shows", "dataColumns": ["col1", "col2"]}
  ],
  "story": "Business narrative this data tells",
  "layout": "How to organize the dashboard sections"
}`;

    // Call Gemini AI API
    const response = await fetch('/api/ai-dashboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, data: sampleData, structure })
    });

    if (!response.ok) {
      throw new Error('AI API call failed');
    }

    const aiResponse = await response.json();
    console.log('🤖 AI Dashboard Response:', aiResponse);
    
         // Calculate actual metric values based on the AI suggestions
     const calculatedMetrics = aiResponse.keyMetrics.map(metric => {
       // Try to calculate the actual value based on the metric label
       if (metric.label.toLowerCase().includes('total') && metric.label.toLowerCase().includes('records')) {
         return { ...metric, value: data.length };
       }
       
       // Look for numeric columns that match the metric
       const numericCols = Object.entries(structure.types)
         .filter(([col, type]) => type === 'numeric')
         .map(([col]) => col);
       
       if (numericCols.length > 0) {
         const firstNum = numericCols[0];
         const values = data.map(row => parseFloat(row[firstNum]) || 0).filter(v => !isNaN(v));
         
         if (values.length > 0) {
           if (metric.label.toLowerCase().includes('total') || metric.label.toLowerCase().includes('sum')) {
             return { ...metric, value: sum(values).toFixed(2) };
           } else if (metric.label.toLowerCase().includes('average') || metric.label.toLowerCase().includes('mean')) {
             return { ...metric, value: mean(values).toFixed(2) };
           } else if (metric.label.toLowerCase().includes('max')) {
             return { ...metric, value: max(values).toFixed(2) };
           } else if (metric.label.toLowerCase().includes('min')) {
             return { ...metric, value: min(values).toFixed(2) };
           }
         }
       }
       
       // Handle specific metric types with better fallbacks
       if (metric.label.toLowerCase().includes('quality')) {
         const quality = Math.round((data.filter(row => 
           Object.values(row).filter(v => v !== null && v !== '').length / Object.keys(structure.types).length > 0.8
         ).length / data.length) * 100);
         return { ...metric, value: `${quality}%` };
       }
       
       if (metric.label.toLowerCase().includes('countries') || metric.label.toLowerCase().includes('locations')) {
         const locationCol = Object.keys(structure.types).find(col => 
           col.toLowerCase().includes('country') || col.toLowerCase().includes('location') || col.toLowerCase().includes('city')
         );
         if (locationCol) {
           const uniqueLocations = new Set(data.map(row => row[locationCol]).filter(v => v && v !== ''));
           return { ...metric, value: uniqueLocations.size };
         }
       }
       
       if (metric.label.toLowerCase().includes('circuits')) {
         const circuitCol = Object.keys(structure.types).find(col => 
           col.toLowerCase().includes('circuit') || col.toLowerCase().includes('venue')
         );
         if (circuitCol) {
           const uniqueCircuits = new Set(data.map(row => row[circuitCol]).filter(v => v && v !== ''));
           return { ...metric, value: uniqueCircuits.size };
         }
       }
       
       // If we still don't have a value, provide a meaningful fallback
       if (!metric.value || metric.value === 'calculated_value') {
         if (metric.label.toLowerCase().includes('total')) {
           return { ...metric, value: data.length };
         } else if (metric.label.toLowerCase().includes('average')) {
           const numericCols = Object.entries(structure.types)
             .filter(([col, type]) => type === 'numeric')
             .map(([col]) => col);
           if (numericCols.length > 0) {
             const values = data.map(row => parseFloat(row[numericCols[0]]) || 0).filter(v => !isNaN(v));
             return { ...metric, value: values.length > 0 ? mean(values).toFixed(2) : 'N/A' };
           }
         }
         return { ...metric, value: 'N/A' };
       }
       
       return metric;
     });
    
    return {
      ...aiResponse,
      keyMetrics: calculatedMetrics
    };
  } catch (error) {
    console.error('AI Dashboard generation failed:', error);
    // Fallback to intelligent analysis
    return generateFallbackDashboard(data, structure);
  }
};

// Fallback dashboard generation
const generateFallbackDashboard = (data, structure) => {
  const { columns, types } = structure;
  const numericCols = columns.filter(col => types[col] === 'numeric');
  const categoricalCols = columns.filter(col => types[col] === 'text');
  
  // Generate smart key metrics
  const keyMetrics = [];
  
  if (numericCols.length > 0) {
    const firstNum = numericCols[0];
    const values = data.map(row => parseFloat(row[firstNum])).filter(v => !isNaN(v));
    if (values.length > 0) {
      keyMetrics.push({
        label: `Total ${firstNum.replace(/_/g, ' ')}`,
        value: sum(values).toFixed(2),
        icon: '💰',
        description: `Sum of all ${firstNum.replace(/_/g, ' ')} values`
      });
      
      keyMetrics.push({
        label: `Average ${firstNum.replace(/_/g, ' ')}`,
        value: mean(values).toFixed(2),
        icon: '📊',
        description: `Mean ${firstNum.replace(/_/g, ' ')} across all records`
      });
    }
  }
  
  // Add location-based metrics if available
  const locationCols = columns.filter(col => 
    col.toLowerCase().includes('country') || col.toLowerCase().includes('location') || 
    col.toLowerCase().includes('city') || col.toLowerCase().includes('region')
  );
  
  if (locationCols.length > 0) {
    const firstLoc = locationCols[0];
    const uniqueLocations = new Set(data.map(row => row[firstLoc]).filter(v => v && v !== ''));
    keyMetrics.push({
      label: `Unique ${firstLoc.replace(/_/g, ' ')}s`,
      value: uniqueLocations.size,
      icon: '🌍',
      description: `Number of distinct ${firstLoc.replace(/_/g, ' ')}s in the dataset`
    });
  }
  
  keyMetrics.push({
    label: 'Total Records',
    value: data.length,
    icon: '📈',
    description: 'Total number of data entries'
  });
  
  keyMetrics.push({
    label: 'Data Quality',
    value: `${Math.round((data.filter(row => 
      Object.values(row).filter(v => v !== null && v !== '').length / columns.length > 0.8
    ).length / data.length) * 100)}%`,
    icon: '⭐',
    description: 'Percentage of complete records'
  });
  
  // Determine chart types based on data
  const charts = [];
  
  if (numericCols.length > 0 && categoricalCols.length > 0) {
    charts.push({
      type: 'bar_chart',
      title: `${categoricalCols[0].replace(/_/g, ' ')} by ${numericCols[0].replace(/_/g, ' ')}`,
      description: `Distribution of ${numericCols[0]} across ${categoricalCols[0]} categories`,
      dataColumns: [categoricalCols[0], numericCols[0]]
    });
  }
  
  if (numericCols.length > 1) {
    charts.push({
      type: 'scatter_plot',
      title: `${numericCols[0].replace(/_/g, ' ')} vs ${numericCols[1].replace(/_/g, ' ')}`,
      description: `Relationship between ${numericCols[0]} and ${numericCols[1]}`,
      dataColumns: [numericCols[0], numericCols[1]]
    });
  }
  
  if (categoricalCols.length > 0) {
    charts.push({
      type: 'pie_chart',
      title: `${categoricalCols[0].replace(/_/g, ' ')} Distribution`,
      description: `Breakdown of ${categoricalCols[0]} categories`,
      dataColumns: [categoricalCols[0]]
    });
    
    // Add donut chart for variety
    if (categoricalCols.length > 1) {
      charts.push({
        type: 'donut_chart',
        title: `${categoricalCols[1].replace(/_/g, ' ')} Breakdown`,
        description: `Distribution of ${categoricalCols[1]} values`,
        dataColumns: [categoricalCols[1]]
      });
    }
  }
  
  // Add area chart if we have time-series data
  const timeCols = columns.filter(col => 
    col.toLowerCase().includes('date') || col.toLowerCase().includes('time') || 
    col.toLowerCase().includes('year') || col.toLowerCase().includes('month')
  );
  
  if (timeCols.length > 0 && numericCols.length > 0) {
    charts.push({
      type: 'area_chart',
      title: `${numericCols[0].replace(/_/g, ' ')} Over Time`,
      description: `Trend of ${numericCols[0]} across time periods`,
      dataColumns: [timeCols[0], numericCols[0]]
    });
  }
  
  return {
    title: "Data Intelligence Dashboard",
    subtitle: `Professional analysis of ${data.length} records`,
    keyMetrics,
    charts,
    story: `This dataset contains ${data.length} records with ${columns.length} different attributes. The data shows patterns and relationships that can drive business insights and decision-making.`,
    layout: "Key metrics at top, charts below in a grid layout, with insights at the bottom"
  };
};

const createRacingDashboard = (data, columns, types) => {
  // Find relevant columns
  const circuitCol = columns.find(col => col.toLowerCase().includes('circuit') || col.toLowerCase().includes('venue'));
  const timeCol = columns.find(col => col.toLowerCase().includes('date') || col.toLowerCase().includes('time') || col.toLowerCase().includes('year'));
  const performanceCol = columns.find(col => types[col] === 'numeric' && !col.toLowerCase().includes('id'));
  
  if (!circuitCol || !performanceCol) return null;
  
  // Circuit performance analysis
  const circuitPerformance = rollup(
    data,
    v => ({
      count: v.length,
      avgPerformance: mean(v, d => parseFloat(d[performanceCol]) || 0),
      totalPerformance: sum(v, d => parseFloat(d[performanceCol]) || 0)
    }),
    d => d[circuitCol]
  );
  
  const topCircuits = Array.from(circuitPerformance.entries())
    .sort((a, b) => b[1].avgPerformance - a[1].avgPerformance)
    .slice(0, 5);
  
  return {
    type: 'circuit_performance',
    title: 'Circuit Performance Analysis',
    data: {
      topCircuits,
      totalCircuits: circuitPerformance.size,
      avgPerformance: mean(data, d => parseFloat(d[performanceCol]) || 0)
    }
  };
};

const createGeographicDashboard = (data, columns, types) => {
  const locationCol = columns.find(col => 
    col.toLowerCase().includes('location') || col.toLowerCase().includes('city') || 
    col.toLowerCase().includes('country') || col.toLowerCase().includes('region')
  );
  
  if (!locationCol) return null;
  
  const locationDistribution = rollup(data, v => v.length, d => d[locationCol]);
  const topLocations = Array.from(locationDistribution.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  
  return {
    type: 'geographic_distribution',
    title: 'Geographic Distribution',
    data: {
      topLocations,
      totalLocations: locationDistribution.size,
      coverage: Math.round((topLocations.length / locationDistribution.size) * 100)
    }
  };
};

const createTemporalDashboard = (data, columns, types) => {
  const timeCol = columns.find(col => 
    col.toLowerCase().includes('date') || col.toLowerCase().includes('time') || 
    col.toLowerCase().includes('year') || col.toLowerCase().includes('month')
  );
  const performanceCol = columns.find(col => types[col] === 'numeric' && !col.toLowerCase().includes('id'));
  
  if (!timeCol || !performanceCol) return null;
  
  // Group by time period
  const timeGroups = rollup(
    data,
    v => mean(v, d => parseFloat(d[performanceCol]) || 0),
    d => {
      if (timeCol.toLowerCase().includes('year')) {
        return d[timeCol];
      } else if (timeCol.toLowerCase().includes('month')) {
        return `${d[timeCol]}`;
      } else {
        return d[timeCol];
      }
    }
  );
  
  const timeSeries = Array.from(timeGroups.entries())
    .sort((a, b) => a[0] - b[0]);
  
  return {
    type: 'temporal_trends',
    title: 'Performance Over Time',
    data: {
      timeSeries,
      trend: timeSeries.length > 1 ? 
        (timeSeries[timeSeries.length - 1][1] > timeSeries[0][1] ? 'increasing' : 'decreasing') : 'stable'
    }
  };
};

const createPerformanceDashboard = (data, columns, types) => {
  const numericCols = columns.filter(col => types[col] === 'numeric' && !col.toLowerCase().includes('id'));
  const categoricalCols = columns.filter(col => types[col] === 'text' && !col.toLowerCase().includes('id'));
  
  if (numericCols.length === 0) return null;
  
  // Analyze the first numeric column for distribution
  const firstNum = numericCols[0];
  const values = data.map(row => parseFloat(row[firstNum])).filter(v => !isNaN(v));
  
  if (values.length === 0) return null;
  
  // Create histogram data
  const min = Math.min(...values);
  const max = Math.max(...values);
  const histogram = histogram()
    .domain([min, max])
    .thresholds(10)(values);
  
  return {
    type: 'performance_distribution',
    title: `${firstNum.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Distribution`,
    data: {
      column: firstNum,
      values: values,
      histogram: histogram,
      stats: {
        min: min,
        max: max,
        mean: mean(values),
        median: median(values),
        std: deviation(values)
      }
    }
  };
};

const createGeneralDashboard = (data, columns, types) => {
  const numericCols = columns.filter(col => types[col] === 'numeric' && !col.toLowerCase().includes('id'));
  const categoricalCols = columns.filter(col => types[col] === 'text' && !col.toLowerCase().includes('id'));
  
  let insights = [];
  if (numericCols.length > 0) {
    const firstNum = numericCols[0];
    const values = data.map(row => parseFloat(row[firstNum])).filter(v => !isNaN(v));
    if (values.length > 0) {
      insights.push(`${firstNum.replace(/_/g, ' ')} ranges from ${Math.min(...values).toFixed(2)} to ${Math.max(...values).toFixed(2)}`);
    }
  }
  
  if (categoricalCols.length > 0) {
    const firstCat = categoricalCols[0];
    const uniqueValues = new Set(data.map(row => row[firstCat]));
    insights.push(`${firstCat.replace(/_/g, ' ')} has ${uniqueValues.size} unique categories`);
  }
  
  return {
    type: 'general_overview',
    title: 'Data Overview',
    data: { insights }
  };
};

export default function DataDashboard({ data, dataStructure, dataContext }) {
  const dashboardRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  // Process data intelligently with AI
  const processDataIntelligently = useCallback(async (rawData, structure) => {
    if (!rawData || !structure) return null;
    
    console.log('🔍 Processing data intelligently with AI:', {
      dataLength: rawData.length,
      columns: structure.columns,
      types: structure.types
    });
    
    try {
      // Try AI-powered dashboard generation first
      const aiDashboard = await generateAIDashboard(rawData, structure);
      console.log('🤖 AI Dashboard generated:', aiDashboard);
      
      return {
        ...aiDashboard,
        rawData,
        structure,
        isAI: true
      };
    } catch (error) {
      console.error('AI generation failed, using fallback:', error);
      // Fallback to intelligent analysis
      const fallbackDashboard = generateFallbackDashboard(rawData, structure);
      return {
        ...fallbackDashboard,
        rawData,
        structure,
        isAI: false
      };
    }
  }, []);

  // Get current theme
  const getCurrentTheme = useCallback(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'light';
  }, []);

  // Render dashboard header
  const renderDashboardHeader = useCallback((container, dashboardData) => {
    const theme = getCurrentTheme();
    const isDark = theme === 'dark';
    
    const header = container
      .append("div")
      .attr("class", "dashboard-header")
      .style("text-align", "center")
      .style("margin-bottom", "40px");

    header
      .append("h1")
      .style("font-size", "32px")
      .style("font-weight", "bold")
      .style("color", isDark ? "var(--dashboard-title-dark)" : "var(--dashboard-title-light)")
      .style("margin-bottom", "12px")
      .text(dashboardData.title || "Intelligent Data Dashboard");

    if (dashboardData.subtitle) {
      header
        .append("p")
        .style("font-size", "18px")
        .style("color", isDark ? "var(--dashboard-subtitle-dark)" : "var(--dashboard-subtitle-light)")
        .style("max-width", "600px")
        .style("margin", "0 auto")
        .text(dashboardData.subtitle);
    } else {
      header
        .append("p")
        .style("font-size", "18px")
        .style("color", isDark ? "var(--dashboard-subtitle-dark)" : "var(--dashboard-subtitle-light)")
        .style("max-width", "600px")
        .style("margin", "0 auto")
        .text(`AI-powered analysis of ${dashboardData.rawData.length} records`);
    }
  }, [getCurrentTheme]);

  // Render key metrics
  const renderKeyMetrics = useCallback((container, metrics) => {
    const theme = getCurrentTheme();
    const isDark = theme === 'dark';
    
    const metricsContainer = container
      .append("div")
      .attr("class", "key-metrics")
      .style("margin-bottom", "40px");

    metricsContainer
      .append("h2")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .style("color", isDark ? "var(--dashboard-title-dark)" : "var(--dashboard-title-light)")
      .style("margin-bottom", "20px")
      .text("🎯 Key Metrics");

    const metricsGrid = metricsContainer
      .append("div")
      .style("display", "grid")
      .style("grid-template-columns", "repeat(auto-fit, minmax(200px, 1fr))")
      .style("gap", "20px");

    metrics.forEach((metric) => {
      const card = metricsGrid
        .append("div")
        .attr("class", "metric-card")
        .style("background", isDark ? "var(--card-bg-dark)" : "var(--card-bg-light)")
        .style("border-radius", "12px")
        .style("padding", "20px")
        .style("box-shadow", isDark ? "var(--card-shadow-dark)" : "var(--card-shadow-light)")
        .style("border", `1px solid ${isDark ? "var(--card-border-dark)" : "var(--card-border-light)"}`)
        .style("text-align", "center")
        .style("transition", "transform 0.2s, box-shadow 0.2s")
        .style("cursor", "pointer")
        .style("min-height", "140px")
        .style("display", "flex")
        .style("flex-direction", "column")
        .style("justify-content", "center");

      card
        .on("mouseenter", function() {
          select(this)
            .style("transform", "translateY(-4px)")
            .style("box-shadow", isDark ? "var(--card-shadow-hover-dark)" : "var(--card-shadow-hover-light)");
        })
        .on("mouseleave", function() {
          select(this)
            .style("transform", "translateY(0)")
            .style("box-shadow", isDark ? "var(--card-shadow-dark)" : "var(--card-shadow-light)");
        });

      card
        .append("div")
        .style("font-size", "32px")
        .style("margin-bottom", "12px")
        .text(metric.icon);

      // Handle metric value display with better sizing
      const valueText = card
        .append("div")
        .attr("class", "metric-value")
        .style("font-weight", "bold")
        .style("color", isDark ? "var(--metric-value-dark)" : "var(--metric-value-light)")
        .style("margin-bottom", "8px")
        .style("word-break", "break-word")
        .style("overflow-wrap", "break-word");

      // Adjust font size based on value length and content
      const value = metric.value || '';
      if (typeof value === 'string' && value.length > 15) {
        valueText.style("font-size", "18px");
        // Add title for long values
        valueText.attr("title", value);
      } else if (typeof value === 'string' && value.length > 10) {
        valueText.style("font-size", "22px");
      } else {
        valueText.style("font-size", "28px");
      }
      
      valueText.text(value);

      card
        .append("div")
        .style("font-size", "14px")
        .style("color", isDark ? "var(--metric-label-dark)" : "var(--metric-label-light)")
        .style("font-weight", "500")
        .text(metric.label);

      // Add description if available
      if (metric.description) {
        card
          .append("div")
          .style("font-size", "12px")
          .style("color", isDark ? "var(--metric-label-dark)" : "var(--metric-label-light)")
          .style("margin-top", "8px")
          .style("opacity", "0.8")
          .text(metric.description);
      }
    });
  }, [getCurrentTheme]);

  // Render charts grid
  const renderChartsGrid = useCallback((container, charts, data) => {
    const theme = getCurrentTheme();
    const isDark = theme === 'dark';
    
    const chartsContainer = container
      .append("div")
      .attr("class", "charts-grid")
      .style("margin-bottom", "40px");

    chartsContainer
      .append("h2")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .style("color", isDark ? "var(--dashboard-title-dark)" : "var(--dashboard-title-light)")
      .style("margin-bottom", "20px")
      .text("📊 Data Visualizations");

    const chartsGrid = chartsContainer
      .append("div")
      .style("display", "grid")
      .style("grid-template-columns", "repeat(auto-fit, minmax(400px, 1fr))")
      .style("gap", "24px");

    charts.forEach((chart, index) => {
      const chartCard = chartsGrid
        .append("div")
        .attr("class", "chart-card")
        .style("background", isDark ? "var(--card-bg-dark)" : "var(--card-bg-light)")
        .style("border-radius", "12px")
        .style("padding", "20px")
        .style("box-shadow", isDark ? "var(--card-shadow-dark)" : "var(--card-shadow-light)")
        .style("border", `1px solid ${isDark ? "var(--card-border-dark)" : "var(--card-border-light)"}`);

      // Chart title
      chartCard
        .append("h3")
        .style("font-size", "18px")
        .style("font-weight", "600")
        .style("color", isDark ? "var(--dashboard-title-dark)" : "var(--dashboard-title-light)")
        .style("margin-bottom", "12px")
        .text(chart.title);

      // Chart description
      if (chart.description) {
        chartCard
          .append("p")
          .style("font-size", "14px")
          .style("color", isDark ? "var(--dashboard-subtitle-dark)" : "var(--dashboard-subtitle-light)")
          .style("margin-bottom", "20px")
          .text(chart.description);
      }

      // Render chart based on type
      if (chart.type === 'bar_chart') {
        renderBarChart(chartCard, chart, data);
      } else if (chart.type === 'pie_chart') {
        renderPieChart(chartCard, chart, data);
      } else if (chart.type === 'line_chart') {
        renderLineChart(chartCard, chart, data);
      } else if (chart.type === 'scatter_plot') {
        renderScatterPlot(chartCard, chart, data);
      } else if (chart.type === 'area_chart') {
        renderAreaChart(chartCard, chart, data);
      } else if (chart.type === 'donut_chart') {
        renderDonutChart(chartCard, chart, data);
      } else if (chart.type === 'horizontal_bar') {
        renderHorizontalBarChart(chartCard, chart, data);
      } else if (chart.type === 'bubble_chart') {
        renderBubbleChart(chartCard, chart, data);
      } else if (chart.type === 'heatmap') {
        renderHeatmap(chartCard, chart, data);
      } else {
        // Default to bar chart
        renderBarChart(chartCard, chart, data);
      }
    });
  }, [getCurrentTheme]);

  // Render dashboard story
  const renderDashboardStory = useCallback((container, story) => {
    const theme = getCurrentTheme();
    const isDark = theme === 'dark';
    
    const storyContainer = container
      .append("div")
      .attr("class", "dashboard-story")
      .style("margin-bottom", "40px");

    storyContainer
      .append("h2")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .style("color", isDark ? "var(--dashboard-title-dark)" : "var(--dashboard-title-light)")
      .style("margin-bottom", "20px")
      .text("📖 Dashboard Story");

    storyContainer
      .append("div")
      .style("background", isDark ? "var(--insight-bg-dark)" : "var(--insight-border-dark)")
      .style("border-radius", "12px")
      .style("padding", "24px")
      .style("border", `1px solid ${isDark ? "var(--insight-border-dark)" : "var(--insight-border-light)"}`)
      .style("font-size", "16px")
      .style("line-height", "1.6")
      .style("color", isDark ? "var(--insight-text-dark)" : "var(--insight-text-light)")
      .text(story);
  }, [getCurrentTheme]);

  // Render AI badge
  const renderAIBadge = useCallback((container) => {
    const badge = container
      .append("div")
      .attr("class", "ai-badge")
      .style("position", "fixed")
      .style("top", "20px")
      .style("right", "20px")
      .style("background", "linear-gradient(135deg, #667eea 0%, #764ba2 100%)")
      .style("color", "white")
      .style("padding", "8px 16px")
      .style("border-radius", "20px")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .style("box-shadow", "0 4px 12px rgba(0,0,0,0.15)")
      .style("z-index", "1000");

    badge.text("🤖 AI Generated");
  }, []);

  // Render the intelligent unified dashboard
  const renderIntelligentDashboard = useCallback((dashboardData) => {
    if (!dashboardData || !dashboardRef.current) return;

    const container = select(dashboardRef.current);
    container.selectAll("*").remove();

    const theme = getCurrentTheme();
    const isDark = theme === 'dark';

    const dashboard = container
      .append("div")
      .attr("class", "intelligent-dashboard")
      .style("padding", "20px")
      .style("background", isDark ? "var(--dashboard-bg-dark)" : "var(--dashboard-bg-light)")
      .style("color", isDark ? "var(--dashboard-text-dark)" : "var(--dashboard-text-light)");

    // Dashboard Header
    renderDashboardHeader(dashboard, dashboardData);

    // Key Metrics
    renderKeyMetrics(dashboard, dashboardData.keyMetrics);

    // Charts Grid
    if (dashboardData.charts && dashboardData.charts.length > 0) {
      renderChartsGrid(dashboard, dashboardData.charts, dashboardData.rawData);
    }

    // Dashboard Story
    if (dashboardData.story) {
      renderDashboardStory(dashboard, dashboardData.story);
    }

    // AI Badge if AI-generated
    if (dashboardData.isAI) {
      renderAIBadge(dashboard);
    }
  }, [getCurrentTheme, renderDashboardHeader, renderKeyMetrics, renderChartsGrid, renderDashboardStory, renderAIBadge]);

  // Initialize dashboard when data changes
  useEffect(() => {
    if (data && dataStructure && dashboardRef.current) {
      setIsLoading(true);
      
      processDataIntelligently(data, dataStructure).then(processed => {
        if (processed) {
          setDashboardData(processed);
          
          setTimeout(() => {
            renderIntelligentDashboard(processed);
            setIsLoading(false);
          }, 100);
        } else {
          setIsLoading(false);
        }
      }).catch(error => {
        console.error('Dashboard processing failed:', error);
        setIsLoading(false);
      });
    }
  }, [data, dataStructure, processDataIntelligently, renderIntelligentDashboard]);

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      if (dashboardData && dashboardRef.current) {
        renderIntelligentDashboard(dashboardData);
      }
    };

    // Create a mutation observer to watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          handleThemeChange();
        }
      });
    });

    if (typeof document !== 'undefined') {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
    }

    return () => observer.disconnect();
  }, [dashboardData, renderIntelligentDashboard]);

  // Chart rendering functions
  const renderBarChart = (container, chart, data) => {
    const theme = getCurrentTheme();
    const isDark = theme === 'dark';
    
    const width = 400;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };

    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("display", "block")
      .style("margin", "0 auto")
      .style("background", isDark ? "var(--chart-bg-dark)" : "var(--chart-bg-light)")
      .style("border-radius", "8px");

    // Process data for bar chart
    const [catCol, numCol] = chart.dataColumns;
    const chartData = rollup(data, v => sum(v, d => parseFloat(d[numCol]) || 0), d => d[catCol]);
    const chartDataArray = Array.from(chartData.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8); // Top 8 categories

    if (chartDataArray.length === 0) {
      container.append("p").text("No data available for chart");
      return;
    }

    const x = scaleBand()
      .domain(chartDataArray.map(d => d[0]))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = scaleLinear()
      .domain([0, max(chartDataArray, d => d[1])])
      .range([height - margin.bottom, margin.top]);

    // Render bars
    svg.selectAll("rect")
      .data(chartDataArray)
      .enter()
      .append("rect")
      .attr("x", d => x(d[0]))
      .attr("y", d => y(d[1]))
      .attr("width", x.bandwidth())
      .attr("height", d => height - margin.bottom - y(d[1]))
      .attr("fill", isDark ? "var(--chart-primary-dark)" : "var(--chart-primary-light)")
      .attr("opacity", 0.8);

    // Add axes
    const xAxis = axisBottom(x);
    const yAxis = axisLeft(y);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)")
      .style("fill", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)")
      .style("font-size", "10px");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .style("color", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)");
  };

  const renderPieChart = (container, chart, data) => {
    const theme = getCurrentTheme();
    const isDark = theme === 'dark';
    
    const width = 400;
    const height = 250;
    const radius = Math.min(width, height) / 2 - 40;

    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("display", "block")
      .style("margin", "0 auto")
      .style("background", isDark ? "var(--chart-bg-dark)" : "var(--chart-bg-light)")
      .style("border-radius", "8px");

    const g = svg.append("g")
      .attr("transform", `translate(${width/2},${height/2})`);

    // Process data for pie chart
    const [catCol] = chart.dataColumns;
    const chartData = rollup(data, v => v.length, d => d[catCol]);
    const chartDataArray = Array.from(chartData.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6); // Top 6 categories

    if (chartDataArray.length === 0) {
      container.append("p").text("No data available for chart");
      return;
    }

    const pie = pie().value(d => d[1]);
    const arc = arc().innerRadius(0).outerRadius(radius);

    const color = scaleOrdinal()
      .domain(chartDataArray.map(d => d[0]))
      .range(schemeCategory10);

    // Render pie slices
    g.selectAll("path")
      .data(pie(chartDataArray))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data[0]))
      .attr("stroke", isDark ? "var(--chart-bg-dark)" : "var(--chart-bg-light)")
      .style("stroke-width", "2px");

    // Add labels
    g.selectAll("text")
      .data(pie(chartDataArray))
      .enter()
      .append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)")
      .text(d => d.data[0].substring(0, 15) + (d.data[0].length > 15 ? '...' : ''));
  };

  const renderLineChart = (container, chart, data) => {
    const theme = getCurrentTheme();
    const isDark = theme === 'dark';
    
    const width = 400;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };

    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("display", "block")
      .style("margin", "0 auto")
      .style("background", isDark ? "var(--chart-bg-dark)" : "var(--chart-bg-light)")
      .style("border-radius", "8px");

    // Process data for line chart
    const [timeCol, numCol] = chart.dataColumns;
    const chartData = rollup(data, v => mean(v, d => parseFloat(d[numCol]) || 0), d => d[timeCol]);
    const chartDataArray = Array.from(chartData.entries())
      .sort((a, b) => a[0] - b[0]);

    if (chartDataArray.length === 0) {
      container.append("p").text("No data available for chart");
      return;
    }

    const x = scaleBand()
      .domain(chartDataArray.map(d => d[0]))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = scaleLinear()
      .domain([0, max(chartDataArray, d => d[1])])
      .range([height - margin.bottom, margin.top]);

    // Create line
    const line = line()
      .x(d => x(d[0]) + x.bandwidth() / 2)
      .y(d => y(d[1]));

    // Render line
    svg.append("path")
      .datum(chartDataArray)
      .attr("fill", "none")
      .attr("stroke", isDark ? "var(--chart-accent-dark)" : "var(--chart-accent-light)")
      .attr("stroke-width", 3)
      .attr("d", line);

    // Add axes
    const xAxis = axisBottom(x);
    const yAxis = axisLeft(y);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)")
      .style("fill", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)")
      .style("font-size", "10px");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .style("color", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)");
  };

  const renderScatterPlot = (container, chart, data) => {
    const theme = getCurrentTheme();
    const isDark = theme === 'dark';
    
    const width = 400;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };

    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("display", "block")
      .style("margin", "0 auto")
      .style("background", isDark ? "var(--chart-bg-dark)" : "var(--chart-bg-light)")
      .style("border-radius", "8px");

    // Process data for scatter plot
    const [xCol, yCol] = chart.dataColumns;
    const chartData = data
      .map(row => ({
        x: parseFloat(row[xCol]) || 0,
        y: parseFloat(row[yCol]) || 0
      }))
      .filter(d => !isNaN(d.x) && !isNaN(d.y))
      .slice(0, 100); // Limit to 100 points for performance

    if (chartData.length === 0) {
      container.append("p").text("No data available for chart");
      return;
    }

    const x = scaleLinear()
      .domain([0, max(chartData, d => d.x)])
      .range([margin.left, width - margin.right]);

    const y = scaleLinear()
      .domain([0, max(chartData, d => d.y)])
      .range([height - margin.bottom, margin.top]);

    // Render points
    svg.selectAll("circle")
      .data(chartData)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.x))
      .attr("cy", d => y(d.y))
      .attr("r", 3)
      .attr("fill", isDark ? "var(--chart-primary-dark)" : "var(--chart-primary-light)")
      .attr("opacity", 0.6);

    // Add axes
    const xAxis = axisBottom(x);
    const yAxis = axisLeft(y);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .style("color", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .style("color", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)");
  };

  // Additional chart types
  const renderAreaChart = (container, chart, data) => {
    const theme = getCurrentTheme();
    const isDark = theme === 'dark';
    
    const width = 400;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };

    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("display", "block")
      .style("margin", "0 auto")
      .style("background", isDark ? "var(--chart-bg-dark)" : "var(--chart-bg-light)")
      .style("border-radius", "8px");

    // Process data for area chart
    const [timeCol, numCol] = chart.dataColumns;
    const chartData = rollup(data, v => sum(v, d => parseFloat(d[numCol]) || 0), d => d[timeCol]);
    const chartDataArray = Array.from(chartData.entries())
      .sort((a, b) => a[0] - b[0]);

    if (chartDataArray.length === 0) {
      container.append("p").text("No data available for chart");
      return;
    }

    const x = scaleBand()
      .domain(chartDataArray.map(d => d[0]))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = scaleLinear()
      .domain([0, max(chartDataArray, d => d[1])])
      .range([height - margin.bottom, margin.top]);

    // Create area
    const area = area()
      .x(d => x(d[0]) + x.bandwidth() / 2)
      .y0(height - margin.bottom)
      .y1(d => y(d[1]));

    // Render area
    svg.append("path")
      .datum(chartDataArray)
      .attr("fill", isDark ? "var(--chart-primary-dark)" : "var(--chart-primary-light)")
      .attr("opacity", 0.3)
      .attr("d", area);

    // Render line on top
    const line = line()
      .x(d => x(d[0]) + x.bandwidth() / 2)
      .y(d => y(d[1]));

    svg.append("path")
      .datum(chartDataArray)
      .attr("fill", "none")
      .attr("stroke", isDark ? "var(--chart-primary-dark)" : "var(--chart-primary-light)")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add axes
    const xAxis = axisBottom(x);
    const yAxis = axisLeft(y);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)")
      .style("fill", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)")
      .style("font-size", "10px");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .style("color", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)");
  };

  const renderDonutChart = (container, chart, data) => {
    const theme = getCurrentTheme();
    const isDark = theme === 'dark';
    
    const width = 400;
    const height = 250;
    const radius = Math.min(width, height) / 2 - 40;
    const innerRadius = radius * 0.6;

    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("display", "block")
      .style("margin", "0 auto")
      .style("background", isDark ? "var(--chart-bg-dark)" : "var(--chart-bg-light)")
      .style("border-radius", "8px");

    const g = svg.append("g")
      .attr("transform", `translate(${width/2},${height/2})`);

    // Process data for donut chart
    const [catCol] = chart.dataColumns;
    const chartData = rollup(data, v => v.length, d => d[catCol]);
    const chartDataArray = Array.from(chartData.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    if (chartDataArray.length === 0) {
      container.append("p").text("No data available for chart");
      return;
    }

    const pie = pie().value(d => d[1]);
    const arc = arc().innerRadius(innerRadius).outerRadius(radius);

    const color = scaleOrdinal()
      .domain(chartDataArray.map(d => d[0]))
      .range(schemeCategory10);

    // Render donut slices
    g.selectAll("path")
      .data(pie(chartDataArray))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data[0]))
      .attr("stroke", isDark ? "var(--chart-bg-dark)" : "var(--chart-bg-light)")
      .style("stroke-width", "2px");

    // Add center text
    const total = sum(chartDataArray, d => d[1]);
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)")
      .text(total);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .style("font-size", "12px")
      .style("fill", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)")
      .text("Total");
  };

  const renderHorizontalBarChart = (container, chart, data) => {
    const theme = getCurrentTheme();
    const isDark = theme === 'dark';
    
    const width = 400;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 60, left: 80 };

    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("display", "block")
      .style("margin", "0 auto")
      .style("background", isDark ? "var(--chart-bg-dark)" : "var(--chart-bg-light)")
      .style("border-radius", "8px");

    // Process data for horizontal bar chart
    const [catCol, numCol] = chart.dataColumns;
    const chartData = rollup(data, v => sum(v, d => parseFloat(d[numCol]) || 0), d => d[catCol]);
    const chartDataArray = Array.from(chartData.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    if (chartDataArray.length === 0) {
      container.append("p").text("No data available for chart");
      return;
    }

    const y = scaleBand()
      .domain(chartDataArray.map(d => d[0]))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    const x = scaleLinear()
      .domain([0, max(chartDataArray, d => d[1])])
      .range([margin.left, width - margin.right]);

    // Render bars
    svg.selectAll("rect")
      .data(chartDataArray)
      .enter()
      .append("rect")
      .attr("x", margin.left)
      .attr("y", d => y(d[0]))
      .attr("width", d => x(d[1]) - margin.left)
      .attr("height", y.bandwidth())
      .attr("fill", isDark ? "var(--chart-primary-dark)" : "var(--chart-primary-light)")
      .attr("opacity", 0.8);

    // Add axes
    const xAxis = axisBottom(x);
    const yAxis = axisLeft(y);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .style("color", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .style("color", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)");
  };

  const renderBubbleChart = (container, chart, data) => {
    const theme = getCurrentTheme();
    const isDark = theme === 'dark';
    
    const width = 400;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };

    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("display", "block")
      .style("margin", "0 auto")
      .style("background", isDark ? "var(--chart-bg-dark)" : "var(--chart-bg-light)")
      .style("border-radius", "8px");

    // Process data for bubble chart (x, y, size)
    const [xCol, yCol, sizeCol] = chart.dataColumns;
    const chartData = data
      .map(row => ({
        x: parseFloat(row[xCol]) || 0,
        y: parseFloat(row[yCol]) || 0,
        size: parseFloat(row[sizeCol]) || 1
      }))
      .filter(d => !isNaN(d.x) && !isNaN(d.y) && !isNaN(d.size))
      .slice(0, 50);

    if (chartData.length === 0) {
      container.append("p").text("No data available for chart");
      return;
    }

    const x = scaleLinear()
      .domain([0, max(chartData, d => d.x)])
      .range([margin.left, width - margin.right]);

    const y = scaleLinear()
      .domain([0, max(chartData, d => d.y)])
      .range([height - margin.bottom, margin.top]);

    const size = scaleLinear()
      .domain([0, max(chartData, d => d.size)])
      .range([3, 15]);

    // Render bubbles
    svg.selectAll("circle")
      .data(chartData)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.x))
      .attr("cy", d => y(d.y))
      .attr("r", d => size(d.size))
      .attr("fill", isDark ? "var(--chart-primary-dark)" : "var(--chart-primary-light)")
      .attr("opacity", 0.6)
      .attr("stroke", isDark ? "var(--chart-bg-dark)" : "var(--chart-bg-light)")
      .style("stroke-width", "1px");

    // Add axes
    const xAxis = axisBottom(x);
    const yAxis = axisLeft(y);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .style("color", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .style("color", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)");
  };

  const renderHeatmap = (container, chart, data) => {
    const theme = getCurrentTheme();
    const isDark = theme === 'dark';
    
    const width = 400;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 60, left: 80 };

    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("display", "block")
      .style("margin", "0 auto")
      .style("background", isDark ? "var(--chart-bg-dark)" : "var(--chart-bg-light)")
      .style("border-radius", "8px");

    // Process data for heatmap (x, y, value)
    const [xCol, yCol, valueCol] = chart.dataColumns;
    const chartData = rollup(
      data,
      v => mean(v, d => parseFloat(d[valueCol]) || 0),
      d => d[xCol],
      d => d[yCol]
    );

    if (chartData.size === 0) {
      container.append("p").text("No data available for chart");
      return;
    }

    const xCategories = Array.from(chartData.keys());
    const yCategories = Array.from(chartData.get(xCategories[0]).keys());
    
    const x = scaleBand()
      .domain(xCategories)
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = scaleBand()
      .domain(yCategories)
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    const color = scaleSequential()
      .domain([0, max(Array.from(chartData.values()).flatMap(m => Array.from(m.values())))])
      .interpolator(interpolateBlues);

    // Render heatmap cells
    xCategories.forEach(xCat => {
      yCategories.forEach(yCat => {
        const value = chartData.get(xCat).get(yCat) || 0;
        svg.append("rect")
          .attr("x", x(xCat))
          .attr("y", y(yCat))
          .attr("width", x.bandwidth())
          .attr("height", y.bandwidth())
          .attr("fill", color(value))
          .attr("stroke", isDark ? "var(--chart-bg-dark)" : "var(--chart-bg-light)")
          .style("stroke-width", "1px");
      });
    });

    // Add axes
    const xAxis = axisBottom(x);
    const yAxis = axisLeft(y);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)")
      .style("fill", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)")
      .style("font-size", "10px");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .style("color", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)");
  };

  // Render main visualization
  const renderMainVisualization = (container, visualization) => {
    const theme = getCurrentTheme();
    const isDark = theme === 'dark';
    
    const vizContainer = container
      .append("div")
      .attr("class", "main-visualization")
      .style("margin-bottom", "40px");

    vizContainer
      .append("h2")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .style("color", isDark ? "var(--dashboard-title-dark)" : "var(--dashboard-title-light)")
      .style("margin-bottom", "20px")
      .text(visualization.title);

    if (visualization.type === 'circuit_performance') {
      renderCircuitPerformance(vizContainer, visualization.data);
    } else if (visualization.type === 'geographic_distribution') {
      renderGeographicDistribution(vizContainer, visualization.data);
    } else if (visualization.type === 'temporal_trends') {
      renderTemporalTrends(vizContainer, visualization.data);
    } else if (visualization.type === 'performance_distribution') {
      renderPerformanceDistribution(vizContainer, visualization.data);
    } else {
      renderGeneralOverview(vizContainer, visualization.data);
    }
  };

  // Render circuit performance
  const renderCircuitPerformance = (container, data) => {
    const theme = getCurrentTheme();
    const isDark = theme === 'dark';
    
    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };

    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("display", "block")
      .style("margin", "0 auto")
      .style("background", isDark ? "var(--chart-bg-dark)" : "var(--chart-bg-light)")
      .style("border-radius", "8px");

    const x = scaleBand()
      .domain(data.topCircuits.map(d => d[0]))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = scaleLinear()
      .domain([0, max(data.topCircuits, d => d[1].avgPerformance)])
      .range([height - margin.bottom, margin.top]);

    // Render bars
    svg.selectAll("rect")
      .data(data.topCircuits)
      .enter()
      .append("rect")
      .attr("x", d => x(d[0]))
      .attr("y", d => y(d[1].avgPerformance))
      .attr("width", x.bandwidth())
      .attr("height", d => height - margin.bottom - y(d[1].avgPerformance))
      .attr("fill", isDark ? "var(--chart-primary-dark)" : "var(--chart-primary-light)")
      .attr("opacity", 0.8);

    // Add axes
    const xAxis = axisBottom(x);
    const yAxis = axisLeft(y);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)")
      .style("fill", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .style("color", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)");

    // Add labels
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .style("text-anchor", "middle")
      .style("fill", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)")
      .style("font-size", "14px")
      .text("Circuit");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 20)
      .style("text-anchor", "middle")
      .style("fill", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)")
      .style("font-size", "14px")
      .text("Average Performance");

    // Add summary stats
    const summaryContainer = container
      .append("div")
      .style("margin-top", "20px")
      .style("display", "grid")
      .style("grid-template-columns", "repeat(auto-fit, minmax(150px, 1fr))")
      .style("gap", "16px");

    const stats = [
      { label: "Total Circuits", value: data.totalCircuits, icon: "🏁" },
      { label: "Avg Performance", value: data.avgPerformance.toFixed(2), icon: "📊" },
      { label: "Top Performer", value: data.topCircuits[0]?.[0] || "N/A", icon: "🥇" }
    ];

    stats.forEach(stat => {
      const statItem = summaryContainer
        .append("div")
        .style("text-align", "center")
        .style("padding", "16px")
        .style("background", isDark ? "var(--stat-bg-dark)" : "var(--stat-bg-light)")
        .style("border-radius", "8px")
        .style("border", `1px solid ${isDark ? "var(--stat-border-dark)" : "var(--stat-border-light)"}`);

      statItem
        .append("div")
        .style("font-size", "24px")
        .style("margin-bottom", "8px")
        .text(stat.icon);

      statItem
        .append("div")
        .style("font-size", "16px")
        .style("font-weight", "600")
        .style("color", "var(--stat-value)")
        .text(stat.value);

      statItem
        .append("div")
        .style("font-size", "12px")
        .style("color", "var(--stat-label)")
        .text(stat.label);
    });
  };

  // Render geographic distribution
  const renderGeographicDistribution = (container, data) => {
    const width = 500;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 60, left: 120 };

    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("display", "block")
      .style("margin", "0 auto")
      .style("background", "var(--chart-bg)")
      .style("border-radius", "8px");

    const x = scaleLinear()
      .domain([0, max(data.topLocations, d => d[1])])
      .range([margin.left, width - margin.right]);

    const y = scaleBand()
      .domain(data.topLocations.map(d => d[0]))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    // Render bars
    svg.selectAll("rect")
      .data(data.topLocations)
      .enter()
      .append("rect")
      .attr("x", margin.left)
      .attr("y", d => y(d[0]))
      .attr("width", d => x(d[1]) - margin.left)
      .attr("height", y.bandwidth())
      .attr("fill", "var(--chart-secondary)")
      .attr("opacity", 0.8);

    // Add axes
    const xAxis = axisBottom(x);
    const yAxis = axisLeft(y);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .style("color", "var(--chart-text)");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .style("color", "var(--chart-text)");

    // Add labels
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .style("text-anchor", "middle")
      .style("fill", "var(--chart-text)")
      .style("font-size", "14px")
      .text("Count");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 20)
      .style("text-anchor", "middle")
      .style("fill", "var(--chart-text)")
      .style("font-size", "14px")
      .text("Location");
  };

  // Render temporal trends
  const renderTemporalTrends = (container, data) => {
    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };

    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("display", "block")
      .style("margin", "0 auto")
      .style("background", "var(--chart-bg)")
      .style("border-radius", "8px");

    const x = scaleBand()
      .domain(data.timeSeries.map(d => d[0]))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = scaleLinear()
      .domain([0, max(data.timeSeries, d => d[1])])
      .range([height - margin.bottom, margin.top]);

    // Create line
    const line = line()
      .x(d => x(d[0]) + x.bandwidth() / 2)
      .y(d => y(d[1]));

    // Render line
    svg.append("path")
      .datum(data.timeSeries)
      .attr("fill", "none")
      .attr("stroke", "var(--chart-accent)")
      .attr("stroke-width", 3)
      .attr("d", line);

    // Render points
    svg.selectAll("circle")
      .data(data.timeSeries)
      .enter()
      .append("circle")
      .attr("cx", d => x(d[0]) + x.bandwidth() / 2)
      .attr("cy", d => y(d[1]))
      .attr("r", 4)
      .attr("fill", "var(--chart-accent)");

    // Add axes
    const xAxis = axisBottom(x);
    const yAxis = axisLeft(y);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .style("color", "var(--chart-text)");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .style("color", "var(--chart-text)");

    // Add trend indicator
    if (data.trend !== 'stable') {
      container
        .append("div")
        .style("margin-top", "16px")
        .style("text-align", "center")
        .style("padding", "12px")
        .style("background", data.trend === 'increasing' ? "var(--trend-positive)" : "var(--trend-negative)")
        .style("border-radius", "8px")
        .style("color", "white")
        .style("font-weight", "600")
        .text(`Trend: ${data.trend} performance`);
    }
  };

  // Render performance distribution
  const renderPerformanceDistribution = (container, data) => {
    const theme = getCurrentTheme();
    const isDark = theme === 'dark';
    
    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };

    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("display", "block")
      .style("margin", "0 auto")
      .style("background", isDark ? "var(--chart-bg-dark)" : "var(--chart-bg-light)")
      .style("border-radius", "8px");

    const x = scaleLinear()
      .domain([data.stats.min, data.stats.max])
      .range([margin.left, width - margin.right]);

    const y = scaleLinear()
      .domain([0, max(data.histogram, d => d.length)])
      .range([height - margin.bottom, margin.top]);

    // Render histogram bars
    svg.selectAll("rect")
      .data(data.histogram)
      .enter()
      .append("rect")
      .attr("x", d => x(d.x0))
      .attr("y", d => y(d.length))
      .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
      .attr("height", d => height - margin.bottom - y(d.length))
      .attr("fill", isDark ? "var(--chart-primary-dark)" : "var(--chart-primary-light)")
      .attr("opacity", 0.8);

    // Add axes
    const xAxis = axisBottom(x);
    const yAxis = axisLeft(y);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .style("color", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .style("color", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)");

    // Add labels
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .style("text-anchor", "middle")
      .style("fill", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)")
      .style("font-size", "14px")
      .text(data.column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 20)
      .style("text-anchor", "middle")
      .style("fill", isDark ? "var(--chart-text-dark)" : "var(--chart-text-light)")
      .style("font-size", "14px")
      .text("Frequency");

    // Add summary stats
    const summaryContainer = container
      .append("div")
      .style("margin-top", "20px")
      .style("display", "grid")
      .style("grid-template-columns", "repeat(auto-fit, minmax(150px, 1fr))")
      .style("gap", "16px");

    const stats = [
      { label: "Mean", value: data.stats.mean.toFixed(2), icon: "📊" },
      { label: "Median", value: data.stats.median.toFixed(2), icon: "📈" },
      { label: "Min", value: data.stats.min.toFixed(2), icon: "📉" },
      { label: "Max", value: data.stats.max.toFixed(2), icon: "📊" }
    ];

    stats.forEach(stat => {
      const statItem = summaryContainer
        .append("div")
        .style("text-align", "center")
        .style("padding", "16px")
        .style("background", isDark ? "var(--stat-bg-dark)" : "var(--stat-bg-light)")
        .style("border-radius", "8px")
        .style("border", `1px solid ${isDark ? "var(--stat-border-dark)" : "var(--stat-border-light)"}`);

      statItem
        .append("div")
        .style("font-size", "24px")
        .style("margin-bottom", "8px")
        .text(stat.icon);

      statItem
        .append("div")
        .style("font-size", "16px")
        .style("font-weight", "600")
        .style("color", isDark ? "var(--stat-value-dark)" : "var(--stat-value-light)")
        .text(stat.value);

      statItem
        .append("div")
        .style("font-size", "12px")
        .style("color", isDark ? "var(--stat-label-dark)" : "var(--stat-label-light)")
        .text(stat.label);
    });
  };

  // Render general overview
  const renderGeneralOverview = (container, data) => {
    const theme = getCurrentTheme();
    const isDark = theme === 'dark';
    
    const insightsContainer = container
      .append("div")
      .style("background", isDark ? "var(--insight-bg-dark)" : "var(--insight-bg-light)")
      .style("border-radius", "12px")
      .style("padding", "24px")
      .style("border", `1px solid ${isDark ? "var(--insight-border-dark)" : "var(--insight-border-light)"}`);

    insightsContainer
      .append("h3")
      .style("font-size", "18px")
      .style("font-weight", "600")
      .style("color", isDark ? "var(--dashboard-title-dark)" : "var(--dashboard-title-light)")
      .style("margin-bottom", "16px")
      .text("📋 Data Overview");

    data.insights.forEach(insight => {
      insightsContainer
        .append("div")
        .style("background", isDark ? "var(--insight-item-bg-dark)" : "var(--insight-item-bg-light)")
        .style("border-radius", "8px")
        .style("padding", "12px")
        .style("margin-bottom", "8px")
        .style("font-size", "14px")
        .style("color", isDark ? "var(--insight-text-dark)" : "var(--insight-text-light)")
        .style("border-left", `4px solid ${isDark ? "var(--insight-accent-dark)" : "var(--insight-accent-light)"}`)
        .text(insight);
    });
  };

  // Render insights
  const renderInsights = (container, insights) => {
    const insightsContainer = container
      .append("div")
      .attr("class", "ai-insights")
      .style("background", "var(--insight-gradient)")
      .style("border-radius", "16px")
      .style("padding", "24px")
      .style("margin-bottom", "30px")
      .style("color", "white")
      .style("box-shadow", "var(--insight-shadow)");

    insightsContainer
      .append("h3")
      .style("font-size", "20px")
      .style("font-weight", "bold")
      .style("margin-bottom", "16px")
      .style("display", "flex")
      .style("align-items", "center")
      .style("gap", "12px")
      .html("🤖 AI Insights");

    insights.forEach(insight => {
      insightsContainer
        .append("div")
        .style("background", "rgba(255, 255, 255, 0.1)")
        .style("border-radius", "8px")
        .style("padding", "12px")
        .style("margin-bottom", "8px")
        .style("font-size", "14px")
        .style("border-left", "4px solid rgba(255, 255, 255, 0.3)")
        .text(insight);
    });
  };

  // Export dashboard
  const exportDashboard = () => {
    if (!dashboardRef.current) return;
    
    const dashboardHTML = dashboardRef.current.innerHTML;
    const blob = new Blob([dashboardHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'intelligent_dashboard.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export dashboard as PNG
  const exportDashboardAsPNG = async () => {
    try {
      // Dynamically import html2canvas to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default;
      
      // Get the dashboard element and ensure it has proper dimensions
      const dashboardElement = dashboardRef.current;
      if (!dashboardElement) {
        throw new Error('Dashboard element not found');
      }

      // Force a reflow to ensure all styles are computed
      dashboardElement.offsetHeight;
      
      const canvas = await html2canvas(dashboardElement, {
        backgroundColor: null, // Use transparent background to capture actual colors
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        width: dashboardElement.scrollWidth || dashboardElement.offsetWidth,
        height: dashboardElement.scrollHeight || dashboardElement.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: dashboardElement.scrollWidth || dashboardElement.offsetWidth,
        windowHeight: dashboardElement.scrollHeight || dashboardElement.offsetHeight,
        // Ensure background is captured properly
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('.dashboard-content');
          if (clonedElement) {
            // Force the cloned element to have full background coverage
            const computedStyle = getComputedStyle(dashboardElement);
            clonedElement.style.backgroundColor = computedStyle.backgroundColor;
            clonedElement.style.color = computedStyle.color;
            clonedElement.style.width = '100%';
            clonedElement.style.minWidth = '100%';
            clonedElement.style.maxWidth = 'none';
            
            // Ensure all child elements also have full width
            const allChildren = clonedElement.querySelectorAll('*');
            allChildren.forEach(child => {
              if (child.style) {
                child.style.maxWidth = 'none';
                child.style.width = '100%';
              }
            });
          }
        }
      });
      
      const link = document.createElement('a');
      link.download = 'intelligent_dashboard.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      
    } catch (error) {
      console.error('Error exporting as PNG:', error);
      alert('Failed to export as PNG. Please try again.');
    }
  };

  // Export menu state
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExportMenu && !event.target.closest('.export-dropdown')) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportMenu]);

  // Refresh dashboard
  const refreshDashboard = () => {
    if (data && dataStructure) {
      setIsLoading(true);
      
      processDataIntelligently(data, dataStructure).then(processed => {
        if (processed) {
          renderIntelligentDashboard(processed);
        }
        setIsLoading(false);
      }).catch(error => {
        console.error('Dashboard refresh failed:', error);
        setIsLoading(false);
      });
    }
  };

  if (!data || !dataStructure) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="data-dashboard bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-6 md:p-8 border border-blue-200 dark:border-blue-700 shadow-2xl"
      style={{
        '--dashboard-bg': 'var(--dashboard-bg-light, #f8fafc)',
        '--dashboard-bg-dark': '#0f172a',
        '--dashboard-text': 'var(--dashboard-text-light, #1e293b)',
        '--dashboard-text-dark': '#e2e8f0',
        '--dashboard-title': 'var(--dashboard-title-light, #0f172a)',
        '--dashboard-title-dark': '#f8fafc',
        '--dashboard-subtitle': 'var(--dashboard-subtitle-light, #64748b)',
        '--dashboard-subtitle-dark': '#94a3b8',
        '--card-bg': 'var(--card-bg-light, #ffffff)',
        '--card-bg-dark': '#1e293b',
        '--card-border': 'var(--card-border-light, #e2e8f0)',
        '--card-border-dark': '#334155',
        '--card-shadow': 'var(--card-shadow-light, 0 4px 6px -1px rgba(0, 0, 0, 0.1))',
        '--card-shadow-hover': 'var(--card-shadow-hover-light, 0 10px 25px -3px rgba(0, 0, 0, 0.1))',
        '--card-shadow-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        '--card-shadow-hover-dark': '0 10px 25px -3px rgba(0, 0, 0, 0.4)',
        '--metric-value': 'var(--metric-value-light, #3b82f6)',
        '--metric-value-dark': '#60a5fa',
        '--metric-label': 'var(--metric-label-light, #64748b)',
        '--metric-label-dark': '#94a3b8',
        '--chart-bg': 'var(--chart-bg-light, #ffffff)',
        '--chart-bg-dark': '#1e293b',
        '--chart-text': 'var(--chart-text-light, #374151)',
        '--chart-text-dark': '#e2e8f0',
        '--chart-primary': 'var(--chart-primary-light, #3b82f6)',
        '--chart-primary-dark': '#60a5fa',
        '--chart-secondary': 'var(--chart-secondary-light, #10b981)',
        '--chart-secondary-dark': '#34d399',
        '--chart-accent': 'var(--chart-accent-light, #f59e0b)',
        '--chart-accent-dark': '#fbbf24',
        '--stat-bg': 'var(--stat-bg-light, #f8fafc)',
        '--stat-bg-dark': '#334155',
        '--stat-border': 'var(--stat-border-light, #e2e8f0)',
        '--stat-border-dark': '#475569',
        '--stat-value': 'var(--stat-value-light, #1e293b)',
        '--stat-value-dark': '#f8fafc',
        '--stat-label': 'var(--stat-label-light, #64748b)',
        '--stat-label-dark': '#94a3b8',
        '--insight-bg': 'var(--insight-bg-light, #f8fafc)',
        '--insight-bg-dark': '#334155',
        '--insight-border': 'var(--insight-border-light, #e2e8f0)',
        '--insight-border-dark': '#475569',
        '--insight-item-bg': 'var(--insight-item-bg-light, #ffffff)',
        '--insight-item-bg-dark': '#1e293b',
        '--insight-text': 'var(--insight-text-light, #374151)',
        '--insight-text-dark': '#e2e8f0',
        '--insight-accent': 'var(--insight-accent-light, #3b82f6)',
        '--insight-accent-dark': '#60a5fa',
        '--insight-gradient': 'var(--insight-gradient-light, linear-gradient(135deg, #667eea 0%, #764ba2 100%))',
        '--insight-gradient-dark': 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
        '--insight-shadow': 'var(--insight-shadow-light, 0 10px 25px -3px rgba(0, 0, 0, 0.1))',
        '--insight-shadow-dark': '0 10px 25px -3px rgba(0, 0, 0, 0.4)',
        '--trend-positive': 'var(--trend-positive-light, #10b981)',
        '--trend-positive-dark': '#34d399',
        '--trend-negative': 'var(--trend-negative-light, #ef4444)',
        '--trend-negative-dark': '#f87171'
      }}
    >
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🧠 Intelligent Data Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            AI-powered analysis that tells your data&apos;s story
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={refreshDashboard}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          {/* Export Dropdown */}
          <div className="relative export-dropdown">
            <Button
              onClick={() => setShowExportMenu(!showExportMenu)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/20"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <div className="py-1">
                  <button
                    onClick={() => {
                      exportDashboard();
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Export as HTML
                  </button>
                  <button
                    onClick={() => {
                      exportDashboardAsPNG();
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Image className="w-4 h-4" alt="Export as PNG" />
                    Export as PNG
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            {/* Primary spinning ring with enhanced CSS */}
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" style={{animation: 'spin 1s linear infinite'}}></div>
            
            <p className="text-blue-600 dark:text-blue-400 font-medium">Analyzing Data...</p>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <div 
        ref={dashboardRef}
        className="dashboard-content"
        style={{ minHeight: '400px' }}
      />

      {/* Dashboard Footer */}
      <div className="mt-8 pt-6 border-t border-blue-200 dark:border-blue-700">
        <div className="text-center text-sm text-blue-600 dark:text-blue-400">
          <p>Powered by AI • Intelligent Analytics • Professional Dashboard</p>
        </div>
      </div>
    </motion.div>
  );
}
