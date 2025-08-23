'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Database, 
  Activity, 
  RefreshCw, 
  Calendar,
  Github,
  Users,
  GitBranch,
  TrendingUp,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { callPythonAPI } from '@/lib/python-api'

export default function GitHubEventsLiveDemo() {
  const [metrics, setMetrics] = useState(null)
  const [timelineData, setTimelineData] = useState(null)
  const [repositories, setRepositories] = useState(null)
  const [loading, setLoading] = useState(false) // Changed from true to false
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [activeTab, setActiveTab] = useState('overview')
  const [lastUpdated, setLastUpdated] = useState(null)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'repositories', label: 'Repositories', icon: Github },
    { id: 'insights', label: 'Insights', icon: TrendingUp }
  ]

  // Load data after component mounts, don't block initial render
  useEffect(() => {
    // Small delay to ensure component renders first
    const timer = setTimeout(() => {
      loadData()
    }, 200)
    
    // Auto-refresh every 10 minutes
    const interval = setInterval(loadData, 10 * 60 * 1000)
    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  const loadData = async () => {
    setLoading(true)
    setConnectionStatus('connecting')
    
    try {
      const startTime = Date.now()
      
      // Fetch all data in parallel for better performance using Python API
      const [metricsData, timelineData, reposData] = await Promise.all([
        callPythonAPI('/api/github-metrics'),
        callPythonAPI('/api/github-timeline'),
        callPythonAPI('/api/github-repositories?limit=5') // Reduced limit for faster queries
      ])

      // Only proceed if ALL APIs return successful Snowflake data
      if (!metricsData.success || !timelineData.success || !reposData.success) {
        throw new Error('Snowflake data unavailable - only showing real-time data')
      }

      // Set the real data from APIs (Python backend format)
      setMetrics(metricsData.data)
      setTimelineData(timelineData.data.timeline || timelineData.data)
      setRepositories(reposData.data.repositories || reposData.data)
      
      const totalTime = Date.now() - startTime
      setConnectionStatus('connected')
      setLastUpdated(new Date())
      
      console.log(`✅ Successfully loaded REAL Snowflake data in ${totalTime}ms`)
      console.log('Query times:', {
        metrics: metricsData.queryTime,
        timeline: timelineData.queryTime,
        repositories: reposData.queryTime
      })
      
    } catch (error) {
      console.error('❌ Failed to load real Snowflake data:', error)
      setConnectionStatus('error')
      
      // Keep existing data if available, don't clear everything
      // This prevents the UI from disappearing on API errors
    } finally {
      setLoading(false)
    }
  }

  const getConnectionStatus = () => {
    switch (connectionStatus) {
      case 'connecting':
        return { icon: RefreshCw, text: 'Connecting to Snowflake...', color: 'text-yellow-600' }
      case 'connected':
        return { icon: CheckCircle, text: 'Connected to Snowflake', color: 'text-green-600' }
      case 'error':
        return { icon: AlertCircle, text: 'Snowflake Connection Failed', color: 'text-red-600' }
      default:
        return { icon: Database, text: 'Disconnected', color: 'text-gray-600' }
    }
  }

  const status = getConnectionStatus()

  return (
    <div className="space-y-6">
      {/* Header with Connection Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Live GitHub Events Dashboard
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <status.icon className={`w-4 h-4 ${status.color} ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`} />
              <span className={`text-sm ${status.color}`}>{status.text}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 inline mr-1" />
              {lastUpdated.toLocaleTimeString()}
            </div>
          )}
          <Button
            onClick={loadData}
            disabled={loading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <OverviewTab metrics={metrics} loading={loading} connectionStatus={connectionStatus} />
          )}
          {activeTab === 'timeline' && (
            <TimelineTab data={timelineData} loading={loading} connectionStatus={connectionStatus} />
          )}
          {activeTab === 'repositories' && (
            <RepositoriesTab data={repositories} loading={loading} connectionStatus={connectionStatus} />
          )}
          {activeTab === 'insights' && (
            <InsightsTab metrics={metrics} timeline={timelineData} repositories={repositories} loading={loading} connectionStatus={connectionStatus} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Overview Tab Component
function OverviewTab({ metrics, loading, connectionStatus }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-6 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!metrics || connectionStatus === 'error') {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-8 text-center">
        <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
          ❌ Snowflake Connection Failed
        </div>
        <p className="text-red-500 dark:text-red-300">
          Unable to fetch real-time data from Snowflake database. 
          Only live data is displayed on this dashboard.
        </p>
      </div>
    )
  }

  const metricCards = [
    {
      title: 'Total Events',
      value: metrics.totalEvents?.toLocaleString() || '0',
      icon: Activity,
      color: 'from-blue-500 to-cyan-500',
      description: 'GitHub events processed'
    },
    {
      title: 'Unique Users',
      value: metrics.uniqueUsers?.toLocaleString() || '0',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      description: 'Active contributors'
    },
    {
      title: 'Repositories',
      value: metrics.uniqueRepos?.toLocaleString() || '0',
      icon: Github,
      color: 'from-purple-500 to-violet-500',
      description: 'Tracked repositories'
    },
    {
      title: 'Peak Daily Events',
      value: metrics.peakDailyEvents?.toLocaleString() || '0',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      description: 'Highest single day'
    },
    {
      title: 'Days Operational',
      value: metrics.daysOperational || '0',
      icon: Calendar,
      color: 'from-indigo-500 to-blue-500',
      description: 'Pipeline runtime'
    },
    {
      title: 'Uptime',
      value: `${metrics.uptime || 0}%`,
      icon: CheckCircle,
      color: 'from-emerald-500 to-green-500',
      description: 'System reliability'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metricCards.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 bg-gradient-to-r ${metric.color} rounded-xl`}>
              <metric.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mb-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {metric.value}
            </h3>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {metric.title}
            </p>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {metric.description}
          </p>
        </motion.div>
      ))}
    </div>
  )
}

// Timeline Tab Component
function TimelineTab({ data, loading, connectionStatus }) {
  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 animate-pulse">
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    )
  }

  if (!data || connectionStatus === 'error') {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-8 text-center">
        <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
          ❌ Timeline Data Unavailable
        </div>
        <p className="text-red-500 dark:text-red-300">
          Unable to fetch real-time timeline from Snowflake. Only live data is shown.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Daily Activity Timeline
        </h3>
        <div className="space-y-4">
          {data?.map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{day.date}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {day.uniqueUsers} users • {day.uniqueRepositories} repositories
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {day.totalEvents.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">events</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Repositories Tab Component
function RepositoriesTab({ data, loading, connectionStatus }) {
  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 animate-pulse">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!data || connectionStatus === 'error') {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-8 text-center">
        <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
          ❌ Repository Data Unavailable
        </div>
        <p className="text-red-500 dark:text-red-300">
          Unable to fetch real-time repository data from Snowflake. Only live data is shown.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Top Active Repositories
      </h3>
      <div className="space-y-3">
        {data?.map((repo, index) => (
          <motion.div
            key={repo.repoName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Github className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{repo.repoName}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {repo.uniqueContributors} contributor{repo.uniqueContributors !== 1 ? 's' : ''} • {repo.category}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {repo.totalActivity}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">events</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Insights Tab Component
function InsightsTab({ metrics, timeline, repositories, loading, connectionStatus }) {
  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 animate-pulse">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!metrics || !timeline || !repositories || connectionStatus === 'error') {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-8 text-center">
        <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
          ❌ Insights Data Unavailable
        </div>
        <p className="text-red-500 dark:text-red-300">
          Unable to fetch real-time insights from Snowflake. Only live data is shown.
        </p>
      </div>
    )
  }

  const insights = [
    {
      title: 'Pipeline Performance',
      description: `Processed ${metrics.totalEvents?.toLocaleString()} events with ${metrics.uptime}% uptime over ${metrics.daysOperational} days of operation.`,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Community Activity',
      description: `Peak activity reached ${metrics.peakDailyEvents?.toLocaleString()} events in a single day with ${metrics.uniqueUsers?.toLocaleString()} unique contributors.`,
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Repository Engagement',
      description: `Tracked activity across ${metrics.uniqueRepos?.toLocaleString()} repositories with top repository generating ${repositories[0]?.totalActivity} events.`,
      icon: Github,
      color: 'from-purple-500 to-violet-500'
    }
  ]

  return (
    <div className="space-y-6">
      {insights.map((insight, index) => (
        <motion.div
          key={insight.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 bg-gradient-to-r ${insight.color} rounded-xl flex-shrink-0`}>
              <insight.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {insight.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {insight.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
