'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Heart, ExternalLink, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// Page Quick Actions Component
export function PageQuickActions({ pageType }) {
  const pageActions = {
    'projects': [
      { name: 'View All Projects', href: '/projects', icon: '🚀', color: 'from-purple-500 to-purple-600' },
      { name: 'Skills', href: '/skills', icon: '⚡', color: 'from-orange-500 to-orange-600' },
      { name: 'Experience', href: '/experience', icon: '📚', color: 'from-red-500 to-red-600' },
    ],
    'skills': [
      { name: 'Projects', href: '/projects', icon: '🚀', color: 'from-purple-500 to-purple-600' },
      { name: 'Experience', href: '/experience', icon: '📚', color: 'from-red-500 to-red-600' },
      { name: 'Playground', href: '/playground', icon: '🎮', color: 'from-pink-500 to-pink-600' },
    ],
    'experience': [
      { name: 'Skills', href: '/skills', icon: '⚡', color: 'from-orange-500 to-orange-600' },
      { name: 'Projects', href: '/projects', icon: '🚀', color: 'from-purple-500 to-purple-600' },
      { name: 'Publications', href: '/publications', icon: '📖', color: 'from-indigo-500 to-indigo-600' },
    ],
    'about': [
      { name: 'Projects', href: '/projects', icon: '🚀', color: 'from-purple-500 to-purple-600' },
      { name: 'Skills', href: '/skills', icon: '⚡', color: 'from-orange-500 to-orange-600' },
      { name: 'Contact', href: '/contact', icon: '📧', color: 'from-teal-500 to-teal-600' },
    ],
    'playground': [
      { name: 'Projects', href: '/projects', icon: '🚀', color: 'from-purple-500 to-purple-600' },
      { name: 'Skills', href: '/skills', icon: '⚡', color: 'from-orange-500 to-orange-600' },
      { name: 'Publications', href: '/publications', icon: '📖', color: 'from-indigo-500 to-indigo-600' },
    ],
    'publications': [
      { name: 'Projects', href: '/projects', icon: '🚀', color: 'from-purple-500 to-purple-600' },
      { name: 'Experience', href: '/experience', icon: '📚', color: 'from-red-500 to-red-600' },
      { name: 'Contact', href: '/contact', icon: '📧', color: 'from-teal-500 to-teal-600' },
    ],
    'contact': [
      { name: 'Projects', href: '/projects', icon: '🚀', color: 'from-purple-500 to-purple-600' },
      { name: 'Skills', href: '/skills', icon: '⚡', color: 'from-orange-500 to-orange-600' },
      { name: 'About', href: '/about', icon: '👨‍💼', color: 'from-green-500 to-green-600' },
    ]
  }

  const actions = pageActions[pageType] || []

  if (actions.length === 0) return null

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span>🔗</span>
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {actions.map((action) => (
          <motion.div
            key={action.name}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={action.href}
              className={`block p-4 rounded-lg bg-gradient-to-br ${action.color} text-white text-center transition-all duration-300 hover:shadow-lg`}
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <div className="text-sm font-medium">{action.name}</div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Breadcrumb Navigation Component
export function BreadcrumbNav({ currentPage, parentPage = null }) {
  const breadcrumbItems = [
    { name: 'Home', href: '/', icon: '🏠' },
    ...(parentPage ? [{ name: parentPage, href: `/${parentPage.toLowerCase()}`, icon: '📁' }] : []),
    { name: currentPage, href: '#', icon: '📍', current: true }
  ]

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
      {breadcrumbItems.map((item, index) => (
        <div key={item.name} className="flex items-center">
          {index > 0 && (
            <span className="mx-2 text-gray-400 dark:text-gray-600">/</span>
          )}
          {item.current ? (
            <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
              <span>{item.icon}</span>
              {item.name}
            </span>
          ) : (
            <Link
              href={item.href}
              className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

// Floating Quick Navigation Component
export function FloatingQuickNav() {
  const [isOpen, setIsOpen] = useState(false)

  const quickNavItems = [
    { name: 'Home', href: '/', icon: '🏠', color: 'from-blue-500 to-blue-600' },
    { name: 'About', href: '/about', icon: '👨‍💼', color: 'from-green-500 to-green-600' },
    { name: 'Projects', href: '/projects', icon: '🚀', color: 'from-purple-500 to-purple-600' },
    { name: 'Skills', href: '/skills', icon: '⚡', color: 'from-orange-500 to-orange-600' },
    { name: 'Experience', href: '/experience', icon: '📚', color: 'from-red-500 to-red-600' },
    { name: 'AI Explorer', href: '/ai-explorer', icon: '🤖', color: 'from-violet-500 to-violet-600' },
    { name: 'Playground', href: '/playground', icon: '🎮', color: 'from-pink-500 to-pink-600' },
    { name: 'Publications', href: '/publications', icon: '📖', color: 'from-indigo-500 to-indigo-600' },
    { name: 'Contact', href: '/contact', icon: '📧', color: 'from-teal-500 to-teal-600' },
  ]

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Quick Navigation"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        ) : (
          <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        )}
      </motion.button>

      {/* Floating Quick Navigation Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-20 right-6 z-40 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 min-w-[280px]"
        >
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-4">
              Quick Navigation
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickNavItems.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block p-3 rounded-xl bg-gradient-to-br ${item.color} text-white text-center transition-all duration-300 hover:shadow-lg`}
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-sm font-medium">{item.name}</div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  // Enhanced quick links organized by category
  const quickLinks = {
    'Main Pages': [
      { name: 'Home', href: '/', icon: '🏠' },
      { name: 'About', href: '/about', icon: '👨‍💼' },
      { name: 'Projects', href: '/projects', icon: '🚀' },
      { name: 'Skills', href: '/skills', icon: '⚡' },
      { name: 'Experience', href: '/experience', icon: '📚' },
    ],
    'Special Features': [
      { name: 'AI Data Explorer', href: '/ai-explorer', icon: '🤖' },
      { name: 'Data Playground', href: '/playground', icon: '🎮' },
      { name: 'Publications', href: '/publications', icon: '📖' },
      { name: 'Contact', href: '/contact', icon: '📧' },
    ]
  }

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
              Ida Bagus Gede Purwa Manik Adiputra
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Data Engineer & ETL Specialist passionate about building scalable data solutions and analytics platforms.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Github, href: 'https://github.com/idabaguspurwa', label: 'GitHub' },
                { icon: Linkedin, href: 'https://www.linkedin.com/in/idabaguspurwa/', label: 'LinkedIn' },
                { icon: Mail, href: 'mailto:ida.adiputra@outlook.com', label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Enhanced Quick Links - Main Pages */}
          <div className="space-y-4">
            <h4 className="text-lg font-heading font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span>📋</span>
              Main Pages
            </h4>
            <ul className="space-y-3">
              {quickLinks['Main Pages'].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Quick Links - Special Features */}
          <div className="space-y-4">
            <h4 className="text-lg font-heading font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span>✨</span>
              Special Features
            </h4>
            <ul className="space-y-3">
              {quickLinks['Special Features'].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.name}
                    </span>
                    {link.name === 'AI Data Explorer' && (
                      <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-full">
                        NEW
                      </span>
                    )}
                    {link.name === 'Data Playground' && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                        Interactive
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-heading font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span>📞</span>
              Get In Touch
            </h4>
            <div className="space-y-3">
              <motion.a
                href="mailto:ida.adiputra@outlook.com"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group"
                whileHover={{ x: 2 }}
              >
                <span className="text-lg">📧</span>
                <span className="text-sm break-all">ida.adiputra@outlook.com</span>
              </motion.a>
              <motion.a
                href="https://wa.me/6281287430970"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group"
                whileHover={{ x: 2 }}
              >
                <span className="text-lg">📱</span>
                <span>+62 812 8743 0970</span>
              </motion.a>
              <div className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <span className="text-lg">📍</span>
                <span>Tangerang, Indonesia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 dark:text-gray-300 text-sm text-center md:text-left">
              © {currentYear} Ida Bagus Gede Purwa Manik Adiputra. All rights reserved.
            </p>
            <motion.div
              className="flex items-center gap-4 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-gray-600 dark:text-gray-300">Built with</span>
              <motion.div
                className="flex items-center gap-1 text-red-500"
                whileHover={{ scale: 1.1 }}
              >
                <Heart className="h-4 w-4" />
                <span>Next.js</span>
              </motion.div>
              <span className="text-gray-600 dark:text-gray-300">•</span>
              <span className="text-gray-600 dark:text-gray-300">React Three Fiber</span>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}
