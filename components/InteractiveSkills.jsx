'use client'

import { motion } from 'motion/react'
import { useState } from 'react'
import { RevealOnScroll, StaggerContainer, StaggerItem } from '@/components/ScrollAnimations'

const skillCategories = {
  'Data Engineering': {
    color: '#4B7BEC',
    skills: [
      { name: 'Apache Spark', level: 90, icon: '⚡' },
      { name: 'Apache Kafka', level: 85, icon: '🔄' },
      { name: 'Apache Airflow', level: 88, icon: '🌊' },
      { name: 'ETL Pipelines', level: 95, icon: '🔧' },
      { name: 'Data Modeling', level: 87, icon: '📊' },
      { name: 'Stream Processing', level: 82, icon: '⚡' }
    ]
  },
  'Cloud Platforms': {
    color: '#50A6FF',
    skills: [
      { name: 'Google Cloud Platform', level: 92, icon: '☁️' },
      { name: 'Microsoft Azure', level: 85, icon: '🔷' },
      { name: 'Amazon Web Services', level: 80, icon: '🟧' },
      { name: 'Terraform', level: 88, icon: '🏗️' },
      { name: 'Docker', level: 90, icon: '🐳' },
      { name: 'Kubernetes', level: 75, icon: '⚙️' }
    ]
  },
  'Programming': {
    color: '#FF6F61',
    skills: [
      { name: 'Python', level: 95, icon: '🐍' },
      { name: 'SQL', level: 98, icon: '🗃️' },
      { name: 'Scala', level: 78, icon: '🔺' },
      { name: 'Go', level: 70, icon: '🐹' },
      { name: 'Java', level: 82, icon: '☕' },
      { name: 'JavaScript', level: 85, icon: '📜' }
    ]
  },
  'Analytics & BI': {
    color: '#FF8A5C',
    skills: [
      { name: 'Looker Studio', level: 90, icon: '📈' },
      { name: 'Power BI', level: 88, icon: '⚡' },
      { name: 'Tableau', level: 82, icon: '📊' },
      { name: 'BigQuery', level: 95, icon: '🔍' },
      { name: 'Databricks', level: 85, icon: '🔬' },
      { name: 'Apache Spark SQL', level: 92, icon: '💫' }
    ]
  }
}

export function InteractiveSkills() {
  const [selectedCategory, setSelectedCategory] = useState('Data Engineering')
  const [hoveredSkill, setHoveredSkill] = useState(null)

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <RevealOnScroll direction="up">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-text-primary-light dark:text-text-primary-dark">
            Technical Expertise
          </h2>
          <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-2xl mx-auto">
            Comprehensive skill set across modern data engineering, cloud platforms, and analytics tools
          </p>
        </div>
      </RevealOnScroll>

      {/* Category Tabs */}
      <StaggerContainer>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.keys(skillCategories).map((category) => (
            <StaggerItem key={category}>
              <motion.button
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary-light text-white dark:bg-primary-dark shadow-lg'
                    : 'bg-surface-light dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>

      {/* Skills Grid */}
      <motion.div
        key={selectedCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {skillCategories[selectedCategory].skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 border border-border-light dark:border-border-dark hover:border-accent-light/50 dark:hover:border-accent-dark/50 transition-all duration-300 group cursor-pointer"
            onMouseEnter={() => setHoveredSkill(skill.name)}
            onMouseLeave={() => setHoveredSkill(null)}
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <motion.span 
                  className="text-2xl"
                  animate={hoveredSkill === skill.name ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {skill.icon}
                </motion.span>
                <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                  {skill.name}
                </h3>
              </div>
              <span className="text-sm font-medium text-accent-light dark:text-accent-dark">
                {skill.level}%
              </span>
            </div>
            
            {/* Animated Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: skillCategories[selectedCategory].color }}
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
              />
            </div>
            
            {/* Skill Level Indicator */}
            <div className="mt-3 text-xs text-text-secondary-light dark:text-text-secondary-dark">
              {skill.level >= 90 ? 'Expert' : 
               skill.level >= 80 ? 'Advanced' : 
               skill.level >= 70 ? 'Intermediate' : 'Beginner'}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Skill Summary */}
      <RevealOnScroll direction="up" delay={0.3}>
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-primary-light/10 to-accent-light/10 dark:from-primary-dark/10 dark:to-accent-dark/10 rounded-xl p-8">
            <h3 className="text-xl font-semibold mb-4 text-text-primary-light dark:text-text-primary-dark">
              Skill Highlight
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              {selectedCategory === 'Data Engineering' && 
                "Specialized in building scalable data pipelines with modern tools like Apache Spark, Kafka, and Airflow for enterprise-grade solutions."}
              {selectedCategory === 'Cloud Platforms' && 
                "Expert in cloud-native architectures using GCP, Azure, and AWS with infrastructure-as-code practices for reliable, scalable deployments."}
              {selectedCategory === 'Programming' && 
                "Proficient in multiple programming languages with strong focus on Python and SQL for data processing and analysis workflows."}
              {selectedCategory === 'Analytics & BI' && 
                "Advanced experience in business intelligence tools and platforms, creating insightful dashboards and reports for data-driven decisions."}
            </p>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  )
}
