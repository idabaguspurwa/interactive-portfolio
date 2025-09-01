'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Database, 
  Zap, 
  MessageSquare, 
  History, 
  Lightbulb,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { NaturalLanguageInput } from './NaturalLanguageInput'
import { QueryProcessingView } from './QueryProcessingView'
import { SQLGenerationDisplay } from './SQLGenerationDisplay'
import { ResultsVisualization } from './ResultsVisualization'
import { AIInsights } from './AIInsights'
import { QueryHistory } from './QueryHistory'

export function AIDataExplorer({ theme = 'light' }) {
  const [currentState, setCurrentState] = useState('idle') // idle, processing, displaying, error
  const [query, setQuery] = useState('')
  const [generatedSQL, setGeneratedSQL] = useState('')
  const [queryResults, setQueryResults] = useState(null)
  const [aiInsights, setAIInsights] = useState('')
  const [error, setError] = useState(null)
  const [queryHistory, setQueryHistory] = useState([])
  const [conversationContext, setConversationContext] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Track performance for the performance panel
  const trackPerformance = (operation, startTime) => {
    const endTime = performance.now()
    const duration = endTime - startTime
    
    if (window.playgroundPerformance) {
      window.playgroundPerformance.addOperation(`AI Explorer: ${operation}`, duration)
    }
  }

  const handleQuery = async (naturalLanguageQuery) => {
    const startTime = performance.now()
    
    try {
      setCurrentState('processing')
      setQuery(naturalLanguageQuery)
      setError(null)
      setIsLoading(true)

      // Add to conversation context
      const newContext = [...conversationContext, {
        role: 'user',
        content: naturalLanguageQuery,
        timestamp: new Date()
      }]
      setConversationContext(newContext)

      // Generate SQL and execute using Turso backend (integrated response)
      const sqlResponse = await generateSQLWithGemini(naturalLanguageQuery, newContext)
      setGeneratedSQL(sqlResponse.sql)
      setQueryResults(sqlResponse.data || [])
      setAIInsights(sqlResponse.insights || `Found ${sqlResponse.count || 0} results for your query.`)
      
      trackPerformance('SQL Generation + Execution', startTime)

      // Add to query history
      const historyItem = {
        id: Date.now(),
        query: naturalLanguageQuery,
        sql: sqlResponse.sql,
        results: sqlResponse.data || [],
        insights: sqlResponse.insights || '',
        timestamp: new Date()
      }
      
      setQueryHistory(prev => [historyItem, ...prev.slice(0, 9)]) // Keep last 10

      setCurrentState('displaying')
      
    } catch (error) {
      console.error('AI Data Explorer error:', error)
      setError(error.message || 'An error occurred while processing your query')
      setCurrentState('error')
    } finally {
      setIsLoading(false)
      trackPerformance('Total Query', startTime)
    }
  }

  const generateSQLWithGemini = async (question, context) => {
    const startTime = performance.now()
    
    const response = await fetch('/api/ai-sql-generator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question,
        context: context.slice(-5) // Last 5 messages for context
      })
    })

    if (!response.ok) {
      // Track failed API calls
      if (window.playgroundPerformance) {
        window.playgroundPerformance.addApiCall('/api/ai-sql-generator', performance.now() - startTime, 'error')
      }
      throw new Error(`Failed to generate SQL: ${response.statusText}`)
    }

    // Track successful API calls
    if (window.playgroundPerformance) {
      window.playgroundPerformance.addApiCall('/api/ai-sql-generator', performance.now() - startTime, 'success')
    }

    return await response.json()
  }


  const handleHistorySelect = (historyItem) => {
    setQuery(historyItem.query)
    setGeneratedSQL(historyItem.sql)
    setQueryResults(historyItem.results)
    setAIInsights(historyItem.insights)
    setCurrentState('displaying')
  }

  const resetExplorer = () => {
    setCurrentState('idle')
    setQuery('')
    setGeneratedSQL('')
    setQueryResults(null)
    setAIInsights('')
    setError(null)
  }

  return (
    <div className="w-full min-h-[900px] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 p-8 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Data Explorer
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-400 mt-1">
                Enterprise-grade natural language data analysis powered by Google Gemini 2.5 Flash
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Live GitHub Data
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                  <Database className="w-3 h-3" />
                  Turso Edge SQLite
                </span>
              </div>
            </div>
          </div>
          
          {currentState !== 'idle' && (
            <button
              onClick={resetExplorer}
              className="px-4 py-2.5 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <MessageSquare className="w-4 h-4 mr-2 inline" />
              New Question
            </button>
          )}
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="flex min-h-[780px]">
        {/* Enhanced Left Panel - Input and History */}
        <div className="w-2/5 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50/50 dark:bg-gray-800/50">
          <div className="p-6 flex-1">
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Ask Your Question
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use natural language to explore your GitHub analytics data
              </p>
            </div>
            
            <NaturalLanguageInput 
              onSubmit={handleQuery}
              disabled={isLoading}
              placeholder="What insights would you like to discover about your GitHub data?"
            />
            
            {queryHistory.length > 0 && (
              <div className="mt-8">
                <h5 className="text-base font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <History className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  Recent Queries
                </h5>
                <QueryHistory 
                  history={queryHistory}
                  onSelect={handleHistorySelect}
                  currentQuery={query}
                />
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Right Panel - Processing and Results */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
          <AnimatePresence mode="wait">
            {currentState === 'idle' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex items-center justify-center p-12"
              >
                <div className="text-center max-w-2xl">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-100 via-blue-100 to-indigo-100 dark:from-purple-900/30 dark:via-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center shadow-lg">
                    <Database className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Enterprise Data Analytics Ready
                  </h4>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                    Your AI-powered data analyst is ready to help you discover insights from your GitHub repository data. 
                    Ask questions in natural language and get professional-grade analysis.
                  </p>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 mb-8">
                    <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Try These Example Queries
                    </h5>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        {
                          query: "What are my most popular repositories by stars?",
                          icon: "⭐",
                          category: "Repository Analytics"
                        },
                        {
                          query: "Which programming languages do I use most?", 
                          icon: "💻",
                          category: "Language Analysis"
                        },
                        {
                          query: "Show me my recent commits and activity patterns",
                          icon: "📈", 
                          category: "Activity Insights"
                        },
                        {
                          query: "What are my largest projects by code size?",
                          icon: "📦",
                          category: "Project Analysis"
                        }
                      ].map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuery(suggestion.query)}
                          className="group p-4 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 hover:bg-white dark:hover:bg-gray-800/50 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{suggestion.icon}</span>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">
                                {suggestion.category}
                              </div>
                              <div className="text-base text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                {suggestion.query}
                              </div>
                            </div>
                            <Zap className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    💡 <strong>Pro Tip:</strong> Be specific in your questions for more detailed insights
                  </div>
                </div>
              </motion.div>
            )}

            {currentState === 'processing' && (
              <QueryProcessingView 
                key="processing"
                query={query}
                isLoading={isLoading}
              />
            )}

            {currentState === 'displaying' && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                {/* SQL Display */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <SQLGenerationDisplay 
                    sql={generatedSQL}
                    query={query}
                    theme={theme}
                  />
                </div>

                {/* Enhanced Results and Insights */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 p-6 overflow-auto">
                    <ResultsVisualization 
                      data={queryResults}
                      query={query}
                      theme={theme}
                    />
                  </div>
                  
                  {aiInsights && (
                    <div className="border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/10 dark:to-blue-900/10">
                      <AIInsights 
                        insights={aiInsights}
                        theme={theme}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {currentState === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex items-center justify-center p-8"
              >
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Unable to process query
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {error}
                  </p>
                  <button
                    onClick={resetExplorer}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}