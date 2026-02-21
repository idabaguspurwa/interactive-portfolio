'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import Link from 'next/link'
import { useTheme } from '@/components/ThemeProvider'
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  CalendarDays,
  Cloud,
  Code,
  Cpu,
  Database,
  Github,
  GraduationCap,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  Star,
  Target,
  Terminal,
  Zap,
} from 'lucide-react'

/* eslint-disable @next/next/no-page-custom-font */

const COLORS = {
  yellow: '#ffe14d',
  coral: '#ff5757',
  blue: '#3d5afe',
  lime: '#c6ff00',
  mint: '#98ffc8',
  lavender: '#c3b1e1',
  peach: '#ffc9a9',
}

const MARQUEE_TEXT = 'ABOUT PAGE \u2605 SYSTEM THINKER \u2605 DATA ENGINEER \u2605 BUILDER \u2605 '

const PRINCIPLES = [
  {
    title: 'Reliability First',
    description: 'Pipelines are only useful when teams can trust them every morning.',
    icon: Database,
    color: COLORS.yellow,
  },
  {
    title: 'Cloud With Purpose',
    description: 'I only add tools that solve a real bottleneck, not trends.',
    icon: Cloud,
    color: COLORS.blue,
    textColor: '#fff',
  },
  {
    title: 'Automate Repetition',
    description: 'If a task happens twice, it should be codified and monitored.',
    icon: Zap,
    color: COLORS.lime,
  },
]

const JOURNEY = [
  {
    year: '2025 - NOW',
    role: 'Data Engineer',
    company: 'Inatax Jakarta',
    description:
      'Building and maintaining production data pipelines using Airflow, Docker, Python, and SQL for cloud and on-prem workflows.',
    icon: Briefcase,
    color: COLORS.yellow,
  },
  {
    year: '2024 - 2025',
    role: 'Business Analyst Intern',
    company: 'PT Bank Central Asia Tbk',
    description:
      'Partnered with stakeholders to translate business needs into measurable process improvements and data-backed decisions.',
    icon: Target,
    color: COLORS.blue,
    textColor: '#fff',
  },
  {
    year: '2021 - 2025',
    role: 'B.Sc. Computer Science',
    company: 'Bina Nusantara University',
    description:
      'Graduated Magna Cum Laude while sharpening foundations in software engineering, databases, and systems thinking.',
    icon: GraduationCap,
    color: COLORS.lime,
  },
]

const NOW_BUILDING = [
  { label: 'dbt + Snowflake', color: COLORS.mint, rotation: -2, icon: Layers },
  { label: 'Spark Streaming', color: COLORS.coral, rotation: 2, icon: Cpu },
  { label: 'Terraform IaC', color: COLORS.lavender, rotation: -1, icon: Terminal },
  { label: 'Kafka Events', color: COLORS.peach, rotation: 1, icon: Code },
]

function BrutalSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-90px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 42 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 42 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function FocusSticker({ item, index }) {
  const Icon = item.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, rotate: item.rotation * 2 }}
      whileInView={{ opacity: 1, scale: 1, rotate: item.rotation }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{
        scale: 1.12,
        rotate: 0,
        zIndex: 15,
        transition: { duration: 0.16 },
      }}
      style={{
        background: item.color,
        border: '3px solid #1a1a1a',
        boxShadow: '4px 4px 0px #1a1a1a',
        width: '160px',
        minHeight: '110px',
        padding: '14px 12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transform: `rotate(${item.rotation}deg)`,
      }}
    >
      <Icon size={24} strokeWidth={2.5} color="#1a1a1a" />
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700,
          fontSize: '12px',
          lineHeight: 1.2,
          textAlign: 'center',
          color: '#1a1a1a',
        }}
      >
        {item.label}
      </span>
    </motion.div>
  )
}

export default function AboutPage() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const pageBg = isDark ? '#0f0f0f' : '#fffdf7'
  const pageText = isDark ? '#fffdf7' : '#1a1a1a'
  const cardBg = isDark ? '#1e1e1e' : '#ffffff'
  const borderColor = isDark ? '#fffdf7' : '#1a1a1a'
  const shadowColor = isDark ? '#000000' : '#1a1a1a'
  const stripBg = isDark ? '#1e1e1e' : '#1a1a1a'

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Work+Sans:wght@300;400;500;600;700;800&display=swap"
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
        .marquee-track {
          animation: marquee-scroll 21s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .about-link {
          transition: all 0.14s ease;
        }
        .about-link:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0px #1a1a1a !important;
          background: #1a1a1a !important;
          color: #ffe14d !important;
        }
        .dark .about-link:hover {
          box-shadow: 6px 6px 0px #000 !important;
          background: #fffdf7 !important;
          color: #1a1a1a !important;
        }
        .about-card {
          transition: all 0.16s ease;
        }
        .about-card:hover {
          transform: translate(-3px, -3px) !important;
          box-shadow: 7px 7px 0px #1a1a1a !important;
        }
        .dark .about-card:hover {
          box-shadow: 7px 7px 0px #000 !important;
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
          color: pageText,
          minHeight: '100vh',
          fontFamily: "'Work Sans', sans-serif",
          position: 'relative',
          overflow: 'hidden',
          transition: 'background 0.3s ease, color 0.3s ease',
        }}
        className="pt-16"
      >
        <div
          className="dot-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        <div
          style={{
            background: stripBg,
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
                  paddingRight: '18px',
                }}
              >
                {MARQUEE_TEXT}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
            position: 'relative',
            zIndex: 5,
          }}
        >
          <section style={{ padding: '60px 0 46px', position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                top: '-32px',
                right: '-12px',
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: 'clamp(96px, 17vw, 220px)',
                letterSpacing: '-6px',
                lineHeight: 1,
                color: pageText,
                opacity: isDark ? 0.06 : 0.04,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              02
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '32px',
                position: 'relative',
                zIndex: 2,
              }}
              className="md:!grid-cols-[1.08fr_0.92fr]"
            >
              <BrutalSection>
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: COLORS.coral,
                      border: '3px solid #1a1a1a',
                      padding: '6px 12px',
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      fontSize: '12px',
                      color: '#1a1a1a',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      boxShadow: '3px 3px 0px #1a1a1a',
                      marginBottom: '20px',
                    }}
                  >
                    <MapPin size={14} strokeWidth={3} color="#1a1a1a" />
                    ABOUT / PROFILE
                  </div>

                  <h1
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      fontSize: 'clamp(34px, 6.5vw, 66px)',
                      lineHeight: 0.98,
                      letterSpacing: '-2px',
                      marginBottom: '20px',
                    }}
                  >
                    <span style={{ display: 'block' }}>I BUILD DATA</span>
                    <span style={{ display: 'block' }}>
                      SYSTEMS THAT
                      <span
                        style={{
                          display: 'inline-block',
                          marginLeft: '10px',
                          background: COLORS.yellow,
                          color: '#1a1a1a',
                          border: '3px solid #1a1a1a',
                          padding: '0 8px',
                          transform: 'rotate(1deg)',
                        }}
                      >
                        LAST
                      </span>
                    </span>
                  </h1>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginBottom: '18px',
                    }}
                  >
                    {[
                      { label: 'DATA ENGINEER', color: COLORS.lime },
                      { label: 'PIPELINE BUILDER', color: COLORS.blue, textColor: '#fff' },
                      { label: 'PROBLEM SOLVER', color: COLORS.peach },
                    ].map((chip) => (
                      <div
                        key={chip.label}
                        style={{
                          background: chip.color,
                          color: chip.textColor || '#1a1a1a',
                          border: '3px solid #1a1a1a',
                          boxShadow: '3px 3px 0px #1a1a1a',
                          padding: '6px 12px',
                          fontFamily: "'Space Mono', monospace",
                          fontWeight: 700,
                          fontSize: '12px',
                          letterSpacing: '1px',
                        }}
                      >
                        {chip.label}
                      </div>
                    ))}
                  </div>

                  <p
                    style={{
                      fontSize: '17px',
                      lineHeight: 1.75,
                      opacity: 0.92,
                      maxWidth: '640px',
                      marginBottom: '14px',
                    }}
                  >
                    I focus on turning raw operational data into dependable products that teams can
                    act on. My day-to-day work sits at the intersection of data engineering,
                    architecture, and delivery.
                  </p>

                  <p
                    style={{
                      fontSize: '16px',
                      lineHeight: 1.7,
                      opacity: 0.78,
                      maxWidth: '610px',
                      marginBottom: '24px',
                    }}
                  >
                    The goal is simple: move from fragile scripts to stable systems. That means clean
                    ingestion, orchestration discipline, observability, and practical cloud choices.
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <Link
                      href="/projects"
                      className="about-link"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: cardBg,
                        color: pageText,
                        border: `3px solid ${borderColor}`,
                        boxShadow: `4px 4px 0px ${shadowColor}`,
                        padding: '10px 18px',
                        fontFamily: "'Space Mono', monospace",
                        fontWeight: 700,
                        fontSize: '13px',
                        textDecoration: 'none',
                        letterSpacing: '1px',
                      }}
                    >
                      VIEW PROJECTS
                      <ArrowUpRight size={14} strokeWidth={3} />
                    </Link>

                    <Link
                      href="/contact"
                      className="about-link"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: COLORS.yellow,
                        color: '#1a1a1a',
                        border: '3px solid #1a1a1a',
                        boxShadow: '4px 4px 0px #1a1a1a',
                        padding: '10px 18px',
                        fontFamily: "'Space Mono', monospace",
                        fontWeight: 700,
                        fontSize: '13px',
                        textDecoration: 'none',
                        letterSpacing: '1px',
                      }}
                    >
                      LET&apos;S CONNECT
                      <ArrowRight size={14} strokeWidth={3} />
                    </Link>
                  </div>
                </div>
              </BrutalSection>

              <BrutalSection delay={0.2}>
                <div style={{ display: 'grid', gap: '14px' }}>
                  <motion.div
                    whileHover={{ rotate: 0, scale: 1.02 }}
                    style={{
                      background: cardBg,
                      border: `4px solid ${borderColor}`,
                      boxShadow: `6px 6px 0px ${shadowColor}`,
                      transform: 'rotate(1.3deg)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        background: '#1a1a1a',
                        color: COLORS.yellow,
                        padding: '10px 14px',
                        fontFamily: "'Space Mono', monospace",
                        fontWeight: 700,
                        fontSize: '12px',
                        letterSpacing: '1px',
                      }}
                    >
                      DATA_SNAPSHOT.JSON
                    </div>
                    <div
                      style={{
                        padding: '14px',
                        display: 'grid',
                        gap: '12px',
                      }}
                    >
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '8px',
                        }}
                      >
                        {[
                          { value: '2+', label: 'YEARS EXP' },
                          { value: '3', label: 'CORE ROLES' },
                          { value: '7 mos', label: 'INATAX TENURE' },
                          { value: 'FEB 2026', label: 'FULL-TIME START' },
                        ].map((item) => (
                          <div
                            key={item.label}
                            style={{
                              border: `2px solid ${borderColor}`,
                              padding: '8px',
                              background: isDark ? '#232323' : '#fffdf7',
                              boxShadow: `2px 2px 0px ${shadowColor}`,
                            }}
                          >
                            <div
                              style={{
                                fontFamily: "'Space Mono', monospace",
                                fontWeight: 700,
                                fontSize: '13px',
                                lineHeight: 1.2,
                              }}
                            >
                              {item.value}
                            </div>
                            <div
                              style={{
                                fontFamily: "'Space Mono', monospace",
                                fontWeight: 700,
                                fontSize: '10px',
                                letterSpacing: '0.6px',
                                opacity: 0.6,
                                marginTop: '4px',
                              }}
                            >
                              {item.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div
                        style={{
                          border: `3px solid ${borderColor}`,
                          boxShadow: `3px 3px 0px ${shadowColor}`,
                          padding: '10px',
                          fontFamily: "'Space Mono', monospace",
                          fontSize: '11px',
                          lineHeight: 1.55,
                        }}
                      >
                        <div style={{ marginBottom: '8px' }}>
                          <Briefcase size={12} style={{ display: 'inline', marginRight: '6px' }} />
                          INATAX JAKARTA
                        </div>
                        <div style={{ opacity: 0.75, marginBottom: '4px' }}>
                          Data Engineer (Full-time) | Feb 2026 - Present
                        </div>
                        <div style={{ opacity: 0.75, marginBottom: '10px' }}>
                          Data Engineer (Contract) | Aug 2025 - Feb 2026
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <Target size={12} style={{ display: 'inline', marginRight: '6px' }} />
                          PT BANK CENTRAL ASIA TBK
                        </div>
                        <div style={{ opacity: 0.75 }}>
                          Business Analyst Intern | Feb 2024 - Feb 2025
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px',
                          fontFamily: "'Space Mono', monospace",
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '0.8px',
                        }}
                      >
                        {[
                          { label: 'PYTHON', color: COLORS.yellow },
                          { label: 'SQL', color: COLORS.lime },
                          { label: 'AIRFLOW', color: COLORS.mint },
                          { label: 'DATA ENGINEERING', color: COLORS.peach },
                        ].map((skill) => (
                          <span
                            key={skill.label}
                            style={{
                              background: skill.color,
                              color: '#1a1a1a',
                              border: '2px solid #1a1a1a',
                              boxShadow: '2px 2px 0px #1a1a1a',
                              padding: '4px 8px',
                            }}
                          >
                            {skill.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      flexWrap: 'wrap',
                    }}
                  >
                    {[
                      {
                        label: 'GITHUB',
                        href: 'https://github.com/idabaguspurwa',
                        icon: Github,
                      },
                      {
                        label: 'LINKEDIN',
                        href: 'https://linkedin.com/in/idabaguspurwa',
                        icon: Linkedin,
                      },
                      {
                        label: 'EMAIL',
                        href: 'mailto:ida.adiputra@outlook.com',
                        icon: Mail,
                      },
                    ].map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target={item.label === 'EMAIL' ? undefined : '_blank'}
                        rel={item.label === 'EMAIL' ? undefined : 'noopener noreferrer'}
                        className="about-link"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '7px',
                          background: cardBg,
                          color: pageText,
                          border: `3px solid ${borderColor}`,
                          boxShadow: `4px 4px 0px ${shadowColor}`,
                          padding: '8px 12px',
                          fontFamily: "'Space Mono', monospace",
                          fontWeight: 700,
                          fontSize: '11px',
                          textDecoration: 'none',
                          letterSpacing: '1px',
                        }}
                      >
                        <item.icon size={13} strokeWidth={2.8} />
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              </BrutalSection>
            </div>
          </section>

          <div
            style={{
              borderTop: `4px solid ${borderColor}`,
              borderBottom: `4px solid ${borderColor}`,
              padding: '8px 0',
              margin: '2px 0 52px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {[...Array(20)].map((_, i) => (
              <Star key={i} size={12} fill={pageText} color={pageText} style={{ opacity: 0.3 }} />
            ))}
          </div>

          <section style={{ position: 'relative', marginBottom: '68px' }}>
            <BrutalSection>
              <div
                style={{
                  display: 'inline-block',
                  background: COLORS.blue,
                  color: '#fff',
                  border: '3px solid #1a1a1a',
                  boxShadow: '3px 3px 0px #1a1a1a',
                  padding: '6px 16px',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: '14px',
                  letterSpacing: '2px',
                  marginBottom: '12px',
                  transform: 'rotate(1deg)',
                }}
              >
                OPERATING_MANUAL
              </div>
            </BrutalSection>

            <BrutalSection delay={0.06}>
              <div
                className="about-card"
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
                    color: COLORS.lime,
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 700,
                    fontSize: '13px',
                    padding: '10px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    letterSpacing: '1px',
                  }}
                >
                  <span>
                    <Terminal size={14} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                    about.md
                  </span>
                  <span style={{ opacity: 0.55 }}>- STABLE VERSION -</span>
                </div>

                <div
                  style={{
                    padding: '24px',
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '13px',
                    lineHeight: 1.82,
                  }}
                >
                  <p style={{ opacity: 0.45, marginBottom: '6px' }}>{'// philosophy'}</p>
                  <p style={{ marginBottom: '14px' }}>
                    I enjoy solving messy operational problems with clean technical systems. The
                    best outcome is invisible reliability where teams stop worrying about the
                    pipeline and focus on decisions.
                  </p>

                  <p style={{ opacity: 0.45, marginBottom: '6px' }}>{'// approach'}</p>
                  <p style={{ marginBottom: '14px' }}>
                    My workflow usually starts with mapping bottlenecks, then designing a delivery
                    path with clear ownership, observability, and rollback strategy from day one.
                  </p>

                  <p style={{ opacity: 0.45, marginBottom: '6px' }}>{'// stack'}</p>
                  <p style={{ marginBottom: '14px' }}>
                    <span style={{ background: COLORS.yellow, color: '#1a1a1a', padding: '0 4px', border: '1px solid #1a1a1a' }}>
                      Python + SQL
                    </span>
                    {' '}for core processing,
                    <span style={{ background: COLORS.mint, color: '#1a1a1a', padding: '0 4px', border: '1px solid #1a1a1a' }}>
                      {' '}Airflow
                    </span>
                    {' '}for orchestration, and
                    <span style={{ background: COLORS.lavender, color: '#1a1a1a', padding: '0 4px', border: '1px solid #1a1a1a' }}>
                      {' '}cloud services
                    </span>
                    {' '}when scaling and resilience become priorities.
                  </p>

                  <p style={{ opacity: 0.45, marginBottom: '6px' }}>{'// current mindset'}</p>
                  <p>
                    Build fewer things. Build stronger things.
                    <span className="cursor-blink" style={{ marginLeft: '4px' }}>
                      _
                    </span>
                  </p>
                </div>
              </div>
            </BrutalSection>
          </section>

          <section style={{ position: 'relative', marginBottom: '68px' }}>
            <BrutalSection>
              <div
                style={{
                  display: 'inline-block',
                  background: COLORS.coral,
                  border: '3px solid #1a1a1a',
                  boxShadow: '3px 3px 0px #1a1a1a',
                  padding: '6px 16px',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: '14px',
                  letterSpacing: '2px',
                  marginBottom: '10px',
                  transform: 'rotate(-1deg)',
                  color: '#1a1a1a',
                }}
              >
                JOURNEY.LOG
              </div>
            </BrutalSection>

            <BrutalSection delay={0.08}>
              <h2
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: 'clamp(28px, 5vw, 46px)',
                  letterSpacing: '-1px',
                  lineHeight: 1.1,
                  marginBottom: '24px',
                }}
              >
                Timeline Of Work And Learning
              </h2>
            </BrutalSection>

            <div style={{ display: 'grid', gap: '14px' }}>
              {JOURNEY.map((item, index) => (
                <BrutalSection key={item.role} delay={0.1 + index * 0.05}>
                  <div
                    className="about-card md:!grid-cols-[220px_1fr]"
                    style={{
                      background: cardBg,
                      border: `4px solid ${borderColor}`,
                      boxShadow: `5px 5px 0px ${shadowColor}`,
                      display: 'grid',
                      gridTemplateColumns: '1fr',
                    }}
                  >
                    <div
                      style={{
                        background: item.color,
                        color: item.textColor || '#1a1a1a',
                        borderBottom: '4px solid #1a1a1a',
                        padding: '16px',
                        fontFamily: "'Space Mono', monospace",
                        display: 'grid',
                        gap: '8px',
                      }}
                      className="md:!border-b-0 md:!border-r-[4px] md:!border-r-[#1a1a1a]"
                    >
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          letterSpacing: '1px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <CalendarDays size={14} strokeWidth={2.8} />
                        {item.year}
                      </div>
                      <item.icon size={20} strokeWidth={2.4} />
                    </div>

                    <div style={{ padding: '18px 18px 20px' }}>
                      <h3
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontWeight: 700,
                          fontSize: '22px',
                          letterSpacing: '-0.5px',
                          marginBottom: '6px',
                        }}
                      >
                        {item.role}
                      </h3>
                      <p
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontWeight: 700,
                          fontSize: '13px',
                          letterSpacing: '1px',
                          opacity: 0.65,
                          textTransform: 'uppercase',
                          marginBottom: '10px',
                        }}
                      >
                        {item.company}
                      </p>
                      <p style={{ fontSize: '15px', lineHeight: 1.7, opacity: 0.88 }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </BrutalSection>
              ))}
            </div>
          </section>

          <section style={{ position: 'relative', marginBottom: '74px' }}>
            <BrutalSection>
              <div
                style={{
                  display: 'inline-block',
                  background: COLORS.yellow,
                  border: '3px solid #1a1a1a',
                  boxShadow: '3px 3px 0px #1a1a1a',
                  padding: '6px 16px',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: '14px',
                  letterSpacing: '2px',
                  marginBottom: '10px',
                  transform: 'rotate(1deg)',
                  color: '#1a1a1a',
                }}
              >
                HOW_I_WORK
              </div>
            </BrutalSection>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '18px',
                marginBottom: '34px',
              }}
            >
              {PRINCIPLES.map((item, index) => (
                <BrutalSection key={item.title} delay={0.1 + index * 0.06}>
                  <div
                    className="about-card"
                    style={{
                      background: item.color,
                      color: item.textColor || '#1a1a1a',
                      border: '4px solid #1a1a1a',
                      boxShadow: '5px 5px 0px #1a1a1a',
                      padding: '22px',
                      height: '100%',
                    }}
                  >
                    <item.icon size={30} strokeWidth={2.5} style={{ marginBottom: '12px' }} />
                    <h3
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontWeight: 700,
                        fontSize: '20px',
                        lineHeight: 1.2,
                        marginBottom: '10px',
                      }}
                    >
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '14px', lineHeight: 1.65, opacity: 0.9 }}>
                      {item.description}
                    </p>
                  </div>
                </BrutalSection>
              ))}
            </div>

            <BrutalSection delay={0.24}>
              <div
                style={{
                  background: cardBg,
                  border: `4px solid ${borderColor}`,
                  boxShadow: `5px 5px 0px ${shadowColor}`,
                  padding: '22px',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 700,
                    letterSpacing: '1px',
                    fontSize: '14px',
                    marginBottom: '16px',
                    textTransform: 'uppercase',
                  }}
                >
                  Currently Exploring
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '14px',
                    justifyContent: 'center',
                  }}
                >
                  {NOW_BUILDING.map((item, index) => (
                    <FocusSticker key={item.label} item={item} index={index} />
                  ))}
                </div>
              </div>
            </BrutalSection>
          </section>

          <section style={{ marginBottom: '56px' }}>
            <BrutalSection>
              <div
                style={{
                  background: '#1a1a1a',
                  border: `4px solid ${borderColor}`,
                  boxShadow: `6px 6px 0px ${shadowColor}`,
                  padding: '34px 22px',
                  textAlign: 'center',
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 700,
                    fontSize: 'clamp(24px, 4vw, 34px)',
                    lineHeight: 1.2,
                    color: COLORS.yellow,
                    marginBottom: '14px',
                  }}
                >
                  BUILDING A NEW DATA PRODUCT OR PIPELINE?
                </h3>
                <p
                  style={{
                    color: '#fff',
                    opacity: 0.78,
                    maxWidth: '680px',
                    margin: '0 auto 20px',
                    fontSize: '16px',
                    lineHeight: 1.7,
                  }}
                >
                  I&apos;m open to discussing data engineering roles, architecture projects, and
                  collaborations where reliable execution matters.
                </p>
                <a
                  href="mailto:ida.adiputra@outlook.com"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: COLORS.lime,
                    color: '#1a1a1a',
                    border: '3px solid #1a1a1a',
                    boxShadow: '4px 4px 0px #0b0b0b',
                    padding: '12px 24px',
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 700,
                    fontSize: '14px',
                    letterSpacing: '1px',
                    textDecoration: 'none',
                  }}
                >
                  GET IN TOUCH
                  <ArrowRight size={16} strokeWidth={3} />
                </a>
              </div>
            </BrutalSection>
          </section>

          <div
            style={{
              borderTop: `4px solid ${borderColor}`,
              borderBottom: `4px solid ${borderColor}`,
              overflow: 'hidden',
              padding: '12px 0',
              marginBottom: '36px',
            }}
          >
            <div style={{ display: 'flex', width: 'max-content' }} className="marquee-track">
              {[...Array(10)].map((_, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 700,
                    fontSize: '30px',
                    color: pageText,
                    whiteSpace: 'nowrap',
                    letterSpacing: '4px',
                    textTransform: 'uppercase',
                    paddingRight: '24px',
                    opacity: 0.08,
                  }}
                >
                  PIPELINES {'\u2605'} CLOUD {'\u2605'} SQL {'\u2605'} AUTOMATION {'\u2605'} ETL {'\u2605'} RELIABILITY {'\u2605'}{' '}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
