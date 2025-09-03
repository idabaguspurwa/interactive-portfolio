const { initializeDatabase } = require('../lib/sqlite-db.js')
const { processGitHubData } = require('../lib/github-data-fetcher.js')

async function initializeGitHubAnalytics() {
  console.log('🚀 Starting GitHub Analytics Database Initialization...')
  console.log('=' .repeat(50))
  
  try {
    // Step 1: Initialize SQLite database
    console.log('1️⃣ Initializing SQLite database...')
    initializeDatabase()
    console.log('✅ Database tables created successfully\n')
    
    // Step 2: Fetch and process GitHub data  
    console.log('2️⃣ Fetching real GitHub data from API...')
    await processGitHubData()
    console.log('✅ GitHub data processed and stored\n')
    
    console.log('🎉 GitHub Analytics Database Ready!')
    console.log('=' .repeat(50))
    console.log('Your AI Data Explorer now has real GitHub data to work with!')
    console.log('\n💡 Try asking questions like:')
    console.log('   • "Which repositories are most active?"')
    console.log('   • "Show me daily activity trends"')
    console.log('   • "Who are the top contributors?"')
    console.log('   • "What are the hourly patterns?"')
    
  } catch (error) {
    console.error('❌ Initialization failed:', error.message)
    console.error('\n🔧 Troubleshooting:')
    console.error('   • Check your internet connection for GitHub API')
    console.error('   • Ensure you have write permissions in the project directory')
    console.error('   • Add GITHUB_TOKEN to .env.local for higher rate limits')
    process.exit(1)
  }
}

// Run initialization
initializeGitHubAnalytics()