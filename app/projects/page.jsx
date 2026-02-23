'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'motion/react'
import { useTheme } from '@/components/ThemeProvider'
import { useQuery } from '@tanstack/react-query'
import {
  Star,
  Terminal,
  Github,
  ArrowUpRight,
  ArrowRight,
  GitFork,
  Clock,
  Code,
  Activity,
  X,
  ExternalLink,
  FolderGit2,
  Layers,
  Zap,
  CheckCircle2,
} from 'lucide-react'

/* eslint-disable @next/next/no-page-custom-font */

// ── Accent colors (shared with home/about) ────────────────────────────────
const COLORS = {
  yellow: '#ffe14d',
  coral: '#ff5757',
  blue: '#3d5afe',
  lime: '#c6ff00',
  pink: '#ff8fab',
  lavender: '#c3b1e1',
  mint: '#98ffc8',
  peach: '#ffc9a9',
  sky: '#89cff0',
}

const MARQUEE_TEXT = 'PROJECTS \u2605 GITHUB DASHBOARD \u2605 OPEN SOURCE \u2605 '

// ── Language colors ─────────────────────────────────────────────────────────
const LANG_COLORS = {
  Python: '#3572A5',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HCL: '#844FBA',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Go: '#00ADD8',
  Jupyter: '#DA5B0B',
  'Jupyter Notebook': '#DA5B0B',
  Dockerfile: '#384d54',
}

// ── Fallback descriptions for repos with no GitHub description ───────────────
const REPO_DESCRIPTIONS = {
  '3d-portfolio':
    'Interactive 3D portfolio built with React, Vite, and Three.js featuring animated island, plane, and sky models with page navigation.',
  'cv_basketball_player_detection':
    'Computer vision system for detecting and recognizing basketball players using OpenCV Haar Cascade and LBPH face recognizer with data augmentation.',
  'e-commerce':
    'Full-stack e-commerce platform built on Payload CMS with authentication, shopping cart, checkout, Stripe payments, and layout builder.',
  'Enterprise-Grade-Sales-and-Marketing-Data-Platform':
    'Production-grade GCP data platform with automated ELT pipelines, dbt medallion architecture, Terraform IaC, and Looker Studio dashboards for e-commerce analytics.',
  'F1-Racing-Analytics':
    'Formula 1 racing analytics platform on Azure Databricks with PySpark, Delta Lake, and medallion architecture for end-to-end data engineering and Power BI reporting.',
  'fakeNewsDetection-ML':
    'Research project comparing BERT, TF-IDF, and GloVe embeddings for fake news detection using machine learning classifiers on Kaggle datasets.',
  'Football_Fixtures_Match_Tracker':
    'Real-time football match streaming pipeline on GCP using Kafka with Avro schemas, PySpark on Dataproc, BigQuery, and Looker Studio dashboards.',
  'MailDeletion':
    'Selenium-based Gmail automation framework using Java, TestNG, and Maven to detect and bulk-delete unread emails with security prompt handling.',
  'NYC-Taxi-Analytics':
    'NYC taxi trip analytics on Azure Synapse with serverless SQL, Apache Spark, and medallion architecture processing CSV, Parquet, JSON, and Delta formats.',
  'portfolio-website':
    'Responsive portfolio website built with Next.js, TypeScript, Tailwind CSS, and Framer Motion featuring project filtering, dark mode, and contact form.',
  'stock_market_data_pipeline':
    'Containerized stock market pipeline using Airflow, Spark, MinIO, and Docker that extracts NVDA prices from Yahoo Finance, transforms, and loads into a warehouse.',
  'synapsis_ppe':
    'ML data engineering challenge building a PPE detection foundation: annotation schema design, dataset collection and labeling, and statistical analysis with Python.',
  'travel-buddies':
    'Collaborative travel planning app built with Next.js, TypeScript, Supabase, and Google Gemini featuring real-time collaboration, budget tracking, and 3D visuals.',
  'vanilla-portfolio':
    'Minimalist portfolio website built with vanilla HTML, CSS, and JavaScript with responsive design and downloadable CV functionality.',
  'interactive-portfolio':
    'AI-powered portfolio with live GitHub analytics, interactive 3D graphics, dual AI exploration (Gemini + DeepSeek), and neo-brutalist design.',
  'idabaguspurwa':
    'GitHub profile README.',
  'idabaguspurwa.github.io':
    'Personal GitHub Pages site.',
  'github-events-pipeline':
    'Production-ready pipeline capturing and analyzing GitHub events in real-time using Kafka, Airflow, dbt, Snowflake, and Kubernetes with full observability.',
  'champions-league-data-pipeline':
    'End-to-end Champions League data pipeline deployed on AWS with MWAA, EKS, Docker, Terraform, and data quality gates via Great Expectations.',
  'mtgraphy':
    'Photography website built as a college HCI project focusing on user-centered design, image-centric layouts, and intuitive navigation.',
}

// ── Featured case studies ───────────────────────────────────────────────────
const FEATURED_CASE_STUDIES = {
  'github-events-pipeline': {
    problem:
      'Needed a production-ready system to capture and analyze GitHub events in real-time with sub-second latency and horizontal scaling.',
    solution:
      'Built a Kubernetes-native streaming pipeline with Kafka for ingestion, Spark for processing, and Snowflake for analytics, orchestrated by Airflow with full Prometheus/Grafana observability.',
    architecture: [
      'GitHub API webhooks ingest events into Kafka topics',
      'Spark Streaming consumes and transforms event data',
      'Processed data lands in Snowflake via staged loads',
      'dbt models create analytics-ready tables',
      'Prometheus + Grafana for real-time observability',
    ],
    techStack: [
      'Apache Airflow',
      'Apache Kafka',
      'Kubernetes',
      'Snowflake',
      'dbt',
      'Prometheus',
      'Grafana',
      'Python',
      'Great Expectations',
    ],
    highlights: [
      'Real-time processing with sub-second latency',
      'Kubernetes-native with horizontal scaling',
      'Complete observability with custom dashboards',
      'Production-ready monitoring and alerting',
    ],
  },
  'Enterprise-Grade-Sales-and-Marketing-Data-Platform': {
    problem:
      'E-commerce business lacked unified analytics across sales and marketing channels, leading to fragmented decision-making and no single source of truth.',
    solution:
      'Designed a complete GCP-based ELT platform with Terraform-provisioned infrastructure, Cloud Composer orchestration, dbt medallion architecture, and interactive Looker Studio dashboards.',
    architecture: [
      'Terraform provisions all GCP infrastructure declaratively',
      'Raw e-commerce data ingested into Google Cloud Storage',
      'Cloud Composer (Airflow) orchestrates the ELT workflow',
      'dbt transforms data through staging and marts layers (Bronze > Silver > Gold)',
      'BigQuery serves as the analytics warehouse with Looker Studio dashboards',
    ],
    techStack: [
      'GCP',
      'BigQuery',
      'Cloud Composer',
      'dbt',
      'Terraform',
      'Python',
      'SQL',
      'HCL',
      'Looker Studio',
    ],
    highlights: [
      'All cloud resources defined as Terraform IaC',
      'Medallion architecture with staging and marts layers',
      'Comprehensive dbt testing for data quality',
      'Self-service analytics via Looker Studio',
    ],
  },
  Football_Fixtures_Match_Tracker: {
    problem:
      'Live football match data was only available through fragmented APIs with no unified streaming analytics platform for real-time insights.',
    solution:
      'Created an end-to-end GCP streaming pipeline that captures live match events from API-Football, publishes to Kafka with Avro schemas, processes via PySpark on Dataproc, and visualizes on Looker Studio.',
    architecture: [
      'API-Football service feeds live match events (goals, cards, substitutions)',
      'Dockerized Kafka producer publishes events with Avro schema enforcement',
      'PySpark Streaming on Cloud Dataproc processes events in real-time',
      'Cleaned data loads into BigQuery partitioned tables',
      'Cloud Composer orchestrates Spark jobs; Looker Studio visualizes results',
    ],
    techStack: [
      'GCP',
      'Apache Kafka',
      'Avro',
      'PySpark',
      'Cloud Dataproc',
      'BigQuery',
      'Terraform',
      'Docker',
      'Cloud Composer',
      'Looker Studio',
    ],
    highlights: [
      'Sub-minute latency from event to insight',
      'Schema enforcement with Avro serialization',
      'Terraform-managed GCP infrastructure',
      'Live dashboard with goal counter, scores, and card tracking',
    ],
  },
  stock_market_data_pipeline: {
    problem:
      'Manual stock price tracking was slow and unreliable, with no automated way to extract, process, and store daily NVDA market data.',
    solution:
      'Built a fully containerized pipeline using Airflow for orchestration, Spark for transformation, MinIO for S3-compatible object storage, and Docker for all services.',
    architecture: [
      'Airflow DAG checks API availability then triggers extraction',
      'Python tasks fetch NVDA stock prices from Yahoo Finance',
      'Raw JSON stored in MinIO object storage',
      'Apache Spark transforms and formats price data (JSON to CSV)',
      'Processed data loaded into the data warehouse',
    ],
    techStack: [
      'Apache Airflow',
      'Apache Spark',
      'MinIO',
      'Docker',
      'Python',
      'Yahoo Finance API',
    ],
    highlights: [
      'Automated daily pipeline with retry logic',
      'Spark master/worker containerized setup',
      'MinIO as S3-compatible object storage',
      'End-to-end error handling and monitoring',
    ],
  },
  'champions-league-data-pipeline': {
    problem:
      'Champions League analytics required a cloud-native platform capable of handling large-scale match data with production-grade reliability.',
    solution:
      'Designed a production-grade AWS platform with EKS-managed Kubernetes, MWAA Airflow orchestration, and Terraform-provisioned infrastructure with data quality gates.',
    architecture: [
      'Terraform provisions AWS EKS cluster, networking, and IAM',
      'MWAA-managed Airflow orchestrates data workflows',
      'PySpark jobs run on EKS for distributed processing',
      'Great Expectations validates data quality at each stage',
      'Redshift serves analytics queries for Tableau dashboards',
    ],
    techStack: [
      'AWS',
      'EKS',
      'Kubernetes',
      'MWAA',
      'Terraform',
      'PySpark',
      'Great Expectations',
      'Redshift',
      'S3',
      'Docker',
      'Tableau',
    ],
    highlights: [
      'Cloud-native Kubernetes on AWS EKS',
      'Full Infrastructure as Code with Terraform',
      'Automated CI/CD with GitHub Actions',
      'Data quality gates via Great Expectations',
    ],
  },
  'F1-Racing-Analytics': {
    problem:
      'Formula 1 racing data from the Ergast API needed to be ingested, cleaned, and transformed into analytics-ready datasets across multiple file formats.',
    solution:
      'Built an end-to-end analytics platform on Azure Databricks using PySpark and Delta Lake with medallion architecture, incremental loading, and Power BI dashboards.',
    architecture: [
      'Azure Data Lake Storage holds raw multi-format data (CSV, JSON, nested JSON)',
      'Databricks notebooks ingest each dataset into the Bronze layer',
      'PySpark transformations clean and validate data into the Silver layer',
      'Aggregation notebooks produce Gold layer analytics tables',
      'Power BI connects to the presentation layer for BI reporting',
    ],
    techStack: [
      'Azure Databricks',
      'PySpark',
      'Delta Lake',
      'Azure Data Lake',
      'SQL',
      'Power BI',
    ],
    highlights: [
      'Medallion architecture (Bronze > Silver > Gold)',
      'Delta Lake for ACID transactions and time travel',
      'Incremental loading with merge operations',
      'Dominant driver and team analysis queries',
    ],
  },
  'NYC-Taxi-Analytics': {
    problem:
      'NYC taxi trip data existed in multiple formats (CSV, Parquet, JSON, Delta) and needed a scalable cloud analytics solution with data quality handling.',
    solution:
      'Built a complete data lake on Azure Synapse Analytics with serverless SQL and Apache Spark, implementing medallion architecture with rejection handling for malformed records.',
    architecture: [
      'Multi-format data ingested into Azure Data Lake Storage (Bronze)',
      'Serverless SQL Pool queries raw data with external tables and views',
      'Apache Spark notebooks transform and validate data (Silver)',
      'Business-ready aggregations produced in the Gold layer',
      'Azure Data Factory Pipelines orchestrate ETL workflows',
    ],
    techStack: [
      'Azure Synapse Analytics',
      'Serverless SQL Pool',
      'Apache Spark',
      'Azure Data Lake',
      'Azure Data Factory',
      'T-SQL',
    ],
    highlights: [
      'Multi-format data processing (CSV, Parquet, JSON, Delta)',
      'Data quality rejection handling for malformed records',
      'Serverless SQL for cost-effective queries',
      'Reference data joins (zones, payment types, vendors)',
    ],
  },
  'cv_basketball_player_detection': {
    problem:
      'Identifying basketball players from images required a robust face detection and recognition pipeline that could handle varying poses, lighting, and occlusions.',
    solution:
      'Built a computer vision system using OpenCV Haar Cascade for detection and LBPH face recognizer for identification, with data augmentation to improve accuracy on limited training data.',
    architecture: [
      'Training images organized by player in a structured dataset directory',
      'Haar Cascade classifier detects faces in each image',
      'Data augmentation applies rotation, flipping, scaling, and translation',
      'LBPH algorithm trains on augmented face crops',
      'Trained model persisted to disk and used for prediction with confidence scores',
    ],
    techStack: [
      'Python',
      'OpenCV',
      'LBPH',
      'NumPy',
      'scikit-learn',
    ],
    highlights: [
      'Haar Cascade face detection pipeline',
      'LBPH recognition with confidence scoring',
      'Data augmentation for limited training sets',
      'Interactive CLI for training and prediction',
    ],
  },
  'fakeNewsDetection-ML': {
    problem:
      'Fake news detection requires comparing multiple NLP embedding strategies to find the most effective approach for classifying news articles as real or fake.',
    solution:
      'Conducted a systematic comparison of three embedding techniques — BERT, TF-IDF, and GloVe — each paired with machine learning classifiers on Kaggle fake news datasets.',
    architecture: [
      'Kaggle dataset preprocessed and split for training/testing',
      'TF-IDF vectorization with classical ML classifiers',
      'GloVe word embeddings with neural network classification',
      'BERT tokenization and fine-tuned transformer model',
      'Accuracy and performance metrics compared across all approaches',
    ],
    techStack: [
      'Python',
      'BERT',
      'TF-IDF',
      'GloVe',
      'scikit-learn',
      'Jupyter Notebook',
    ],
    highlights: [
      'Three-way embedding comparison (BERT vs TF-IDF vs GloVe)',
      'Published research paper on findings',
      'Systematic evaluation methodology',
      'Kaggle dataset preprocessing pipeline',
    ],
  },
  'synapsis_ppe': {
    problem:
      'Building a PPE detection system requires a well-engineered data foundation — from designing an annotation schema to collecting, labeling, and statistically validating the dataset.',
    solution:
      'Completed the full data engineering workflow for computer vision: designed a labeling scheme, collected 30 images, annotated them with bounding boxes, and performed statistical analysis to identify class imbalance issues.',
    architecture: [
      'Annotation schema designed for PPE classes (helmets, vests, gloves, glasses, boots)',
      '30-image dataset collected and organized',
      'YOLO-format bounding box annotations created for each image',
      'Preview script visualizes annotations overlaid on images',
      'Statistical analysis script generates class distribution and imbalance reports',
    ],
    techStack: [
      'Python',
      'OpenCV',
      'YOLO format',
      'Data Annotation',
      'Statistical Analysis',
    ],
    highlights: [
      'End-to-end data engineering for CV',
      'Annotation guide for labeling consistency',
      'Class imbalance detection and documentation',
      'Preview and statistics generation scripts',
    ],
  },
  'travel-buddies': {
    problem:
      'Planning group trips is fragmented across messaging apps, spreadsheets, and booking sites with no unified platform for collaborative itinerary building and budget tracking.',
    solution:
      'Built a full-stack collaborative travel app with Next.js and Supabase featuring real-time collaboration, AI-powered recommendations via Google Gemini, smart budget splitting, and 3D visual storytelling.',
    architecture: [
      'Next.js 14 App Router with TypeScript frontend',
      'Supabase handles auth, PostgreSQL database, and real-time subscriptions',
      'Google Gemini API powers personalized travel suggestions',
      'Google Maps and Places API for location search and mapping',
      'GSAP animations and Unicorn Studio for 3D visual scenes',
    ],
    techStack: [
      'Next.js',
      'TypeScript',
      'Supabase',
      'Google Gemini',
      'Tailwind CSS',
      'GSAP',
      'Zustand',
      'Zod',
    ],
    highlights: [
      'Real-time WebSocket collaboration',
      'AI-powered travel recommendations',
      'Smart budget tracking and cost splitting',
      'Drag-and-drop itinerary builder',
    ],
  },
  'MailDeletion': {
    problem:
      'Manually cleaning up hundreds of unread emails from a Gmail inbox is tedious and time-consuming, requiring an automated solution.',
    solution:
      'Built a Selenium-based automation framework in Java with TestNG that logs into Gmail, identifies unread emails, and bulk-deletes them with robust error handling and security prompt management.',
    architecture: [
      'Maven project manages dependencies and build lifecycle',
      'Credentials loaded securely from properties file (git-ignored)',
      'Selenium WebDriver automates Chrome browser interactions',
      'Security prompt handlers manage Google login challenges',
      'TestNG orchestrates test execution with SLF4J logging',
    ],
    techStack: [
      'Java',
      'Selenium WebDriver',
      'TestNG',
      'Maven',
      'SLF4J',
      'Chrome WebDriver',
    ],
    highlights: [
      'Automated Gmail login with security handling',
      'Bulk unread email detection and deletion',
      'Multiple retry mechanisms and fallbacks',
      'Comprehensive SLF4J logging',
    ],
  },
}

// ── Animated section wrapper ──────────────────────────────────────────────
function BrutalSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Skeleton card ─────────────────────────────────────────────────────────
function SkeletonCard({ borderColor, shadowColor, cardBg }) {
  return (
    <div
      style={{
        background: cardBg,
        border: `4px solid ${borderColor}`,
        boxShadow: `5px 5px 0px ${shadowColor}`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          background: '#1a1a1a',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div
          className="shimmer"
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#333',
          }}
        />
        <div
          className="shimmer"
          style={{
            height: '12px',
            width: '120px',
            background: '#333',
          }}
        />
      </div>
      <div style={{ padding: '20px' }}>
        <div
          className="shimmer"
          style={{
            height: '14px',
            width: '80%',
            background: borderColor === '#fffdf7' ? '#2a2a2a' : '#eee',
            marginBottom: '12px',
            opacity: 0.3,
          }}
        />
        <div
          className="shimmer"
          style={{
            height: '14px',
            width: '60%',
            background: borderColor === '#fffdf7' ? '#2a2a2a' : '#eee',
            marginBottom: '16px',
            opacity: 0.2,
          }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="shimmer"
              style={{
                height: '22px',
                width: '60px',
                background: borderColor === '#fffdf7' ? '#2a2a2a' : '#eee',
                opacity: 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Stat box ──────────────────────────────────────────────────────────────
function StatBox({ icon: Icon, value, label, accentColor, borderColor, shadowColor, cardBg, pageText }) {
  return (
    <div
      className="proj-card"
      style={{
        background: cardBg,
        border: `4px solid ${borderColor}`,
        boxShadow: `5px 5px 0px ${shadowColor}`,
        padding: '20px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          background: accentColor,
        }}
      />
      <Icon size={22} strokeWidth={2.5} color={accentColor} style={{ marginBottom: '10px' }} />
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700,
          fontSize: 'clamp(24px, 4vw, 36px)',
          lineHeight: 1,
          color: pageText,
          marginBottom: '4px',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700,
          fontSize: '10px',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          opacity: 0.5,
          color: pageText,
        }}
      >
        {label}
      </div>
    </div>
  )
}

// ── Repo card ─────────────────────────────────────────────────────────────
function RepoCard({ repo, borderColor, shadowColor, cardBg, pageText, onClick }) {
  const isFeatured = !!FEATURED_CASE_STUDIES[repo.slug]
  const langColor = LANG_COLORS[repo.language] || '#888'

  return (
    <motion.div
      className="proj-card"
      onClick={onClick}
      whileHover={{ y: -3 }}
      style={{
        background: cardBg,
        border: `4px solid ${borderColor}`,
        boxShadow: `5px 5px 0px ${shadowColor}`,
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* Title bar */}
      <div
        style={{
          background: '#1a1a1a',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: langColor,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: '12px',
              color: '#fff',
              letterSpacing: '0.5px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {repo.name}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {repo.stars > 0 && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontFamily: "'Space Mono', monospace",
                fontSize: '11px',
                color: COLORS.yellow,
                fontWeight: 700,
              }}
            >
              <Star size={11} fill={COLORS.yellow} color={COLORS.yellow} />
              {repo.stars}
            </span>
          )}
          {isFeatured && (
            <span
              style={{
                background: COLORS.coral,
                color: '#fff',
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '9px',
                padding: '2px 6px',
                letterSpacing: '1px',
              }}
            >
              CASE STUDY
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px 14px' }}>
        <p
          style={{
            fontFamily: "'Work Sans', sans-serif",
            fontSize: '14px',
            lineHeight: 1.5,
            color: pageText,
            opacity: 0.75,
            marginBottom: '14px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '42px',
          }}
        >
          {repo.description || REPO_DESCRIPTIONS[repo.slug] || 'No description provided.'}
        </p>

        {/* Meta row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            alignItems: 'center',
            fontFamily: "'Space Mono', monospace",
            fontSize: '11px',
            fontWeight: 700,
            color: pageText,
            opacity: 0.5,
          }}
        >
          {repo.language && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: langColor,
                }}
              />
              {repo.language}
            </span>
          )}
          {repo.forks > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <GitFork size={11} />
              {repo.forks}
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Clock size={11} />
            {new Date(repo.pushedAt).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// ── Case study modal ──────────────────────────────────────────────────────
function CaseStudyModal({ repo, onClose, borderColor, shadowColor, cardBg, pageText, isDark }) {
  const caseStudy = FEATURED_CASE_STUDIES[repo.slug]

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const langColor = LANG_COLORS[repo.language] || '#888'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: isDark ? 'rgba(0,0,0,0.75)' : 'rgba(26,26,26,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: cardBg,
          border: `4px solid ${borderColor}`,
          boxShadow: `8px 8px 0px ${shadowColor}`,
          width: '100%',
          maxWidth: '680px',
          maxHeight: '85vh',
          overflow: 'auto',
          position: 'relative',
        }}
      >
        {/* Modal title bar */}
        <div
          style={{
            background: '#1a1a1a',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={14} color={COLORS.lime} />
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '13px',
                color: COLORS.lime,
                letterSpacing: '1px',
              }}
            >
              {caseStudy ? 'CASE_STUDY.MD' : 'REPO_DETAIL.MD'}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '2px solid rgba(255,255,255,0.2)',
              color: '#fff',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal content */}
        <div style={{ padding: '24px' }}>
          {/* Repo header */}
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: langColor,
                }}
              />
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: '11px',
                  letterSpacing: '1px',
                  color: pageText,
                  opacity: 0.5,
                  textTransform: 'uppercase',
                }}
              >
                {repo.language || 'Unknown'}
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: 'clamp(20px, 4vw, 28px)',
                lineHeight: 1.2,
                color: pageText,
                marginBottom: '8px',
                letterSpacing: '-0.5px',
              }}
            >
              {repo.name}
            </h2>
            <p
              style={{
                fontFamily: "'Work Sans', sans-serif",
                fontSize: '15px',
                lineHeight: 1.6,
                color: pageText,
                opacity: 0.7,
              }}
            >
              {repo.description || REPO_DESCRIPTIONS[repo.slug] || 'No description provided.'}
            </p>
          </div>

          {/* Quick meta */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '24px',
            }}
          >
            {[
              { icon: Star, label: `${repo.stars} stars`, color: COLORS.yellow },
              { icon: GitFork, label: `${repo.forks} forks`, color: COLORS.sky },
              {
                icon: Clock,
                label: `Updated ${new Date(repo.pushedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}`,
                color: COLORS.mint,
              },
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: m.color,
                  border: '2px solid #1a1a1a',
                  padding: '4px 10px',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: '10px',
                  color: '#1a1a1a',
                  letterSpacing: '0.5px',
                }}
              >
                <m.icon size={12} strokeWidth={2.5} />
                {m.label}
              </div>
            ))}
          </div>

          {/* Case study content OR github-only view */}
          {caseStudy ? (
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '13px',
                lineHeight: 1.7,
                color: pageText,
              }}
            >
              {/* Problem */}
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    display: 'inline-block',
                    background: COLORS.coral,
                    color: '#1a1a1a',
                    border: '2px solid #1a1a1a',
                    padding: '3px 10px',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    marginBottom: '8px',
                  }}
                >
                  PROBLEM
                </div>
                <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '14px', opacity: 0.85 }}>
                  {caseStudy.problem}
                </p>
              </div>

              {/* Solution */}
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    display: 'inline-block',
                    background: COLORS.lime,
                    color: '#1a1a1a',
                    border: '2px solid #1a1a1a',
                    padding: '3px 10px',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    marginBottom: '8px',
                  }}
                >
                  SOLUTION
                </div>
                <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '14px', opacity: 0.85 }}>
                  {caseStudy.solution}
                </p>
              </div>

              {/* Architecture */}
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    display: 'inline-block',
                    background: COLORS.blue,
                    color: '#fff',
                    border: '2px solid #1a1a1a',
                    padding: '3px 10px',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    marginBottom: '10px',
                  }}
                >
                  ARCHITECTURE FLOW
                </div>
                <div style={{ display: 'grid', gap: '6px' }}>
                  {caseStudy.architecture.map((step, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        fontFamily: "'Work Sans', sans-serif",
                        fontSize: '13px',
                        opacity: 0.8,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontWeight: 700,
                          fontSize: '10px',
                          color: COLORS.blue,
                          marginTop: '3px',
                          flexShrink: 0,
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    display: 'inline-block',
                    background: COLORS.yellow,
                    color: '#1a1a1a',
                    border: '2px solid #1a1a1a',
                    padding: '3px 10px',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    marginBottom: '10px',
                  }}
                >
                  HIGHLIGHTS
                </div>
                <div style={{ display: 'grid', gap: '6px' }}>
                  {caseStudy.highlights.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontFamily: "'Work Sans', sans-serif",
                        fontSize: '13px',
                        opacity: 0.8,
                      }}
                    >
                      <CheckCircle2 size={14} color={COLORS.lime} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                      {h}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech stack tags */}
              <div>
                <div
                  style={{
                    display: 'inline-block',
                    background: COLORS.lavender,
                    color: '#1a1a1a',
                    border: '2px solid #1a1a1a',
                    padding: '3px 10px',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    marginBottom: '10px',
                  }}
                >
                  TECH STACK
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {caseStudy.techStack.map((t) => (
                    <span
                      key={t}
                      style={{
                        border: `2px solid ${borderColor}`,
                        padding: '4px 10px',
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        color: pageText,
                        opacity: 0.7,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Non-featured: GitHub data only */
            <div>
              {repo.topics && repo.topics.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      fontSize: '10px',
                      letterSpacing: '1.5px',
                      color: pageText,
                      opacity: 0.4,
                      marginBottom: '8px',
                    }}
                  >
                    TOPICS
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {repo.topics.map((t) => (
                      <span
                        key={t}
                        style={{
                          border: `2px solid ${borderColor}`,
                          padding: '4px 10px',
                          fontFamily: "'Space Mono', monospace",
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '0.5px',
                          color: pageText,
                          opacity: 0.6,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '12px',
                  color: pageText,
                  opacity: 0.5,
                  lineHeight: 1.7,
                }}
              >
                <div>Size: {(repo.sizeKb / 1024).toFixed(1)} MB</div>
                <div>
                  Created:{' '}
                  {new Date(repo.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: `3px solid ${borderColor}`,
            }}
          >
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="proj-link"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#1a1a1a',
                color: '#fff',
                border: '3px solid #1a1a1a',
                padding: '10px 18px',
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '1px',
                textDecoration: 'none',
                boxShadow: `4px 4px 0px ${shadowColor}`,
              }}
            >
              <Github size={16} strokeWidth={2.5} />
              VIEW ON GITHUB
              <ArrowUpRight size={12} strokeWidth={3} />
            </a>
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="proj-link"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: COLORS.yellow,
                  color: '#1a1a1a',
                  border: '3px solid #1a1a1a',
                  padding: '10px 18px',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '1px',
                  textDecoration: 'none',
                  boxShadow: '4px 4px 0px #1a1a1a',
                }}
              >
                <ExternalLink size={16} strokeWidth={2.5} />
                LIVE DEMO
                <ArrowUpRight size={12} strokeWidth={3} />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Main page component ───────────────────────────────────────────────────
export default function ProjectsPage() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [selectedRepo, setSelectedRepo] = useState(null)

  const pageBg = isDark ? '#0f0f0f' : '#fffdf7'
  const pageText = isDark ? '#fffdf7' : '#1a1a1a'
  const cardBg = isDark ? '#1e1e1e' : '#ffffff'
  const borderColor = isDark ? '#fffdf7' : '#1a1a1a'
  const shadowColor = isDark ? '#000000' : '#1a1a1a'
  const darkSectionBg = isDark ? '#1e1e1e' : '#1a1a1a'

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['github-repos'],
    queryFn: async () => {
      const res = await fetch('/api/github-repos')
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to fetch repos')
      }
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const repos = data?.repos || []
  const stats = data?.stats || {}

  // Build language filter list
  const langCounts = stats.languages || {}
  const langFilters = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, count]) => ({ lang, count }))

  // Filter repos
  const filteredRepos =
    activeFilter === 'ALL'
      ? repos
      : repos.filter((r) => r.language === activeFilter)

  // Format last push
  const lastPushLabel = stats.lastPushDate
    ? new Date(stats.lastPushDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : '---'

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Work+Sans:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      <style jsx global>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes shimmer {
          0% { opacity: 0.15; }
          50% { opacity: 0.3; }
          100% { opacity: 0.15; }
        }
        .marquee-track {
          animation: marquee-scroll 20s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .shimmer {
          animation: shimmer 1.5s ease-in-out infinite;
        }
        .proj-card {
          transition: all 0.15s ease;
        }
        .proj-card:hover {
          transform: translate(-3px, -3px) !important;
          box-shadow: 7px 7px 0px #1a1a1a !important;
        }
        .dark .proj-card:hover {
          box-shadow: 7px 7px 0px #000 !important;
        }
        .proj-link {
          transition: all 0.15s ease;
        }
        .proj-link:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0px #1a1a1a !important;
        }
        .dark .proj-link:hover {
          box-shadow: 6px 6px 0px #000 !important;
        }
        .dot-overlay {
          background-image: radial-gradient(circle, #1a1a1a 1px, transparent 1px);
          background-size: 24px 24px;
          opacity: 0.06;
        }
        .dark .dot-overlay {
          background-image: radial-gradient(circle, #fffdf7 1px, transparent 1px);
          opacity: 0.03;
        }
        .cursor-blink {
          animation: blink-cursor 1s step-end infinite;
        }
      `}</style>

      <div
        style={{
          background: pageBg,
          fontFamily: "'Work Sans', sans-serif",
          color: pageText,
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          transition: 'background 0.3s ease, color 0.3s ease',
        }}
        className="pt-16"
      >
        {/* Dot pattern overlay */}
        <div
          className="dot-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* ── MARQUEE TICKER ───────────────────────────────────────────── */}
        <div
          style={{
            background: darkSectionBg,
            borderBottom: `4px solid ${COLORS.yellow}`,
            overflow: 'hidden',
            padding: '10px 0',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', width: 'max-content' }} className="marquee-track">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: '14px',
                  color: COLORS.yellow,
                  whiteSpace: 'nowrap',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  paddingRight: '16px',
                }}
              >
                {MARQUEE_TEXT}
              </span>
            ))}
          </div>
        </div>

        {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
            position: 'relative',
            zIndex: 5,
          }}
        >
          {/* ── SECTION 03: HEADER ─────────────────────────────────────── */}
          <section style={{ padding: '60px 0 40px', position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: 'clamp(150px, 20vw, 280px)',
                lineHeight: 1,
                color: pageText,
                opacity: isDark ? 0.06 : 0.04,
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: 0,
              }}
            >
              03
            </div>

            <BrutalSection>
              <div
                style={{
                  display: 'inline-block',
                  background: COLORS.coral,
                  border: '3px solid #1a1a1a',
                  padding: '6px 16px',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#1a1a1a',
                  letterSpacing: '2px',
                  marginBottom: '16px',
                  boxShadow: '3px 3px 0px #1a1a1a',
                  transform: 'rotate(-1deg)',
                }}
              >
                PROJECTS / DASHBOARD
              </div>
            </BrutalSection>

            <BrutalSection delay={0.1}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <h1
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 700,
                    fontSize: 'clamp(32px, 6vw, 56px)',
                    lineHeight: 1,
                    letterSpacing: '-2px',
                    color: pageText,
                  }}
                >
                  GITHUB LIVE DASHBOARD
                </h1>
                {!isLoading && !isError && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: COLORS.lime,
                      border: '3px solid #1a1a1a',
                      padding: '6px 14px',
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      fontSize: '11px',
                      color: '#1a1a1a',
                      letterSpacing: '1px',
                      boxShadow: '3px 3px 0px #1a1a1a',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#1a1a1a',
                      }}
                    />
                    LIVE
                  </div>
                )}
              </div>
              <p
                style={{
                  fontFamily: "'Work Sans', sans-serif",
                  fontSize: '16px',
                  opacity: 0.6,
                  marginTop: '12px',
                  maxWidth: '550px',
                }}
              >
                Real-time data from the GitHub API. Click any repository card to explore details.
              </p>
            </BrutalSection>
          </section>

          {/* ── STAR DIVIDER ───────────────────────────────────────────── */}
          <div
            style={{
              borderTop: `4px solid ${borderColor}`,
              borderBottom: `4px solid ${borderColor}`,
              padding: '8px 0',
              margin: '10px 0 50px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {[...Array(20)].map((_, i) => (
              <Star key={i} size={12} fill={pageText} color={pageText} style={{ opacity: 0.3 }} />
            ))}
          </div>

          {/* ── SECTION 04: METRICS ────────────────────────────────────── */}
          <section style={{ position: 'relative', marginBottom: '70px' }}>
            <div
              style={{
                position: 'absolute',
                top: '-60px',
                left: '-30px',
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: 'clamp(120px, 18vw, 256px)',
                lineHeight: 1,
                color: pageText,
                opacity: isDark ? 0.06 : 0.03,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              04
            </div>

            <BrutalSection>
              <div
                style={{
                  display: 'inline-block',
                  background: COLORS.blue,
                  color: '#fff',
                  border: '3px solid #1a1a1a',
                  padding: '6px 16px',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: '14px',
                  letterSpacing: '2px',
                  marginBottom: '8px',
                  boxShadow: '3px 3px 0px #1a1a1a',
                  transform: 'rotate(1deg)',
                }}
              >
                METRICS.JSON
              </div>
            </BrutalSection>

            <BrutalSection delay={0.1}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginTop: '8px',
                }}
              >
                <StatBox
                  icon={FolderGit2}
                  value={isLoading ? '...' : stats.totalRepos || 0}
                  label="REPOSITORIES"
                  accentColor={COLORS.coral}
                  borderColor={borderColor}
                  shadowColor={shadowColor}
                  cardBg={cardBg}
                  pageText={pageText}
                />
                <StatBox
                  icon={Star}
                  value={isLoading ? '...' : stats.totalStars || 0}
                  label="TOTAL STARS"
                  accentColor={COLORS.yellow}
                  borderColor={borderColor}
                  shadowColor={shadowColor}
                  cardBg={cardBg}
                  pageText={pageText}
                />
                <StatBox
                  icon={Code}
                  value={isLoading ? '...' : Object.keys(langCounts).length}
                  label="LANGUAGES"
                  accentColor={COLORS.blue}
                  borderColor={borderColor}
                  shadowColor={shadowColor}
                  cardBg={cardBg}
                  pageText={pageText}
                />
                <StatBox
                  icon={Activity}
                  value={isLoading ? '...' : lastPushLabel}
                  label="LAST ACTIVITY"
                  accentColor={COLORS.lime}
                  borderColor={borderColor}
                  shadowColor={shadowColor}
                  cardBg={cardBg}
                  pageText={pageText}
                />
              </div>
            </BrutalSection>
          </section>

          {/* ── SECTION 03: FILTER ─────────────────────────────────────── */}
          <section style={{ position: 'relative', marginBottom: '50px' }}>
            <div
              style={{
                position: 'absolute',
                top: '-60px',
                right: '-20px',
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: 'clamp(120px, 18vw, 256px)',
                lineHeight: 1,
                color: pageText,
                opacity: isDark ? 0.06 : 0.03,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              03
            </div>

            <BrutalSection>
              <div
                style={{
                  display: 'inline-block',
                  background: COLORS.yellow,
                  border: '3px solid #1a1a1a',
                  padding: '6px 16px',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#1a1a1a',
                  letterSpacing: '2px',
                  marginBottom: '16px',
                  boxShadow: '3px 3px 0px #1a1a1a',
                  transform: 'rotate(-1deg)',
                }}
              >
                FILTER.SH
              </div>
            </BrutalSection>

            <BrutalSection delay={0.1}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  onClick={() => setActiveFilter('ALL')}
                  style={{
                    background: activeFilter === 'ALL' ? '#1a1a1a' : cardBg,
                    color: activeFilter === 'ALL' ? COLORS.yellow : pageText,
                    border: `3px solid ${borderColor}`,
                    padding: '8px 16px',
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 700,
                    fontSize: '12px',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    boxShadow:
                      activeFilter === 'ALL' ? `4px 4px 0px ${shadowColor}` : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  ALL ({repos.length})
                </button>
                {langFilters.map(({ lang, count }) => (
                  <button
                    key={lang}
                    onClick={() => setActiveFilter(lang)}
                    style={{
                      background: activeFilter === lang ? '#1a1a1a' : cardBg,
                      color: activeFilter === lang ? COLORS.yellow : pageText,
                      border: `3px solid ${borderColor}`,
                      padding: '8px 16px',
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      fontSize: '12px',
                      letterSpacing: '1px',
                      cursor: 'pointer',
                      boxShadow:
                        activeFilter === lang ? `4px 4px 0px ${shadowColor}` : 'none',
                      transition: 'all 0.15s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: LANG_COLORS[lang] || '#888',
                      }}
                    />
                    {lang.toUpperCase()} ({count})
                  </button>
                ))}
              </div>
            </BrutalSection>
          </section>

          {/* ── SECTION 04: REPOSITORIES ───────────────────────────────── */}
          <section style={{ position: 'relative', marginBottom: '70px' }}>
            <div
              style={{
                position: 'absolute',
                top: '-60px',
                left: '-30px',
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: 'clamp(120px, 18vw, 256px)',
                lineHeight: 1,
                color: pageText,
                opacity: isDark ? 0.06 : 0.03,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              04
            </div>

            <BrutalSection>
              <div
                style={{
                  display: 'inline-block',
                  background: COLORS.lime,
                  border: '3px solid #1a1a1a',
                  padding: '6px 16px',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#1a1a1a',
                  letterSpacing: '2px',
                  marginBottom: '8px',
                  boxShadow: '3px 3px 0px #1a1a1a',
                  transform: 'rotate(1deg)',
                }}
              >
                REPOSITORIES/
              </div>
            </BrutalSection>

            <BrutalSection delay={0.1}>
              <p
                style={{
                  fontFamily: "'Work Sans', sans-serif",
                  fontSize: '15px',
                  opacity: 0.5,
                  marginBottom: '24px',
                }}
              >
                {isLoading
                  ? 'Fetching repositories from GitHub...'
                  : `Showing ${filteredRepos.length} of ${repos.length} repositories`}
              </p>
            </BrutalSection>

            {/* Loading state */}
            {isLoading && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '16px',
                }}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <SkeletonCard
                    key={n}
                    borderColor={borderColor}
                    shadowColor={shadowColor}
                    cardBg={cardBg}
                  />
                ))}
              </div>
            )}

            {/* Error state */}
            {isError && (
              <BrutalSection>
                <div
                  style={{
                    background: cardBg,
                    border: `4px solid ${COLORS.coral}`,
                    boxShadow: `5px 5px 0px ${shadowColor}`,
                    padding: '32px 24px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      fontSize: '18px',
                      color: COLORS.coral,
                      marginBottom: '8px',
                    }}
                  >
                    ERROR: FETCH FAILED
                  </div>
                  <p
                    style={{
                      fontFamily: "'Work Sans', sans-serif",
                      fontSize: '14px',
                      color: pageText,
                      opacity: 0.6,
                    }}
                  >
                    {error?.message || 'Could not load GitHub data. Please try again later.'}
                  </p>
                </div>
              </BrutalSection>
            )}

            {/* Repo grid */}
            {!isLoading && !isError && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '16px',
                }}
              >
                {filteredRepos.map((repo, i) => (
                  <BrutalSection key={repo.slug} delay={Math.min(i * 0.03, 0.3)}>
                    <RepoCard
                      repo={repo}
                      borderColor={borderColor}
                      shadowColor={shadowColor}
                      cardBg={cardBg}
                      pageText={pageText}
                      onClick={() => setSelectedRepo(repo)}
                    />
                  </BrutalSection>
                ))}
              </div>
            )}

            {/* No results */}
            {!isLoading && !isError && filteredRepos.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: '14px',
                  color: pageText,
                  opacity: 0.4,
                }}
              >
                No repositories found for this filter.
              </div>
            )}
          </section>

          {/* ── CTA SECTION ────────────────────────────────────────────── */}
          <section style={{ position: 'relative', marginBottom: '70px' }}>
            <div
              style={{
                position: 'absolute',
                top: '-40px',
                right: '-20px',
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: 'clamp(120px, 18vw, 256px)',
                lineHeight: 1,
                color: pageText,
                opacity: isDark ? 0.06 : 0.03,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              05
            </div>

            <BrutalSection>
              <div
                style={{
                  background: darkSectionBg,
                  border: `4px solid ${isDark ? '#333' : '#1a1a1a'}`,
                  padding: 'clamp(32px, 6vw, 60px)',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Decorative corners */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    width: '40px',
                    height: '40px',
                    border: `3px solid ${COLORS.yellow}`,
                    opacity: 0.4,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    width: '40px',
                    height: '40px',
                    border: `3px solid ${COLORS.coral}`,
                    opacity: 0.4,
                  }}
                />

                <h2
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 700,
                    fontSize: 'clamp(24px, 4vw, 40px)',
                    color: '#fff',
                    marginBottom: '12px',
                    letterSpacing: '-1px',
                  }}
                >
                  EXPLORE THE{' '}
                  <span style={{ color: COLORS.yellow }}>CODE</span>
                </h2>
                <p
                  style={{
                    fontFamily: "'Work Sans', sans-serif",
                    fontSize: '16px',
                    color: '#ffffff99',
                    marginBottom: '32px',
                    maxWidth: '500px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  All projects are open source. Browse the full collection on GitHub.
                </p>

                <a
                  href="https://github.com/idabaguspurwa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="proj-link"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: COLORS.yellow,
                    color: '#1a1a1a',
                    border: '3px solid #1a1a1a',
                    padding: '14px 28px',
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 700,
                    fontSize: '15px',
                    letterSpacing: '1px',
                    textDecoration: 'none',
                    boxShadow: '4px 4px 0px #ffe14d55',
                  }}
                >
                  <Github size={20} strokeWidth={2.5} />
                  VIEW GITHUB PROFILE
                  <ArrowUpRight size={16} strokeWidth={3} />
                </a>
              </div>
            </BrutalSection>
          </section>

          {/* ── BOTTOM MARQUEE ─────────────────────────────────────────── */}
          <div
            style={{
              borderTop: `4px solid ${borderColor}`,
              borderBottom: `4px solid ${borderColor}`,
              overflow: 'hidden',
              padding: '12px 0',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: 'max-content',
              }}
              className="marquee-track"
            >
              {[...Array(10)].map((_, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 700,
                    fontSize: '32px',
                    color: pageText,
                    whiteSpace: 'nowrap',
                    letterSpacing: '4px',
                    textTransform: 'uppercase',
                    paddingRight: '24px',
                    opacity: 0.08,
                  }}
                >
                  PYTHON {'\u2605'} TERRAFORM {'\u2605'} AIRFLOW {'\u2605'} KAFKA {'\u2605'} SPARK {'\u2605'} DOCKER {'\u2605'} K8S {'\u2605'}{' '}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── CASE STUDY MODAL ─────────────────────────────────────────── */}
        <AnimatePresence>
          {selectedRepo && (
            <CaseStudyModal
              repo={selectedRepo}
              onClose={() => setSelectedRepo(null)}
              borderColor={borderColor}
              shadowColor={shadowColor}
              cardBg={cardBg}
              pageText={pageText}
              isDark={isDark}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
