'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Heart } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-heading font-bold text-primary">
              Ida Bagus Gede Purwa Manik Adiputra
            </h3>
            <p className="text-secondary">
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
                  className="text-secondary hover:text-primary transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-heading font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: 'About', href: '/about' },
                { name: 'Projects', href: '/projects' },
                { name: 'Skills', href: '/skills' },
                { name: 'Experience', href: '/experience' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-secondary hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-heading font-semibold">Get In Touch</h4>
            <div className="space-y-2">
              <p className="text-secondary">
                📧 ida.adiputra@outlook.com
              </p>
              <p className="text-secondary">
                📱 +62 812 8743 0970
              </p>
              <p className="text-secondary">
                📍 Tangerang, Indonesia
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary text-sm">
              © {currentYear} Ida Bagus Gede Purwa Manik Adiputra. All rights reserved.
            </p>
            <motion.p
              className="text-secondary text-sm flex items-center mt-2 md:mt-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> and Next.js
            </motion.p>
          </div>
        </div>
      </div>
    </footer>
  )
}
