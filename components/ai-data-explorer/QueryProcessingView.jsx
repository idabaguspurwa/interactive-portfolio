'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Database, 
  Zap, 
  CheckCircle, 
  Loader2,
  Code,
  BarChart3,
  Lightbulb
} from 'lucide-react'

const PROCESSING_STEPS = [
  {
    id: 'understanding',
    label: 'Understanding your question',
    icon: Brain,
    duration: 1500,
    color: 'text-purple-600 dark:text-purple-400'
  },
  {
    id: 'generating',
    label: 'Generating SQL query',
    icon: Code,
    duration: 2000,
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    id: 'executing',
    label: 'Executing against database',
    icon: Database,
    duration: 1000,
    color: 'text-green-600 dark:text-green-400'
  },
  {
    id: 'analyzing',
    label: 'Analyzing results',
    icon: BarChart3,
    duration: 800,
    color: 'text-amber-600 dark:text-amber-400'
  },
  {
    id: 'insights',
    label: 'Generating insights',
    icon: Lightbulb,
    duration: 1200,
    color: 'text-indigo-600 dark:text-indigo-400'
  }
]

export function QueryProcessingView({ query, isLoading }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [startTime] = useState(Date.now())

  useEffect(() => {
    if (!isLoading) return

    let timeouts = []
    let currentDelay = 0

    PROCESSING_STEPS.forEach((step, index) => {
      const timeout = setTimeout(() => {
        setCurrentStep(index)
        
        // Mark previous steps as completed
        if (index > 0) {
          setCompletedSteps(prev => new Set([...prev, index - 1]))
        }
      }, currentDelay)
      
      timeouts.push(timeout)
      currentDelay += step.duration
    })

    // Final completion
    const finalTimeout = setTimeout(() => {
      setCompletedSteps(prev => new Set([...prev, PROCESSING_STEPS.length - 1]))
    }, currentDelay)
    
    timeouts.push(finalTimeout)

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [isLoading])

  const getElapsedTime = () => {
    return ((Date.now() - startTime) / 1000).toFixed(1)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex items-center justify-center p-8"
    >
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
            <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Processing your question
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            &ldquo;{query}&rdquo;
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Processing time: {getElapsedTime()}s
          </div>
        </div>

        {/* Processing Steps */}
        <div className="space-y-4">
          {PROCESSING_STEPS.map((step, index) => {
            const isActive = currentStep === index && isLoading
            const isCompleted = completedSteps.has(index)
            const isPending = index > currentStep

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700' 
                    : isCompleted
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                    : isCompleted
                    ? 'bg-green-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      </motion.div>
                    ) : isCompleted ? (
                      <motion.div
                        key="completed"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                      >
                        <CheckCircle className="w-5 h-5 text-white" />
                      </motion.div>
                    ) : (
                      <step.icon className={`w-5 h-5 ${
                        isPending ? 'text-gray-500' : 'text-white'
                      }`} />
                    )}
                  </AnimatePresence>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className={`font-medium ${
                    isActive
                      ? 'text-gray-900 dark:text-white'
                      : isCompleted
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {step.label}
                  </div>
                  
                  {isActive && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-gray-600 dark:text-gray-400 mt-1"
                    >
                      AI is working...
                    </motion.div>
                  )}
                  
                  {isCompleted && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-green-600 dark:text-green-400 mt-1"
                    >
                      Completed
                    </motion.div>
                  )}
                </div>

                {/* Progress indicator */}
                {isActive && (
                  <div className="flex-shrink-0">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-blue-200 border-t-blue-500 rounded-full"
                    />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Fun Facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-700"
        >
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lightbulb className="w-3 h-3 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Did you know?
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Our AI can understand complex questions about your data and automatically 
                generate optimized SQL queries in milliseconds.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}