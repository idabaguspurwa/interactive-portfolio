'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/components/ThemeProvider'
import {
  Github,
  Linkedin,
  Mail,
  ArrowRight,
  ArrowUpRight,
  Star,
  Zap,
  Database,
  Cloud,
  Terminal,
  Cpu,
  Layers,
  Code,
  MapPin,
  Briefcase,
  GraduationCap,
} from 'lucide-react'

/* eslint-disable @next/next/no-page-custom-font */

// ── Accent colors (shared across light & dark) ──────────────────────────────
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

// ── Tech stack with colors ───────────────────────────────────────────────────
const TECH_STACK = [
  { name: 'Python', color: '#ffe14d', rotation: -2, icon: Code },
  { name: 'SQL', color: '#89cff0', rotation: 3, icon: Database },
  { name: 'Apache Spark', color: '#ff5757', rotation: -1, icon: Zap },
  { name: 'Kafka', color: '#c6ff00', rotation: 2, icon: Layers },
  { name: 'Azure', color: '#c3b1e1', rotation: -3, icon: Cloud },
  { name: 'AWS', color: '#ffc9a9', rotation: 1, icon: Cloud },
  { name: 'Docker', color: '#89cff0', rotation: -2, icon: Cpu },
  { name: 'Kubernetes', color: '#98ffc8', rotation: 3, icon: Cpu },
  { name: 'Snowflake', color: '#ffe14d', rotation: -1, icon: Database },
  { name: 'dbt', color: '#ff8fab', rotation: 2, icon: Terminal },
  { name: 'Airflow', color: '#c6ff00', rotation: -3, icon: Zap },
  { name: 'Terraform', color: '#c3b1e1', rotation: 1, icon: Layers },
]

// ── Marquee text ─────────────────────────────────────────────────────────────
const MARQUEE_TEXT = 'DATA ENGINEER \u2605 ETL SPECIALIST \u2605 CLOUD ARCHITECT \u2605 '

// ── Animated section wrapper ─────────────────────────────────────────────────
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

// ── Sticky note component ────────────────────────────────────────────────────
function StickyNote({ name, color, rotation, icon: Icon, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, rotate: rotation * 2 }}
      whileInView={{ opacity: 1, scale: 1, rotate: rotation }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{
        scale: 1.15,
        rotate: 0,
        zIndex: 20,
        transition: { duration: 0.2 },
      }}
      className="cursor-pointer"
      style={{
        background: color,
        border: '3px solid #1a1a1a',
        boxShadow: '4px 4px 0px #1a1a1a',
        padding: '16px',
        width: '130px',
        height: '130px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <Icon size={28} strokeWidth={2.5} color="#1a1a1a" />
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700,
          fontSize: '12px',
          color: '#1a1a1a',
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        {name}
      </span>
    </motion.div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Theme-adaptive base colors
  const pageBg = isDark ? '#0f0f0f' : '#fffdf7'
  const pageText = isDark ? '#fffdf7' : '#1a1a1a'
  const cardBg = isDark ? '#1e1e1e' : '#ffffff'
  const borderColor = isDark ? '#fffdf7' : '#1a1a1a'
  const shadowColor = isDark ? '#000000' : '#1a1a1a'
  const darkSectionBg = isDark ? '#1e1e1e' : '#1a1a1a'

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Google Fonts */}
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
        @keyframes float-up {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes pulse-border {
          0%, 100% { border-color: #1a1a1a; }
          50% { border-color: #3d5afe; }
        }
        .marquee-track {
          animation: marquee-scroll 20s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .brutal-link {
          transition: all 0.15s ease;
        }
        .brutal-link:hover {
          background: #1a1a1a !important;
          color: #ffe14d !important;
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0px #1a1a1a;
        }
        .dark .brutal-link:hover {
          background: #fffdf7 !important;
          color: #1a1a1a !important;
          box-shadow: 6px 6px 0px #000;
        }
        .brutal-card {
          transition: all 0.15s ease;
        }
        .brutal-card:hover {
          transform: translate(-3px, -3px) !important;
          box-shadow: 7px 7px 0px #1a1a1a !important;
        }
        .dark .brutal-card:hover {
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
          {/* ── HERO SECTION ─────────────────────────────────────────── */}
          <section style={{ padding: '60px 0 40px', position: 'relative' }}>
            {/* Giant watermark number */}
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
              01
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '40px',
                position: 'relative',
                zIndex: 2,
              }}
              className="md:!grid-cols-[1fr_auto]"
            >
              {/* Left: Name + roles */}
              <BrutalSection>
                <div>
                  {/* Location tag */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: COLORS.lime,
                      border: '3px solid #1a1a1a',
                      padding: '6px 14px',
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      fontSize: '12px',
                      color: '#1a1a1a',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '20px',
                      boxShadow: '3px 3px 0px #1a1a1a',
                    }}
                  >
                    <MapPin size={14} strokeWidth={3} color="#1a1a1a" />
                    Tangerang, Indonesia
                  </motion.div>

                  {/* Giant name */}
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      fontSize: 'clamp(36px, 7vw, 72px)',
                      lineHeight: 0.95,
                      letterSpacing: '-2px',
                      color: pageText,
                      marginBottom: '24px',
                      maxWidth: '700px',
                    }}
                    className="md:!-rotate-[-3deg] md:!origin-top-left"
                  >
                    <span style={{ display: 'block' }}>IDA BAGUS</span>
                    <span style={{ display: 'block' }}>GEDE PURWA</span>
                    <span style={{ display: 'block' }}>
                      MANIK{' '}
                      <span
                        style={{
                          background: COLORS.yellow,
                          padding: '0 8px',
                          border: '3px solid #1a1a1a',
                          display: 'inline-block',
                          transform: 'rotate(1deg)',
                          color: '#1a1a1a',
                        }}
                      >
                        ADIPUTRA
                      </span>
                    </span>
                  </motion.h1>

                  {/* Role stamps */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '10px',
                      marginBottom: '28px',
                    }}
                  >
                    {[
                      { label: 'DATA ENGINEER', color: COLORS.coral },
                      { label: 'ETL SPECIALIST', color: COLORS.blue, textColor: '#fff' },
                      { label: 'CLOUD ARCHITECT', color: COLORS.lime },
                    ].map((role) => (
                      <div
                        key={role.label}
                        style={{
                          background: role.color,
                          color: role.textColor || '#1a1a1a',
                          border: '3px solid #1a1a1a',
                          padding: '8px 18px',
                          fontFamily: "'Space Mono', monospace",
                          fontWeight: 700,
                          fontSize: '13px',
                          letterSpacing: '2px',
                          boxShadow: '3px 3px 0px #1a1a1a',
                        }}
                      >
                        {role.label}
                      </div>
                    ))}
                  </motion.div>

                  {/* Quick info */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontFamily: "'Work Sans', sans-serif",
                        fontSize: '15px',
                        fontWeight: 500,
                      }}
                    >
                      <Briefcase size={16} strokeWidth={2.5} />
                      <span>Inatax Jakarta</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontFamily: "'Work Sans', sans-serif",
                        fontSize: '15px',
                        fontWeight: 500,
                      }}
                    >
                      <GraduationCap size={16} strokeWidth={2.5} />
                      <span>Bina Nusantara University</span>
                    </div>
                  </motion.div>
                </div>
              </BrutalSection>

              {/* Right: Photo */}
              <BrutalSection delay={0.3}>
                <motion.div
                  whileHover={{ rotate: 0, scale: 1.03 }}
                  style={{
                    position: 'relative',
                    width: '260px',
                    height: '320px',
                    border: `4px solid ${COLORS.coral}`,
                    boxShadow: `6px 6px 0px ${shadowColor}`,
                    transform: 'rotate(2deg)',
                    overflow: 'hidden',
                    background: cardBg,
                    transition: 'all 0.3s ease',
                  }}
                  className="mx-auto md:!mx-0"
                >
                  <Image
                    src="/logo.jpg"
                    alt="Ida Bagus Gede Purwa Manik Adiputra"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                  {/* Photo label */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: '#1a1a1a',
                      color: COLORS.yellow,
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      fontSize: '11px',
                      padding: '6px 10px',
                      letterSpacing: '1px',
                      textAlign: 'center',
                    }}
                  >
                    PROFILE.JPG
                  </div>
                </motion.div>
              </BrutalSection>
            </div>

            {/* Social links row */}
            <BrutalSection delay={0.6}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginTop: '32px',
                }}
              >
                <a
                  href="https://github.com/idabaguspurwa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-link"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: cardBg,
                    border: `3px solid ${borderColor}`,
                    padding: '10px 20px',
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 700,
                    fontSize: '13px',
                    color: pageText,
                    textDecoration: 'none',
                    boxShadow: `4px 4px 0px ${shadowColor}`,
                  }}
                >
                  <Github size={18} strokeWidth={2.5} />
                  GITHUB
                  <ArrowUpRight size={14} strokeWidth={3} />
                </a>

                <a
                  href="https://linkedin.com/in/idabaguspurwa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-link"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: cardBg,
                    border: `3px solid ${borderColor}`,
                    padding: '10px 20px',
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 700,
                    fontSize: '13px',
                    color: pageText,
                    textDecoration: 'none',
                    boxShadow: `4px 4px 0px ${shadowColor}`,
                  }}
                >
                  <Linkedin size={18} strokeWidth={2.5} />
                  LINKEDIN
                  <ArrowUpRight size={14} strokeWidth={3} />
                </a>

                <a
                  href="mailto:ida.adiputra@outlook.com"
                  className="brutal-link"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: COLORS.yellow,
                    border: '3px solid #1a1a1a',
                    padding: '10px 20px',
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 700,
                    fontSize: '13px',
                    color: '#1a1a1a',
                    textDecoration: 'none',
                    boxShadow: '4px 4px 0px #1a1a1a',
                  }}
                >
                  <Mail size={18} strokeWidth={2.5} />
                  CONTACT
                  <ArrowRight size={14} strokeWidth={3} />
                </a>
              </div>
            </BrutalSection>
          </section>

          {/* ── DIVIDER ──────────────────────────────────────────────── */}
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

          {/* ── ABOUT.TXT SECTION ────────────────────────────────────── */}
          <section style={{ position: 'relative', marginBottom: '70px' }}>
            {/* Watermark */}
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
              02
            </div>

            <BrutalSection>
              {/* Section label */}
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
                SECTION 02
              </div>
            </BrutalSection>

            <BrutalSection delay={0.1}>
              <div
                className="brutal-card"
                style={{
                  background: cardBg,
                  border: `4px solid ${borderColor}`,
                  boxShadow: `5px 5px 0px ${shadowColor}`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* File title bar */}
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
                    ABOUT.TXT
                  </span>
                  <span style={{ opacity: 0.5 }}>--- READ ONLY ---</span>
                </div>

                {/* File content */}
                <div
                  style={{
                    padding: '24px',
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '13px',
                    lineHeight: 1.8,
                    color: pageText,
                  }}
                >
                  <div style={{ opacity: 0.4, marginBottom: '4px' }}>
                    {'// ======================================'}
                  </div>
                  <div style={{ opacity: 0.4, marginBottom: '4px' }}>
                    {'// ABOUT: Ida Bagus Gede Purwa Manik Adiputra'}
                  </div>
                  <div style={{ opacity: 0.4, marginBottom: '16px' }}>
                    {'// ======================================'}
                  </div>

                  <p style={{ marginBottom: '16px' }}>
                    Data Engineer at
                    <span style={{ fontWeight: 700 }}> Inatax Jakarta</span>,
                    a startup where I build and maintain
                    <span style={{ background: COLORS.yellow, padding: '0 4px', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
                      {' '}data pipelines{' '}
                    </span>
                    using Docker, Airflow, Python, and SQL &mdash;
                    working with Wasabi cloud storage and on-premise servers.
                  </p>

                  <p style={{ marginBottom: '16px' }}>
                    Previously a
                    <span style={{ fontWeight: 700 }}> Business Analyst Intern </span>
                    at
                    <span style={{ background: COLORS.sky, padding: '0 4px', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
                      {' '}Bank Central Asia (BCA){' '}
                    </span>
                    for 1 year, where I gained hands-on experience in
                    data-driven decision making at one of Indonesia&apos;s largest banks.
                  </p>

                  <p style={{ marginBottom: '16px' }}>
                    Graduated from
                    <span style={{ fontWeight: 700 }}> Bina Nusantara University </span>
                    with a strong foundation in computer science and data engineering principles.
                  </p>

                  <p>
                    Beyond work, I continuously expand my toolkit through
                    self-learning &mdash; technologies like
                    <span style={{ background: COLORS.mint, padding: '0 4px', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
                      {' '}dbt & Snowflake{' '}
                    </span>
                    ,
                    <span style={{ background: COLORS.peach, padding: '0 4px', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
                      {' '}Kubernetes & Terraform{' '}
                    </span>
                    , and
                    <span style={{ background: COLORS.lavender, padding: '0 4px', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
                      {' '}Apache Spark & Kafka{' '}
                    </span>
                    {' '}picked up through platforms like Udemy and hands-on projects.
                  </p>

                  <div style={{ marginTop: '20px', opacity: 0.4 }}>
                    {'> EOF'}
                    <span className="cursor-blink" style={{ marginLeft: '4px' }}>
                      _
                    </span>
                  </div>
                </div>
              </div>
            </BrutalSection>
          </section>

          {/* ── TECH STACK SECTION ───────────────────────────────────── */}
          <section style={{ position: 'relative', marginBottom: '70px' }}>
            {/* Watermark */}
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
                SECTION 03
              </div>
            </BrutalSection>

            <BrutalSection delay={0.1}>
              <h2
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: 'clamp(28px, 5vw, 48px)',
                  lineHeight: 1.1,
                  marginBottom: '8px',
                  letterSpacing: '-1px',
                }}
              >
                TECH STACK
              </h2>
              <p
                style={{
                  fontFamily: "'Work Sans', sans-serif",
                  fontSize: '16px',
                  opacity: 0.6,
                  marginBottom: '32px',
                  maxWidth: '500px',
                }}
              >
                Tools and technologies I work with daily to build
                data infrastructure.
              </p>
            </BrutalSection>

            {/* Sticky notes grid */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                justifyContent: 'center',
              }}
            >
              {TECH_STACK.map((tech, i) => (
                <StickyNote key={tech.name} {...tech} index={i} />
              ))}
            </div>
          </section>

          {/* ── EXPERIENCE HIGHLIGHTS ────────────────────────────────── */}
          <section style={{ position: 'relative', marginBottom: '70px' }}>
            {/* Watermark */}
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
                  background: COLORS.yellow,
                  border: '3px solid #1a1a1a',
                  padding: '6px 16px',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#1a1a1a',
                  letterSpacing: '2px',
                  marginBottom: '8px',
                  boxShadow: '3px 3px 0px #1a1a1a',
                  transform: 'rotate(-1deg)',
                }}
              >
                SECTION 04
              </div>
            </BrutalSection>

            <BrutalSection delay={0.1}>
              <h2
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: 'clamp(28px, 5vw, 48px)',
                  lineHeight: 1.1,
                  marginBottom: '32px',
                  letterSpacing: '-1px',
                }}
              >
                WHAT I DO
              </h2>
            </BrutalSection>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {[
                {
                  title: 'ETL PIPELINES',
                  desc: 'Design and build robust ETL/ELT pipelines processing millions of records daily using Apache Spark, Airflow, and dbt.',
                  color: COLORS.coral,
                  icon: Zap,
                  rotation: -1,
                },
                {
                  title: 'CLOUD INFRA',
                  desc: 'Architect cloud-native data solutions on Azure and AWS with Infrastructure as Code using Terraform and Kubernetes.',
                  color: COLORS.blue,
                  textColor: '#fff',
                  icon: Cloud,
                  rotation: 1,
                },
                {
                  title: 'STREAMING',
                  desc: 'Real-time data streaming and event-driven architectures with Apache Kafka, enabling instant data availability.',
                  color: COLORS.lime,
                  icon: Layers,
                  rotation: -0.5,
                },
              ].map((card, i) => (
                <BrutalSection key={card.title} delay={0.1 + i * 0.1}>
                  <div
                    className="brutal-card"
                    style={{
                      background: card.color,
                      color: card.textColor || '#1a1a1a',
                      border: '4px solid #1a1a1a',
                      padding: '28px 24px',
                      boxShadow: '5px 5px 0px #1a1a1a',
                      transform: `rotate(${card.rotation}deg)`,
                      height: '100%',
                    }}
                  >
                    <card.icon size={32} strokeWidth={2.5} style={{ marginBottom: '14px' }} />
                    <h3
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontWeight: 700,
                        fontSize: '20px',
                        marginBottom: '12px',
                        letterSpacing: '1px',
                      }}
                    >
                      {card.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Work Sans', sans-serif",
                        fontSize: '14px',
                        lineHeight: 1.6,
                        opacity: 0.85,
                      }}
                    >
                      {card.desc}
                    </p>
                  </div>
                </BrutalSection>
              ))}
            </div>
          </section>

          {/* ── CTA SECTION ──────────────────────────────────────────── */}
          <section style={{ position: 'relative', marginBottom: '70px' }}>
            {/* Watermark */}
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
                {/* Decorative corner stamps */}
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
                  LET&apos;S BUILD{' '}
                  <span style={{ color: COLORS.yellow }}>SOMETHING</span>
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
                  Have a data challenge? Looking for someone to architect
                  your next pipeline? Let&apos;s talk.
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '16px',
                    justifyContent: 'center',
                  }}
                >
                  <a
                    href="mailto:ida.adiputra@outlook.com"
                    className="brutal-link"
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
                    GET IN TOUCH
                    <ArrowRight size={18} strokeWidth={3} />
                  </a>

                  <a
                    href="https://github.com/idabaguspurwa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brutal-link"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: 'transparent',
                      color: '#fff',
                      border: '3px solid #ffffff44',
                      padding: '14px 28px',
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      fontSize: '15px',
                      letterSpacing: '1px',
                      textDecoration: 'none',
                      boxShadow: '4px 4px 0px #ffffff11',
                    }}
                  >
                    VIEW GITHUB
                    <ArrowUpRight size={18} strokeWidth={3} />
                  </a>
                </div>
              </div>
            </BrutalSection>
          </section>

          {/* ── BOTTOM MARQUEE ───────────────────────────────────────── */}
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
                  PYTHON {'\u2605'} SQL {'\u2605'} SPARK {'\u2605'} KAFKA {'\u2605'} AZURE {'\u2605'} AWS {'\u2605'} DOCKER {'\u2605'} K8S {'\u2605'}{' '}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
