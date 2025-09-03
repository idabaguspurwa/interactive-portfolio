const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

// Database file path
const DB_PATH = path.join(process.cwd(), 'data', 'github_analytics.db')

// Initialize database connection
let db = null

function getDatabase() {
  if (!db) {
    // Create data directory if it doesn't exist
    const dataDir = path.dirname(DB_PATH)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
      console.log('📁 Created data directory:', dataDir)
    }
    
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL') // Enable WAL mode for better performance
  }
  return db
}

// Create analytics tables matching Snowflake schema
function initializeDatabase() {
  const db = getDatabase()

  // 1. Daily Activity Summary
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_activity_summary (
      activity_date DATE PRIMARY KEY,
      total_events INTEGER,
      unique_users INTEGER,
      unique_repositories INTEGER,
      push_events INTEGER,
      pull_request_events INTEGER,
      issue_events INTEGER,
      create_events INTEGER,
      latest_activity DATETIME
    )
  `)

  // 2. Hourly Trend Analysis  
  db.exec(`
    CREATE TABLE IF NOT EXISTS hourly_trend_analysis (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      activity_hour DATETIME,
      event_type TEXT,
      event_count INTEGER,
      unique_users INTEGER,
      unique_repos INTEGER,
      hour_of_day INTEGER,
      day_of_week INTEGER
    )
  `)

  // 3. Repository Popularity Rankings
  db.exec(`
    CREATE TABLE IF NOT EXISTS repository_popularity_rankings (
      repo_name TEXT PRIMARY KEY,
      total_activity INTEGER,
      unique_contributors INTEGER,
      push_events INTEGER,
      watch_events INTEGER,
      fork_events INTEGER,
      pull_requests INTEGER,
      issues INTEGER,
      latest_activity DATETIME,
      first_seen DATETIME,
      avg_daily_activity REAL
    )
  `)

  // 4. User Engagement Metrics
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_engagement_metrics (
      actor_login TEXT PRIMARY KEY,
      total_events INTEGER,
      repositories_contributed INTEGER,
      push_count INTEGER,
      pr_count INTEGER,
      issue_count INTEGER,
      first_activity DATETIME,
      latest_activity DATETIME,
      active_days INTEGER,
      avg_events_per_day REAL
    )
  `)

  console.log('✅ SQLite database initialized with analytics tables')
  return db
}

// Execute SQL queries (for AI Data Explorer)
function executeQuery(sql) {
  const db = getDatabase()
  
  try {
    console.log('🔍 Executing SQLite query:', sql)
    
    // Determine if it's a SELECT query
    const isSelect = sql.trim().toUpperCase().startsWith('SELECT')
    
    if (isSelect) {
      const stmt = db.prepare(sql)
      const results = stmt.all()
      console.log(`📊 Query returned ${results.length} rows`)
      return results
    } else {
      const result = db.exec(sql)
      console.log('✅ Query executed successfully')
      return result
    }
  } catch (error) {
    console.error('❌ SQLite query error:', error.message)
    throw error
  }
}

// Insert data helpers
function insertDailyActivity(data) {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO daily_activity_summary 
    (activity_date, total_events, unique_users, unique_repositories, push_events, pull_request_events, issue_events, create_events, latest_activity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  
  return stmt.run(
    data.activity_date,
    data.total_events,
    data.unique_users,
    data.unique_repositories,
    data.push_events,
    data.pull_request_events,
    data.issue_events,
    data.create_events,
    data.latest_activity
  )
}

function insertHourlyTrend(data) {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT INTO hourly_trend_analysis 
    (activity_hour, event_type, event_count, unique_users, unique_repos, hour_of_day, day_of_week)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
  
  return stmt.run(
    data.activity_hour,
    data.event_type,
    data.event_count,
    data.unique_users,
    data.unique_repos,
    data.hour_of_day,
    data.day_of_week
  )
}

function insertRepositoryPopularity(data) {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO repository_popularity_rankings 
    (repo_name, total_activity, unique_contributors, push_events, watch_events, fork_events, pull_requests, issues, latest_activity, first_seen, avg_daily_activity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  
  return stmt.run(
    data.repo_name,
    data.total_activity,
    data.unique_contributors,
    data.push_events,
    data.watch_events,
    data.fork_events,
    data.pull_requests,
    data.issues,
    data.latest_activity,
    data.first_seen,
    data.avg_daily_activity
  )
}

function insertUserEngagement(data) {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO user_engagement_metrics 
    (actor_login, total_events, repositories_contributed, push_count, pr_count, issue_count, first_activity, latest_activity, active_days, avg_events_per_day)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  
  return stmt.run(
    data.actor_login,
    data.total_events,
    data.repositories_contributed,
    data.push_count,
    data.pr_count,
    data.issue_count,
    data.first_activity,
    data.latest_activity,
    data.active_days,
    data.avg_events_per_day
  )
}

// Close database connection
function closeDatabase() {
  if (db) {
    db.close()
    db = null
  }
}

// Export all functions
module.exports = {
  getDatabase,
  initializeDatabase,
  executeQuery,
  insertDailyActivity,
  insertHourlyTrend,
  insertRepositoryPopularity,
  insertUserEngagement,
  closeDatabase
}