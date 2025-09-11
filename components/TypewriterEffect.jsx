'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function TypewriterEffect({ words = [], text, delay = 100, className = "" }) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  // Use text prop if provided, otherwise use words array
  const textToType = text || (words.length > 0 ? words[currentWordIndex] : '')

  useEffect(() => {
    if (!textToType) return

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentIndex < textToType.length) {
          setDisplayText(prev => prev + textToType[currentIndex])
          setCurrentIndex(currentIndex + 1)
        } else {
          // Finished typing, wait then start deleting (only for words array)
          if (words.length > 1) {
            setTimeout(() => setIsDeleting(true), 1500)
          }
        }
      } else {
        // Deleting
        if (currentIndex > 0) {
          setDisplayText(prev => prev.slice(0, -1))
          setCurrentIndex(currentIndex - 1)
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false)
          setCurrentWordIndex((prev) => (prev + 1) % words.length)
        }
      }
    }, isDeleting ? delay / 2 : delay)

    return () => clearTimeout(timeout)
  }, [currentIndex, currentWordIndex, isDeleting, delay, textToType, words.length])

  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayText}
      <motion.span
        className="text-primary"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        |
      </motion.span>
    </motion.span>
  )
}
