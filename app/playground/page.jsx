'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RevealOnScroll } from '@/components/ScrollAnimations'
import { ArrowLeft, Database, Zap, BarChart3, Github, Activity } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const InteractiveDataPlayground = dynamic(
  () => import('@/components/InteractiveDataPlayground'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-light dark:border-primary-dark"></div>
      </div>
    )
  }
)

const GitHubEventsLiveDemo = dynamic(
  () => import('@/components/GitHubEventsLiveDemo'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-light dark:border-primary-dark"></div>
      </div>
    )
  }
)

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState('data-lakehouse')

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 pt-16 md:pt-20 pb-16 md:pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <RevealOnScroll direction="up">
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
        </RevealOnScroll>

        {/* Tab Navigation */}
        <RevealOnScroll direction="up" delay={0.2}>
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
        </RevealOnScroll>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
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
        <InteractiveDataPlayground />
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
  return (
    <div>
      {/* Features Overview */}
      <RevealOnScroll direction="up" delay={0.3}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {[
            {
              icon: Database,
              title: "Live Snowflake Data",
              description: "Real-time connection to production Snowflake database with 7,301+ processed events",
              color: "from-green-500 to-emerald-500"
            },
            {
              icon: Activity,
              title: "Production Pipeline",
              description: "Completed GitHub Events data pipeline processing real repository activity",
              color: "from-blue-500 to-cyan-500"
            },
            {
              icon: BarChart3,
              title: "Advanced Analytics",
              description: "Complex aggregations, timeline analysis, and repository insights with rich visualizations",
              color: "from-purple-500 to-pink-500"
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

      {/* GitHub Events Showcase */}
      <RevealOnScroll direction="up" delay={0.5}>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border border-green-200/50 dark:border-green-700/50 text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-600 dark:text-green-400 font-medium">Live Production Data Available</span>
          </div>
          
          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Explore Real GitHub Events Analytics
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Experience my completed GitHub Events pipeline with live Snowflake data. 
            See real production results from 7,301+ processed events across 6,170+ repositories.
          </p>
        </div>
      </RevealOnScroll>

      {/* GitHub Events Live Dashboard */}
      <RevealOnScroll direction="up" delay={0.7}>
        <GitHubEventsLiveDemo />
      </RevealOnScroll>

      {/* Technical Notes */}
      <RevealOnScroll direction="up" delay={0.9}>
        <div className="mt-8 md:mt-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-gray-900 dark:text-white">
            Production Architecture
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-primary-light dark:text-primary-dark">
                Data Infrastructure
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Snowflake Cloud Data Platform</li>
                <li>• Python FastAPI Backend</li>
                <li>• Real-time Event Processing</li>
                <li>• Complex SQL Aggregations</li>
                <li>• Hybrid Cloud Architecture</li>
              </ul>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-primary-light dark:text-primary-dark">
                Analytics Features
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Live Dashboard Analytics</li>
                <li>• Timeline Visualizations</li>
                <li>• Repository Insights</li>
                <li>• Performance Monitoring</li>
                <li>• Interactive Data Exploration</li>
              </ul>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  )
}