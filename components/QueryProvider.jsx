'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function QueryProvider({ children }) {
  // Create QueryClient instance on client side only
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,        // 5 minutes enterprise standard
        gcTime: 10 * 60 * 1000,          // 10 minutes cache retention
        refetchInterval: 30 * 1000,       // 30 second auto-refresh
        refetchOnWindowFocus: false,      // Prevent unnecessary refetches
        retry: 3,                         // Retry failed requests 3 times
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}