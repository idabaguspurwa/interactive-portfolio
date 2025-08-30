'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RevealOnScroll } from '@/components/ScrollAnimations'
import { ArrowLeft, Database, Zap, BarChart3, Github, Activity, RefreshCw, Users, TrendingUp, Download, AlertCircle, Code } from 'lucide-react'
import Link from 'next/link'
import dynamicImport from 'next/dynamic'
import { callPythonAPI } from '@/lib/python-api'

// Force dynamic rendering to prevent Vercel build issues
export const dynamic = 'force-dynamic'

const InteractiveDataPlayground = dynamicImport(
  () => import('@/components/InteractiveDataPlayground'),
  { 
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-light dark:border-primary-dark"></div>
      </div>
    )
  }
)

const GitHubEventsLiveDemo = dynamicImport(
  () => import('@/components/GitHubEventsLiveDemo'),
  { 
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    )
  }
)

const QueryPlayground = dynamicImport(
  () => import('@/components/QueryPlayground'),
  { 
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }
)

const EnterpriseDashboard = dynamicImport(
  () => import('@/components/enterprise-dashboard/EnterpriseWrapper').then(mod => ({ default: mod.EnterpriseWrapper })),
  { 
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    )
  }
)


// Error boundary component for dynamic imports
function ErrorBoundary({ children, fallback }) {
  const [hasError, setHasError] = useState(false)
  
  useEffect(() => {
    const handleError = (error) => {
      console.error('Component error:', error)
      setHasError(true)
    }
    
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])
  
  if (hasError) {
    return fallback
  }
  
  return children
}

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState('data-lakehouse')
  const [isLoading, setIsLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  // Handle URL parameters for direct tab navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get('tab')
      
      // If tab parameter exists and is valid, set it as active
      if (tabParam === 'github-events') {
        setActiveTab('github-events')
      }
    }
  }, [])

  // Ensure component is fully loaded and hydrated
  useEffect(() => {
    setIsHydrated(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  const tabs = [
    {
      id: 'data-lakehouse',
      title: 'Data Lakehouse',
      icon: Database,
      description: 'Interactive ETL Pipeline with Apache Spark simulation',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'github-events',
      title: 'GitHub Events',
      icon: Github,
      description: 'Live Snowflake analytics with real production data',
      color: 'from-green-500 to-emerald-500'
    }
  ]

  // Show loading state while component initializes, but ensure content is visible
  if (isLoading && !isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 pt-16 md:pt-20 pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {/* Show header immediately to prevent blank page */}
          <div className="text-center mb-8 md:mb-12">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-primary-light dark:text-primary-dark hover:underline mb-4 md:mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </Link>
            
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-heading font-bold mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-primary-light via-purple-600 to-accent-light dark:from-primary-dark dark:via-purple-400 dark:to-accent-dark bg-clip-text text-transparent">
                Data Engineering
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">Playground</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
              Explore production-grade data engineering projects with interactive demos. 
              Experience real data processing pipelines, live analytics, and cloud-native architectures.
            </p>
          </div>

          {/* Show loading indicator */}
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-light dark:border-primary-dark mx-auto mb-8"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading playground components...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 pt-16 md:pt-20 pb-16 md:pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-primary-light dark:text-primary-dark hover:underline mb-4 md:mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
          
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-heading font-bold mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-primary-light via-purple-600 to-accent-light dark:from-primary-dark dark:via-purple-400 dark:to-accent-dark bg-clip-text text-transparent">
              Data Engineering
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">Playground</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
            Explore production-grade data engineering projects with interactive demos. 
            Experience real data processing pipelines, live analytics, and cloud-native architectures.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-xl`}
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative flex items-center gap-3">
                    <tab.icon className="w-5 h-5" />
                    <span className="hidden sm:block">{tab.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ 
              // Ensure tab content doesn't interfere with navigation
              pointerEvents: 'auto',
              position: 'relative',
              zIndex: 1
            }}
          >
            {activeTab === 'data-lakehouse' && <DataLakehouseTab />}
            {activeTab === 'github-events' && <GitHubEventsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// Data Lakehouse Tab Component
function DataLakehouseTab() {
  return (
    <div>
      {/* Features Overview */}
      <RevealOnScroll direction="up" delay={0.3}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {[
            {
              icon: Database,
              title: "Real Data Processing",
              description: "Upload CSV files or use sample datasets to see actual data transformation in action",
              color: "from-blue-500 to-cyan-500"
            },
            {
              icon: Zap,
              title: "Live ETL Pipeline",
              description: "Watch data flow through Extract, Transform, and Load stages with visual feedback",
              color: "from-purple-500 to-pink-500"
            },
            {
              icon: BarChart3,
              title: "Performance Metrics",
              description: "Monitor processing speed, success rates, and data quality metrics in real-time",
              color: "from-green-500 to-emerald-500"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-3 md:mb-4`}>
                <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </RevealOnScroll>

             {/* Main Playground Component */}
       <RevealOnScroll direction="up" delay={0.5}>
         <ErrorBoundary 
           fallback={
             <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-6 text-center">
               <p className="text-red-700 dark:text-red-300 mb-4">
                 Interactive component failed to load. Please refresh the page.
               </p>
               <button 
                 onClick={() => window.location.reload()} 
                 className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
               >
                 Refresh Page
               </button>
             </div>
           }
         >
           <InteractiveDataPlayground />
         </ErrorBoundary>
       </RevealOnScroll>

      {/* Technical Notes */}
      <RevealOnScroll direction="up" delay={0.7}>
        <div className="mt-8 md:mt-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-gray-900 dark:text-white">
            Technologies Demonstrated
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-primary-light dark:text-primary-dark">
                Data Processing Concepts
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• ETL Pipeline Architecture</li>
                <li>• Data Filtering & Aggregation</li>
                <li>• Schema Transformation</li>
                <li>• Data Quality Validation</li>
                <li>• Real-time Processing Simulation</li>
              </ul>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-primary-light dark:text-primary-dark">
                Production Technologies
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Apache Spark (Simulated)</li>
                <li>• CSV/JSON Data Formats</li>
                <li>• Stream Processing Patterns</li>
                <li>• Data Pipeline Monitoring</li>
                <li>• Cloud-Native Architecture</li>
              </ul>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  )
}

// GitHub Events Tab Component
function GitHubEventsTab() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Load data after component mounts, don't block initial render
  useEffect(() => {
    // Small delay to ensure page renders first
    const timer = setTimeout(() => {
      fetchMetrics()
    }, 100)
    return () => clearTimeout(timer)
  }, [])
  
  // Ensure navigation works by preventing any event interference
  useEffect(() => {
    // Restore body overflow and remove any potential scroll locks
    document.body.style.overflow = 'auto'
    
    return () => {
      // Clean up on unmount
      document.body.style.overflow = 'auto'
    }
  }, [])

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const data = await callPythonAPI('/api/github-metrics')
      
      if (data.success) {
        setMetrics(data.data)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
      // Don't keep loading state on error, show placeholder
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="space-y-8 lg:space-y-12" style={{ 
      // Ensure SVG icons render properly on all devices
      WebkitBackfaceVisibility: 'hidden',
      backfaceVisibility: 'hidden'
    }}>
      {/* Clean Professional Header */}
      <motion.div 
        className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
          {/* Status Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  metrics ? 'bg-emerald-500' : 
                  loading ? 'bg-amber-500 animate-pulse' : 
                  'bg-gray-400'
                }`}></div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {metrics ? 'Connected' : loading ? 'Connecting' : 'Offline'}
                </span>
                {lastUpdated && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    • {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
            
            <button
              onClick={fetchMetrics}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 sm:w-3 sm:h-3 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Loading State */}
          {loading && !metrics && (
            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200/30 dark:border-blue-800/30">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-4 w-4 border border-blue-500 border-t-transparent"></div>
                <div className="text-sm">
                  <span className="font-medium text-blue-700 dark:text-blue-300">Initializing connection</span>
                  <span className="text-blue-600 dark:text-blue-400 ml-2">This may take 15-30 seconds</span>
                </div>
              </div>
            </div>
          )}

          {/* Main Header */}
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/30 dark:border-emerald-800/30 rounded-full text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-4">
                <Database className="w-4 h-4 sm:w-3 sm:h-3" />
                Live Production Data
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                GitHub Events{' '}
                <span className="text-blue-600 dark:text-blue-400">Analytics</span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Real-time insights from production Snowflake data warehouse
              </p>
            </div>
            
            {/* Key Metrics */}
            {metrics && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { label: 'Events Processed', value: metrics.totalEvents?.toLocaleString() || '7,301+', color: 'text-blue-600 dark:text-blue-400' },
                  { label: 'Repositories', value: metrics.uniqueRepos?.toLocaleString() || '6,170+', color: 'text-emerald-600 dark:text-emerald-400' },
                  { label: 'Data Points', value: metrics.dataPoints?.toLocaleString() || '25.2K+', color: 'text-purple-600 dark:text-purple-400' },
                  { label: 'Uptime', value: '33.3%', color: 'text-amber-600 dark:text-amber-400' }
                ].map((metric, index) => (
                  <div key={metric.label} className="text-center">
                    <div className={`text-2xl lg:text-3xl font-bold ${metric.color} mb-1`}>
                      {metric.value}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      

      {/* Platform Overview */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Enterprise Data Platform
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Production-grade infrastructure powering real-time analytics and insights
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {[
            {
              title: "Snowflake Integration",
              description: "Direct connection to production data warehouse with enterprise-grade security and performance",
              icon: Database,
              metrics: ["Sub-second queries", "99.9% uptime", "Auto-scaling"],
              iconBg: "bg-blue-100 dark:bg-blue-900/30",
              iconColor: "text-blue-600 dark:text-blue-400",
              dotColor: "bg-blue-500"
            },
            {
              title: "Real-time Pipeline",
              description: "Kafka streaming with dbt transformations processing events with data quality validation",
              icon: Activity,
              metrics: ["Stream processing", "Data validation", "Event deduplication"],
              iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
              iconColor: "text-emerald-600 dark:text-emerald-400",
              dotColor: "bg-emerald-500"
            },
            {
              title: "Interactive Analytics",
              description: "Professional dashboards with cross-filtering, drill-down, and export capabilities",
              icon: BarChart3,
              metrics: ["Cross-filtering", "Data export", "Drill-down navigation"],
              iconBg: "bg-purple-100 dark:bg-purple-900/30",
              iconColor: "text-purple-600 dark:text-purple-400",
              dotColor: "bg-purple-500"
            }
          ].map((item, index) => (
            <div key={item.title} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 sm:w-12 sm:h-12 rounded-lg ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <item.icon className={`w-7 h-7 sm:w-6 sm:h-6 ${item.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <div className="space-y-2">
                    {item.metrics.map((metric, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className={`w-1 h-1 rounded-full ${item.dotColor}`}></div>
                        <span className="text-gray-600 dark:text-gray-400">{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/30 border border-blue-200/30 dark:border-blue-800/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
              <BarChart3 className="w-4 h-4 sm:w-3 sm:h-3" />
              Interactive Dashboard
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Analytics Dashboard
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Professional Tableau-style visualizations with cross-filtering, drill-down capabilities, and real-time data updates
            </p>
          </div>
          
          {/* Dashboard Container */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <ErrorBoundary 
              fallback={
                <div className="p-12 text-center">
                  <div className="w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Dashboard Unavailable
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 max-w-sm mx-auto">
                    Unable to load the analytics dashboard. Please check your connection and try again.
                  </p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reload Dashboard
                  </button>
                </div>
              }
            >
              <EnterpriseDashboard />
            </ErrorBoundary>
          </div>
        </div>
      </div>

      {/* Live Data Stream */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/30 dark:border-emerald-800/30 rounded-full text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-4">
            <Activity className="w-4 h-4 sm:w-3 sm:h-3" />
            Live Stream
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Real-time GitHub Events
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Direct access to production data pipeline with live GitHub events streaming through Kafka
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <ErrorBoundary 
            fallback={
              <div className="p-12 text-center">
                <div className="w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Stream Unavailable</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 max-w-sm mx-auto">
                  Unable to connect to the live data stream
                </p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reconnect
                </button>
              </div>
            }
          >
            <GitHubEventsLiveDemo />
          </ErrorBoundary>
        </div>
      </div>

      {/* SQL Query Playground */}
      <div className="bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200/30 dark:border-indigo-800/30 rounded-full text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-4">
              <Code className="w-4 h-4 sm:w-3 sm:h-3" />
              SQL Playground
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Query Builder
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Write and execute SQL queries against the live Snowflake database with full query capabilities
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <ErrorBoundary 
              fallback={
                <div className="p-12 text-center">
                  <div className="w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Query Environment Unavailable</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 max-w-sm mx-auto">
                    Unable to initialize the SQL query environment
                  </p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reload Playground
                  </button>
                </div>
              }
            >
              <QueryPlayground />
            </ErrorBoundary>
          </div>
        </div>
      </div>

      {/* Technical Achievement */}
      <RevealOnScroll direction="up" delay={0.7}>
        <div className="mt-16 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border border-green-200/50 dark:border-green-700/50">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Production Architecture Highlights
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              This development pipeline successfully processed real GitHub events during active development sessions, 
              demonstrating enterprise-grade data engineering capabilities with transparent performance metrics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Real-time Ingestion",
                items: ["Apache Kafka streaming", "GitHub API integration", "Sub-second latency", "Event deduplication"]
              },
              {
                title: "Production Infrastructure", 
                items: ["Kubernetes orchestration", "Snowflake data warehouse", "Prometheus monitoring", "33% uptime (development pipeline)"]
              },
              {
                title: "Data Engineering Best Practices",
                items: ["dbt transformations", "Great Expectations validation", "Medallion architecture", "Cost-optimized cleanup"]
              }
            ].map((section, index) => (
              <div key={section.title} className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
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
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Ready to Build Your Real-Time Data Pipeline?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              This project demonstrates production-grade data engineering from ingestion to insights. 
              Let&apos;s discuss how similar real-time analytics can drive your business forward.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
              >
                <Database className="w-4 h-4" />
                Let&apos;s Talk Data Engineering
              </Link>
              <Link 
                href="/projects"
                className="inline-flex items-center gap-2 border border-green-600 text-green-600 dark:text-green-400 hover:bg-green-900/20 px-6 py-3 rounded-lg font-medium transition-all"
              >
                <Github className="w-4 h-4" />
                View All Projects
              </Link>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  )
}