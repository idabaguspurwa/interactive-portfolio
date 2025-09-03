'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Lightbulb, Clock, TrendingUp, Database } from 'lucide-react'

const SUGGESTED_QUESTIONS = [
  {
    category: 'Popular Projects',
    icon: TrendingUp,
    questions: [
      "What are the most popular JavaScript frameworks?",
      "Show me repositories with over 50,000 stars",
      "Compare React vs Vue.js vs Angular",
      "Which TypeScript projects are trending?"
    ]
  },
  {
    category: 'My Portfolio',
    icon: Database,
    questions: [
      "How do my repositories compare to popular projects?",
      "Show me the most active repositories",
      "What programming languages do I use most?",
      "Which of my projects have the most commits?"
    ]
  },
  {
    category: 'Tech Insights',
    icon: Lightbulb,
    questions: [
      "Which programming languages are most popular?",
      "Show me the biggest open source projects",
      "What are the most forked repositories?",
      "Find recently updated popular projects"
    ]
  }
]

export function NaturalLanguageInput({ onSubmit, disabled = false, placeholder = "Ask a question..." }) {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(0)
  const textareaRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (questionText = null) => {
    const question = questionText || input.trim()
    if (!question || disabled) return

    onSubmit(question)
    setInput('')
    setShowSuggestions(false)
    
    // Track performance
    if (window.playgroundPerformance) {
      window.playgroundPerformance.addOperation('Question Submitted', 0)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInputFocus = () => {
    if (!input.trim()) {
      setShowSuggestions(true)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setInput(value)
    
    // Show suggestions if input is empty
    if (!value.trim()) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const selectSuggestion = (question) => {
    handleSubmit(question)
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Enhanced Professional Input Area */}
      <div className="relative">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-600 focus-within:border-purple-500 dark:focus-within:border-purple-400 transition-all duration-300 shadow-lg hover:shadow-xl">
          {/* Input Header */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Natural Language Query
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Powered by Gemini 2.0 Flash + DeepSeek AI
              </p>
            </div>
            {disabled && (
              <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-orange-700 dark:text-orange-400">Processing...</span>
              </div>
            )}
          </div>
          
          {/* Input Content */}
          <div className="p-6">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onFocus={handleInputFocus}
              placeholder={placeholder}
              disabled={disabled}
              rows={5}
              className="w-full bg-transparent border-none outline-none resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base leading-relaxed font-medium"
            />
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Enter</kbd> to submit • <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Shift+Enter</kbd> for new line
                </div>
              </div>
              
              <button
                onClick={() => handleSubmit()}
                disabled={!input.trim() || disabled}
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {disabled ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Ask AI
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-lg z-50 overflow-hidden"
          >
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Lightbulb className="w-4 h-4" />
                Try asking about your GitHub data
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {SUGGESTED_QUESTIONS.map((category, index) => (
                <button
                  key={category.category}
                  onClick={() => setSelectedCategory(index)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-medium transition-colors ${
                    selectedCategory === index
                      ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-b-2 border-purple-500'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <category.icon className="w-3 h-3" />
                  {category.category}
                </button>
              ))}
            </div>

            {/* Questions */}
            <div className="max-h-64 overflow-y-auto">
              <div className="p-2">
                {SUGGESTED_QUESTIONS[selectedCategory].questions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => selectSuggestion(question)}
                    className="w-full text-left p-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">{question}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Ask anything about repositories, commits, pull requests, issues, and more
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}