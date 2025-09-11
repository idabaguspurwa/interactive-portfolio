import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'
import { queryTurso } from '@/lib/turso-client'
import { searchRepositories, getTrendingRepositories, findAlternatives } from '@/lib/github-api-client'

// Initialize Gemini AI
let genAI = null
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
}

const ENHANCED_STRATEGY_PROMPT = `
You are an intelligent data strategy AI for GitHub repository exploration. Analyze the user's question and determine the best approach to find the answer.

AVAILABLE DATA SOURCES:
1. DATABASE: Local SQLite database with ~75 popular repositories (React, Vue, Python libs, Java frameworks, etc.)
2. GITHUB_API: Live GitHub search API for current data, trending repos, and comprehensive searches
3. COMBINED: Use both sources for comparison or comprehensive analysis

DECISION RULES:
- DATABASE: Use for questions about popular/well-known repositories we likely have
- GITHUB_API: Use for trending, recent, specific searches, or when database is insufficient  
- COMBINED: Use for comparisons, comprehensive analysis, or "best of both" scenarios

OUTPUT FORMAT (JSON):
{
  "method": "database|github_api|combined",
  "reasoning": "Brief explanation of why this approach",
  "primary_query": "SQL query OR GitHub search parameters",
  "fallback_strategy": "What to do if primary fails"
}

EXAMPLES:

Question: "What are the most popular Python repositories?"
{
  "method": "database",
  "reasoning": "Database likely contains popular Python repos",
  "primary_query": "SELECT name, description, language, stars, forks FROM repositories WHERE language = 'Python' AND is_private = 0 ORDER BY stars DESC LIMIT 20",
  "fallback_strategy": "github_api"
}

Question: "What JavaScript frameworks are trending this week?"
{
  "method": "github_api", 
  "reasoning": "Need current trending data not available in database",
  "primary_query": {"language": "javascript", "query": "framework", "since": "week", "minStars": 100},
  "fallback_strategy": "database"
}

Question: "Compare React alternatives"
{
  "method": "combined",
  "reasoning": "Need both established alternatives (database) and emerging ones (GitHub API)",
  "primary_query": "multi_source",
  "fallback_strategy": "github_api"
}

User Question: "{QUESTION}"

Provide the JSON strategy:
`

export async function POST(request) {
  try {
    // Check environment variables
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        error: 'AI system not configured',
        message: 'Missing GEMINI_API_KEY environment variable'
      }, { status: 503 })
    }

    const { question, context = [] } = await request.json()

    if (!question?.trim()) {
      return NextResponse.json({
        error: 'Question is required'
      }, { status: 400 })
    }

    console.log('🤖 Enhanced AI Pipeline processing:', question)

    // PHASE 1: Gemini determines data strategy
    const strategy = await determineDataStrategy(question, context)
    console.log('📋 Strategy:', strategy)

    // PHASE 2: Execute data retrieval based on strategy
    let dataResult = null
    let dataSource = ''

    switch (strategy.method) {
      case 'database':
        dataResult = await executeDatabase(strategy.primary_query, strategy.fallback_strategy, question)
        dataSource = 'database'
        break
        
      case 'github_api':
        dataResult = await executeGitHubAPI(strategy.primary_query, strategy.fallback_strategy, question)
        dataSource = 'github_api'
        break
        
      case 'combined':
        dataResult = await executeCombined(question, strategy)
        dataSource = 'combined'
        break
        
      default:
        throw new Error('Invalid strategy method')
    }

    if (!dataResult.success) {
      throw new Error(dataResult.error || 'Data retrieval failed')
    }

    // PHASE 3: DeepSeek generates insights from ANY data source
    const insights = await generateEnhancedInsights(question, dataResult.data, dataSource, dataResult.count)

    return NextResponse.json({
      success: true,
      question,
      method: strategy.method,
      data_source: dataSource,
      sql: dataResult.sql || null,
      github_params: dataResult.github_params || null,
      data: dataResult.data,
      count: dataResult.count,
      insights,
      reasoning: strategy.reasoning,
      model: 'enhanced-dual-ai',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Enhanced AI Pipeline error:', error)
    
    return NextResponse.json({
      error: 'Failed to process enhanced query',
      details: error.message,
      fallback: 'Try using the standard AI explorer or rephrase your question'
    }, { status: 500 })
  }
}

// PHASE 1: Strategy determination using Gemini
async function determineDataStrategy(question, context) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.2, // Low temperature for consistent strategy decisions
        maxOutputTokens: 300,
        topP: 0.9,
      }
    })

    const prompt = ENHANCED_STRATEGY_PROMPT.replace('{QUESTION}', question)
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text().trim()

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid strategy response format')
    }

    const strategy = JSON.parse(jsonMatch[0])
    
    // Validate strategy
    if (!['database', 'github_api', 'combined'].includes(strategy.method)) {
      throw new Error('Invalid strategy method')
    }

    return strategy

  } catch (error) {
    console.error('❌ Strategy determination error:', error)
    
    // Fallback to database strategy
    return {
      method: 'database',
      reasoning: 'Fallback strategy due to AI planning error',
      primary_query: generateFallbackSQL(question),
      fallback_strategy: 'github_api'
    }
  }
}

// PHASE 2A: Execute database query with fallback
async function executeDatabase(sqlQuery, fallbackStrategy, question) {
  try {
    if (typeof sqlQuery !== 'string') {
      throw new Error('Invalid SQL query format')
    }

    // Execute SQL query
    const result = await queryTurso(sqlQuery)
    
    if (result.success && result.data.length > 0) {
      return {
        success: true,
        data: result.data,
        count: result.data.length,
        sql: sqlQuery,
        source: 'database'
      }
    }

    // Fallback if no results or database failed
    if (fallbackStrategy === 'github_api') {
      console.log('🔄 Database empty, falling back to GitHub API')
      return await executeGitHubAPIFallback(question)
    }

    return {
      success: false,
      error: 'No results found in database',
      sql: sqlQuery
    }

  } catch (error) {
    console.error('❌ Database execution error:', error)
    
    // Fallback to GitHub API
    if (fallbackStrategy === 'github_api') {
      console.log('🔄 Database error, falling back to GitHub API')
      return await executeGitHubAPIFallback(question)
    }

    return {
      success: false,
      error: error.message,
      sql: sqlQuery
    }
  }
}

// PHASE 2B: Execute GitHub API search
async function executeGitHubAPI(apiParams, fallbackStrategy, question) {
  try {
    let result = null

    // Handle different types of API calls
    if (apiParams.since) {
      // Trending repositories
      result = await getTrendingRepositories(apiParams)
    } else if (apiParams.alternatives) {
      // Find alternatives
      result = await findAlternatives(apiParams.alternatives, apiParams.language)
    } else {
      // General search
      result = await searchRepositories(apiParams)
    }

    if (result.success && result.data.length > 0) {
      return {
        success: true,
        data: result.data,
        count: result.data.length,
        github_params: apiParams,
        source: 'github_api'
      }
    }

    // Fallback to database if GitHub API fails
    if (fallbackStrategy === 'database') {
      console.log('🔄 GitHub API empty, falling back to database')
      const fallbackSQL = generateFallbackSQL(question)
      return await executeDatabase(fallbackSQL, null, question)
    }

    return {
      success: false,
      error: 'No results found via GitHub API',
      github_params: apiParams
    }

  } catch (error) {
    console.error('❌ GitHub API execution error:', error)
    
    // Fallback to database
    if (fallbackStrategy === 'database') {
      console.log('🔄 GitHub API error, falling back to database')
      const fallbackSQL = generateFallbackSQL(question)
      return await executeDatabase(fallbackSQL, null, question)
    }

    return {
      success: false,
      error: error.message,
      github_params: apiParams
    }
  }
}

// PHASE 2C: Execute combined approach
async function executeCombined(question, strategy) {
  try {
    console.log('🔄 Executing combined data approach')
    
    // Execute both database and GitHub API in parallel
    const [dbResult, apiResult] = await Promise.allSettled([
      executeGitHubAPIFallback(question),
      executeDatabase(generateFallbackSQL(question), null, question)
    ])

    const dbData = dbResult.status === 'fulfilled' && dbResult.value.success ? dbResult.value.data : []
    const apiData = apiResult.status === 'fulfilled' && apiResult.value.success ? apiResult.value.data : []

    // Combine and deduplicate results
    const combinedData = [...dbData]
    
    // Add GitHub API results that aren't already in database
    for (const apiRepo of apiData) {
      if (!combinedData.find(dbRepo => dbRepo.name === apiRepo.name || dbRepo.full_name === apiRepo.full_name)) {
        combinedData.push(apiRepo)
      }
    }

    // Sort by stars (descending)
    combinedData.sort((a, b) => (b.stars || 0) - (a.stars || 0))

    return {
      success: true,
      data: combinedData.slice(0, 30), // Limit to top 30
      count: combinedData.length,
      source: 'combined',
      db_count: dbData.length,
      api_count: apiData.length
    }

  } catch (error) {
    console.error('❌ Combined execution error:', error)
    return {
      success: false,
      error: error.message,
      source: 'combined'
    }
  }
}

// Helper: GitHub API fallback with intelligent search
async function executeGitHubAPIFallback(question) {
  const lowerQuestion = question.toLowerCase()
  
  // Extract language from question
  const languages = ['javascript', 'python', 'java', 'typescript', 'go', 'rust', 'c++', 'php', 'ruby', 'swift']
  const detectedLanguage = languages.find(lang => lowerQuestion.includes(lang))
  
  // Extract intent
  const isPopular = lowerQuestion.includes('popular') || lowerQuestion.includes('best') || lowerQuestion.includes('top')
  const isTrending = lowerQuestion.includes('trending') || lowerQuestion.includes('recent') || lowerQuestion.includes('latest')
  const isFramework = lowerQuestion.includes('framework') || lowerQuestion.includes('library')
  
  let searchParams = {
    query: '',
    language: detectedLanguage,
    per_page: 20
  }
  
  if (isTrending) {
    return await getTrendingRepositories({
      language: detectedLanguage,
      since: 'week',
      limit: 20
    })
  }
  
  if (isFramework) {
    searchParams.query = 'framework OR library'
  }
  
  if (isPopular) {
    searchParams.minStars = 1000
  }
  
  return await searchRepositories(searchParams)
}

// PHASE 3: Enhanced insights generation using DeepSeek
async function generateEnhancedInsights(question, data, dataSource, count) {
  try {
    if (!data || data.length === 0) {
      return '• No Data Found: The enhanced search could not find relevant results for your query. Try rephrasing your question or exploring related topics.'
    }

    // Create enhanced prompt for DeepSeek with data source context
    const topResults = data.slice(0, 10)
    const sourceContext = {
      'database': 'from your curated database of popular repositories',
      'github_api': 'from live GitHub search results', 
      'combined': 'from both your curated database and live GitHub data'
    }

    const insightsPrompt = `You are a senior technology analyst. Analyze these GitHub search results and provide 3 highly valuable, specific insights.

USER QUESTION: "${question}"
DATA SOURCE: ${dataSource === 'github_api' ? 'Live GitHub trending data' : dataSource === 'database' ? 'Curated popular repositories' : 'Combined database + live data'} 
TOTAL FOUND: ${count} repositories

TOP REPOSITORIES FOUND:
${topResults.map((repo, i) => {
  const name = repo.name || repo.repository_name || 'Unknown'
  const stars = (repo.stars || 0).toLocaleString()
  const forks = (repo.forks || 0).toLocaleString()
  const language = repo.language || 'Mixed'
  const desc = (repo.description || '').substring(0, 100)
  
  return `${i+1}. ${name} (${language})
   ${stars} stars, ${forks} forks
   "${desc}"`
}).join('\n\n')}

ANALYSIS REQUIREMENTS:
- Focus on specific frameworks/libraries mentioned by name
- Compare adoption metrics (stars/forks) between top projects
- Identify emerging trends or surprising findings
- Give actionable insights for developers
- Avoid generic statements like "spans X languages"

Provide exactly 3 bullet points with deep, specific analysis:
• [Analyze the dominant framework with specific numbers and what makes it leading]
• [Compare 2-3 frameworks and identify key differences or trends you observe]
• [Give a practical insight or recommendation based on the actual data shown]

Each insight must reference specific repository names and numbers from the results above.`

    // Use the same OpenRouter DeepSeek call as in your existing system
    const rawInsights = await generateOpenRouterInsights(insightsPrompt)
    
    if (rawInsights && rawInsights.includes('•') && rawInsights.length > 50) {
      return rawInsights
        .replace(/```\w*\n?/g, '')
        .replace(/^\n+|\n+$/g, '')
        .replace(/^- /gm, '• ')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .split('\n')
        .filter(line => line.trim() && line.includes('•'))
        .join('\n')
        .trim()
    } else {
      // Fallback to analytical insights
      return generateAnalyticalInsights(question, data, dataSource, count)
    }

  } catch (error) {
    console.error('❌ Enhanced insights generation error:', error)
    return generateAnalyticalInsights(question, data, dataSource, count)
  }
}

// DeepSeek insights generation (reuse from existing system)
async function generateOpenRouterInsights(prompt) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Enhanced AI Data Explorer'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3.1:free',
        messages: [
          {
            role: 'system',
            content: 'You are a data analyst. Provide exactly 3 bullet points analyzing GitHub repository results with specific numbers and insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 250,
        top_p: 0.9
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const result = await response.json()
    return result.choices?.[0]?.message?.content?.trim() || ''

  } catch (error) {
    console.error('❌ DeepSeek insights error:', error.message)
    throw error
  }
}

// Enhanced analytical fallback insights
function generateAnalyticalInsights(question, data, dataSource, count) {
  if (!data || data.length === 0) {
    return '• No Results: Your enhanced search returned no matching repositories. Try adjusting your search criteria or exploring related technologies.'
  }

  const insights = []
  const topRepo = data[0]
  const top3 = data.slice(0, 3)
  
  // Leading repository with context
  if (topRepo && topRepo.stars) {
    const starGap = data.length > 1 ? topRepo.stars - (data[1].stars || 0) : 0
    const dominanceText = starGap > 50000 ? ' significantly outpacing competitors' : 
                         starGap > 10000 ? ' clearly ahead of alternatives' : 
                         ' closely competitive with other options'
    
    insights.push(`• Market Leader: ${topRepo.name} dominates with ${topRepo.stars.toLocaleString()} stars and ${(topRepo.forks || 0).toLocaleString()} forks in ${topRepo.language || 'Mixed'},${dominanceText}`)
  }
  
  // Compare top frameworks with meaningful analysis
  if (data.length >= 3 && top3.every(repo => repo.stars)) {
    const frameworks = top3.map(repo => `${repo.name} (${repo.stars.toLocaleString()})`).join(', ')
    const avgStars = Math.round(top3.reduce((sum, repo) => sum + (repo.stars || 0), 0) / 3)
    
    insights.push(`• Framework Landscape: Top contenders are ${frameworks} with an average of ${avgStars.toLocaleString()} stars, showing a competitive ${topRepo.language || 'technology'} ecosystem`)
  }
  
  // Actionable insight based on question type
  const lowerQuestion = question.toLowerCase()
  if (lowerQuestion.includes('trending') || lowerQuestion.includes('recent')) {
    const recentlyUpdated = data.filter(repo => {
      if (!repo.updated_at) return false
      const updateDate = new Date(repo.updated_at)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return updateDate > weekAgo
    }).length
    
    insights.push(`• Development Activity: ${recentlyUpdated} of ${Math.min(count, 10)} top repositories show recent activity (updated within a week), indicating ${recentlyUpdated > 5 ? 'very active' : 'moderate'} community engagement`)
  } else if (lowerQuestion.includes('best') || lowerQuestion.includes('popular')) {
    const totalStars = data.slice(0, 5).reduce((sum, repo) => sum + (repo.stars || 0), 0)
    insights.push(`• Adoption Metrics: Top 5 ${topRepo.language || 'repositories'} projects collectively have ${totalStars.toLocaleString()} stars, suggesting strong community validation for production use`)
  } else {
    insights.push(`• Technology Insight: ${dataSource === 'github_api' ? 'Live search reveals' : 'Curated data shows'} ${count} relevant repositories, with ${topRepo.language || 'this technology'} maintaining strong developer interest and active development`)
  }
  
  return insights.join('\n')
}

// Fallback SQL generation (reuse existing function)
function generateFallbackSQL(question) {
  const lowerQuestion = question.toLowerCase()
  
  // Language-specific queries
  const languageMap = {
    'python': 'Python', 'java': 'Java', 'javascript': 'JavaScript',
    'typescript': 'TypeScript', 'go': 'Go', 'rust': 'Rust'
  }
  
  for (const [keyword, language] of Object.entries(languageMap)) {
    if (lowerQuestion.includes(keyword)) {
      return `SELECT name, description, language, stars, forks, topics FROM repositories WHERE is_private = 0 AND language = '${language}' ORDER BY stars DESC LIMIT 25`
    }
  }
  
  // General popular repositories
  return `SELECT name, description, language, stars, forks FROM repositories WHERE is_private = 0 ORDER BY stars DESC LIMIT 20`
}