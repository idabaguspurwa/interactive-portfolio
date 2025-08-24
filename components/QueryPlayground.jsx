'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Database, 
  Play, 
  Save, 
  Download, 
  Copy, 
  Clock, 
  TrendingUp, 
  Users, 
  Github, 
  Calendar,
  Filter,
  Search,
  Code,
  Eye,
  EyeOff
} from 'lucide-react'
import { callPythonAPI } from '@/lib/python-api'

// Pre-built query templates
const QUERY_TEMPLATES = [
  {
    id: 'top-repos',
    name: 'Top Active Repositories',
    description: 'Find the most active repositories by event count',
    query: {
      eventTypes: ['PushEvent', 'PullRequestEvent', 'IssuesEvent'],
      timeRange: '30d',
      groupBy: 'repository',
      limit: 10,
      sortBy: 'event_count'
    }
  },
  {
    id: 'developer-activity',
    name: 'Developer Activity Patterns',
    description: 'Analyze developer activity by time of day',
    query: {
      eventTypes: ['PushEvent', 'PullRequestEvent'],
      timeRange: '7d',
      groupBy: 'hour',
      limit: 24,
      sortBy: 'hour'
    }
  },
  {
    id: 'event-distribution',
    name: 'Event Type Distribution',
    description: 'See distribution of different GitHub event types',
    query: {
      eventTypes: ['all'],
      timeRange: '30d',
      groupBy: 'event_type',
      limit: 20,
      sortBy: 'event_count'
    }
  },
  {
    id: 'language-trends',
    name: 'Language Popularity Trends',
    description: 'Track programming language popularity over time',
    query: {
      eventTypes: ['PushEvent'],
      timeRange: '90d',
      groupBy: 'language',
      limit: 15,
      sortBy: 'event_count'
    }
  }
]

export default function QueryPlayground() {
  const [activeQuery, setActiveQuery] = useState(QUERY_TEMPLATES[0])
  const [customQuery, setCustomQuery] = useState(QUERY_TEMPLATES[0].query)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showManualQuery, setShowManualQuery] = useState(false)
  const [manualQuery, setManualQuery] = useState('')
  const [queryHistory, setQueryHistory] = useState([])
  const [savedQueries, setSavedQueries] = useState([])

  // Event type options
  const eventTypeOptions = [
    'PushEvent', 'PullRequestEvent', 'IssuesEvent', 'CreateEvent', 
    'DeleteEvent', 'ForkEvent', 'WatchEvent', 'ReleaseEvent',
    'CommitCommentEvent', 'PullRequestReviewEvent'
  ]

  // Time range options
  const timeRangeOptions = [
    { value: '1d', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ]

  // Group by options
  const groupByOptions = [
    { value: 'repository', label: 'Repository' },
    { value: 'user', label: 'User' },
    { value: 'event_type', label: 'Event Type' },
    { value: 'language', label: 'Language' },
    { value: 'hour', label: 'Hour of Day' },
    { value: 'day', label: 'Day of Week' }
  ]

  // Sort by options
  const sortByOptions = [
    { value: 'event_count', label: 'Event Count' },
    { value: 'timestamp', label: 'Timestamp' },
    { value: 'repository', label: 'Repository Name' },
    { value: 'user', label: 'User Name' }
  ]

  const executeQuery = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        event_types: customQuery.eventTypes.join(','),
        time_range: customQuery.timeRange,
        group_by: customQuery.groupBy,
        limit: customQuery.limit.toString(),
        sort_by: customQuery.sortBy
      })

      const data = await callPythonAPI(`/api/query-executor?${queryParams}`)
      
      if (data.success) {
        setResults(data.data)
        
        // Add to query history
        const historyItem = {
          id: Date.now(),
          query: { ...customQuery },
          timestamp: new Date(),
          resultCount: data.data.length
        }
        setQueryHistory(prev => [historyItem, ...prev.slice(0, 9)])
      } else {
        setError(data.message || 'Query execution failed')
      }
    } catch (err) {
      setError('Failed to execute query. Please try again.')
      console.error('Query execution error:', err)
    } finally {
      setLoading(false)
    }
  }

  const executeManualQuery = async () => {
    if (!manualQuery.trim()) {
      setError('Please enter a query')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Send manual query to backend
      const data = await callPythonAPI('/api/manual-query', {
        method: 'POST',
        body: JSON.stringify({ query: manualQuery })
      })
      
      if (data.success) {
        setResults(data.data)
        
        // Add to query history
        const historyItem = {
          id: Date.now(),
          query: { type: 'manual', query: manualQuery },
          timestamp: new Date(),
          resultCount: data.data.length
        }
        setQueryHistory(prev => [historyItem, ...prev.slice(0, 9)])
      } else {
        setError(data.message || 'Manual query execution failed')
      }
    } catch (err) {
      setError('Failed to execute manual query. Please try again.')
      console.error('Manual query execution error:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadTemplate = (template) => {
    setActiveQuery(template)
    setCustomQuery(template.query)
  }

  const saveQuery = () => {
    const savedQuery = {
      id: Date.now(),
      name: `Custom Query ${savedQueries.length + 1}`,
      description: 'Custom query created by user',
      query: { ...customQuery },
      timestamp: new Date()
    }
    setSavedQueries(prev => [...prev, savedQuery])
  }

  const exportResults = (format = 'json') => {
    if (!results) return

    let content, filename, mimeType

    if (format === 'csv') {
      const headers = Object.keys(results[0] || {}).join(',')
      const rows = results.map(row => Object.values(row).join(',')).join('\n')
      content = `${headers}\n${rows}`
      filename = `github-events-query-${Date.now()}.csv`
      mimeType = 'text/csv'
    } else {
      content = JSON.stringify(results, null, 2)
      filename = `github-events-query-${Date.now()}.json`
      mimeType = 'application/json'
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyQuery = () => {
    const queryString = JSON.stringify(customQuery, null, 2)
    navigator.clipboard.writeText(queryString)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Interactive Query Playground
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Explore GitHub events data with custom queries. Build, execute, and analyze real-time data from our production Snowflake database.
        </p>
      </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Left Panel - Query Builder */}
         <div className="lg:col-span-1 space-y-6">
           {/* Query Templates - Only show when Manual Query is hidden */}
           <AnimatePresence mode="wait">
             {!showManualQuery && (
               <motion.div
                 key="query-templates"
                 initial={{ opacity: 0, height: 0, scale: 0.95 }}
                 animate={{ opacity: 1, height: 'auto', scale: 1 }}
                 exit={{ opacity: 0, height: 0, scale: 0.95 }}
                 transition={{ duration: 0.2 }}
                 className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50"
               >
                 <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                   <Database className="w-5 h-5" />
                   Query Templates
                 </h3>
                 <div className="space-y-3">
                   {QUERY_TEMPLATES.map((template) => (
                     <motion.button
                       key={template.id}
                       onClick={() => loadTemplate(template)}
                       className={`w-full text-left p-3 rounded-xl border transition-all ${
                         activeQuery.id === template.id
                           ? 'border-primary-light dark:border-primary-dark bg-primary-light/10 dark:bg-primary-dark/10'
                           : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                       }`}
                       whileHover={{ scale: 1.02 }}
                       whileTap={{ scale: 0.98 }}
                     >
                       <div className="font-medium text-gray-900 dark:text-white">
                         {template.name}
                       </div>
                       <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                         {template.description}
                       </div>
                     </motion.button>
                   ))}
                 </div>
               </motion.div>
             )}
           </AnimatePresence>

                     {/* Custom Query Builder */}
           <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 ${showManualQuery ? 'h-full' : ''}`}>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Code className="w-5 h-5" />
              Custom Query Builder
            </h3>
            
            <div className="space-y-4">
              {/* Event Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Types
                </label>
                <select
                  multiple
                  value={customQuery.eventTypes}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value)
                    setCustomQuery(prev => ({ ...prev, eventTypes: values }))
                  }}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {eventTypeOptions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Time Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Range
                </label>
                <select
                  value={customQuery.timeRange}
                  onChange={(e) => setCustomQuery(prev => ({ ...prev, timeRange: e.target.value }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {timeRangeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Group By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Group By
                </label>
                <select
                  value={customQuery.groupBy}
                  onChange={(e) => setCustomQuery(prev => ({ ...prev, groupBy: e.target.value }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {groupByOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

                             {/* Advanced Options */}
               <button
                 onClick={() => setShowAdvanced(!showAdvanced)}
                 className="flex items-center gap-2 text-sm text-primary-light dark:text-primary-dark hover:underline"
               >
                 {showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                 {showAdvanced ? 'Hide' : 'Show'} Advanced Options
               </button>

                               {/* Manual Query Toggle */}
                <button
                  onClick={() => setShowManualQuery(!showManualQuery)}
                  className="flex items-center gap-2 text-sm text-primary-light dark:text-primary-dark hover:underline"
                >
                  {showManualQuery ? <EyeOff className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                  {showManualQuery ? 'Hide' : 'Show'} Manual Query Panel
                </button>

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    {/* Limit */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Result Limit
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={customQuery.limit}
                        onChange={(e) => setCustomQuery(prev => ({ ...prev, limit: parseInt(e.target.value) }))}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sort By
                      </label>
                      <select
                        value={customQuery.sortBy}
                        onChange={(e) => setCustomQuery(prev => ({ ...prev, sortBy: e.target.value }))}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {sortByOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                                     </motion.div>
                 )}
               </AnimatePresence>

               

                             {/* Action Buttons */}
               <div className="flex gap-2 pt-4">
                 <button
                   onClick={executeQuery}
                   disabled={loading}
                   className="flex-1 bg-primary-light dark:bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-primary-light/90 dark:hover:bg-primary-dark/90 disabled:opacity-50 flex items-center justify-center gap-2"
                 >
                   {loading ? (
                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                   ) : (
                     <Play className="w-4 h-4" />
                   )}
                   Execute Query
                 </button>
                 <button
                   onClick={saveQuery}
                   className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                   title="Save Query"
                 >
                   <Save className="w-4 h-4" />
                 </button>
                 <button
                   onClick={copyQuery}
                   className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                   title="Copy Query"
                 >
                   <Copy className="w-4 h-4" />
                 </button>
               </div>

               {/* Quick Stats & Info */}
               <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                 <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
                   <Database className="w-4 h-4" />
                   Query Builder Info
                 </h4>
                 <div className="space-y-2 text-xs text-blue-700 dark:text-blue-300">
                   <div className="flex justify-between">
                     <span>Selected Events:</span>
                     <span className="font-medium">{customQuery.eventTypes.length} types</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Time Range:</span>
                     <span className="font-medium">{timeRangeOptions.find(opt => opt.value === customQuery.timeRange)?.label}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Group By:</span>
                     <span className="font-medium">{groupByOptions.find(opt => opt.value === customQuery.groupBy)?.label}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Result Limit:</span>
                     <span className="font-medium">{customQuery.limit}</span>
                   </div>
                 </div>
               </div>

               {/* Helpful Tips */}
               <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                 <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                   <Code className="w-4 h-4" />
                   Quick Tips
                 </h4>
                 <div className="text-xs text-green-700 dark:text-green-300 space-y-1">
                   <div>• Use multiple event types for comprehensive analysis</div>
                   <div>• Longer time ranges show broader trends</div>
                   <div>• Group by repository for activity insights</div>
                   <div>• Group by hour for time-based patterns</div>
                 </div>
               </div>

               {/* Current Query Preview */}
               <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg">
                 <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                   <Eye className="w-4 h-4" />
                   Query Preview
                 </h4>
                 <div className="text-xs text-gray-600 dark:text-gray-400 font-mono bg-white dark:bg-gray-800 p-2 rounded border">
                   SELECT {customQuery.groupBy === 'repository' ? 'V:repo.name::STRING' : 
                          customQuery.groupBy === 'user' ? 'V:actor.login::STRING' :
                          customQuery.groupBy === 'event_type' ? 'V:type::STRING' :
                          customQuery.groupBy === 'language' ? 'V:repo.language::STRING' :
                          customQuery.groupBy === 'hour' ? 'HOUR(V:created_at::TIMESTAMP)' :
                          'DAYOFWEEK(V:created_at::TIMESTAMP)'} as {customQuery.groupBy},
                   COUNT(*) as event_count
                   FROM RAW_EVENTS
                   WHERE V:type::STRING IN ({customQuery.eventTypes.map(type => `'${type}'`).join(', ')})
                   AND V:created_at::TIMESTAMP &gt;= DATEADD(day, -{customQuery.timeRange === '1d' ? '1' : 
                                                                   customQuery.timeRange === '7d' ? '7' : 
                                                                   customQuery.timeRange === '30d' ? '30' : 
                                                                   customQuery.timeRange === '90d' ? '90' : '365'}, CURRENT_DATE())
                   GROUP BY {customQuery.groupBy === 'repository' ? 'V:repo.name::STRING' : 
                            customQuery.groupBy === 'user' ? 'V:actor.login::STRING' :
                            customQuery.groupBy === 'event_type' ? 'V:type::STRING' :
                            customQuery.groupBy === 'language' ? 'V:repo.language::STRING' :
                            customQuery.groupBy === 'hour' ? 'HOUR(V:created_at::TIMESTAMP)' :
                            'DAYOFWEEK(V:created_at::TIMESTAMP)'}
                   ORDER BY event_count DESC
                   LIMIT {customQuery.limit}
                 </div>
               </div>
            </div>
          </div>
        </div>

                 {/* Middle Panel - Manual Query Input (when shown) */}
         <AnimatePresence mode="wait">
           {showManualQuery && (
             <motion.div
               key="manual-query"
               initial={{ opacity: 0, x: 20, scale: 0.95 }}
               animate={{ opacity: 1, x: 0, scale: 1 }}
               exit={{ opacity: 0, x: 20, scale: 0.95 }}
               transition={{ duration: 0.2 }}
               className="lg:col-span-2 space-y-6"
             >
               <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 h-full">
                 <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                   <Code className="w-5 h-5" />
                   Manual Query Input
                 </h3>
                 
                 {/* Table Structure Display */}
                 <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                   <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                     <Database className="w-4 h-4" />
                     Table Structure: RAW_EVENTS
                   </h4>
                   <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                     <div><strong>V:type::STRING</strong> - Event type (PushEvent, PullRequestEvent, etc.)</div>
                     <div><strong>V:repo.name::STRING</strong> - Repository name</div>
                     <div><strong>V:repo.language::STRING</strong> - Programming language</div>
                     <div><strong>V:actor.login::STRING</strong> - Username</div>
                     <div><strong>V:created_at::TIMESTAMP</strong> - Event timestamp</div>
                     <div><strong>V:payload::VARIANT</strong> - Additional event data</div>
                   </div>
                 </div>
                 
                 <textarea
                   value={manualQuery}
                   onChange={(e) => setManualQuery(e.target.value)}
                   placeholder="Enter your custom Snowflake query here...&#10;&#10;Example: SELECT V:repo.name::STRING as repo_name, COUNT(*) as event_count FROM RAW_EVENTS WHERE V:type::STRING = 'PushEvent' GROUP BY V:repo.name::STRING ORDER BY event_count DESC LIMIT 10"
                   rows={16}
                   className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-none"
                 />
                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                   Write custom Snowflake queries using JSON extraction syntax. Table: RAW_EVENTS
                 </p>
                 
                 {/* Query Examples */}
                 <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                   <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">Example Queries:</p>
                   <div className="space-y-3 text-xs text-gray-600 dark:text-gray-400">
                     <div className="font-mono bg-white dark:bg-gray-800 p-2 rounded border">
                       <div className="text-blue-600 dark:text-blue-400 mb-1">Top Repositories:</div>
                       SELECT V:repo.name::STRING as repo_name, COUNT(*) as events FROM RAW_EVENTS GROUP BY V:repo.name::STRING ORDER BY events DESC LIMIT 10
                     </div>
                     <div className="font-mono bg-white dark:bg-gray-800 p-2 rounded border">
                       <div className="text-blue-600 dark:text-blue-400 mb-1">Most Active Users:</div>
                       SELECT V:actor.login::STRING as username, COUNT(*) as events FROM RAW_EVENTS GROUP BY V:actor.login::STRING ORDER BY events DESC LIMIT 15
                     </div>
                     <div className="font-mono bg-white dark:bg-gray-800 p-2 rounded border">
                       <div className="text-blue-600 dark:text-blue-400 mb-1">Event Type Distribution:</div>
                       SELECT V:type::STRING as event_type, COUNT(*) as count FROM RAW_EVENTS GROUP BY V:type::STRING ORDER BY count DESC
                     </div>
                     <div className="font-mono bg-white dark:bg-gray-800 p-2 rounded border">
                       <div className="text-blue-600 dark:text-blue-400 mb-1">Daily Activity:</div>
                       SELECT DATE(V:created_at::TIMESTAMP) as date, COUNT(*) as events FROM RAW_EVENTS GROUP BY DATE(V:created_at::TIMESTAMP) ORDER BY date DESC
                     </div>
                     <div className="font-mono bg-white dark:bg-gray-800 p-2 rounded border">
                       <div className="text-blue-600 dark:text-blue-400 mb-1">Language Analysis:</div>
                       SELECT V:repo.language::STRING as language, COUNT(*) as events FROM RAW_EVENTS WHERE V:repo.language::STRING IS NOT NULL GROUP BY V:repo.language::STRING ORDER BY events DESC
                     </div>
                   </div>
                   
                   {/* JSON Extraction Syntax Help */}
                   <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                     <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-2">💡 JSON Extraction Syntax:</p>
                     <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                       <div>• <strong>V:field::TYPE</strong> - Extract JSON field with type casting</div>
                       <div>• <strong>V:repo.name::STRING</strong> - Repository name as string</div>
                       <div>• <strong>V:actor.login::STRING</strong> - Username as string</div>
                       <div>• <strong>V:type::STRING</strong> - Event type as string</div>
                       <div>• <strong>V:created_at::TIMESTAMP</strong> - Timestamp as timestamp</div>
                     </div>
                   </div>
                 </div>
                 
                 <div className="flex gap-2 mt-4">
                   <button
                     onClick={executeManualQuery}
                     disabled={loading || !manualQuery.trim()}
                     className="flex-1 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
                   >
                     {loading ? (
                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                     ) : (
                       <Play className="w-4 h-4" />
                     )}
                     Execute Manual Query
                   </button>
                   <button
                     onClick={() => setManualQuery('')}
                     className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                   >
                     Clear
                   </button>
                 </div>
               </div>
             </motion.div>
           )}
         </AnimatePresence>

         {/* Results Panel */}
         <div className={`${showManualQuery ? 'lg:col-span-3' : 'lg:col-span-2'} space-y-6`}>
          {/* Query Results */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Query Results
              </h3>
              {results && (
                <div className="flex gap-2">
                  <button
                    onClick={() => exportResults('csv')}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    CSV
                  </button>
                  <button
                    onClick={() => exportResults('json')}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    JSON
                  </button>
                </div>
              )}
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light dark:border-primary-dark"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 text-center">
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {results && !loading && (
              <div>
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    Query executed successfully! Found {results.length} results.
                  </p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        {Object.keys(results[0] || {}).map((key) => (
                          <th key={key} className="text-left p-2 font-medium text-gray-700 dark:text-gray-300">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.slice(0, 20).map((row, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          {Object.values(row).map((value, valueIndex) => (
                            <td key={valueIndex} className="p-2 text-gray-900 dark:text-gray-100">
                              {typeof value === 'number' ? value.toLocaleString() : String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {results.length > 20 && (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                      Showing first 20 results of {results.length} total
                    </p>
                  )}
                </div>
              </div>
            )}

            {!results && !loading && !error && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No query results yet. Build and execute a query to see data.</p>
              </div>
            )}
          </div>

          {/* Query History */}
          {queryHistory.length > 0 && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Queries
              </h3>
              <div className="space-y-2">
                                 {queryHistory.map((item) => (
                   <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                     <div className="flex items-center gap-3">
                       <div className="text-sm text-gray-600 dark:text-gray-300">
                         {item.query.type === 'manual' ? (
                           <>
                             <span className="font-medium">Manual Query</span> • {item.resultCount} results
                           </>
                         ) : (
                           <>
                             {item.query.groupBy} • {item.query.timeRange} • {item.resultCount} results
                           </>
                         )}
                       </div>
                     </div>
                     <button
                       onClick={() => {
                         if (item.query.type === 'manual') {
                           setManualQuery(item.query.query)
                           setShowManualQuery(true)
                         } else {
                           setCustomQuery(item.query)
                         }
                       }}
                       className="text-sm text-primary-light dark:text-primary-dark hover:underline"
                     >
                       {item.query.type === 'manual' ? 'Reuse' : 'Reuse'}
                     </button>
                   </div>
                 ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
