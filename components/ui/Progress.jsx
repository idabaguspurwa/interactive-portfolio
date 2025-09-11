'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Progress = forwardRef(({ className, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800',
      className
    )}
    {...props}
  >
    <div
      className="h-full w-full flex-1 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
))
Progress.displayName = 'Progress'

export { Progress }