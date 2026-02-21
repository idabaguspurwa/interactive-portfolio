'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, Sun, Moon, FileText, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'

/* eslint-disable @next/next/no-page-custom-font */

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
]

const ACCENT = {
  yellow: '#ffe14d',
  coral: '#ff5757',
  blue: '#3d5afe',
  lime: '#c6ff00',
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  // Theme-adaptive colors
  const bg = isDark ? '#1a1a1a' : '#fffdf7'
  const textColor = isDark ? '#fffdf7' : '#1a1a1a'
  const textMuted = isDark ? 'rgba(255,253,247,0.5)' : 'rgba(26,26,26,0.5)'
  const borderMuted = isDark ? 'rgba(255,253,247,0.15)' : 'rgba(26,26,26,0.15)'
  const cardBg = isDark ? '#252525' : '#fff'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Work+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? bg : 'transparent',
          borderBottom: scrolled ? `3px solid ${textColor}` : '3px solid transparent',
          transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
          boxShadow: scrolled ? (isDark ? '0 4px 0 rgba(0,0,0,0.2)' : '0 4px 0 rgba(26,26,26,0.04)') : 'none',
          fontFamily: "'Space Mono', monospace",
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '64px',
            }}
          >
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: ACCENT.yellow,
                  border: '3px solid #1a1a1a',
                  boxShadow: '3px 3px 0px #1a1a1a',
                  padding: '4px 14px',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: '18px',
                  color: '#1a1a1a',
                  letterSpacing: '-1px',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                IBP
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '4px' }}>
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href} style={{ textDecoration: 'none' }}>
                    <motion.div
                      whileHover={{ y: -2 }}
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        color: isActive ? '#1a1a1a' : textMuted,
                        background: isActive ? ACCENT.lime : 'transparent',
                        border: isActive ? '2px solid #1a1a1a' : '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = textColor
                          e.currentTarget.style.borderColor = borderMuted
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = textMuted
                          e.currentTarget.style.borderColor = 'transparent'
                        }
                      }}
                    >
                      {item.name}
                    </motion.div>
                  </Link>
                )
              })}

              {/* CV Button */}
              <motion.button
                whileHover={{ y: -2, boxShadow: `4px 4px 0px ${textColor}` }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.open('/CV.pdf', '_blank')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  fontFamily: "'Space Mono', monospace",
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: textColor,
                  background: cardBg,
                  border: `2px solid ${textColor}`,
                  boxShadow: `3px 3px 0px ${textColor}`,
                  cursor: 'pointer',
                  marginLeft: '8px',
                  transition: 'all 0.15s ease',
                }}
              >
                <FileText size={14} strokeWidth={2.5} />
                CV
              </motion.button>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ rotate: 15, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  border: `2px solid ${textColor}`,
                  background: isDark ? ACCENT.yellow : cardBg,
                  cursor: 'pointer',
                  marginLeft: '8px',
                  transition: 'background 0.2s ease',
                }}
              >
                {isDark ? (
                  <Sun size={16} strokeWidth={2.5} color="#1a1a1a" />
                ) : (
                  <Moon size={16} strokeWidth={2.5} color="#1a1a1a" />
                )}
              </motion.button>
            </div>

            {/* Mobile: Theme + Hamburger */}
            <div className="flex lg:hidden" style={{ alignItems: 'center', gap: '8px' }}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  border: `2px solid ${textColor}`,
                  background: isDark ? ACCENT.yellow : cardBg,
                  cursor: 'pointer',
                }}
              >
                {isDark ? (
                  <Sun size={16} strokeWidth={2.5} color="#1a1a1a" />
                ) : (
                  <Moon size={16} strokeWidth={2.5} color="#1a1a1a" />
                )}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  border: `3px solid ${textColor}`,
                  boxShadow: isOpen ? 'none' : `3px 3px 0px ${textColor}`,
                  background: isOpen ? ACCENT.coral : cardBg,
                  color: isOpen ? '#fff' : textColor,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {isOpen ? (
                  <X size={20} strokeWidth={3} />
                ) : (
                  <Menu size={20} strokeWidth={3} />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(26,26,26,0.3)',
                  zIndex: 40,
                }}
                className="lg:hidden"
              />

              {/* Menu Panel */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: bg,
                  borderBottom: `4px solid ${textColor}`,
                  zIndex: 50,
                  padding: '16px 20px 24px',
                }}
                className="lg:hidden"
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {navItems.map((item, index) => {
                    const isActive = pathname === item.href
                    const accentColors = [ACCENT.coral, ACCENT.blue, ACCENT.lime, ACCENT.yellow]
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            fontSize: '14px',
                            fontWeight: 700,
                            fontFamily: "'Space Mono', monospace",
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            textDecoration: 'none',
                            color: isActive ? '#1a1a1a' : textColor,
                            background: isActive ? accentColors[index % accentColors.length] : 'transparent',
                            border: isActive ? '3px solid #1a1a1a' : '3px solid transparent',
                            boxShadow: isActive ? '3px 3px 0px #1a1a1a' : 'none',
                            transition: 'all 0.1s ease',
                          }}
                        >
                          <span>{item.name}</span>
                          {isActive && (
                            <div
                              style={{
                                width: '8px',
                                height: '8px',
                                background: '#1a1a1a',
                              }}
                            />
                          )}
                        </Link>
                      </motion.div>
                    )
                  })}

                  {/* Mobile CV */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.05 }}
                    style={{ marginTop: '8px' }}
                  >
                    <button
                      onClick={() => {
                        window.open('/CV.pdf', '_blank')
                        setIsOpen(false)
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: 700,
                        fontFamily: "'Space Mono', monospace",
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        color: '#1a1a1a',
                        background: ACCENT.yellow,
                        border: '3px solid #1a1a1a',
                        boxShadow: '3px 3px 0px #1a1a1a',
                        cursor: 'pointer',
                      }}
                    >
                      <FileText size={16} strokeWidth={2.5} />
                      View CV
                      <ArrowUpRight size={14} strokeWidth={3} />
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
