import { NextResponse } from 'next/server'
import { callPythonAPI } from '@/lib/python-api'

// Force dynamic rendering to prevent Vercel build errors
export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const eventTypes = searchParams.get('event_types')
    const timeRange = searchParams.get('time_range')
    const groupBy = searchParams.get('group_by')
    const limit = searchParams.get('limit') || '50'
    const sortBy = searchParams.get('sort_by') || 'event_count'

    // Validate required parameters
    if (!eventTypes || !timeRange || !groupBy) {
      return NextResponse.json({
        success: false,
        message: 'Missing required parameters: event_types, time_range, group_by'
      }, { status: 400 })
    }

    // Build query parameters for Python backend
    const queryParams = new URLSearchParams({
      event_types: eventTypes,
      time_range: timeRange,
      group_by: groupBy,
      limit: limit,
      sort_by: sortBy
    })

    // Call Python backend query executor
    const data = await callPythonAPI(`/api/query-executor?${queryParams}`)
    
    if (data.success) {
      return NextResponse.json({
        success: true,
        data: data.data,
        query: {
          eventTypes: eventTypes.split(','),
          timeRange,
          groupBy,
          limit: parseInt(limit),
          sortBy
        },
        metadata: {
          resultCount: data.data?.length || 0,
          executedAt: new Date().toISOString()
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        message: data.message || 'Query execution failed on backend'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Query executor error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error during query execution'
    }, { status: 500 })
  }
}
