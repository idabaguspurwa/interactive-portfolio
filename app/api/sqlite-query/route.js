import { NextResponse } from 'next/server'
import { executeTursoQuery, checkTursoConnection, getTursoTables, getTursoTableInfo } from '@/lib/turso-db.js'

// Force dynamic rendering
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

    // Basic SQL injection prevention
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

    // Transform query to use actual GitHub data tables from Turso
    let tursoQuery = query
      // Map old Snowflake table names to actual GitHub data tables
      .replace(/GITHUB_EVENTS_DB\.ANALYTICS\./gi, '')
      .replace(/DAILY_ACTIVITY_SUMMARY/gi, 'repositories')
      .replace(/HOURLY_TREND_ANALYSIS/gi, 'commits') 
      .replace(/REPOSITORY_POPULARITY_RANKINGS/gi, 'repositories')
      .replace(/USER_ENGAGEMENT_METRICS/gi, 'commits')
      // Handle date functions
      .replace(/CURRENT_DATE/gi, "DATE('now')")
      .replace(/DATE_TRUNC\('day', ([^)]+)\)/gi, "DATE($1)")

    console.log('🔍 Original query:', query)
    console.log('🔄 Transformed query:', tursoQuery)

    // Execute query against Turso
    const result = await executeTursoQuery(tursoQuery)
    
    if (!result.success) {
      throw new Error('Query execution failed')
    }
    
    return NextResponse.json({
      success: true,
      data: result.data,
      metadata: {
        query: tursoQuery,
        resultCount: result.data?.length || 0,
        executedAt: new Date().toISOString(),
        database: 'Turso',
        columns: result.metadata?.columns || [],
        changes: result.metadata?.changes || 0
      }
    })

  } catch (error) {
    console.error('❌ SQLite query error:', error)
    
    return NextResponse.json({
      success: false,
      message: `Query execution failed: ${error.message}`,
      error: error.message
    }, { status: 500 })
  }
}

// GET endpoint to check Turso connection and get table info
export async function GET() {
  try {
    // Check connection
    const connectionStatus = await checkTursoConnection()
    
    if (!connectionStatus.success) {
      return NextResponse.json(connectionStatus, { status: 500 })
    }
    
    // Get available tables
    const tables = await getTursoTables()
    
    // Get table info for each table
    const tableInfo = {}
    for (const table of tables) {
      try {
        tableInfo[table] = await getTursoTableInfo(table)
      } catch (error) {
        console.error(`Error getting info for table ${table}:`, error)
        tableInfo[table] = { error: error.message }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Turso database connection successful',
      timestamp: new Date().toISOString(),
      tables: tables,
      tableInfo: tableInfo,
      database: 'Turso'
    })
    
  } catch (error) {
    console.error('❌ Turso connection error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to connect to Turso database',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}