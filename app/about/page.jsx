'use client'

import { motion } from 'framer-motion'
import { SafeCanvas } from '@/components/WebGLManager'
import { OrbitControls, Float, Sphere, Box, Text3D, Environment } from '@react-three/drei'
import { Code, Database, Cloud, Brain, Users, Zap, Award, Target, Coffee, BookOpen, Lightbulb } from 'lucide-react'
import { ScrollProgress, RevealOnScroll, StaggerContainer, StaggerItem } from '@/components/ScrollAnimations'
import { useRef, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTheme } from '@/components/ThemeProvider'

function DataVisualization3D() {
  const groupRef = useRef()
  const { theme } = useTheme()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  // Create data nodes representing different aspects of data engineering
  const dataNodes = [
    { position: [0, 2, 0], color: '#4B7BEC', scale: 0.8 },
    { position: [-2, 0, 0], color: '#FF6F61', scale: 0.6 },
    { position: [2, 0, 0], color: '#28A745', scale: 0.7 },
    { position: [0, -1.5, 1], color: '#FFA500', scale: 0.5 },
    { position: [-1, 1, -1], color: '#9966CC', scale: 0.6 },
    { position: [1, -0.5, -1], color: '#20B2AA', scale: 0.5 },
  ]

  return (
    <group ref={groupRef}>
      {dataNodes.map((node, index) => (
        <Float 
          key={index}
          speed={2 + index * 0.2} 
          rotationIntensity={0.3} 
          floatIntensity={0.8}
        >
          <Sphere position={node.position} scale={node.scale}>
            <meshStandardMaterial 
              color={node.color}
              transparent
              opacity={0.8}
              emissive={node.color}
              emissiveIntensity={0.2}
            />
          </Sphere>
        </Float>
      ))}
      
      {/* Connecting lines effect with boxes */}
      <Float speed={1} rotationIntensity={0.1}>
        <Box position={[0, 0, 0]} scale={[3, 0.1, 0.1]}>
          <meshStandardMaterial 
            color={theme === 'dark' ? '#50A6FF' : '#4B7BEC'}
            transparent
            opacity={0.3}
          />
        </Box>
      </Float>
      
      <Float speed={1.2} rotationIntensity={0.1}>
        <Box position={[0, 0, 0]} scale={[0.1, 3, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial 
            color={theme === 'dark' ? '#FF8A5C' : '#FF6F61'}
            transparent
            opacity={0.3}
          />
        </Box>
      </Float>
    </group>
  )
}

export default function AboutPage() {
  const { theme } = useTheme()
  
  const skills = [
    { icon: Database, title: 'ETL & Data Pipelines', description: 'Apache Spark, Apache Airflow, Azure Data Factory, real-time data processing', color: 'from-blue-500 to-cyan-500' },
    { icon: Cloud, title: 'Cloud Architecture', description: 'Azure, GCP, AWS, Terraform, Kubernetes, serverless computing', color: 'from-purple-500 to-pink-500' },
    { icon: Code, title: 'Programming & Development', description: 'Python, SQL, Scala, PySpark, Apache Kafka, REST APIs', color: 'from-green-500 to-emerald-500' },
    { icon: Brain, title: 'Analytics & BI', description: 'Looker Studio, Power BI, Tableau, BigQuery, advanced analytics', color: 'from-orange-500 to-red-500' },
    { icon: Zap, title: 'DevOps & Infrastructure', description: 'Docker, CI/CD, Git, monitoring, performance optimization', color: 'from-indigo-500 to-purple-500' },
    { icon: Users, title: 'Business Intelligence', description: 'Stakeholder analysis, requirements gathering, data strategy', color: 'from-pink-500 to-rose-500' },
  ]

  const journey = [
    {
      year: '2021-2025',
      title: 'Bachelor of Computer Science',
      company: 'Bina Nusantara University',
      description: 'Graduated Magna Cum Laude with GPA 3.62/4.00.',
      icon: BookOpen,
      type: 'education'
    },
    {
      year: '2024-2025',
      title: 'Business Analyst Intern',
      company: 'PT Bank Central Asia Tbk',
      description: 'Optimized operational processes achieving 20% efficiency improvement. Led stakeholder interviews and business requirements analysis.',
      icon: Target,
      type: 'work'
    },
    {
      year: '2022-2024',
      title: 'HIMTI Organization Member',
      company: 'BINUS University',
      description: 'Enhanced leadership and communication skills through active participation in technology student community events.',
      icon: Users,
      type: 'experience'
    }
  ]

  const values = [
    {
      icon: Coffee,
      title: 'Continuous Learning',
      description: 'Always exploring new technologies and best practices in the rapidly evolving data landscape.'
    },
    {
      icon: Award,
      title: 'Excellence in Delivery',
      description: 'Committed to delivering high-quality, scalable solutions that exceed expectations.'
    },
    {
      icon: Users,
      title: 'Collaborative Approach',
      description: 'Strong believer in team collaboration and knowledge sharing to achieve common goals.'
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
                      Get to know me
                    </span>
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-8 leading-tight">
                    <span className="block text-gray-900 dark:text-white">Transforming</span>
                    <span className="block bg-gradient-to-r from-primary-light via-blue-600 to-accent-light dark:from-primary-dark dark:via-blue-400 dark:to-accent-dark bg-clip-text text-transparent">
                      Data into Insights
                    </span>
                  </h1>
                  
                  <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>
                      I&apos;m a passionate <strong className="text-primary-light dark:text-primary-dark">Data Engineer</strong> and 
                      <strong className="text-primary-light dark:text-primary-dark"> Business Intelligence Specialist</strong> with 
                      a proven track record of building robust, scalable data solutions that drive business growth.
                    </p>
                    
                    <p>
                      My expertise spans the entire data ecosystem - from real-time ingestion with 
                      <strong className="text-accent-light dark:text-accent-dark"> Apache Kafka</strong> and 
                      <strong className="text-accent-light dark:text-accent-dark"> Apache Spark</strong> to orchestrating 
                      complex ETL pipelines with <strong className="text-accent-light dark:text-accent-dark">Apache Airflow</strong>. 
                      I specialize in cloud-native architectures across Azure, GCP, and AWS.
                    </p>
                    
                    <p>
                      Currently completing my Computer Science degree at 
                      <strong className="text-primary-light dark:text-primary-dark"> Bina Nusantara University</strong> with 
                      Magna Cum Laude honors, while gaining real-world experience as a Business Analyst Intern at 
                      <strong className="text-primary-light dark:text-primary-dark"> Bank Central Asia</strong>.
                    </p>
                  </div>
                </RevealOnScroll>
              </div>

              <div className="lg:col-span-5">
                <RevealOnScroll direction="right" delay={0.2}>
                  <div className="h-96 relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700">
                    <SafeCanvas camera={{ position: [0, 0, 6], fov: 60 }}>
                      <Suspense fallback={null}>
                        <ambientLight intensity={0.4} />
                        <directionalLight position={[10, 10, 5]} intensity={0.6} />
                        <Environment preset="sunset" background={false} />
                        <DataVisualization3D />
                        <OrbitControls 
                          enableZoom={false} 
                          enablePan={false} 
                          autoRotate 
                          autoRotateSpeed={0.5}
                        />
                      </Suspense>
                    </SafeCanvas>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <RevealOnScroll direction="up">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  Skills & Expertise
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  My comprehensive expertise spans data engineering, cloud architecture, and business intelligence - 
                  enabling me to design and implement end-to-end data solutions that drive business value.
                </p>
              </div>
            </RevealOnScroll>

            <StaggerContainer>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {skills.map((skill, index) => (
                  <StaggerItem key={index}>
                    <motion.div
                      className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${skill.color} p-0.5 mb-6`}>
                        <div className="w-full h-full bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center">
                          <skill.icon className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors">
                        {skill.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {skill.description}
                      </p>
                    </motion.div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </div>
        </section>

        {/* Journey Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <RevealOnScroll direction="up">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  My Journey
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  From academic excellence to professional experience, here&apos;s how I&apos;ve built my expertise 
                  in data engineering and business intelligence.
                </p>
              </div>
            </RevealOnScroll>

            <StaggerContainer>
              <div className="space-y-8">
                {journey.map((item, index) => (
                  <StaggerItem key={index}>
                    <motion.div
                      className="flex flex-col md:flex-row gap-6 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
                      whileHover={{ y: -4, scale: 1.01 }}
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                          item.type === 'education' ? 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800' :
                          item.type === 'work' ? 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800' :
                          item.type === 'experience' ? 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800' :
                          'bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800'
                        }`}>
                          <item.icon className={`w-8 h-8 ${
                            item.type === 'education' ? 'text-blue-600 dark:text-blue-400' :
                            item.type === 'work' ? 'text-green-600 dark:text-green-400' :
                            item.type === 'experience' ? 'text-purple-600 dark:text-purple-400' :
                            'text-orange-600 dark:text-orange-400'
                          }`} />
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                          <span className="text-sm font-medium px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                            {item.year}
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-3">{item.company}</p>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto">
            <RevealOnScroll direction="up">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  What Drives Me
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  The core values that guide my approach to data engineering and professional development.
                </p>
              </div>
            </RevealOnScroll>

            <StaggerContainer>
              <div className="grid md:grid-cols-3 gap-8">
                {values.map((value, index) => (
                  <StaggerItem key={index}>
                    <motion.div
                      className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col"
                      whileHover={{ y: -8, scale: 1.05 }}
                    >
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark rounded-2xl flex items-center justify-center">
                        <value.icon className="w-10 h-10 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        {value.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
                        {value.description}
                      </p>
                    </motion.div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </div>
        </section>
      </div>
    </>
  )
}
