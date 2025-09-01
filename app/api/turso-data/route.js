import { NextResponse } from 'next/server'
import { queryTurso } from '@/lib/turso-client'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const table = searchParams.get('table')
    const limit = parseInt(searchParams.get('limit')) || 100

    // Validate limit to prevent excessive reads
    if (limit > 1000) {
      return NextResponse.json(
        { error: 'Limit cannot exceed 1000 rows' },
        { status: 400 }
      )
    }

    let sql = ''
    let params = []

    if (query) {
      // AI-generated SQL query (sanitized)
      sql = query
    } else if (table) {
      // Predefined table queries for safety
      const allowedTables = ['repositories', 'commits', 'languages']
      
      if (!allowedTables.includes(table)) {
        return NextResponse.json(
          { error: 'Table not allowed' },
          { status: 400 }
        )
      }

      sql = `SELECT * FROM ${table} ORDER BY sync_date DESC LIMIT ?`
      params = [limit]
    } else {
      // Default: return repository summary
      sql = `
        SELECT 
          name,
          description,
          language,
          stars,
          forks,
          created_at,
          updated_at
        FROM repositories 
        WHERE is_private = 0 
        ORDER BY stars DESC 
        LIMIT ?
      `
      params = [limit]
    }

    const result = await queryTurso(sql, params)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      count: result.data.length,
      meta: result.meta
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST endpoint for AI-generated queries
export async function POST(request) {
  try {
    const { sql, params = [] } = await request.json()

    if (!sql || typeof sql !== 'string') {
      return NextResponse.json(
        { error: 'SQL query is required' },
        { status: 400 }
      )
    }

    // Basic SQL injection protection
    const dangerousKeywords = [
      'DROP', 'DELETE', 'INSERT', 'UPDATE', 'CREATE', 'ALTER', 
      'TRUNCATE', 'REPLACE', 'EXEC', 'EXECUTE'
    ]
    
    const upperSql = sql.toUpperCase()
    for (const keyword of dangerousKeywords) {
      if (upperSql.includes(keyword)) {
        return NextResponse.json(
          { error: `SQL keyword '${keyword}' is not allowed` },
          { status: 400 }
        )
      }
    }

    // Limit result size to prevent excessive reads
    if (!upperSql.includes('LIMIT')) {
      return NextResponse.json(
        { error: 'Query must include LIMIT clause (max 1000)' },
        { status: 400 }
      )
    }

    const result = await queryTurso(sql, params)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      count: result.data.length,
      query: sql,
      meta: result.meta
    })

  } catch (error) {
    console.error('POST API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}