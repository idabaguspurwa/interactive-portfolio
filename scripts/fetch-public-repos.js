#!/usr/bin/env node

/**
 * Fetch Popular Public Repositories from GitHub API
 * 
 * This script fetches trending/popular public repositories and their data
 * to expand the AI Data Explorer beyond just personal repositories.
 * 
 * Strategy:
 * - Fetch ~100-200 popular repos (well under Turso free tier)
 * - Focus on diverse languages and active projects
 * - Include commit data where available
 * - Stay under API rate limits
 */

const { Octokit } = require('@octokit/rest')
const { createClient } = require('@libsql/client')
const path = require('path')

// Load environment variables from both .env and .env.local
require('dotenv').config()
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN, // Optional: for higher rate limits
})

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

// Helper function to safely quote SQL string values (matching your workflow)
function sqlString(value) {
  if (value === null || value === undefined) {
    return 'NULL'
  }
  // Escape single quotes by doubling them
  return "'" + String(value).replace(/'/g, "''") + "'"
}

async function fetchPopularRepositories() {
  console.log('🚀 Fetching popular public repositories...')
  
  try {
    // Conservative approach to stay well under Turso free tier limits
    const languages = ['javascript', 'python', 'typescript']  // Reduced to 3 languages
    const allRepos = []
    
    for (const language of languages) {
      console.log(`📦 Fetching ${language} repositories...`)
      
      const { data } = await octokit.rest.search.repos({
        q: `language:${language} stars:>5000 pushed:>2024-01-01`,  // Higher star threshold
        sort: 'stars',
        order: 'desc',
        per_page: 10, // 10 per language = 30 total repos (conservative)
      })
      
      allRepos.push(...data.items)
      
      // Rate limiting: wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    // Add some highly popular trending repositories
    console.log('🔥 Fetching trending repositories...')
    const { data: trendingData } = await octokit.rest.search.repos({
      q: 'stars:>10000 pushed:>2024-06-01',  // Only very popular repos
      sort: 'updated',
      order: 'desc',
      per_page: 20,  // Reduced from 25
    })
    
    allRepos.push(...trendingData.items)
    
    // Remove duplicates and limit to 40 total (very conservative for free tier)
    const uniqueRepos = Array.from(
      new Map(allRepos.map(repo => [repo.id, repo])).values()
    ).slice(0, 40)  // Reduced from 100 to 40
    
    console.log(`✅ Fetched ${uniqueRepos.length} unique repositories`)
    return uniqueRepos
    
  } catch (error) {
    console.error('❌ Error fetching repositories:', error.message)
    throw error
  }
}

async function generateSQLForRepos(repos) {
  console.log('💾 Generating SQL for public repositories...')
  
  // Start with the same SQL structure as your workflow
  let sql = `
  /* Add public repositories without affecting existing personal data */
  
  `
  
  // Process repositories using conservative limits
  for (const repo of repos.slice(0, 40)) { // Limited to 40 repos for free tier safety
    const topics = repo.topics ? repo.topics.join(',') : ''
    
    // Build INSERT statement with same format as your workflow
    const repoInsert = 'INSERT OR REPLACE INTO repositories VALUES (' +
      repo.id + ', ' +
      sqlString(repo.name) + ', ' +
      sqlString(repo.full_name) + ', ' +
      sqlString(repo.description || '') + ', ' +
      sqlString(repo.language || '') + ', ' +
      (repo.stargazers_count || 0) + ', ' +
      (repo.forks_count || 0) + ', ' +
      (repo.open_issues_count || 0) + ', ' +
      (repo.size || 0) + ', ' +
      sqlString(repo.created_at) + ', ' +
      sqlString(repo.updated_at) + ', ' +
      sqlString(repo.pushed_at) + ', ' +
      (repo.fork ? 1 : 0) + ', ' +
      (repo.private ? 1 : 0) + ', ' +
      sqlString(repo.homepage || '') + ', ' +
      sqlString(topics) + ', ' +
      'CURRENT_TIMESTAMP' +
      ');\n'
    
    sql += repoInsert

    // Fetch recent commits (only 3 per repo to minimize database writes)
    try {
      const { data: commits } = await octokit.rest.repos.listCommits({
        owner: repo.owner.login,
        repo: repo.name,
        per_page: 3,  // Reduced from 5 to 3
        since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // Last 30 days
      })

      for (const commit of commits) {
        if (commit.author) {
          const commitInsert = 'INSERT OR IGNORE INTO commits VALUES (' +
            sqlString(commit.sha) + ', ' +
            sqlString(repo.name) + ', ' +
            sqlString(commit.commit.author.name) + ', ' +
            sqlString(commit.commit.author.email) + ', ' +
            sqlString(commit.commit.message.split('\n')[0].substring(0, 200)) + ', ' +
            sqlString(commit.commit.author.date) + ', ' +
            '0, 0, 0, ' +
            'CURRENT_TIMESTAMP' +
            ');\n'
          
          sql += commitInsert
        }
      }
    } catch (error) {
      console.log(`Skipping commits for ${repo.full_name}: ${error.message}`)
    }

    // Fetch languages (cached by GitHub, minimal API impact)
    try {
      const { data: languages } = await octokit.rest.repos.listLanguages({
        owner: repo.owner.login,
        repo: repo.name
      })

      const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0)
      
      for (const [language, bytes] of Object.entries(languages)) {
        const percentage = totalBytes > 0 ? (bytes / totalBytes) * 100 : 0
        
        const langInsert = 'INSERT OR REPLACE INTO languages (repo_name, language, bytes, percentage, sync_date) VALUES (' +
          sqlString(repo.name) + ', ' +
          sqlString(language) + ', ' +
          bytes + ', ' +
          percentage.toFixed(2) + ', ' +
          'CURRENT_TIMESTAMP' +
          ');\n'
        
        sql += langInsert
      }
    } catch (error) {
      console.log(`Skipping languages for ${repo.full_name}: ${error.message}`)
    }

    // Rate limiting: small delay between repos (same as your workflow)
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  return sql
}


async function main() {
  console.log('🌟 Starting public repository data collection...')
  console.log('📊 Target: ~40 highly popular repositories with commit & language data')
  console.log('💾 Database: Turso SQLite (staying well under free tier limits)')
  console.log('📈 Current usage: 1.90K reads / 1.63K writes (very safe levels)')
  
  try {
    // Check Turso connection (same as your workflow)
    await turso.execute('SELECT COUNT(*) as count FROM repositories')
    console.log('✅ Turso database connected')
    
    // Fetch popular repositories
    const repos = await fetchPopularRepositories()
    
    // Generate SQL using the same pattern as your workflow
    const sql = await generateSQLForRepos(repos)
    
    // Write SQL to file (matching your workflow)
    const fs = require('fs')
    fs.writeFileSync('public_github_data.sql', sql)
    console.log('SQL file generated successfully')
    
    // Show a sample of the generated SQL for debugging (same as your workflow)
    const sampleLines = sql.split('\n').slice(0, 20).join('\n')
    console.log('Sample SQL generated:')
    console.log(sampleLines)
    
    // Execute SQL statements directly (simplified version of your workflow's approach)
    console.log('Executing SQL statements...')
    const statements = sql.split('\n').filter(line => {
      const trimmed = line.trim()
      return trimmed && !trimmed.startsWith('/*') && !trimmed.startsWith('--') && trimmed.includes('INSERT')
    })
    
    let successCount = 0
    let errorCount = 0
    
    for (const statement of statements) {
      if (statement.trim().endsWith(';')) {
        try {
          await turso.execute(statement.trim())
          successCount++
        } catch (error) {
          console.error(`Error executing: ${statement.substring(0, 50)}...`)
          console.error(`Error: ${error.message}`)
          errorCount++
        }
      }
    }
    
    console.log(`📊 Execution complete: ${successCount} successful, ${errorCount} errors`)
    
    // Final stats (same as your workflow)
    const { rows } = await turso.execute('SELECT COUNT(*) as count FROM repositories')
    const totalRepos = rows[0].count
    
    console.log(`🎉 Data collection complete!`)
    console.log(`📈 Total repositories in database: ${totalRepos}`)
    console.log(`🚀 Your AI Data Explorer now has rich public GitHub data!`)
    
    // Cleanup (same as your workflow)
    fs.unlinkSync('public_github_data.sql')
    
  } catch (error) {
    console.error('❌ Script failed:', error.message)
    process.exit(1)
  } finally {
    turso.close()
  }
}

// Run the script
main()