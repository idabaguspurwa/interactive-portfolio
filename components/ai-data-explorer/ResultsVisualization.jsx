'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import * as Plot from "@observablehq/plot"
import * as d3 from "d3"
import { 
  BarChart3, 
  Table, 
  TrendingUp, 
  PieChart, 
  Calendar,
  Download,
  Maximize2,
  Minimize2
} from 'lucide-react'

const CHART_TYPES = {
  auto: { icon: BarChart3, label: 'Auto' },
  bar: { icon: BarChart3, label: 'Bar Chart' },
  line: { icon: TrendingUp, label: 'Line Chart' },
  pie: { icon: PieChart, label: 'Pie Chart' },
  table: { icon: Table, label: 'Table' },
  timeline: { icon: Calendar, label: 'Timeline' }
}

export function ResultsVisualization({ data, query, theme = 'light' }) {
  const [viewMode, setViewMode] = useState('auto')
  const [isExpanded, setIsExpanded] = useState(false)
  const [chartType, setChartType] = useState('auto')
  const chartRef = useRef(null)
  const [processedData, setProcessedData] = useState([])

  useEffect(() => {
    if (!data || !Array.isArray(data)) return

    // Process and clean the data
    const processed = data.map((row, index) => ({
      ...row,
      _id: index, // Add unique ID for React keys
      // Convert string numbers to actual numbers
      ...Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          key,
          isNumericString(value) ? parseFloat(value) : value
        ])
      )
    }))

    setProcessedData(processed)
    
    // Auto-detect best chart type
    const detectedType = detectBestVisualization(processed, query)
    setChartType(detectedType)
  }, [data, query])

  const isNumericString = (value) => {
    return typeof value === 'string' && !isNaN(value) && !isNaN(parseFloat(value))
  }

  const detectBestVisualization = (data, query) => {
    if (!data || data.length === 0) return 'table'
    
    const firstRow = data[0]
    const columns = Object.keys(firstRow)
    const numericColumns = columns.filter(col => 
      typeof firstRow[col] === 'number' && !isNaN(firstRow[col])
    )
    
    const queryLower = query?.toLowerCase() || ''
    
    // Time series detection
    if (columns.some(col => col.toLowerCase().includes('date') || col.toLowerCase().includes('time'))) {
      if (queryLower.includes('trend') || queryLower.includes('over time') || queryLower.includes('pattern')) {
        return 'line'
      }
    }
    
    // Bar chart for counts and comparisons
    if (numericColumns.length > 0 && data.length <= 20) {
      if (queryLower.includes('most') || queryLower.includes('top') || queryLower.includes('compare')) {
        return 'bar'
      }
    }
    
    // Pie chart for compositions
    if (numericColumns.length === 1 && data.length <= 10) {
      if (queryLower.includes('distribution') || queryLower.includes('breakdown')) {
        return 'pie'
      }
    }
    
    // Default to table for complex data
    return data.length > 50 ? 'table' : 'bar'
  }

  const renderChart = () => {
    if (!processedData || processedData.length === 0) return null
    if (!chartRef.current) return null

    const startTime = performance.now()

    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove()

    const width = chartRef.current.clientWidth
    const height = isExpanded ? 500 : 300

    let plot

    try {
      switch (chartType) {
        case 'bar':
          plot = createBarChart(processedData, width, height, theme)
          break
        case 'line':
          plot = createLineChart(processedData, width, height, theme)
          break
        case 'pie':
          plot = createPieChart(processedData, width, height, theme)
          break
        case 'timeline':
          plot = createTimelineChart(processedData, width, height, theme)
          break
        case 'auto':
          const autoType = detectBestVisualization(processedData, query)
          if (autoType === 'line') plot = createLineChart(processedData, width, height, theme)
          else if (autoType === 'pie') plot = createPieChart(processedData, width, height, theme)
          else plot = createBarChart(processedData, width, height, theme)
          break
        default:
          plot = createBarChart(processedData, width, height, theme)
      }

      if (plot) {
        chartRef.current.appendChild(plot)
        
        // Track performance
        const endTime = performance.now()
        if (window.playgroundPerformance) {
          window.playgroundPerformance.addOperation(`Chart Render (${chartType})`, endTime - startTime)
        }
      }
    } catch (error) {
      console.error('Chart rendering error:', error)
    }
  }

  const createBarChart = (data, width, height, theme) => {
    const columns = Object.keys(data[0] || {})
    const numericColumns = columns.filter(col => typeof data[0][col] === 'number')
    const textColumns = columns.filter(col => typeof data[0][col] !== 'number')
    
    if (numericColumns.length === 0 || textColumns.length === 0) return null

    const xCol = textColumns[0]
    const yCol = numericColumns[0]

    return Plot.plot({
      width,
      height,
      marginLeft: 80,
      marginBottom: 60,
      style: { backgroundColor: 'transparent' },
      x: { 
        label: xCol,
        tickRotate: data.length > 5 ? -45 : 0
      },
      y: { label: yCol, grid: true },
      color: { 
        scheme: theme === 'dark' ? 'blues' : 'blues'
      },
      marks: [
        Plot.barY(data.slice(0, 20), { 
          x: xCol, 
          y: yCol, 
          fill: theme === 'dark' ? '#3B82F6' : '#1D4ED8',
          tip: true
        })
      ]
    })
  }

  const createLineChart = (data, width, height, theme) => {
    const columns = Object.keys(data[0] || {})
    const dateColumns = columns.filter(col => 
      col.toLowerCase().includes('date') || col.toLowerCase().includes('time') || col.toLowerCase().includes('activity')
    )
    const numericColumns = columns.filter(col => typeof data[0][col] === 'number')
    
    if (dateColumns.length === 0 || numericColumns.length === 0) {
      return createBarChart(data, width, height, theme)
    }

    const xCol = dateColumns[0]
    const yCol = numericColumns[0]

    // Convert date strings to Date objects
    const processedData = data.map(d => {
      try {
        return {
          ...d,
          [xCol]: new Date(d[xCol])
        }
      } catch {
        return d // Keep original if date conversion fails
      }
    }).filter(d => d[xCol] instanceof Date && !isNaN(d[xCol]))

    if (processedData.length === 0) {
      return createBarChart(data, width, height, theme)
    }

    return Plot.plot({
      width,
      height,
      marginLeft: 80,
      marginBottom: 60,
      style: { backgroundColor: 'transparent' },
      x: { label: xCol, type: 'time' },
      y: { label: yCol, grid: true },
      marks: [
        Plot.line(processedData, { 
          x: xCol, 
          y: yCol, 
          stroke: theme === 'dark' ? '#10B981' : '#059669',
          strokeWidth: 2,
          curve: 'catmull-rom'
        }),
        Plot.dot(processedData, { 
          x: xCol, 
          y: yCol, 
          fill: theme === 'dark' ? '#10B981' : '#059669',
          r: 4,
          tip: true
        })
      ]
    })
  }

  const createTimelineChart = (data, width, height, theme) => {
    const columns = Object.keys(data[0] || {})
    const dateColumns = columns.filter(col => 
      col.toLowerCase().includes('date') || col.toLowerCase().includes('time') || col.toLowerCase().includes('activity')
    )
    const textColumns = columns.filter(col => typeof data[0][col] !== 'number')
    
    if (dateColumns.length === 0) {
      return createBarChart(data, width, height, theme)
    }

    const xCol = dateColumns[0]
    const labelCol = textColumns.find(col => col !== xCol) || textColumns[0]
    
    // Convert date strings to Date objects
    const processedData = data.map((d, index) => {
      try {
        return {
          ...d,
          [xCol]: new Date(d[xCol]),
          y: index % 3, // Spread events across different y levels for better visibility
          label: d[labelCol] || `Event ${index + 1}`
        }
      } catch {
        return {
          ...d,
          y: index % 3,
          label: d[labelCol] || `Event ${index + 1}`
        }
      }
    }).filter(d => d[xCol] instanceof Date && !isNaN(d[xCol]))

    if (processedData.length === 0) {
      return createBarChart(data, width, height, theme)
    }

    return Plot.plot({
      width,
      height,
      marginLeft: 80,
      marginBottom: 60,
      style: { backgroundColor: 'transparent' },
      x: { label: xCol, type: 'time' },
      y: { label: 'Events', domain: [-0.5, 2.5], ticks: [], axis: null },
      marks: [
        Plot.dot(processedData, { 
          x: xCol, 
          y: 'y',
          fill: theme === 'dark' ? '#8B5CF6' : '#7C3AED',
          r: 6,
          tip: true,
          title: d => `${d.label}\n${d[xCol].toLocaleString()}`
        }),
        Plot.text(processedData, {
          x: xCol,
          y: d => d.y + 0.3,
          text: 'label',
          fontSize: 10,
          fill: theme === 'dark' ? '#E5E7EB' : '#374151',
          textAnchor: 'middle'
        })
      ]
    })
  }

  const createPieChart = (data, width, height, theme) => {
    const columns = Object.keys(data[0] || {})
    const numericColumns = columns.filter(col => typeof data[0][col] === 'number')
    const textColumns = columns.filter(col => typeof data[0][col] !== 'number')
    
    if (numericColumns.length === 0 || textColumns.length === 0) {
      return createBarChart(data, width, height, theme)
    }

    const labelCol = textColumns[0]
    const valueCol = numericColumns[0]
    
    // Create pie chart using D3 since Observable Plot doesn't support pie charts natively
    const radius = Math.min(width, height) / 2 - 40
    const pieData = data.slice(0, 8) // Limit to 8 slices for readability
    
    // Create SVG element
    const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .style("background", "transparent")

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)

    // Create pie generator
    const pie = d3.pie()
      .value(d => d[valueCol])
      .sort(null)

    // Create arc generator
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius)

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(pieData.map(d => d[labelCol]))
      .range(theme === 'dark' 
        ? d3.schemeCategory10 
        : d3.schemeCategory10
      )

    // Create pie slices
    const slices = g.selectAll(".arc")
      .data(pie(pieData))
      .enter().append("g")
      .attr("class", "arc")

    // Add paths
    slices.append("path")
      .attr("d", arc)
      .style("fill", d => color(d.data[labelCol]))
      .style("stroke", theme === 'dark' ? '#374151' : '#ffffff')
      .style("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).style("opacity", 0.8)
        
        // Create tooltip
        const tooltip = d3.select("body").append("div")
          .attr("class", "pie-tooltip")
          .style("position", "absolute")
          .style("background", theme === 'dark' ? '#1F2937' : '#ffffff')
          .style("color", theme === 'dark' ? '#ffffff' : '#000000')
          .style("padding", "8px 12px")
          .style("border-radius", "6px")
          .style("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)")
          .style("border", `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`)
          .style("font-size", "12px")
          .style("z-index", "1000")
          .style("pointer-events", "none")
          .style("opacity", 0)
          .html(`
            <div><strong>${d.data[labelCol]}</strong></div>
            <div>Value: ${d.data[valueCol].toLocaleString()}</div>
            <div>Percentage: ${((d.data[valueCol] / d3.sum(pieData, dd => dd[valueCol])) * 100).toFixed(1)}%</div>
          `)

        tooltip.transition()
          .duration(200)
          .style("opacity", 1)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px")
      })
      .on("mouseout", function() {
        d3.select(this).style("opacity", 1)
        d3.selectAll(".pie-tooltip").remove()
      })

    // Add labels
    slices.append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("dy", "0.35em")
      .style("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-weight", "500")
      .style("fill", theme === 'dark' ? '#ffffff' : '#000000')
      .style("pointer-events", "none")
      .text(d => {
        const percentage = (d.data[valueCol] / d3.sum(pieData, dd => dd[valueCol])) * 100
        return percentage > 5 ? `${percentage.toFixed(0)}%` : '' // Only show label if slice is big enough
      })

    // Add legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 120}, 20)`)

    const legendItems = legend.selectAll(".legend-item")
      .data(pieData)
      .enter().append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`)

    legendItems.append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .style("fill", d => color(d[labelCol]))

    legendItems.append("text")
      .attr("x", 18)
      .attr("y", 6)
      .attr("dy", "0.35em")
      .style("font-size", "11px")
      .style("fill", theme === 'dark' ? '#E5E7EB' : '#374151')
      .text(d => {
        const text = d[labelCol].toString()
        return text.length > 12 ? text.substring(0, 12) + '...' : text
      })

    return svg.node()
  }

  useEffect(() => {
    if (chartType !== 'table' && processedData.length > 0) {
      renderChart()
    }
  }, [processedData, chartType, theme, isExpanded])

  const downloadData = () => {
    const csv = convertToCSV(processedData)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `query-results-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return ''
    
    const headers = Object.keys(data[0]).filter(key => key !== '_id')
    const rows = data.map(row => 
      headers.map(header => 
        typeof row[header] === 'string' && row[header].includes(',') 
          ? `"${row[header]}"` 
          : row[header]
      ).join(',')
    )
    
    return [headers.join(','), ...rows].join('\n')
  }

  if (!processedData || processedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No data to visualize</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Visualization:
          </span>
          <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
            {Object.entries(CHART_TYPES).map(([type, config]) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                  chartType === type
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <config.icon className="w-3 h-3" />
                {config.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isExpanded ? 'Minimize' : 'Maximize'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          
          <button
            onClick={downloadData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <Download className="w-3 h-3" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Visualization */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {chartType === 'table' ? (
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {Object.keys(processedData[0] || {}).filter(key => key !== '_id').map(header => (
                    <th key={header} className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {processedData.slice(0, 100).map((row, index) => (
                  <tr key={row._id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {Object.entries(row).filter(([key]) => key !== '_id').map(([key, value]) => (
                      <td key={key} className="px-4 py-3 text-gray-900 dark:text-gray-100">
                        {typeof value === 'number' ? value.toLocaleString() : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {processedData.length > 100 && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
                Showing first 100 of {processedData.length} results
              </div>
            )}
          </div>
        ) : (
          <div 
            ref={chartRef} 
            className={`w-full ${isExpanded ? 'h-[500px]' : 'h-[300px]'} overflow-hidden`}
          />
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>
          {processedData.length.toLocaleString()} result{processedData.length !== 1 ? 's' : ''} found
        </span>
        <span>
          {Object.keys(processedData[0] || {}).filter(key => key !== '_id').length} column{Object.keys(processedData[0] || {}).length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}