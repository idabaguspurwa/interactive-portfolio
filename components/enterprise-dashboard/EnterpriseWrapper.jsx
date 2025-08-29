'use client'

import { DataStreamProvider } from './realtime/DataStream'
import { CrossFilterProvider } from './interactions/CrossFilter'
import { DashboardContainer } from './DashboardContainer'

export function EnterpriseWrapper() {
  return (
    <DataStreamProvider>
      <CrossFilterProvider>
        <DashboardContainer />
      </CrossFilterProvider>
    </DataStreamProvider>
  )
}