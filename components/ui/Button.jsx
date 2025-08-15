'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

const Button = forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'default', 
  asChild = false,
  children, 
  ...props 
}, ref) => {
  const Comp = asChild ? 'span' : 'button'
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Comp
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-primary-light dark:bg-primary-dark text-white hover:bg-primary-light/90 dark:hover:bg-primary-dark/90': variant === 'default',
            'border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-700': variant === 'outline',
            'hover:bg-surface-light dark:hover:bg-surface-dark text-text-primary-light dark:text-text-primary-dark': variant === 'ghost',
            'bg-red-500 text-white hover:bg-red-600': variant === 'destructive',
          },
          {
            'h-10 py-2 px-4': size === 'default',
            'h-9 px-3 rounded-md': size === 'sm',
            'h-11 px-8 rounded-md': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    </motion.div>
  )
})

Button.displayName = 'Button'

export { Button }
