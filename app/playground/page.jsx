'use client'

import { motion } from 'framer-motion'
import { InteractiveDataPlayground } from '@/components/InteractiveDataPlayground'
import { RevealOnScroll } from '@/components/ScrollAnimations'
import { ArrowLeft, Database, Zap, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <RevealOnScroll direction="up">
          <div className="text-center mb-12">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-primary-light dark:text-primary-dark hover:underline mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </Link>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-heading font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-primary-light via-purple-600 to-accent-light dark:from-primary-dark dark:via-purple-400 dark:to-accent-dark bg-clip-text text-transparent">
                Data Engineering
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">Playground</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Experience production-grade Data Lakehouse architecture! This interactive demo showcases the Bronze → Silver → Gold 
              pipeline used by Netflix, Uber, and Airbnb with Apache Spark, Delta Lake, and modern cloud-native data engineering patterns.
            </motion.p>
          </div>
        </RevealOnScroll>

        {/* Features Overview */}
        <RevealOnScroll direction="up" delay={0.3}>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
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
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
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
          <div className="mt-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
              Technologies Demonstrated
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4 text-primary-light dark:text-primary-dark">
                  Data Processing Concepts
                </h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• ETL Pipeline Architecture</li>
                  <li>• Data Filtering & Aggregation</li>
                  <li>• Schema Transformation</li>
                  <li>• Data Quality Validation</li>
                  <li>• Real-time Processing Simulation</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-primary-light dark:text-primary-dark">
                  Production Technologies
                </h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
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
    </div>
  )
}