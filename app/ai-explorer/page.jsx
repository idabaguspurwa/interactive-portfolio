'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles, Database, Zap, Brain, BarChart3, Lightbulb } from 'lucide-react'
import Link from 'next/link'
import { AIDataExplorer } from '@/components/ai-data-explorer/AIDataExplorer'
import { PerformancePanel } from '@/components/PerformancePanel'
import { RevealOnScroll } from '@/components/ScrollAnimations'

// Force dynamic rendering to prevent Vercel build issues  
export const dynamic = 'force-dynamic'

export default function AIExplorerPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    setIsLoaded(true)
    
    // Detect theme
    const detectTheme = () => {
      if (typeof window !== 'undefined') {
        const isDark = document.documentElement.classList.contains('dark') ||
                      window.matchMedia('(prefers-color-scheme: dark)').matches
        setTheme(isDark ? 'dark' : 'light')
      }
    }
    
    detectTheme()
    
    // Listen for theme changes
    const observer = new MutationObserver(detectTheme)
    if (typeof window !== 'undefined') {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      })
    }
    
    return () => observer.disconnect()
  }, [])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 pt-16 md:pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">Loading AI Data Explorer...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 pt-16 md:pt-20 pb-16 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <RevealOnScroll direction="up" delay={0.1}>
          <div className="text-center mb-8 md:mb-12">
            <div className="mb-6 flex flex-col items-center gap-4">
              <Link 
                href="/playground"
                className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Data Engineering Playground
              </Link>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border border-purple-200/50 dark:border-purple-700/50 rounded-full text-purple-700 dark:text-purple-300 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                AI-Powered Data Exploration
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                AI Data Explorer
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Ask questions about your GitHub data in plain English. Our AI understands your intent, 
              generates optimized SQL queries, and creates beautiful visualizations automatically.
            </p>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              {[
                {
                  icon: Brain,
                  title: "Natural Language Processing",
                  description: "Ask questions like you would to a data analyst",
                  color: "from-purple-500 to-purple-600"
                },
                {
                  icon: Database,
                  title: "Auto SQL Generation", 
                  description: "Watch AI convert your questions to optimized queries",
                  color: "from-blue-500 to-blue-600"
                },
                {
                  icon: BarChart3,
                  title: "Smart Visualizations",
                  description: "Get charts, tables, and insights automatically",
                  color: "from-indigo-500 to-indigo-600"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 mx-auto`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* AI Explorer Component */}
        <RevealOnScroll direction="up" delay={0.3}>
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl overflow-hidden">
            <AIDataExplorer theme={theme} />
          </div>
        </RevealOnScroll>

        {/* How It Works */}
        <RevealOnScroll direction="up" delay={0.5}>
          <div className="mt-16 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900/50 dark:to-blue-900/20 rounded-2xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Experience the future of data exploration with AI-powered analysis
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Ask Your Question",
                  description: "Type your question in plain English about GitHub data",
                  icon: "💬"
                },
                {
                  step: "2", 
                  title: "AI Processes",
                  description: "Gemini 2.5 Flash converts your question to optimized SQL",
                  icon: "🧠"
                },
                {
                  step: "3",
                  title: "Execute Query",
                  description: "Query runs against live Snowflake production database",
                  icon: "⚡"
                },
                {
                  step: "4",
                  title: "Get Insights",
                  description: "See results with auto-generated charts and AI analysis",
                  icon: "📊"
                }
              ].map((item, index) => (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">
                    {item.icon}
                  </div>
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mb-4 mx-auto">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* Technical Details */}
        <RevealOnScroll direction="up" delay={0.7}>
          <div className="mt-16 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Technical Innovation
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Built with cutting-edge AI and enterprise-grade infrastructure
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Google Gemini 2.5 Flash",
                  items: ["Natural language processing", "SQL query generation", "Context awareness", "Error handling"]
                },
                {
                  title: "Production Database",
                  items: ["Live Snowflake connection", "Real GitHub events data", "Optimized query performance", "Enterprise security"]
                },
                {
                  title: "Smart Visualizations", 
                  items: ["Observable Plot charts", "Auto chart type selection", "Interactive filtering", "Data export capabilities"]
                },
                {
                  title: "Performance Monitoring",
                  items: ["Real-time metrics tracking", "AI processing times", "Query performance", "User interaction analytics"]
                },
                {
                  title: "Conversational AI",
                  items: ["Context-aware follow-ups", "Query history tracking", "Fallback mechanisms", "Error recovery"]
                },
                {
                  title: "Enterprise Features",
                  items: ["Syntax highlighting", "Query validation", "Result pagination", "CSV export"]
                }
              ].map((section, index) => (
                <div key={section.title} className="bg-white/80 dark:bg-gray-900/80 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                  <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* Call to Action */}
        <RevealOnScroll direction="up" delay={0.9}>
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 dark:from-purple-400/10 dark:to-blue-400/10 rounded-2xl p-8 border border-purple-200/50 dark:border-purple-700/50">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Explore Your Data?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                This AI-powered data exploration tool represents the future of business intelligence. 
                Let&apos;s discuss how similar AI solutions can transform your data workflows.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
                >
                  <Lightbulb className="w-4 h-4" />
                  Discuss AI Solutions
                </Link>
                <Link 
                  href="/playground"
                  className="inline-flex items-center gap-2 border border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-400 dark:hover:text-gray-900 px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  <Database className="w-4 h-4" />
                  View More Projects
                </Link>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>

      {/* Performance Panel */}
      <PerformancePanel />
    </div>
  )
}