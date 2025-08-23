import { NextResponse } from 'next/server'
import { callPythonAPI } from '@/lib/python-api'

// Force dynamic rendering to prevent Vercel build errors
export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const { query } = await request.json()
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'Query parameter is required and must be a string'
      }, { status: 400 })
    }

    // Basic SQL injection prevention (basic level)
    const dangerousKeywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE', 'TRUNCATE']
    const upperQuery = query.toUpperCase()
    
    for (const keyword of dangerousKeywords) {
      if (upperQuery.includes(keyword)) {
        return NextResponse.json({
          success: false,
          message: `Query contains forbidden keyword: ${keyword}. Only SELECT queries are allowed.`
        }, { status: 400 })
      }
    }

    // Ensure it's a SELECT query
    if (!upperQuery.trim().startsWith('SELECT')) {
      return NextResponse.json({
        success: false,
        message: 'Only SELECT queries are allowed for security reasons'
      }, { status: 400 })
    }

    // Call Python backend manual query executor
    const data = await callPythonAPI('/api/manual-query', {
      method: 'POST',
      body: JSON.stringify({ query })
    })
    
    if (data.success) {
      return NextResponse.json({
        success: true,
        data: data.data,
        metadata: {
          query: query,
          resultCount: data.data?.length || 0,
          executedAt: new Date().toISOString()
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        message: data.message || 'Manual query execution failed on backend'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Manual query error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error during manual query execution'
    }, { status: 500 })
  }
}
