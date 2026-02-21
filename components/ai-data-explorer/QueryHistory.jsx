'use client'

import { motion, AnimatePresence } from 'motion/react'
import { 
  History, 
  Clock, 
  BarChart3, 
  Trash2, 
  RotateCcw,
  Database
} from 'lucide-react'

export function QueryHistory({ history = [], onSelect, onClear, currentQuery }) {
  const formatTimeAgo = (timestamp) => {
    const now = Date.now()
    const diff = now - new Date(timestamp).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const truncateText = (text, maxLength = 60) => {
    if (!text) return ''
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <History className="w-8 h-8 mx-auto mb-3 text-gray-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          No query history yet
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Your previous questions will appear here
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Recent Questions
          </span>
        </div>
        
        {onClear && history.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Clear history"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* History List */}
      <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
        <AnimatePresence>
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.05 }}
              className={`group relative p-2 sm:p-3 rounded-lg border cursor-pointer transition-all duration-200 min-h-[60px] sm:min-h-[auto] ${
                currentQuery === item.query
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => onSelect(item)}
            >
              {/* Query Text */}
              <div className="mb-1 sm:mb-2">
                <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white leading-tight sm:leading-relaxed">
                  <span className="block sm:hidden">{truncateText(item.query, 40)}</span>
                  <span className="hidden sm:block">{truncateText(item.query)}</span>
                </p>
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(item.timestamp)}</span>
                  </div>
                  
                  {item.results && (
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" />
                      <span className="hidden sm:inline">{item.results.length} results</span>
                      <span className="sm:hidden">{item.results.length}</span>
                    </div>
                  )}
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <RotateCcw className="w-3 h-3" />
                </div>
              </div>

              {/* SQL Preview */}
              {item.sql && (
                <div className="mt-2 p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-600 hidden sm:block">
                  <div className="flex items-center gap-1 mb-1">
                    <Database className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-500">SQL</span>
                  </div>
                  <code className="text-xs text-gray-700 dark:text-gray-300 font-mono break-all">
                    {truncateText(item.sql.replace(/\s+/g, ' '), 80)}
                  </code>
                </div>
              )}

              {/* Insights Preview */}
              {item.insights && (
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 italic hidden sm:block">
                  💡 {truncateText(item.insights, 100)}
                </div>
              )}

              {/* Current Query Indicator */}
              {currentQuery === item.query && (
                <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          <span className="hidden sm:inline">Click any question to rerun it</span>
          <span className="sm:hidden">Tap to rerun</span>
        </p>
      </div>
    </div>
  )
}