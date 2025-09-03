import { createClient } from '@libsql/client'

// Turso database client
let tursoClient = null

function getTursoClient() {
  if (!tursoClient) {
    const url = process.env.TURSO_DATABASE_URL
    const authToken = process.env.TURSO_AUTH_TOKEN

    if (!url || !authToken) {
      throw new Error('Missing Turso environment variables: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are required')
    }

    tursoClient = createClient({
      url,
      authToken
    })

    console.log('✅ Turso client initialized')
  }
  
  return tursoClient
}

// Execute SQL queries against Turso database
export async function executeTursoQuery(sql) {
  const client = getTursoClient()
  
  try {
    console.log('🔍 Executing Turso query:', sql)
    
    const result = await client.execute(sql)
    
    console.log(`📊 Query returned ${result.rows?.length || 0} rows`)
    
    // Transform result to match expected format
    return {
      success: true,
      data: result.rows || [],
      metadata: {
        columns: result.columns || [],
        rowCount: result.rows?.length || 0,
        lastInsertRowid: result.lastInsertRowid,
        changes: result.changes,
        database: 'Turso'
      }
    }
  } catch (error) {
    console.error('❌ Turso query error:', error.message)
    throw error
  }
}

// Get table schema information
export async function getTursoTableInfo(tableName) {
  const client = getTursoClient()
  
  try {
    const result = await client.execute(`PRAGMA table_info(${tableName})`)
    return result.rows || []
  } catch (error) {
    console.error(`❌ Error getting table info for ${tableName}:`, error.message)
    throw error
  }
}

// Get all tables in the database
export async function getTursoTables() {
  const client = getTursoClient()
  
  try {
    const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    return result.rows.map(row => row.name) || []
  } catch (error) {
    console.error('❌ Error getting table list:', error.message)
    throw error
  }
}

// Get sample data from a table
export async function getTursoTableSample(tableName, limit = 5) {
  const client = getTursoClient()
  
  try {
    const result = await client.execute(`SELECT * FROM ${tableName} LIMIT ${limit}`)
    return result.rows || []
  } catch (error) {
    console.error(`❌ Error getting sample data for ${tableName}:`, error.message)
    throw error
  }
}

// Health check
export async function checkTursoConnection() {
  const client = getTursoClient()
  
  try {
    const result = await client.execute('SELECT 1 as test')
    return {
      success: true,
      message: 'Turso connection successful',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      success: false,
      message: `Turso connection failed: ${error.message}`,
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
}

// Close connection (cleanup)
export function closeTursoConnection() {
  if (tursoClient) {
    tursoClient.close()
    tursoClient = null
    console.log('🔌 Turso connection closed')
  }
}