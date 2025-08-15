'use client'

import { motion } from 'framer-motion'
import { ExternalLink, FileText, Users, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ScrollProgress, RevealOnScroll, StaggerContainer, StaggerItem } from '@/components/ScrollAnimations'

export default function PublicationsPage() {
  const publications = [
    {
      title: "Predicting Anger Proneness Using Deep Learning Techniques",
      authors: "Ida Bagus G. P. M. Adiputra, et al.",
      journal: "2023 IEEE 9th International Conference on Computing, Engineering and Design (ICCED)",
      abstract: "This research explores the application of machine learning algorithms to predict anger proneness in individuals based on physiological and behavioral data, contributing to mental health monitoring and intervention strategies.",
      tags: ["Machine Learning", "NLP", "Mental Health", "Predictive Analysis"],
      url: "https://ieeexplore.ieee.org/document/10425252",
      year: "2023",
      type: "Conference Paper",
      venue: "IEEE ICCED 2023"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  return (
    <>
      <ScrollProgress />
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <RevealOnScroll direction="up">
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
                Publications & Research
              </h1>
              <p className="text-xl md:text-2xl text-secondary mb-8 max-w-3xl mx-auto">
                Exploring machine learning applications in mental health and behavioral analysis
              </p>
            </RevealOnScroll>
          </div>
        </section>

        {/* Publications Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <StaggerContainer>
              <div className="space-y-8">
                {publications.map((publication, index) => (
                  <StaggerItem key={index}>
                    <motion.div
                      className="bg-card border border-border rounded-lg p-8 hover:shadow-lg transition-shadow duration-300"
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-heading font-bold mb-2">
                          {publication.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-secondary mb-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {publication.authors}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {publication.year}
                          </div>
                          <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                            {publication.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-lg mb-2">Published in:</h4>
                      <p className="text-accent font-medium">{publication.journal}</p>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-lg mb-2">Abstract:</h4>
                      <p className="text-secondary leading-relaxed">
                        {publication.abstract}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-lg mb-3">Research Areas:</h4>
                      <div className="flex flex-wrap gap-2">
                        {publication.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <Button asChild>
                        <a 
                          href={publication.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Publication
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
            ))}
              </div>
            </StaggerContainer>

            {/* Research Interests */}
            <RevealOnScroll direction="up" delay={0.4}>
              <div className="mt-16 bg-card border border-border rounded-lg p-8">
                <h2 className="text-3xl font-heading font-bold mb-6 text-center">
                  Research Interests
                </h2>
                <StaggerContainer>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StaggerItem>
                      <div className="text-center">
                        <div className="p-4 bg-primary/10 rounded-lg mb-4 inline-block">
                          <FileText className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Machine Learning</h3>
                        <p className="text-secondary text-sm">
                          Deep learning applications in behavioral analysis and prediction
                        </p>
                      </div>
                    </StaggerItem>
                    <StaggerItem>
                      <div className="text-center">
                        <div className="p-4 bg-accent/10 rounded-lg mb-4 inline-block">
                          <Users className="h-8 w-8 text-accent" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Mental Health Tech</h3>
                        <p className="text-secondary text-sm">
                          Technology-driven solutions for mental health monitoring
                        </p>
                      </div>
                    </StaggerItem>
                    <StaggerItem>
                      <div className="text-center">
                        <div className="p-4 bg-primary/10 rounded-lg mb-4 inline-block">
                          <Calendar className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Data Analytics</h3>
                        <p className="text-secondary text-sm">
                          Advanced analytics for behavioral pattern recognition
                        </p>
                      </div>
                    </StaggerItem>
                  </div>
                </StaggerContainer>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </div>
    </>
  )
}
