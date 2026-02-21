'use client'

import { motion, AnimatePresence } from 'motion/react'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

// Fast, smooth page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    x: 30,
    scale: 0.98
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1]
    }
  },
  out: {
    opacity: 0,
    x: -30,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: [0.76, 0, 0.24, 1]
    }
  }
}

// Subtle transition overlay
const overlayTransitionVariants = {
  initial: { 
    opacity: 0
  },
  animate: { 
    opacity: 0.3,
    transition: { 
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: 0.2,
      ease: "easeIn"
    }
  }
}


export function PageTransition({ children }) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = prefersReducedMotion ? 150 : 400
    
    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), duration)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div className="relative">
      {/* Subtle overlay for smooth transition */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key={`overlay-${pathname}`}
            variants={overlayTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-[99] pointer-events-none bg-white/50 dark:bg-gray-900/50"
          />
        )}
      </AnimatePresence>

      {/* Fast, smooth page content transitions */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          className="min-h-screen relative z-10"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Enhanced hook for external components
export const usePageTransition = () => {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = prefersReducedMotion ? 150 : 400
    
    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), duration)
    return () => clearTimeout(timer)
  }, [pathname])

  return { isTransitioning, pathname }
}