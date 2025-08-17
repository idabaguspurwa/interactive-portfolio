'use client'

import { motion } from 'framer-motion'
import { MapPin, ExternalLink, Users, TrendingUp } from 'lucide-react'
import { ScrollProgress, RevealOnScroll, StaggerContainer, StaggerItem } from '@/components/ScrollAnimations'

export default function ExperiencePage() {
  const experiences = [
    {
      title: 'Business Analyst Intern',
      company: 'PT Bank Central Asia Tbk',
      location: 'Tangerang, Indonesia',
      period: '02/2024 - 02/2025',
      type: 'Internship',
      description: 'Analyzed business requirements through comprehensive stakeholder interviews to optimize operational processes and enhance decision-making capabilities across remittance and Sankimods divisions.',
      achievements: [
        'Designed and implemented solutions for internal website optimization achieving 20% operational efficiency improvement',
        'Conducted stakeholder interviews and business requirements analysis for IT operations',
        'Collaborated with cross-functional teams to develop and align strategic business solutions',
        'Streamlined operational workflows resulting in enhanced productivity and process efficiency'
      ],
      technologies: ['SQL', 'Excel', 'Business Process Analysis', 'Stakeholder Management', 'Requirements Gathering'],
      highlights: [
        { metric: '20%', description: 'Operational Efficiency Improvement' },
        { metric: '10+', description: 'Stakeholder Interviews Conducted' },
        { metric: '2', description: 'Business Divisions Supported' }
      ]
    },
    {
      title: 'Relation Expansion Commission Activist',
      company: 'HIMTI BINUS University',
      location: 'Jakarta, Indonesia',
      period: 'Mar 2022 - Jan 2024',
      type: 'Organization',
      description: 'Collaborated with a team to organize internal events that foster connection and engagement among HIMTI members, enhancing communication and community within the organization.',
      achievements: [
        'Organized multiple internal events to strengthen member relationships and community engagement',
        'Enhanced communication and collaboration among HIMTI members through strategic initiatives',
        'Contributed to building a stronger, more connected technology student community',
        'Developed leadership and teamwork skills through active participation in organizational activities'
      ],
      technologies: ['Event Management', 'Team Collaboration', 'Leadership', 'Communication'],
      highlights: [
        { metric: '5+', description: 'Events Organized' },
        { metric: '200+', description: 'Members Engaged' },
        { metric: '2 Years', description: 'Active Participation' }
      ]
    },
    {
      title: 'Contestant',
      company: 'ICPC - International Collegiate Programming Contest',
      location: 'Indonesia (Remote)',
      period: '2022',
      type: 'Competition',
      description: 'Represented BINUS University in the national ICPC competition, solving complex algorithmic problems and competing against top-tier universities across Indonesia.',
      achievements: [
        'Successfully represented BINUS University in national-level programming competition',
        'Solved complex algorithmic and data structure problems under time pressure',
        'Demonstrated strong problem-solving skills and competitive programming expertise',
        'Competed against top-tier universities showcasing technical excellence'
      ],
      technologies: ['Critical Thinking', 'Competitive Programming', 'Algorithms', 'Data Structures', 'Problem Solving'],
      highlights: [
        { metric: 'National', description: 'Competition Level' },
        { metric: 'Top Tier', description: 'University Representation' },
        { metric: '20+', description: 'Universities Competed' }
      ]
    },
    {
      title: 'MC of HIMTI Care Movie Day',
      company: 'HIMTI BINUS University',
      location: 'Jakarta, Indonesia',
      period: '2022',
      type: 'Event Leadership',
      description: 'Served as lead Master of Ceremonies for HIMTI Care\'s virtual Movie Day event, demonstrating exceptional public speaking and event management capabilities.',
      achievements: [
        'Successfully hosted and managed a large-scale virtual student event as Master of Ceremony',
        'Demonstrated excellent public speaking and crowd engagement skills in virtual environment',
        'Led event coordination and audience interaction for enhanced participant experience',
        'Contributed to HIMTI Care\'s community outreach and member engagement initiatives'
      ],
      technologies: ['Communication', 'Public Speaking', 'Event Management', 'Virtual Event Hosting'],
      highlights: [
        { metric: '100+', description: 'Virtual Attendees' },
        { metric: '100%', description: 'Event Success Rate' },
        { metric: '2 Hours', description: 'Event Duration' }
      ]
    },
    {
      title: 'Sharing Knowledge Event Treasurer',
      company: 'Keluarga Mahasiswa Hindu Bina Nusantara',
      location: 'Jakarta, Indonesia (Remote)',
      period: 'Nov 2021 - Dec 2021',
      type: 'Financial Management',
      description: 'Managed and allocated organizational budget for securing keynote speakers for the Knowledge Sharing Event, oversaw financial planning and distribution of incentives for event participants.',
      achievements: [
        'Successfully managed event budget for speaker procurement and attendee incentives',
        'Administered overall event budget and financial documentation with full accountability',
        'Demonstrated exceptional financial responsibility and strategic budget allocation skills',
        'Enhanced event quality through strategic financial planning for speakers and participant rewards'
      ],
      technologies: ['Communication', 'Financial Planning', 'Budget Management', 'Event Coordination'],
      highlights: [
        { metric: '100%', description: 'Budget Accountability' },
        { metric: '1+', description: 'Expert Speakers Secured' },
        { metric: '30+', description: 'Participants Supported' }
      ]
    }
  ]

  const education = [
    {
      degree: 'Bachelor of Computer Science',
      school: 'Bina Nusantara University',
      period: '09/2021 - Present',
      gpa: '3.62/4.00',
      achievements: [
        'Magna Cum Laude graduate'
      ]
    },
  ]

  return (
    <>
      <ScrollProgress />
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <RevealOnScroll direction="up">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                Professional Experience
              </h1>
              <p className="text-lg text-secondary max-w-3xl mx-auto mb-8">
                My journey through various roles has shaped me into a skilled data engineer 
                with expertise in cloud platforms, data pipelines, and delivering impactful business solutions.
              </p>
            </RevealOnScroll>
            
            <StaggerContainer>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12">
                <StaggerItem>
                  <motion.div 
                    className="text-center p-4 md:p-6 bg-primary/10 rounded-lg cursor-pointer h-full flex flex-col justify-center"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="text-2xl md:text-3xl font-bold text-primary mb-2">1+</div>
                    <div className="text-xs md:text-sm text-secondary leading-tight">Years Experience</div>
                  </motion.div>
                </StaggerItem>
                <StaggerItem>
                  <motion.div 
                    className="text-center p-4 md:p-6 bg-accent/10 rounded-lg cursor-pointer h-full flex flex-col justify-center"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="text-2xl md:text-3xl font-bold text-accent mb-2">12+</div>
                    <div className="text-xs md:text-sm text-secondary leading-tight">Projects Completed</div>
                  </motion.div>
                </StaggerItem>
                <StaggerItem>
                  <motion.div 
                    className="text-center p-4 md:p-6 bg-orange-500/10 rounded-lg cursor-pointer h-full flex flex-col justify-center"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="text-2xl md:text-3xl font-bold text-orange-500 mb-2">10+</div>
                    <div className="text-xs md:text-sm text-secondary leading-tight">Technologies Mastered</div>
                  </motion.div>
                </StaggerItem>
                <StaggerItem>
                  <motion.div 
                    className="text-center p-4 md:p-6 bg-green-500/10 rounded-lg cursor-pointer h-full flex flex-col justify-center"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="text-2xl md:text-3xl font-bold text-green-500 mb-2">1+</div>
                    <div className="text-xs md:text-sm text-secondary leading-tight">Certifications</div>
                  </motion.div>
                </StaggerItem>
              </div>
            </StaggerContainer>
          </div>
        </section>

        {/* Experience Timeline */}
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <RevealOnScroll direction="up">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  Career Journey
                </h2>
                <p className="text-lg text-secondary max-w-3xl mx-auto">
                  A detailed timeline of my professional experience and key achievements.
                </p>
              </div>
            </RevealOnScroll>

            <StaggerContainer>
              <div className="space-y-12">
                {experiences.map((exp, index) => (
                  <StaggerItem key={index}>
                    <motion.div
                      className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ y: -5 }}
                    >
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Job Info */}
                  <div className="lg:col-span-1">
                    <h3 className="text-xl font-heading font-bold text-primary mb-2">
                      {exp.title}
                    </h3>
                    <h4 className="text-lg font-semibold mb-2">{exp.company}</h4>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-secondary">
                        <MapPin className="h-4 w-4 mr-2" />
                        {exp.period}
                      </div>
                      <div className="flex items-center text-secondary">
                        <MapPin className="h-4 w-4 mr-2" />
                        {exp.location}
                      </div>
                      <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        {exp.type}
                      </div>
                    </div>

                    <p className="text-secondary mb-4">{exp.description}</p>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 gap-3">
                      {exp.highlights.map((highlight, idx) => (
                        <div key={idx} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-lg font-bold text-primary">{highlight.metric}</div>
                          <div className="text-xs text-secondary">{highlight.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Achievements & Technologies */}
                  <div className="lg:col-span-2">
                    <div className="mb-6">
                      <h5 className="font-semibold mb-3 flex items-center">
                        <Users className="h-5 w-5 mr-2 text-accent" />
                        Key Achievements
                      </h5>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="text-secondary">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold mb-3">Technologies Used</h5>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
        </div>
      </section>

        {/* Education */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <RevealOnScroll direction="up">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  Education & Training
                </h2>
                <p className="text-lg text-secondary max-w-3xl mx-auto">
                  My educational background and continuous learning journey.
                </p>
              </div>
            </RevealOnScroll>

            <StaggerContainer>
              <div className="flex justify-center">
                {education.map((edu, index) => (
                  <StaggerItem key={index}>
                    <motion.div
                      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 max-w-md"
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <h3 className="text-xl font-heading font-bold mb-2">{edu.degree}</h3>
                      <h4 className="text-lg text-primary font-semibold mb-2">{edu.school}</h4>
                      <p className="text-secondary mb-2">{edu.period}</p>
                      {edu.gpa && (
                        <p className="text-sm text-secondary mb-4">GPA: {edu.gpa}</p>
                      )}
                      
                      <ul className="space-y-1">
                        {edu.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 mr-2 flex-shrink-0" />
                            <span className="text-secondary">{achievement}</span>
                          </li>
                        ))}
                      </ul>
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
