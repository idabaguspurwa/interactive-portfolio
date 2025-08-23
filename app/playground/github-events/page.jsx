'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RevealOnScroll, StaggerContainer, StaggerItem } from '@/components/ScrollAnimations'
import { ArrowLeft, Database, Activity, BarChart3, Zap, Github, Calendar, Users, TrendingUp, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { callPythonAPI } from '@/lib/python-api'

const GitHubEventsLiveDemo = dynamic(
  () => import('@/components/GitHubEventsLiveDemo'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    )
  }
)

export default function GitHubEventsPlayground() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(false) // Changed from true to false
  const [lastUpdated, setLastUpdated] = useState(null)

  // Load data after component mounts, don't block initial render
  useEffect(() => {
    // Small delay to ensure page renders first
    const timer = setTimeout(() => {
      fetchMetrics()
    }, 100)
    return () => clearTimeout(timer)
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

  // Dynamic project stats using real data
  const getProjectStats = () => {
    // Show placeholder cards while loading or if no data
    if (!metrics) {
      return [
        {
          icon: Database,
          title: "Loading...",
          description: "Fetching GitHub events data",
          color: "from-gray-400 to-gray-500",
          value: "—"
        },
        {
          icon: Users,
          title: "Loading...",
          description: "Fetching developer data",
          color: "from-gray-400 to-gray-500",
          value: "—"
        },
        {
          icon: Github,
          title: "Loading...",
          description: "Fetching repository data",
          color: "from-gray-400 to-gray-500",
          value: "—"
        },
        {
          icon: TrendingUp,
          title: "Loading...",
          description: "Fetching performance data",
          color: "from-gray-400 to-gray-500",
          value: "—"
        }
      ]
    }

    return [
      {
        icon: Database,
        title: `${metrics.totalEvents?.toLocaleString()} Events`,
        description: "GitHub events successfully processed in production",
        color: "from-green-500 to-emerald-500",
        value: metrics.totalEvents?.toLocaleString() || "0"
      },
      {
        icon: Users,
        title: `${metrics.uniqueUsers?.toLocaleString()} Developers`,
        description: "Unique developers tracked across repositories",
        color: "from-blue-500 to-cyan-500",
        value: metrics.uniqueUsers?.toLocaleString() || "0"
      },
      {
        icon: Github,
        title: `${metrics.uniqueRepos?.toLocaleString()} Repositories`,
        description: "Open source projects monitored in real-time",
        color: "from-purple-500 to-pink-500",
        value: metrics.uniqueRepos?.toLocaleString() || "0"
      },
      {
        icon: TrendingUp,
        title: `${metrics.uptime}% Uptime`,
        description: `Production pipeline reliability over ${metrics.daysOperational} days`,
        color: "from-orange-500 to-red-500",
        value: `${metrics.uptime}%`
      }
    ]
  }

  const projectStats = getProjectStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-green-900/20 pt-16 md:pt-20 pb-16 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <RevealOnScroll direction="up">
          <div className="text-center mb-8 md:mb-12">
            <Link 
              href="/playground"
              className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:underline mb-4 md:mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Playground
            </Link>
            
            <div className="mb-6 flex items-center justify-center gap-4">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent text-lg font-semibold">
                Live Production Data
              </span>
              <button
                onClick={fetchMetrics}
                disabled={loading}
                className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-heading font-bold mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                GitHub Events
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">Analytics</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed px-2">
              Explore real-time data from my production GitHub Events pipeline. This dashboard connects directly to 
              Snowflake to display live insights from {metrics?.totalEvents?.toLocaleString() || '7,301+'}+ GitHub events processed across {metrics?.uniqueRepos?.toLocaleString() || '6,170+'}+ repositories.
            </p>

            {/* Success Badge with Last Updated */}
            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                {metrics ? 'Production Pipeline Successfully Completed' : 'Connecting to Production Pipeline...'}
              </div>
              {lastUpdated && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
              {loading && !metrics && (
                <div className="text-xs text-blue-500 dark:text-blue-400">
                  Fetching live data from Snowflake...
                </div>
              )}
            </div>
          </div>
        </RevealOnScroll>

        {/* Project Stats Overview */}
        <RevealOnScroll direction="up" delay={0.2}>
          <div className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              Pipeline Achievement Metrics
            </h2>
            <StaggerContainer>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {projectStats.map((stat, index) => (
                  <StaggerItem key={stat.title}>
                    <motion.div
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 text-center"
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4 mx-auto`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {loading && !metrics ? (
                          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 rounded w-16 mx-auto"></div>
                        ) : (
                          stat.value
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                        {stat.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {stat.description}
                      </p>
                      {loading && !metrics && (
                        <div className="mt-2">
                          <div className="inline-flex items-center gap-2 text-xs text-gray-500">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            Loading data...
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </div>
        </RevealOnScroll>

        {/* Key Features */}
        <RevealOnScroll direction="up" delay={0.3}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Database,
                title: "Live Snowflake Connection",
                description: "Real-time queries to production Snowflake database with actual GitHub events data",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Activity,
                title: "Production Insights",
                description: "Analyze real developer patterns, repository trends, and open source activity",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: BarChart3,
                title: "Interactive Analytics",
                description: "Explore the data with interactive charts, filters, and real-time metrics",
                color: "from-purple-500 to-pink-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </RevealOnScroll>

        {/* Main Live Demo Component */}
        <RevealOnScroll direction="up" delay={0.5}>
          <GitHubEventsLiveDemo />
        </RevealOnScroll>

        {/* Technical Achievement */}
        <RevealOnScroll direction="up" delay={0.7}>
          <div className="mt-16 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border border-green-200/50 dark:border-green-700/50">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Production Architecture Highlights
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                This pipeline successfully processed real GitHub events in production for 11 days, 
                demonstrating enterprise-grade data engineering capabilities.
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
                  items: ["Kubernetes orchestration", "Snowflake data warehouse", "Prometheus monitoring", "99.7% uptime achieved"]
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
    </div>
  )
}