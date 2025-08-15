'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, Box, Sphere, Cylinder, Torus } from '@react-three/drei'
import { ExternalLink, Github, Star, Calendar, Users, Zap, Database, Cloud, Code, Brain, Smartphone, Eye, Palette, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ScrollProgress, RevealOnScroll, StaggerContainer, StaggerItem } from '@/components/ScrollAnimations'
import { useTheme } from '@/components/ThemeProvider'

function ProjectsVisualization() {
  const groupRef = useRef()
  const { theme } = useTheme()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  const projectShapes = [
    { Component: Box, props: { args: [1.5, 1.5, 1.5] }, position: [0, 2, 0], color: '#4B7BEC', rotation: [0.5, 0.5, 0] },
    { Component: Sphere, props: { args: [0.8] }, position: [-2.5, 0, 0], color: '#FF6F61', rotation: [0, 0, 0] },
    { Component: Cylinder, props: { args: [0.6, 0.6, 1.5] }, position: [2.5, 0, 0], color: '#28A745', rotation: [0, 0, 0.5] },
    { Component: Torus, props: { args: [0.8, 0.3] }, position: [0, -2, 0], color: '#FFA500', rotation: [0.5, 0, 0] },
    { Component: Box, props: { args: [0.8, 0.8, 2] }, position: [-1.5, 1.5, -1], color: '#9966CC', rotation: [0.3, 0.3, 0.3] },
    { Component: Sphere, props: { args: [0.5] }, position: [1.5, -1.5, 1], color: '#20B2AA', rotation: [0, 0, 0] },
  ]

  return (
    <group ref={groupRef}>
      {projectShapes.map((shape, index) => (
        <Float 
          key={index}
          speed={1.5 + index * 0.2} 
          rotationIntensity={0.3} 
          floatIntensity={0.5}
          position={shape.position}
          rotation={shape.rotation}
        >
          <shape.Component {...shape.props}>
            <meshStandardMaterial 
              color={shape.color}
              transparent
              opacity={0.8}
              emissive={shape.color}
              emissiveIntensity={0.1}
            />
          </shape.Component>
        </Float>
      ))}
    </group>
  )
}

export default function ProjectsPage() {
  const [filter, setFilter] = useState('all')
  const { theme } = useTheme()
  
  const categories = [
    { key: 'all', label: 'All Projects', icon: Code },
    { key: 'automation', label: 'Automation', icon: Zap },
    { key: 'computer-vision', label: 'Computer Vision', icon: Eye },
    { key: 'data-analytics', label: 'Data Analytics', icon: BarChart3 },
    { key: 'data-engineering', label: 'Data Engineering', icon: Database },
    { key: 'machine-learning', label: 'Machine Learning', icon: Brain },
    { key: 'mobile-development', label: 'Mobile Development', icon: Smartphone },
    { key: 'ui-ux-design', label: 'UI/UX Design', icon: Palette },
    { key: 'web-development', label: 'Web Development', icon: Code },
  ]

  const projects = [
    {
      id: 1,
      title: "Enterprise-Grade Sales & Marketing Data Platform",
      description: "GCP based e-commerce analytics platform with automated ELT pipelines and real-time dashboards",
      category: 'data-engineering',
      tags: ["GCP", "BigQuery", "Airflow", "dbt", "Terraform", "Python", "SQL", "Looker Studio"],
      image: '/dataplatform.png',
      github: "https://github.com/idabaguspurwa/Enterprise-Grade-Sales-and-Marketing-Data-Platform",
      demo: "https://lookerstudio.google.com/reporting/cb541980-d4a0-41bd-97f1-68cc0adecafe",
      featured: true,
      year: '2025',
      team: 'Solo Project',
      status: 'Completed',
      highlights: [
        'Infrastructure as Code with Terraform',
        'Medallion architecture patterns',
        'Real-time business intelligence',
        'Production-grade monitoring'
      ]
    },
    {
      id: 2,
      title: "Real-Time Football Match Data Streaming Pipeline",
      description: "Stream live match events using Kafka → Spark Streaming → BigQuery for instant analytics and insights",
      category: 'data-engineering',
      tags: ["GCP", "Apache Kafka", "Spark Streaming", "BigQuery", "Terraform", "Docker", "Airflow", "Avro", "Looker Studio"],
      image: '/football-streaming.png',
      github: "https://github.com/idabaguspurwa/Football_Fixtures_Match_Tracker",
      demo: "https://lookerstudio.google.com/reporting/6cef80f3-5906-46e0-b23d-94f1494c8979",
      featured: true,
      year: '2025',
      team: 'Solo Project',
      status: 'Completed',
      highlights: [
        'Sub-minute latency from event to insight',
        'Apache Kafka for ingestion',
        'PySpark Streaming on Dataproc',
        'Schema enforcement with Avro'
      ]
    },
    {
      id: 3,
      title: "F1 Racing Analytics Project",
      description: "Comprehensive Formula 1 racing data analytics platform built on Azure Databricks with medallion architecture for end-to-end data engineering and BI reporting.",
      category: 'data-analytics',
      tags: ["Azure Databricks", "PySpark", "Delta Lake", "Azure", "SQL", "Power BI", "Data Engineering"],
      image: '/f1analytics.png',
      github: "https://github.com/idabaguspurwa/F1-Racing-Analytics",
      demo: null,
      featured: false,
      year: '2025',
      team: 'Solo Project',
      status: 'Completed',
      highlights: [
        'Medallion architecture (Bronze-Silver-Gold)',
        'Delta Lake for ACID transactions',
        'Incremental loading with merge operations',
        'Interactive Power BI dashboards'
      ]
    },
    {
      id: 4,
      title: "Stock Market Data Pipeline",
      description: "Comprehensive stock market data pipeline using Apache Airflow, Spark, and MinIO for real-time stock price extraction and processing.",
      category: 'data-engineering',
      tags: ["Apache Airflow", "Apache Spark", "MinIO", "Docker", "Python", "Data Engineering"],
      image: '/stockmarket.png',
      github: "https://github.com/idabaguspurwa/stock_market_data_pipeline",
      demo: null,
      featured: false,
      year: '2025',
      team: 'Solo Project',
      status: 'Completed',
      highlights: [
        'Automated daily pipeline execution',
        'Real-time stock price extraction',
        'Comprehensive error handling',
        'Containerized architecture'
      ]
    },
    {
      id: 5,
      title: "NYC Taxi Analytics Project",
      description: "NYC taxi analytics on Azure Synapse with medallion architecture for multi-format data processing and BI.",
      category: 'data-analytics',
      tags: ["Azure Synapse", "Serverless SQL", "Apache Spark", "Azure Data Lake", "SQL", "Data Analytics"],
      image: '/nyctaxi.png',
      github: "https://github.com/idabaguspurwa/NYC-Taxi-Analytics",
      demo: null,
      featured: false,
      year: '2025',
      team: 'Solo Project',
      status: 'Completed',
      highlights: [
        'Multi-format data processing',
        'Automated ETL with Azure Data Factory',
        'Serverless SQL queries',
        'Geographic insights dashboard'
      ]
    },
    {
      id: 6,
      title: "Professional Portfolio Website",
      description: "Modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS showcasing data engineering and analytics expertise.",
      category: 'web-development',
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "React", "Framer Motion", "Vercel"],
      image: '/reactporto.png',
      github: "https://github.com/idabaguspurwa/portfolio-website",
      demo: "https://idabaguspurwa.vercel.app/",
      featured: false,
      year: '2025',
      team: 'Solo Project',
      status: 'Completed',
      highlights: [
        'Dynamic project filtering',
        'Smooth animations with Framer Motion',
        'Dark/light theme toggle',
        'SEO optimization'
      ]
    },
    {
      id: 7,
      title: "3D Portfolio Website",
      description: "A modern portfolio showcasing work through interactive 3D elements and animations. Built with React, Vite, and TailwindCSS to deliver a visually impressive experience across devices.",
      category: 'web-development',
      tags: ["Vite", "React", "TailwindCSS"],
      image: '/3dportfolio.png',
      github: "https://github.com/idabaguspurwa/3d-portfolio",
      demo: "https://idabaguspurwa3d-portfolio.vercel.app/",
      featured: false,
      year: '2025',
      team: 'Solo Project',
      status: 'Completed',
      highlights: [
        'Interactive 3D elements',
        'Dynamic animations',
        'Responsive design',
        'Performance optimization'
      ]
    },
    {
      id: 8,
      title: "Fake News Detection Paper using Machine Learning Technique",
      description: "Research paper comparing BERT, TF-IDF, and GloVe embeddings with different ML models using advanced NLP techniques.",
      category: 'machine-learning',
      tags: ["Machine Learning", "TF-IDF", "BERT", "GloVe", "NLP"],
      image: '/fakenewsDetection.png',
      github: "https://github.com/idabaguspurwa/fakeNewsDetection-ML",
      demo: null,
      featured: false,
      year: '2025',
      team: 'Research Team',
      status: 'Completed',
      highlights: [
        'BERT vs TF-IDF comparison',
        'Advanced NLP techniques',
        'Systematic analysis',
        'Research publication'
      ]
    },
    {
      id: 9,
      title: "Basketball Player Face Detection & Recognition",
      description: "Basketball player recognition using OpenCV, LBPH, and advanced data augmentation",
      category: 'computer-vision',
      tags: ["OpenCV", "Computer Vision", "Machine Learning", "Python", "LBPH", "Face Detection"],
      image: '/basketball-detection.png',
      github: "https://github.com/idabaguspurwa/cv_basketball_player_detection",
      demo: null,
      featured: false,
      year: '2025',
      team: 'Solo Project',
      status: 'Completed',
      highlights: [
        'Haar Cascade detection',
        'LBPH recognition algorithm',
        'Advanced data augmentation',
        'Real-time visual output'
      ]
    },
    {
      id: 10,
      title: "Beritau - Mobile News Application",
      description: "Beritau offers Indonesian users a streamlined news experience from diverse sources. The app functions like Line Today, Detik, and Kompas.",
      category: 'mobile-development',
      tags: ["Java", "Mobile Programming"],
      image: '/beritau_mobile.png',
      github: "https://github.com/chelluu/MobProg_Final",
      demo: "https://www.figma.com/design/MRtoDlIUiQYvvvEDerE7UF/Mob-Prog-Anjay?node-id=0-1&p=f&t=ccUXWxCLTndrB5c6-0",
      featured: false,
      year: '2025',
      team: 'Team Project',
      status: 'Completed',
      highlights: [
        'Clean user-friendly design',
        'Content aggregation',
        'Intuitive interface',
        'Indonesian market focus'
      ]
    },
    {
      id: 11,
      title: "Email Cleanup Automation Tool",
      description: "Web automation tool that uses Selenium and TestNG to delete unread emails from a user's inbox.",
      category: 'automation',
      tags: ["Java", "Selenium", "Web Automation", "TestNG"],
      image: '/mail_deletion.jpg',
      github: "https://github.com/idabaguspurwa/MailDeletion",
      demo: null,
      featured: false,
      year: '2025',
      team: 'Solo Project',
      status: 'Completed',
      highlights: [
        'Selenium WebDriver automation',
        'TestNG integration',
        'Authentication handling',
        'Comprehensive reporting'
      ]
    },
    {
      id: 12,
      title: "Contractor Website UI/UX",
      description: "A contractor platform developed as our SE project. This marketplace combines social and professional features.",
      category: 'ui-ux-design',
      tags: ["UI/UX", "Figma"],
      image: '/viewContractor.png',
      github: null,
      demo: "https://www.figma.com/design/sbIo50vnABJ3KFq8LSRJVY/Web-Kontraktor?node-id=0-1&p=f&t=JN4UDOe9oeQreYnw-0",
      featured: false,
      year: '2025',
      team: 'Team Project',
      status: 'Completed',
      highlights: [
        'Comprehensive user flows',
        'High-fidelity prototypes',
        'Trust-building elements',
        'Intuitive navigation'
      ]
    },
    {
      id: 13,
      title: "MtGraphy Photography Website",
      description: "A photography platform built as a college HCI project, focusing on user-centered design and intuitive navigation to showcase professional photography site",
      category: 'web-development',
      tags: ["HTML", "CSS", "JavaScript", "Bootstrap"],
      image: '/mtgraphy.png',
      github: "https://github.com/idabaguspurwa/mtgraphy",
      demo: "https://mtgraphy-navy.vercel.app/",
      featured: false,
      year: '2023',
      team: 'Solo Project',
      status: 'Completed',
      highlights: [
        'HCI principles implementation',
        'Image-centric layouts',
        'Accessibility features',
        'Visual hierarchy design'
      ]
    },
    {
      id: 14,
      title: "Vanilla Portfolio Website",
      description: "A clean, minimalist portfolio website built with vanilla web technologies to showcase professional skills and projects in frontend development.",
      category: 'web-development',
      tags: ["HTML", "CSS", "JavaScript"],
      image: '/portfolioimg.png',
      github: "https://github.com/idabaguspurwa/vanilla-portfolio",
      demo: "https://vanilla-portfolio-mu.vercel.app/",
      featured: false,
      year: '2023',
      team: 'Solo Project',
      status: 'Completed',
      highlights: [
        'Vanilla web technologies',
        'Minimalist design',
        'Downloadable CV functionality',
        'Optimized performance'
      ]
    }
  ]

  const filteredProjects = (filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter))
    .sort((a, b) => a.title.localeCompare(b.title))

  const featuredProjects = projects.filter(project => project.featured)
    .sort((a, b) => a.title.localeCompare(b.title))
    
  const stats = [
    { label: 'Projects Completed', value: '15+', icon: Code },
    { label: 'Data Processed', value: '1TB+', icon: Database },
    { label: 'Cloud Platforms', value: '3', icon: Cloud },
    { label: 'Technologies Mastered', value: '20+', icon: Zap },
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
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6"
                  >
                    <span className="bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark bg-clip-text text-transparent text-lg font-semibold">
                      My Work
                    </span>
                  </motion.div>
                  
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-8 leading-tight">
                    <span className="block text-gray-900 dark:text-white">Building</span>
                    <span className="block bg-gradient-to-r from-primary-light via-blue-600 to-accent-light dark:from-primary-dark dark:via-blue-400 dark:to-accent-dark bg-clip-text text-transparent">
                      Data Solutions
                    </span>
                  </h1>
                  
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    Explore my portfolio of data engineering projects, cloud solutions, and business intelligence 
                    implementations that have driven real business impact across various industries.
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                        className="text-center"
                      >
                        <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark rounded-xl flex items-center justify-center">
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </RevealOnScroll>
              </div>

              <div className="lg:col-span-5">
                <RevealOnScroll direction="right" delay={0.2}>
                  <div className="h-96 relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700">
                    <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
                      <ambientLight intensity={0.4} />
                      <directionalLight position={[10, 10, 5]} intensity={0.6} />
                      <ProjectsVisualization />
                      <OrbitControls 
                        enableZoom={false} 
                        enablePan={false} 
                        autoRotate 
                        autoRotateSpeed={0.3}
                      />
                    </Canvas>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <RevealOnScroll direction="up">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  Featured Projects
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Highlighted projects that showcase advanced data engineering capabilities and real-world impact.
                </p>
              </div>
            </RevealOnScroll>

            <StaggerContainer>
              <div className="grid lg:grid-cols-2 gap-8 mb-16">
                {featuredProjects.slice(0, 2).map((project, index) => (
                  <StaggerItem key={project.id}>
                    <motion.div
                      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col"
                      whileHover={{ y: -8, scale: 1.02 }}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500" />
                        <div className="absolute top-4 left-4">
                          <span className="bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark text-white px-3 py-1 rounded-full text-sm font-medium">
                            Featured
                          </span>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                          <span className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-lg text-xs">
                            {project.year}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-8 flex-grow flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-500">{project.team}</span>
                          <span className="mx-2">•</span>
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            project.status === 'Completed' 
                              ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                              : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors">
                            {project.title}
                          </h3>
                          
                          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                            {project.description}
                          </p>

                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Key Highlights:</h4>
                            <ul className="space-y-1">
                              {project.highlights.map((highlight, idx) => (
                                <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                  {highlight}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-6">
                            {project.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          {project.github && project.github !== 'Private' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center gap-2"
                              onClick={() => window.open(project.github, '_blank')}
                            >
                              <Github className="w-4 h-4" />
                              Code
                            </Button>
                          )}
                          {project.demo && project.demo !== 'Confidential' && (
                            <Button 
                              size="sm" 
                              className="flex items-center gap-2"
                              onClick={() => window.open(project.demo, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                              Demo
                            </Button>
                          )}
                          {(project.github === 'Private' || project.demo === 'Confidential') && (
                            <span className="text-sm text-gray-500 italic flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              Enterprise Project
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </div>
        </section>

        {/* Filter Categories */}
        <section className="py-10 px-6 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <RevealOnScroll direction="up">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-heading font-bold mb-4">Browse by Category</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Filter projects by technology stack and domain expertise
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                {categories.map((category) => (
                  <motion.button
                    key={category.key}
                    onClick={() => setFilter(category.key)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      filter === category.key
                        ? 'bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark text-white shadow-lg'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md border border-gray-200 dark:border-gray-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <category.icon className="w-4 h-4" />
                    {category.label}
                  </motion.button>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* All Projects Grid */}
        <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <RevealOnScroll direction="up">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  {filter === 'all' ? 'All Projects' : categories.find(c => c.key === filter)?.label}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col"
                  whileHover={{ y: -6, scale: 1.03 }}
                >
                  <div className="relative h-32 overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500" />
                    {project.featured && (
                      <div className="absolute top-3 left-3">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-500">{project.year}</span>
                      <span className="mx-1">•</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        project.status === 'Completed' 
                          ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                          : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3 flex-grow">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-2 py-1 text-gray-500 text-xs">
                          +{project.tags.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {project.github && project.github !== 'Private' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1 text-xs"
                          onClick={() => window.open(project.github, '_blank')}
                        >
                          <Github className="w-3 h-3" />
                          Code
                        </Button>
                      )}
                      {project.demo && project.demo !== 'Confidential' && (
                        <Button 
                          size="sm" 
                          className="flex items-center gap-1 text-xs"
                          onClick={() => window.open(project.demo, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3" />
                          Demo
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}