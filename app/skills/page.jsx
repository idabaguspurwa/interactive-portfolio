'use client'

import { motion } from 'framer-motion'
import { SafeCanvas } from '@/components/WebGLManager'
import { OrbitControls, Float, Icosahedron, Octahedron, Dodecahedron, MeshDistortMaterial, Sphere, Box } from '@react-three/drei'
import { 
  Code, 
  Database, 
  Cloud, 
  Smartphone, 
  Wrench, 
  GitBranch,
  Server,
  Monitor,
  Layers,
  Zap,
  Brain,
  Users,
  TrendingUp,
  Target
} from 'lucide-react'
import { ScrollProgress, RevealOnScroll, StaggerContainer, StaggerItem } from '@/components/ScrollAnimations'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTheme } from '@/components/ThemeProvider'

function SkillsVisualization() {
  const groupRef = useRef()
  const { theme } = useTheme()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  const skillShapes = [
    { 
      Component: Icosahedron, 
      props: { args: [1.2, 1] }, 
      position: [0, 0, 0], 
      color: '#4B7BEC',
      distortProps: { distort: 0.3, speed: 1.5 }
    },
    { 
      Component: Octahedron, 
      props: { args: [0.8] }, 
      position: [-2.5, 1.5, 0], 
      color: '#FF6F61',
      distortProps: { distort: 0.2, speed: 2 }
    },
    { 
      Component: Dodecahedron, 
      props: { args: [0.7] }, 
      position: [2.5, -1.5, 0], 
      color: '#28A745',
      distortProps: { distort: 0.4, speed: 1 }
    },
    { 
      Component: Sphere, 
      props: { args: [0.6] }, 
      position: [-1.8, -1.8, 1], 
      color: '#FFA500',
      distortProps: { distort: 0.1, speed: 3 }
    },
    { 
      Component: Box, 
      props: { args: [1, 1, 1] }, 
      position: [2, 2, -1], 
      color: '#9966CC',
      distortProps: { distort: 0.2, speed: 1.8 }
    },
  ]

  return (
    <group ref={groupRef}>
      {skillShapes.map((shape, index) => (
        <Float 
          key={index}
          speed={1 + index * 0.3} 
          rotationIntensity={0.4} 
          floatIntensity={0.6}
          position={shape.position}
        >
          <shape.Component {...shape.props}>
            <MeshDistortMaterial
              color={shape.color}
              attach="material"
              {...shape.distortProps}
              roughness={0.1}
              metalness={0.2}
              transparent
              opacity={0.9}
            />
          </shape.Component>
        </Float>
      ))}
    </group>
  )
}

function SkillMeter({ skill, index }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-900 dark:text-white">{skill.name}</span>
        <span className="text-sm text-gray-600 dark:text-gray-300">{skill.level}%</span>
      </div>
      
      <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${skill.level}%` }}
          transition={{ delay: index * 0.1 + 0.5, duration: 1, ease: "easeOut" }}
        />
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={isHovered ? { x: "100%" } : { x: "-100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
      
      <motion.p 
        className="text-sm text-gray-600 dark:text-gray-300 mt-2"
        initial={{ height: 0, opacity: 0 }}
        animate={isHovered ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {skill.description}
      </motion.p>
    </motion.div>
  )
}

export default function SkillsPage() {
  const { theme } = useTheme()
  const [selectedCategory, setSelectedCategory] = useState('technical')

  const skillCategories = [
    {
      id: 'technical',
      title: 'Technical Skills',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      description: 'Core programming and development technologies'
    },
    {
      id: 'data',
      title: 'Data Engineering',
      icon: Database,
      color: 'from-green-500 to-emerald-500',
      description: 'Data processing, pipelines, and analytics'
    },
    {
      id: 'cloud',
      title: 'Cloud Platforms',
      icon: Cloud,
      color: 'from-purple-500 to-pink-500',
      description: 'Cloud infrastructure and services'
    },
    {
      id: 'tools',
      title: 'Tools & DevOps',
      icon: Wrench,
      color: 'from-orange-500 to-red-500',
      description: 'Development tools and operational practices'
    },
    {
      id: 'soft',
      title: 'Soft Skills',
      icon: Users,
      color: 'from-indigo-500 to-purple-500',
      description: 'Leadership and communication abilities'
    }
  ]

  const skills = {
    technical: [
      { name: 'Python', level: 95, description: 'Advanced proficiency in data processing, automation, and web development' },
      { name: 'SQL', level: 90, description: 'Complex query optimization, stored procedures, and database design' },
      { name: 'Scala', level: 80, description: 'Functional programming for big data processing with Spark' },
      { name: 'JavaScript/TypeScript', level: 85, description: 'Modern web development with React, Node.js, and TypeScript' },
      { name: 'PySpark', level: 88, description: 'Large-scale data processing and distributed computing' },
      { name: 'Apache Kafka', level: 85, description: 'Real-time data streaming and event-driven architectures' }
    ],
    data: [
      { name: 'Apache Spark', level: 90, description: 'Big data processing, ML pipelines, and distributed computing' },
      { name: 'Apache Airflow', level: 88, description: 'Workflow orchestration and complex DAG management' },
      { name: 'ETL/ELT Pipelines', level: 92, description: 'Data transformation, validation, and quality assurance' },
      { name: 'Data Modeling', level: 85, description: 'Dimensional modeling, star/snowflake schemas, data warehousing' },
      { name: 'BigQuery', level: 87, description: 'Advanced analytics, performance optimization, and cost management' },
      { name: 'Data Lake Architecture', level: 83, description: 'Delta Lake, data partitioning, and metadata management' }
    ],
    cloud: [
      { name: 'Azure Data Factory', level: 90, description: 'ETL pipeline orchestration and hybrid data integration' },
      { name: 'Google Cloud Platform', level: 85, description: 'Dataproc, Cloud Functions, Pub/Sub, and BigQuery' },
      { name: 'Amazon Web Services', level: 80, description: 'EKS, S3, Managed Airflow (MWAA), and Lambda' },
      { name: 'Terraform', level: 85, description: 'Infrastructure as Code, state management, and cloud automation' },
      { name: 'Docker & Kubernetes', level: 82, description: 'Containerization, orchestration, and microservices' },
      { name: 'Azure Databricks', level: 88, description: 'Collaborative analytics, MLOps, and performance tuning' }
    ],
    tools: [
      { name: 'Git & GitHub', level: 90, description: 'Version control, branching strategies, and collaborative development' },
      { name: 'CI/CD Pipelines', level: 85, description: 'Azure DevOps, automated testing, and deployment strategies' },
      { name: 'Looker Studio', level: 92, description: 'Advanced visualization, dashboard design, and data storytelling' },
      { name: 'Power BI', level: 88, description: 'Enterprise reporting, DAX formulas, and business intelligence' },
      { name: 'Tableau', level: 83, description: 'Interactive dashboards and advanced analytics visualizations' },
      { name: 'Monitoring & Logging', level: 80, description: 'Application monitoring, log analysis, and alerting systems' }
    ],
    soft: [
      { name: 'Leadership', level: 85, description: 'Team leadership, project management, and mentoring junior developers' },
      { name: 'Communication', level: 90, description: 'Technical writing, stakeholder presentations, and cross-team collaboration' },
      { name: 'Problem Solving', level: 92, description: 'Analytical thinking, root cause analysis, and innovative solutions' },
      { name: 'Business Analysis', level: 88, description: 'Requirements gathering, process optimization, and stakeholder management' },
      { name: 'Agile Methodologies', level: 85, description: 'Scrum, Kanban, sprint planning, and iterative development' },
      { name: 'Continuous Learning', level: 95, description: 'Staying current with emerging technologies and industry best practices' }
    ]
  }

  const achievements = [
    {
      icon: Target,
      title: 'Operational Excellence',
      description: 'Achieved 20% process optimization at PT Bank Central Asia',
      metric: '20%',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: TrendingUp,
      title: 'Academic Performance',
      description: 'Magna Cum Laude graduate with GPA 3.62/4.00',
      metric: '3.62',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Brain,
      title: 'Technical Certifications',
      description: 'Multiple cloud and data engineering certifications',
      metric: '5+',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Project Leadership',
      description: 'Successfully led cross-functional teams',
      metric: '2+',
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <>
      <ScrollProgress />
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">
                <RevealOnScroll direction="left">
                  <div className="mb-6">
                    <span className="bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark bg-clip-text text-transparent text-lg font-semibold">
                      My Expertise
                    </span>
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-8 leading-tight">
                    <span className="block text-gray-900 dark:text-white">Technical</span>
                    <span className="block bg-gradient-to-r from-primary-light via-blue-600 to-accent-light dark:from-primary-dark dark:via-blue-400 dark:to-accent-dark bg-clip-text text-transparent">
                      Excellence
                    </span>
                  </h1>
                  
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    A comprehensive overview of my technical skills, tools, and methodologies that I use to 
                    build robust data engineering solutions and drive business impact.
                  </p>

                  {/* Achievements Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={index}
                        className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        whileHover={{ y: -4, scale: 1.05 }}
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br ${achievement.color} rounded-xl flex items-center justify-center`}>
                          <achievement.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{achievement.metric}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">{achievement.title}</div>
                      </motion.div>
                    ))}
                  </div>
                </RevealOnScroll>
              </div>

              <div className="lg:col-span-5">
                <RevealOnScroll direction="right" delay={0.2}>
                  <div className="h-96 relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700">
                    <SafeCanvas camera={{ position: [0, 0, 6], fov: 60 }}>
                      <ambientLight intensity={0.4} />
                      <directionalLight position={[10, 10, 5]} intensity={0.6} />
                      <SkillsVisualization />
                      <OrbitControls 
                        enableZoom={false} 
                        enablePan={false} 
                        autoRotate 
                        autoRotateSpeed={0.4}
                      />
                    </SafeCanvas>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Categories */}
        <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <RevealOnScroll direction="up">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  Skill Categories
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Explore my expertise across different domains of technology and business.
                </p>
              </div>
            </RevealOnScroll>

            <StaggerContainer>
              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
                {skillCategories.map((category, index) => (
                  <StaggerItem key={category.id}>
                    <motion.button
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full p-6 rounded-2xl text-center transition-all duration-500 ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-br from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark text-white shadow-xl transform scale-105'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-lg border border-gray-200 dark:border-gray-700'
                      }`}
                      whileHover={{ y: selectedCategory === category.id ? 0 : -4 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                        selectedCategory === category.id
                          ? 'bg-white/20'
                          : `bg-gradient-to-br ${category.color}`
                      }`}>
                        <category.icon className={`w-8 h-8 ${
                          selectedCategory === category.id ? 'text-white' : 'text-white'
                        }`} />
                      </div>
                      <h3 className="font-semibold mb-2">{category.title}</h3>
                      <p className={`text-sm ${
                        selectedCategory === category.id 
                          ? 'text-white/80' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {category.description}
                      </p>
                    </motion.button>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>

            {/* Skills Display */}
            <motion.div
              key={selectedCategory}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                {skillCategories.find(cat => cat.id === selectedCategory)?.title}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                {skills[selectedCategory]?.map((skill, index) => (
                  <SkillMeter key={skill.name} skill={skill} index={index} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Certification & Learning Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <RevealOnScroll direction="up">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  Continuous Learning
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  I believe in continuous learning and staying current with emerging technologies in the 
                  rapidly evolving data engineering landscape.
                </p>
              </div>
            </RevealOnScroll>

            <StaggerContainer>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <StaggerItem>
                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-800"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                      <Cloud className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Cloud Certifications
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Pursuing advanced certifications in Azure, GCP, and AWS to stay current with cloud technologies.
                    </p>
                    <div className="space-y-2">
                      <div className="text-sm text-blue-600 dark:text-blue-400">• Azure Data Engineer Associate</div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">• GCP Professional Data Engineer</div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">• AWS Certified Solutions Architect</div>
                    </div>
                  </motion.div>
                </StaggerItem>

                <StaggerItem>
                  <motion.div
                    className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-8 rounded-2xl border border-green-200 dark:border-green-800"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                      <Database className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Data Engineering
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Continuous exploration of modern data stack and emerging technologies in the data ecosystem.
                    </p>
                    <div className="space-y-2">
                      <div className="text-sm text-green-600 dark:text-green-400">• Apache Kafka & Event Streaming</div>
                      <div className="text-sm text-green-600 dark:text-green-400">• Delta Lake & Data Lakehouse</div>
                      <div className="text-sm text-green-600 dark:text-green-400">• dbt & Modern Data Stack</div>
                    </div>
                  </motion.div>
                </StaggerItem>

                <StaggerItem>
                  <motion.div
                    className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-8 rounded-2xl border border-purple-200 dark:border-purple-800"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Leadership & Soft Skills
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Developing leadership capabilities and business acumen to drive organizational impact.
                    </p>
                    <div className="space-y-2">
                      <div className="text-sm text-purple-600 dark:text-purple-400">• Technical Leadership</div>
                      <div className="text-sm text-purple-600 dark:text-purple-400">• Business Strategy</div>
                      <div className="text-sm text-purple-600 dark:text-purple-400">• Cross-functional Collaboration</div>
                    </div>
                  </motion.div>
                </StaggerItem>
              </div>
            </StaggerContainer>
          </div>
        </section>
      </div>
    </>
  )
}
