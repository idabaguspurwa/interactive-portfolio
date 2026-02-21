'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Lightbulb, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react'

export function AIInsights({ insights, theme = 'light' }) {
  const [isExpanded, setIsExpanded] = useState(true)

  if (!insights) return null

  // Parse insights if they're in a structured format
  const parseInsights = (insightsText) => {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(insightsText)
      return parsed
    } catch {
      // Fall back to text parsing
      return {
        summary: insightsText,
        keyFindings: [],
        recommendations: [],
        anomalies: []
      }
    }
  }

  const parsedInsights = parseInsights(insights)
  const isStructured = typeof parsedInsights === 'object' && 
                     (parsedInsights.keyFindings?.length > 0 || 
                      parsedInsights.recommendations?.length > 0 ||
                      parsedInsights.anomalies?.length > 0)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-t border-purple-200 dark:border-purple-700"
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 sm:p-4 cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              AI Insights
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">
              AI-generated analysis of your query results
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 sm:hidden">
              AI analysis
            </p>
          </div>
        </div>
        
        <button className="p-1 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-3 sm:space-y-4">
              {isStructured ? (
                <>
                  {/* Summary */}
                  {parsedInsights.summary && (
                    <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 sm:p-4">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                            Summary
                          </h5>
                          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {parsedInsights.summary}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Key Findings */}
                  {parsedInsights.keyFindings?.length > 0 && (
                    <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 sm:p-4">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                            Key Findings
                          </h5>
                          <ul className="space-y-1 sm:space-y-2">
                            {parsedInsights.keyFindings.map((finding, index) => (
                              <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                                <span>{finding}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Anomalies */}
                  {parsedInsights.anomalies?.length > 0 && (
                    <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                            Notable Patterns
                          </h5>
                          <ul className="space-y-2">
                            {parsedInsights.anomalies.map((anomaly, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <AlertCircle className="w-3 h-3 text-amber-500 mt-1 flex-shrink-0" />
                                <span>{anomaly}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {parsedInsights.recommendations?.length > 0 && (
                    <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                            Recommendations
                          </h5>
                          <ul className="space-y-2">
                            {parsedInsights.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <div className="w-3 h-3 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // Simple text insights
                <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                        Analysis
                      </h5>
                      <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {insights}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Attribution */}
              <div className="flex items-center justify-center pt-2">
                <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                  <Sparkles className="w-3 h-3" />
                  <span className="hidden sm:inline">Generated by AI • Insights may vary based on data interpretation</span>
                  <span className="sm:hidden">AI Generated</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}