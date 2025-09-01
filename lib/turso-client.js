import { createClient } from '@libsql/client'

let client = null

export function getTursoClient() {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  }
  return client
}

export async function queryTurso(sql, params = []) {
  try {
    const client = getTursoClient()
    const result = await client.execute({
      sql,
      args: params
    })
    return {
      success: true,
      data: result.rows,
      meta: {
        rowsAffected: result.rowsAffected,
        lastInsertRowid: result.lastInsertRowid
      }
    }
  } catch (error) {
    console.error('Turso query error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Batch queries to minimize write operations
export async function batchInsert(tableName, records, conflictResolution = 'REPLACE') {
  if (!records.length) return { success: true, data: [] }
  
  const client = getTursoClient()
  const transaction = client.transaction('write')
  
  try {
    const keys = Object.keys(records[0])
    const placeholders = keys.map(() => '?').join(', ')
    const sql = `INSERT OR ${conflictResolution} INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`
    
    // Process in batches of 100 to stay within limits
    const batchSize = 100
    let totalInserted = 0
    
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize)
      
      for (const record of batch) {
        const values = keys.map(key => record[key])
        await transaction.execute({
          sql,
          args: values
        })
      }
      
      totalInserted += batch.length
    }
    
    await transaction.commit()
    
    return {
      success: true,
      data: { inserted: totalInserted }
    }
  } catch (error) {
    await transaction.rollback()
    console.error('Batch insert error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Free tier safe: only update records that actually changed
export async function upsertIfChanged(tableName, records, idField = 'id') {
  if (!records.length) return { success: true, data: { updated: 0 } }
  
  const client = getTursoClient()
  let updated = 0
  
  try {
    for (const record of records) {
      // Check if record exists and is different
      const existing = await client.execute({
        sql: `SELECT * FROM ${tableName} WHERE ${idField} = ?`,
        args: [record[idField]]
      })
      
      const shouldUpdate = !existing.rows.length || 
        JSON.stringify(existing.rows[0]) !== JSON.stringify(record)
      
      if (shouldUpdate) {
        const keys = Object.keys(record)
        const placeholders = keys.map(() => '?').join(', ')
        const updateSql = `INSERT OR REPLACE INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`
        
        await client.execute({
          sql: updateSql,
          args: keys.map(key => record[key])
        })
        updated++
      }
    }
    
    return {
      success: true,
      data: { updated }
    }
  } catch (error) {
    console.error('Upsert error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}