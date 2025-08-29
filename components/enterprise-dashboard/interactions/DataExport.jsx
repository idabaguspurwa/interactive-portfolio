'use client'

import { useState, useRef } from 'react'
import { Download, FileText, Image, Table } from 'lucide-react'
import * as Plot from '@observablehq/plot'

export const DataExport = ({ 
  data, 
  filename = 'dashboard-export',
  chartRefs = [],
  className = "" 
}) => {
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState('csv')

  const downloadCSV = (data, filename) => {
    if (!data || data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const downloadJSON = (data, filename) => {
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const downloadPNG = async (element, filename) => {
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
        logging: false
      })
      
      const link = document.createElement('a')
      link.download = `${filename}.png`
      link.href = canvas.toDataURL('image/png')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('PNG export failed:', error)
    }
  }

  const exportCharts = async (format) => {
    setIsExporting(true)
    
    try {
      if (format === 'png' && chartRefs.length > 0) {
        for (const [index, ref] of chartRefs.entries()) {
          if (ref.current) {
            await downloadPNG(ref.current, `${filename}-chart-${index + 1}`)
            await new Promise(resolve => setTimeout(resolve, 500))
          }
        }
      }
    } catch (error) {
      console.error('Chart export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExport = async (format) => {
    setIsExporting(true)
    
    try {
      switch (format) {
        case 'csv':
          downloadCSV(data, filename)
          break
        case 'json':
          downloadJSON(data, filename)
          break
        case 'png':
          await exportCharts('png')
          break
        default:
          console.warn('Unsupported export format:', format)
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <select
        value={exportFormat}
        onChange={(e) => setExportFormat(e.target.value)}
        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                   rounded-md focus:ring-2 focus:ring-blue-500"
        disabled={isExporting}
      >
        <option value="csv">CSV Data</option>
        <option value="json">JSON Data</option>
        <option value="png">PNG Images</option>
      </select>
      
      <button
        onClick={() => handleExport(exportFormat)}
        disabled={isExporting || !data || data.length === 0}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                   disabled:bg-gray-400 disabled:cursor-not-allowed
                   text-white text-sm font-medium rounded-md transition-colors"
      >
        {isExporting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download size={16} />
            Export {exportFormat.toUpperCase()}
          </>
        )}
      </button>
    </div>
  )
}

export const ExportButton = ({ 
  onExport, 
  format = 'csv', 
  disabled = false,
  className = "",
  children 
}) => {
  const [isExporting, setIsExporting] = useState(false)

  const handleClick = async () => {
    setIsExporting(true)
    try {
      await onExport(format)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const getIcon = () => {
    switch (format) {
      case 'csv': return <Table size={16} />
      case 'json': return <FileText size={16} />
      case 'png': return <Image size={16} />
      default: return <Download size={16} />
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isExporting}
      className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium
                  bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
                  text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600
                  rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                  ${className}`}
    >
      {isExporting ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        getIcon()
      )}
      {children || `Export ${format.toUpperCase()}`}
    </button>
  )
}

export default DataExport