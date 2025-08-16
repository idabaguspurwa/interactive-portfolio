'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

// Fast, modern page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] // Smooth custom easing
    }
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: [0.76, 0, 0.24, 1]
    }
  }
}

// Optional subtle overlay for premium feel (very fast)
const overlayVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.15 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.15 }
  }
}

export function PageTransition({ children }) {
  const pathname = usePathname()

  return (
    <div className="relative">
      {/* Fast, subtle overlay during transitions */}
      <AnimatePresence>
        <motion.div
          key={`overlay-${pathname}`}
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 bg-gradient-to-br from-primary-light/5 via-transparent to-accent-light/5 dark:from-primary-dark/5 dark:to-accent-dark/5 z-[50] pointer-events-none"
        />
      </AnimatePresence>

      {/* Fast page content transitions */}
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

// Simplified hook for external components
export const usePageTransition = () => {
  const pathname = usePathname()
  return { isTransitioning: false, pathname }
}