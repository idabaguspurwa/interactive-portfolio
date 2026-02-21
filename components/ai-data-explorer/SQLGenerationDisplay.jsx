'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import { 
  Code, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Zap,
  Database,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export function SQLGenerationDisplay({ sql, query, theme = 'light' }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const sqlRef = useRef(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sql)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      
      // Track performance
      if (window.playgroundPerformance) {
        window.playgroundPerformance.addOperation('SQL Copied', 0)
      }
    } catch (error) {
      console.error('Failed to copy SQL:', error)
    }
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  // Simple SQL syntax highlighting
  const highlightSQL = (sqlText) => {
    if (!sqlText) return ''
    
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 
      'LIMIT', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'ON',
      'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'LIKE', 'BETWEEN',
      'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'DISTINCT',
      'AS', 'ASC', 'DESC', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
      'DATE_TRUNC', 'CURRENT_DATE'
    ]
    
    const functions = ['COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'DATE_TRUNC']
    
    let highlighted = sqlText
    
    // Highlight keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      highlighted = highlighted.replace(regex, `<span class="sql-keyword">${keyword}</span>`)
    })
    
    // Highlight strings
    highlighted = highlighted.replace(/'([^']*)'/g, '<span class="sql-string">\'$1\'</span>')
    
    // Highlight numbers
    highlighted = highlighted.replace(/\b\d+\b/g, '<span class="sql-number">$&</span>')
    
    // Highlight comments
    highlighted = highlighted.replace(/--.*$/gm, '<span class="sql-comment">$&</span>')
    
    return highlighted
  }

  const formatSQL = (sqlText) => {
    if (!sqlText) return ''
    
    return sqlText
      .replace(/,/g, ',\n       ')
      .replace(/FROM/gi, '\nFROM')
      .replace(/WHERE/gi, '\nWHERE')
      .replace(/GROUP BY/gi, '\nGROUP BY')
      .replace(/ORDER BY/gi, '\nORDER BY')
      .replace(/HAVING/gi, '\nHAVING')
      .replace(/LIMIT/gi, '\nLIMIT')
      .replace(/^\s+/gm, '       ') // Indent continuation lines
  }

  const displaySQL = isExpanded ? formatSQL(sql) : sql
  const highlightedSQL = highlightSQL(displaySQL)

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Database className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Generated SQL Query
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              For: &ldquo;{query}&rdquo;
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleVisibility}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isVisible ? 'Hide SQL' : 'Show SQL'}
          >
            {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          
          <button
            onClick={toggleExpanded}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isExpanded ? 'Compact view' : 'Formatted view'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-green-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* SQL Display */}
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="p-4">
            <div className="relative">
              <pre
                ref={sqlRef}
                className={`text-sm font-mono leading-relaxed p-4 rounded-lg border overflow-x-auto ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-700 text-gray-100'
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
                style={{
                  minHeight: isExpanded ? '120px' : '60px',
                  maxHeight: '300px'
                }}
              >
                <code 
                  dangerouslySetInnerHTML={{ __html: highlightedSQL }}
                  className="sql-code"
                />
              </pre>
              
              {/* AI Badge */}
              <div className="absolute top-2 right-2">
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-medium rounded-full">
                  <Zap className="w-3 h-3" />
                  AI Generated
                </div>
              </div>
            </div>
            
            {/* SQL Info */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <span>Query ready to execute</span>
                <span>•</span>
                <span>Snowflake compatible</span>
                <span>•</span>
                <span>{sql?.split(' ').length || 0} tokens</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Code className="w-3 h-3" />
                <span>SQL</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Custom CSS for syntax highlighting */}
      <style jsx>{`
        .sql-code :global(.sql-keyword) {
          color: ${theme === 'dark' ? '#8B5CF6' : '#7C3AED'};
          font-weight: 600;
        }
        
        .sql-code :global(.sql-string) {
          color: ${theme === 'dark' ? '#10B981' : '#059669'};
        }
        
        .sql-code :global(.sql-number) {
          color: ${theme === 'dark' ? '#F59E0B' : '#D97706'};
        }
        
        .sql-code :global(.sql-comment) {
          color: ${theme === 'dark' ? '#6B7280' : '#9CA3AF'};
          font-style: italic;
        }
      `}</style>
    </motion.div>
  )
}