'use client'

import { motion } from 'motion/react'
import { Github, Linkedin, Mail, ArrowUpRight, Star } from 'lucide-react'
import Link from 'next/link'

/* eslint-disable @next/next/no-page-custom-font */

const COLORS = {
  bg: '#fffdf7',
  black: '#1a1a1a',
  yellow: '#ffe14d',
  coral: '#ff5757',
  blue: '#3d5afe',
  lime: '#c6ff00',
  mint: '#98ffc8',
  lavender: '#c3b1e1',
}

const footerLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
]

const socials = [
  { name: 'GITHUB', icon: Github, href: 'https://github.com/idabaguspurwa' },
  { name: 'LINKEDIN', icon: Linkedin, href: 'https://www.linkedin.com/in/idabaguspurwa/' },
  { name: 'EMAIL', icon: Mail, href: 'mailto:ida.adiputra@outlook.com' },
]

// Kept for backward compatibility but simplified
export function PageQuickActions() {
  return null
}

export function BreadcrumbNav() {
  return null
}

export function FloatingQuickNav() {
  return null
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Work+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <footer
        style={{
          position: 'relative',
          zIndex: 20,
          background: COLORS.black,
          color: '#fff',
          fontFamily: "'Space Mono', monospace",
          overflow: 'hidden',
        }}
      >
        {/* Top border accent */}
        <div
          style={{
            height: '6px',
            background: `repeating-linear-gradient(90deg, ${COLORS.yellow} 0px, ${COLORS.yellow} 60px, ${COLORS.coral} 60px, ${COLORS.coral} 120px, ${COLORS.blue} 120px, ${COLORS.blue} 180px, ${COLORS.lime} 180px, ${COLORS.lime} 240px)`,
          }}
        />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {/* Main footer content */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '40px',
              padding: '48px 0 40px',
            }}
            className="md:!grid-cols-[1.2fr_1fr_auto]"
          >
            {/* Brand block */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ marginBottom: '20px' }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    background: COLORS.yellow,
                    border: `3px solid ${COLORS.yellow}`,
                    padding: '4px 16px',
                    fontWeight: 700,
                    fontSize: '22px',
                    color: COLORS.black,
                    letterSpacing: '-1px',
                    marginBottom: '16px',
                  }}
                >
                  IBP
                </div>
                <p
                  style={{
                    fontFamily: "'Work Sans', sans-serif",
                    fontSize: '14px',
                    lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.5)',
                    maxWidth: '340px',
                  }}
                >
                  Data Engineer at Inatax Jakarta, building data
                  pipelines with Docker, Airflow, Python & SQL.
                  Former Business Analyst Intern at BCA.
                </p>
              </motion.div>

              {/* Social links */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {socials.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2, boxShadow: `4px 4px 0px ${COLORS.yellow}` }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      color: '#fff',
                      background: 'transparent',
                      border: '2px solid rgba(255,255,255,0.2)',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = COLORS.yellow
                      e.currentTarget.style.color = COLORS.yellow
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <social.icon size={14} strokeWidth={2.5} />
                    {social.name}
                    <ArrowUpRight size={10} strokeWidth={3} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.3)',
                  marginBottom: '20px',
                }}
              >
                Navigation
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '4px 24px',
                }}
              >
                {footerLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    style={{
                      display: 'block',
                      padding: '6px 0',
                      fontSize: '13px',
                      fontWeight: 700,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.5)',
                      textDecoration: 'none',
                      transition: 'color 0.15s ease',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = COLORS.yellow
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Status block */}
            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.3)',
                  marginBottom: '20px',
                }}
              >
                Status
              </div>
              <div
                style={{
                  border: '2px solid rgba(255,255,255,0.1)',
                  padding: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      background: COLORS.lime,
                      animation: 'pulse 2s infinite',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      color: COLORS.lime,
                    }}
                  >
                    AVAILABLE
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "'Work Sans', sans-serif",
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.4)',
                    lineHeight: 1.5,
                  }}
                >
                  Open to data engineering
                  opportunities and collaborations.
                </p>
                <a
                  href="mailto:ida.adiputra@outlook.com"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    color: COLORS.yellow,
                    textDecoration: 'none',
                    transition: 'gap 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.gap = '10px'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.gap = '6px'
                  }}
                >
                  GET IN TOUCH
                  <ArrowUpRight size={12} strokeWidth={3} />
                </a>
              </div>
            </div>
          </div>

          {/* Star divider */}
          <div
            style={{
              borderTop: '2px solid rgba(255,255,255,0.08)',
              borderBottom: '2px solid rgba(255,255,255,0.08)',
              padding: '6px 0',
              display: 'flex',
              justifyContent: 'space-between',
              overflow: 'hidden',
            }}
          >
            {[...Array(16)].map((_, i) => (
              <Star
                key={i}
                size={10}
                fill="rgba(255,255,255,0.1)"
                color="rgba(255,255,255,0.1)"
              />
            ))}
          </div>

          {/* Bottom bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 0',
              gap: '12px',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontWeight: 400,
                letterSpacing: '1px',
                color: 'rgba(255,255,255,0.2)',
              }}
            >
              &copy; {currentYear} IDA BAGUS PURWA
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 400,
                letterSpacing: '1px',
                color: 'rgba(255,255,255,0.2)',
              }}
            >
              BUILT WITH NEXT.JS + MOTION
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
