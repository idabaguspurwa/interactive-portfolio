const { 
  insertDailyActivity, 
  insertHourlyTrend, 
  insertRepositoryPopularity, 
  insertUserEngagement 
} = require('./sqlite-db.js')

// GitHub API configuration
const GITHUB_API_BASE = 'https://api.github.com'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN // Optional: for higher rate limits

// Fetch GitHub events data
async function fetchGitHubEvents(pages = 3) {
  console.log('🔍 Fetching GitHub events data...')
  
  const events = []
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-Analytics-Portfolio'
  }
  
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`
  }

  try {
    // Fetch public events from GitHub API
    for (let page = 1; page <= pages; page++) {
      console.log(`📥 Fetching page ${page}/${pages}...`)
      
      const response = await fetch(`${GITHUB_API_BASE}/events?page=${page}&per_page=100`, {
        headers
      })
      
      if (!response.ok) {
        console.warn(`⚠️ GitHub API error on page ${page}: ${response.status}`)
        break
      }
      
      const pageEvents = await response.json()
      events.push(...pageEvents)
      
      // Respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log(`✅ Fetched ${events.length} GitHub events`)
    return events
    
  } catch (error) {
    console.error('❌ Error fetching GitHub events:', error)
    return []
  }
}

// Process events into analytics tables
async function processGitHubData() {
  console.log('🔄 Starting GitHub data processing...')
  
  const events = await fetchGitHubEvents(5) // Fetch 5 pages = ~500 events
  
  if (events.length === 0) {
    console.log('⚠️ No events fetched, using sample data')
    await generateSampleData()
    return
  }
  
  // Process into analytics tables
  const dailyStats = processDailyStats(events)
  const hourlyStats = processHourlyStats(events)
  const repoStats = processRepositoryStats(events)
  const userStats = processUserStats(events)
  
  // Insert into database
  console.log('💾 Inserting processed data into SQLite...')
  
  // Insert daily activity
  for (const day of dailyStats) {
    insertDailyActivity(day)
  }
  
  // Insert hourly trends
  for (const hour of hourlyStats) {
    insertHourlyTrend(hour)
  }
  
  // Insert repository popularity
  for (const repo of repoStats) {
    insertRepositoryPopularity(repo)
  }
  
  // Insert user engagement
  for (const user of userStats) {
    insertUserEngagement(user)
  }
  
  console.log('✅ GitHub data processing complete!')
}

// Process daily statistics
function processDailyStats(events) {
  const dailyData = new Map()
  
  events.forEach(event => {
    const date = event.created_at.split('T')[0]
    
    if (!dailyData.has(date)) {
      dailyData.set(date, {
        activity_date: date,
        total_events: 0,
        unique_users: new Set(),
        unique_repositories: new Set(),
        push_events: 0,
        pull_request_events: 0,
        issue_events: 0,
        create_events: 0,
        latest_activity: event.created_at
      })
    }
    
    const day = dailyData.get(date)
    day.total_events++
    day.unique_users.add(event.actor.login)
    day.unique_repositories.add(event.repo.name)
    
    switch (event.type) {
      case 'PushEvent':
        day.push_events++
        break
      case 'PullRequestEvent':
        day.pull_request_events++
        break
      case 'IssuesEvent':
        day.issue_events++
        break
      case 'CreateEvent':
        day.create_events++
        break
    }
    
    if (new Date(event.created_at) > new Date(day.latest_activity)) {
      day.latest_activity = event.created_at
    }
  })
  
  // Convert Sets to counts
  return Array.from(dailyData.values()).map(day => ({
    ...day,
    unique_users: day.unique_users.size,
    unique_repositories: day.unique_repositories.size
  }))
}

// Process hourly statistics
function processHourlyStats(events) {
  const hourlyData = new Map()
  
  events.forEach(event => {
    const date = new Date(event.created_at)
    const hour = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours())
    const hourKey = `${hour.toISOString()}-${event.type}`
    
    if (!hourlyData.has(hourKey)) {
      hourlyData.set(hourKey, {
        activity_hour: hour.toISOString(),
        event_type: event.type,
        event_count: 0,
        unique_users: new Set(),
        unique_repos: new Set(),
        hour_of_day: hour.getHours(),
        day_of_week: hour.getDay()
      })
    }
    
    const hourData = hourlyData.get(hourKey)
    hourData.event_count++
    hourData.unique_users.add(event.actor.login)
    hourData.unique_repos.add(event.repo.name)
  })
  
  // Convert Sets to counts
  return Array.from(hourlyData.values()).map(hour => ({
    ...hour,
    unique_users: hour.unique_users.size,
    unique_repos: hour.unique_repos.size
  }))
}

// Process repository statistics
function processRepositoryStats(events) {
  const repoData = new Map()
  
  events.forEach(event => {
    const repoName = event.repo.name
    
    if (!repoData.has(repoName)) {
      repoData.set(repoName, {
        repo_name: repoName,
        total_activity: 0,
        unique_contributors: new Set(),
        push_events: 0,
        watch_events: 0,
        fork_events: 0,
        pull_requests: 0,
        issues: 0,
        latest_activity: event.created_at,
        first_seen: event.created_at,
        events: []
      })
    }
    
    const repo = repoData.get(repoName)
    repo.total_activity++
    repo.unique_contributors.add(event.actor.login)
    repo.events.push(event.created_at)
    
    switch (event.type) {
      case 'PushEvent':
        repo.push_events++
        break
      case 'WatchEvent':
        repo.watch_events++
        break
      case 'ForkEvent':
        repo.fork_events++
        break
      case 'PullRequestEvent':
        repo.pull_requests++
        break
      case 'IssuesEvent':
        repo.issues++
        break
    }
    
    if (new Date(event.created_at) > new Date(repo.latest_activity)) {
      repo.latest_activity = event.created_at
    }
    if (new Date(event.created_at) < new Date(repo.first_seen)) {
      repo.first_seen = event.created_at
    }
  })
  
  // Calculate average daily activity
  return Array.from(repoData.values()).map(repo => {
    const daySpan = Math.max(1, Math.ceil((new Date(repo.latest_activity) - new Date(repo.first_seen)) / (1000 * 60 * 60 * 24)))
    
    return {
      repo_name: repo.repo_name,
      total_activity: repo.total_activity,
      unique_contributors: repo.unique_contributors.size,
      push_events: repo.push_events,
      watch_events: repo.watch_events,
      fork_events: repo.fork_events,
      pull_requests: repo.pull_requests,
      issues: repo.issues,
      latest_activity: repo.latest_activity,
      first_seen: repo.first_seen,
      avg_daily_activity: Number((repo.total_activity / daySpan).toFixed(2))
    }
  })
}

// Process user statistics
function processUserStats(events) {
  const userData = new Map()
  
  events.forEach(event => {
    const login = event.actor.login
    
    if (!userData.has(login)) {
      userData.set(login, {
        actor_login: login,
        total_events: 0,
        repositories_contributed: new Set(),
        push_count: 0,
        pr_count: 0,
        issue_count: 0,
        first_activity: event.created_at,
        latest_activity: event.created_at,
        event_dates: new Set()
      })
    }
    
    const user = userData.get(login)
    user.total_events++
    user.repositories_contributed.add(event.repo.name)
    user.event_dates.add(event.created_at.split('T')[0])
    
    switch (event.type) {
      case 'PushEvent':
        user.push_count++
        break
      case 'PullRequestEvent':
        user.pr_count++
        break
      case 'IssuesEvent':
        user.issue_count++
        break
    }
    
    if (new Date(event.created_at) > new Date(user.latest_activity)) {
      user.latest_activity = event.created_at
    }
    if (new Date(event.created_at) < new Date(user.first_activity)) {
      user.first_activity = event.created_at
    }
  })
  
  return Array.from(userData.values()).map(user => ({
    actor_login: user.actor_login,
    total_events: user.total_events,
    repositories_contributed: user.repositories_contributed.size,
    push_count: user.push_count,
    pr_count: user.pr_count,
    issue_count: user.issue_count,
    first_activity: user.first_activity,
    latest_activity: user.latest_activity,
    active_days: user.event_dates.size,
    avg_events_per_day: Number((user.total_events / user.event_dates.size).toFixed(2))
  }))
}

// Generate sample data if API fails
async function generateSampleData() {
  console.log('📊 Generating sample data...')
  
  const sampleRepos = [
    'microsoft/vscode', 'facebook/react', 'google/tensorflow', 'kubernetes/kubernetes',
    'nodejs/node', 'angular/angular', 'vuejs/vue', 'apple/swift'
  ]
  
  const sampleUsers = [
    'octocat', 'torvalds', 'gaearon', 'tj', 'sindresorhus', 'addyosmani'
  ]
  
  // Generate sample daily data
  for (let i = 0; i < 30; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    insertDailyActivity({
      activity_date: date.toISOString().split('T')[0],
      total_events: Math.floor(Math.random() * 1000) + 500,
      unique_users: Math.floor(Math.random() * 300) + 100,
      unique_repositories: Math.floor(Math.random() * 500) + 200,
      push_events: Math.floor(Math.random() * 400) + 200,
      pull_request_events: Math.floor(Math.random() * 50) + 20,
      issue_events: Math.floor(Math.random() * 30) + 10,
      create_events: Math.floor(Math.random() * 20) + 5,
      latest_activity: date.toISOString()
    })
  }
  
  // Generate sample repository data
  sampleRepos.forEach((repo, index) => {
    insertRepositoryPopularity({
      repo_name: repo,
      total_activity: Math.floor(Math.random() * 500) + 100,
      unique_contributors: Math.floor(Math.random() * 50) + 10,
      push_events: Math.floor(Math.random() * 200) + 50,
      watch_events: Math.floor(Math.random() * 100) + 20,
      fork_events: Math.floor(Math.random() * 50) + 10,
      pull_requests: Math.floor(Math.random() * 80) + 20,
      issues: Math.floor(Math.random() * 60) + 15,
      latest_activity: new Date().toISOString(),
      first_seen: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      avg_daily_activity: Number((Math.random() * 20 + 5).toFixed(2))
    })
  })
  
  console.log('✅ Sample data generated')
}

// Export functions
module.exports = {
  fetchGitHubEvents,
  processGitHubData
}