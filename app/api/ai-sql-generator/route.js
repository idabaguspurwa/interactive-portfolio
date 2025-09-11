import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'
import { queryTurso } from '@/lib/turso-client'

// Initialize Gemini AI only if API key is available
let genAI = null
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
}

const TURSO_GITHUB_SCHEMA = `
Database: Turso SQLite Database

Table 1: repositories
Columns:
- id (INTEGER): GitHub repository ID
- name (TEXT): Repository name
- full_name (TEXT): Owner/repo format
- description (TEXT): Repository description
- language (TEXT): Primary programming language
- stars (INTEGER): Star count
- forks (INTEGER): Fork count
- open_issues (INTEGER): Open issues count
- size_kb (INTEGER): Repository size in KB
- created_at (TEXT): Creation date (ISO format)
- updated_at (TEXT): Last update date (ISO format)
- pushed_at (TEXT): Last push date (ISO format)
- is_fork (BOOLEAN): Whether it's a fork (0/1)
- is_private (BOOLEAN): Whether it's private (0/1)
- homepage (TEXT): Repository homepage URL
- topics (TEXT): Comma-separated topics
- sync_date (TEXT): Last sync timestamp

Table 2: commits
Columns:
- sha (TEXT): Commit hash (primary key)
- repo_name (TEXT): Repository name
- author_name (TEXT): Commit author name
- author_email (TEXT): Commit author email
- message (TEXT): Commit message (truncated to 200 chars)
- date (TEXT): Commit date (ISO format)
- additions (INTEGER): Lines added (currently 0)
- deletions (INTEGER): Lines deleted (currently 0)
- files_changed (INTEGER): Files changed (currently 0)
- sync_date (TEXT): Last sync timestamp

Table 3: languages
Columns:
- id (INTEGER): Auto-increment ID
- repo_name (TEXT): Repository name
- language (TEXT): Programming language
- bytes (INTEGER): Bytes of code in this language
- percentage (REAL): Percentage of total codebase
- sync_date (TEXT): Last sync timestamp

Sample data context:
- Real GitHub repository data for your portfolio
- Updated weekly via GitHub Actions
- Focus on public repositories only
- Recent commit history (last 30 days per repo)
- Language statistics per repository
`

const SHORT_SQL_PROMPT = `
Generate SQLite query for GitHub repository data.

SCHEMAS:
1. repositories: name, description, language, stars, forks, open_issues, size_kb, created_at, updated_at, is_private
2. commits: repo_name, author_name, message, date
3. languages: repo_name, language, bytes, percentage

QUERY PATTERNS:

POPULAR/MOST STARRED:
SELECT name, description, language, stars, forks FROM repositories WHERE is_private = 0 ORDER BY stars DESC LIMIT 20

RECENT/LATEST:
SELECT name, description, language, stars, updated_at FROM repositories WHERE is_private = 0 ORDER BY updated_at DESC LIMIT 15

LANGUAGES/PROGRAMMING:
SELECT l.language, COUNT(DISTINCT l.repo_name) as repo_count, ROUND(AVG(l.percentage), 2) as avg_percentage, SUM(l.bytes) as total_bytes FROM languages l JOIN repositories r ON l.repo_name = r.name WHERE r.is_private = 0 GROUP BY l.language ORDER BY repo_count DESC, total_bytes DESC LIMIT 15

POPULAR LANGUAGE REPOSITORIES (Python, Java, etc):
SELECT name, description, language, stars, forks, topics FROM repositories WHERE is_private = 0 AND language = '{LANGUAGE}' ORDER BY stars DESC LIMIT 20

POPULAR PYTHON:
SELECT name, description, language, stars, forks, created_at, topics FROM repositories WHERE is_private = 0 AND language = 'Python' ORDER BY stars DESC LIMIT 25

POPULAR JAVA:
SELECT name, description, language, stars, forks, created_at, topics FROM repositories WHERE is_private = 0 AND language = 'Java' ORDER BY stars DESC LIMIT 25

POPULAR TYPESCRIPT:
SELECT name, description, language, stars, forks, created_at, topics FROM repositories WHERE is_private = 0 AND language = 'TypeScript' ORDER BY stars DESC LIMIT 25

POPULAR GO:
SELECT name, description, language, stars, forks, created_at, topics FROM repositories WHERE is_private = 0 AND language = 'Go' ORDER BY stars DESC LIMIT 25

POPULAR RUST:
SELECT name, description, language, stars, forks, created_at, topics FROM repositories WHERE is_private = 0 AND language = 'Rust' ORDER BY stars DESC LIMIT 25

POPULAR C++:
SELECT name, description, language, stars, forks, created_at, topics FROM repositories WHERE is_private = 0 AND language = 'C++' ORDER BY stars DESC LIMIT 25

BIG/LARGE/SIZE:
SELECT name, description, language, size_kb, stars FROM repositories WHERE is_private = 0 AND size_kb > 0 ORDER BY size_kb DESC LIMIT 15

COMMITS:
SELECT repo_name, COUNT(*) as commit_count, COUNT(DISTINCT author_name) as unique_authors FROM commits GROUP BY repo_name ORDER BY commit_count DESC LIMIT 15

FRAMEWORKS (JavaScript):
SELECT name, stars, forks, description, language FROM repositories WHERE language = 'JavaScript' AND (name LIKE '%react%' OR name LIKE '%vue%' OR name LIKE '%angular%' OR name LIKE '%next%' OR description LIKE '%framework%') ORDER BY stars DESC LIMIT 15

OVERVIEW/SUMMARY:
SELECT name, description, language, stars, forks FROM repositories WHERE is_private = 0 ORDER BY stars DESC LIMIT 25

RULES:
- Include key columns: name, stars, description, language
- Use WHERE is_private = 0 for repositories
- Add LIMIT clauses

Question: "{QUESTION}"

Generate matching SQLite query:
`

export async function POST(request) {
  let question = ''
  
  try {
    // Check if required environment variables are available
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { 
          error: 'AI Data Explorer is not configured', 
          message: 'Missing GEMINI_API_KEY environment variable. Please check your deployment configuration.',
          configured: false
        },
        { status: 503 } // Service Unavailable
      )
    }

    if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
      return NextResponse.json(
        { 
          error: 'Database is not configured', 
          message: 'Missing Turso database environment variables. Please check your deployment configuration.',
          configured: false
        },
        { status: 503 } // Service Unavailable
      )
    }

    const { question: userQuestion, context = [] } = await request.json()
    question = userQuestion

    if (!question?.trim()) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    // Use Groq Llama 3.1 for fast and reliable SQL generation
    const model = 'llama-3.1-8b-instant' // Fast and excellent for SQL

    // Build context from conversation history
    const contextText = context
      .slice(-3) // Last 3 exchanges
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n')

    const prompt = SHORT_SQL_PROMPT.replace('{QUESTION}', question)

    console.log('🤖 Generating SQL query for:', question)
    console.log('⏱️  Prompt length:', prompt.length, 'characters')
    
    let combinedResponse, apiDuration
    
    try {
      console.log('🚀 Calling Gemini 2.0 Flash for SQL generation...')
      
      // Use Gemini 2.0 Flash model
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: 0.1, // Very low for consistent SQL
          maxOutputTokens: 150, // Conservative limit for SQL only
          topP: 0.8,
        }
      })
      
      const startTime = Date.now()
      const result = await model.generateContent(prompt)
      apiDuration = Date.now() - startTime
      
      console.log('⏱️  Gemini 2.0 Flash took:', apiDuration, 'ms')
      
      const response = await result.response
      combinedResponse = response.text().trim()
      
      // Check if response was blocked or empty
      if (result.response.candidates?.[0]?.finishReason) {
        console.log('🔍 Finish reason:', result.response.candidates[0].finishReason)
      }
      
    } catch (error) {
      console.error('❌ Gemini 2.0 Flash error:', error.message)
      throw error
    }

    console.log('🔍 Combined response from Gemini 2.0 Flash:', combinedResponse)
    console.log('🔍 Response length:', combinedResponse.length)

    // Check if response is empty
    if (!combinedResponse || combinedResponse.length < 10) {
      console.log('❌ Empty response from Gemini 2.0 Flash')  
      throw new Error('Gemini 2.0 Flash returned empty response')
    }

    // Extract SQL from response and format properly
    let cleanSQL = combinedResponse
      .replace(/```\w*\n?/g, '') // Remove all code block markers
      .replace(/^\s*/, '') // Remove leading whitespace
      .replace(/;$/, '') // Remove trailing semicolon
      .trim()
    
    // Format SQL for better display (add line breaks and proper indentation)
    cleanSQL = cleanSQL
      .replace(/SELECT\s+/gi, 'SELECT\n  ')
      .replace(/,\s*(?=\w)/gi, ',\n  ') // Add line break after commas
      .replace(/\s+FROM\s+/gi, '\nFROM ')
      .replace(/\s+WHERE\s+/gi, '\nWHERE\n  ')
      .replace(/\s+AND\s+\(/gi, '\n  AND (')
      .replace(/\s+OR\s+/gi, '\n     OR ')
      .replace(/\s+ORDER\s+BY\s+/gi, '\nORDER BY ')
      .replace(/\s+LIMIT\s+/gi, '\nLIMIT ')

    console.log('🔍 Extracted SQL:', cleanSQL.substring(0, 100) + '...')

    if (!cleanSQL || !cleanSQL.toLowerCase().includes('select')) {
      throw new Error('Failed to extract valid SQL from AI response')
    }

    // Basic SQL validation
    if (!cleanSQL.toLowerCase().includes('select')) {
      throw new Error('Generated response is not a valid SQL query')
    }

    // Security: Prevent dangerous operations (check as whole words to avoid false positives)
    const dangerousKeywords = ['drop', 'delete', 'update', 'insert', 'alter', 'create', 'truncate']
    const lowerSQL = cleanSQL.toLowerCase()
    
    for (const keyword of dangerousKeywords) {
      // Use word boundaries to avoid false positives like "updated_at"
      const regex = new RegExp(`\\b${keyword}\\b`, 'i')
      if (regex.test(lowerSQL)) {
        throw new Error('Generated query contains unsafe operations')
      }
    }

    // Ensure LIMIT clause exists (Turso free tier protection)
    let finalSQL = cleanSQL
    if (!lowerSQL.includes('limit')) {
      finalSQL += ' LIMIT 50'
    }

    console.log('✅ Generated SQLite query:', finalSQL)

    // Execute the query against Turso
    const queryResult = await queryTurso(finalSQL)

    if (!queryResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Query execution failed',
        sql: finalSQL,
        dbError: queryResult.error,
        question
      }, { status: 500 })
    }

    if (queryResult.data.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No data found',
        message: 'Query executed successfully but returned no results',
        sql: finalSQL,
        question
      }, { status: 404 })
    }

    // Generate real insights based on actual query results
    console.log('🤖 Generating insights based on REAL data...')
    let insights = ''
    
    try {
      // Get top 10 results for analysis
      const topResults = queryResult.data.slice(0, 10)
      const totalResults = queryResult.data.length
      
      // Create a focused prompt with REAL data
      let realDataPrompt
      
      // Check if this is a language statistics query
      if (topResults[0] && 'repo_count' in topResults[0]) {
        // Language statistics format
        realDataPrompt = `Analyze these ACTUAL programming language statistics and provide 3 specific insights:

Question: "${question}"
Total Languages: ${totalResults}

Language Statistics:
${topResults.map((row, i) => {
  const language = row.language || 'Unknown'
  const repoCount = row.repo_count || 0
  const avgPercentage = row.avg_percentage || 0
  const totalBytes = row.total_bytes || 0
  
  return `${i+1}. ${language}: ${repoCount} repositories, ${avgPercentage}% average usage, ${totalBytes} total bytes`
}).join('\n')}

Provide exactly 3 bullet points analyzing the SPECIFIC LANGUAGE DATA shown:
• [Comment on the most used language with specific numbers]
• [Identify patterns in language usage, percentages, or repository counts]  
• [Give insights about the technology stack based on the actual data]

Focus on the actual language names, usage percentages, and repository counts.`
      } else {
        // Repository data format - check what data we actually have
        const hasCommitData = topResults.some(row => row.total_commits || row.commits || row.commit_count)
        const hasSizeData = topResults.some(row => row.size_kb && row.size_kb > 0)
        const hasForkData = topResults.some(row => row.forks && row.forks > 0)
        
        realDataPrompt = `Analyze these ACTUAL GitHub repository results and provide 3 specific insights:

Question: "${question}"
Total Results: ${totalResults}

Top Results:
${topResults.map((row, i) => {
  const name = row.name || row.repository_name || 'Unknown'
  const stars = row.stars || row.star_count || 'N/A'
  const language = row.language || 'Mixed'
  
  // Only include data fields that are actually present and meaningful
  let details = [`${stars} stars`, language]
  
  if (hasCommitData && (row.total_commits || row.commits || row.commit_count)) {
    details.push(`${row.total_commits || row.commits || row.commit_count} commits`)
  }
  
  if (hasForkData && row.forks) {
    details.push(`${row.forks} forks`)
  }
  
  if (hasSizeData && row.size_kb) {
    details.push(`${Math.round(row.size_kb / 1024)}MB`)
  }
  
  return `${i+1}. ${name} - ${details.join(', ')}`
}).join('\n')}

Provide exactly 3 bullet points analyzing the SPECIFIC RESULTS shown:
• [Comment on the top performing repository by name with specific numbers]
• [Identify a pattern you see in the actual data - languages, stars, activity, etc.]  
• [Give an insight or recommendation based on what the real results reveal]

Focus on the actual repository names, numbers, and patterns shown in the data - avoid mentioning missing data fields.`
      }

      console.log('🚀 Calling Gemini for real data analysis...')
      
      // Use OpenRouter DeepSeek for AI insights (free and reliable)
      console.log('🤖 Calling OpenRouter DeepSeek for insights generation...')
      const rawInsights = await generateOpenRouterInsights(realDataPrompt)
      
      console.log('📝 Raw insights from real data:', rawInsights)
      
      // Validate that we got real insights  
      const hasValidBullets = rawInsights && (rawInsights.includes('•') || rawInsights.includes('- '))
      const hasMinimumLength = rawInsights && rawInsights.length > 50
      
      if (hasValidBullets && hasMinimumLength) {
        insights = rawInsights
          .replace(/```\w*\n?/g, '') // Remove code block markers
          .replace(/^\n+|\n+$/g, '') // Remove leading/trailing newlines
          .replace(/^- /gm, '• ') // Convert hyphens to bullet points
          .replace(/\*\*(.*?)\*\*/g, '$1') // Remove ALL ** bold formatting
          .replace(/<\|begin▁of▁sentence\|>/g, '') // Remove DeepSeek sentence tokens
          .replace(/<｜begin▁of▁sentence｜>/g, '') // Remove DeepSeek sentence tokens (Unicode variant)
          .replace(/<\|.*?\|>/g, '') // Remove any other angle bracket tokens
          .replace(/<｜.*?｜>/g, '') // Remove any other Unicode angle bracket tokens
          .replace(/Based on the provided.*?:\s*/gi, '') // Remove generic intro
          .replace(/^.*?results for.*?:\s*/gi, '') // Remove question repetition
          .split('\n')
          .filter(line => line.trim() && line.includes('•')) // Only keep bullet points
          .join('\n')
          .trim()
        console.log('✅ Generated REAL data-based insights!')
      } else {
        console.log('❌ Real data insight generation failed, using analytical fallback')
        insights = generateAnalyticalFallback(question, queryResult.data)
      }
      
    } catch (error) {
      console.error('❌ Real data insight generation error:', error.message)
      insights = generateAnalyticalFallback(question, queryResult.data)
    }

    return NextResponse.json({
      success: true,
      question,
      sql: finalSQL,
      data: queryResult.data,
      count: queryResult.data.length,
      insights,
      model: 'gemini-2.0-flash + deepseek-insights',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ SQL generation error:', error)
    
    // Fallback to template-based SQL
    const fallbackSQL = generateFallbackSQL(question)
    
    if (fallbackSQL) {
      try {
        console.log('🔄 Using fallback SQL template')
        const queryResult = await queryTurso(fallbackSQL)
        
        if (queryResult.success) {
          // Generate fallback insights
          const fallbackInsights = generateFallbackInsights(question, queryResult.data)
          
          return NextResponse.json({
            success: true,
            question,
            sql: fallbackSQL,
            data: queryResult.data,
            count: queryResult.data.length,
            insights: fallbackInsights,
            model: 'fallback-template',
            fallback: true,
            timestamp: new Date().toISOString()
          })
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError)
      }
    }

    return NextResponse.json({
      error: 'Failed to generate and execute SQL query',
      details: error.message,
      question: question
    }, { status: 500 })
  }
}

// Fallback templates for common questions
function generateFallbackSQL(question) {
  const lowerQuestion = question.toLowerCase()
  
  // Language-specific popular repositories
  const languageMap = {
    'python': 'Python',
    'java': 'Java', 
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'go': 'Go',
    'rust': 'Rust',
    'c++': 'C++',
    'cpp': 'C++',
    'c#': 'C#',
    'csharp': 'C#',
    'php': 'PHP',
    'ruby': 'Ruby',
    'swift': 'Swift',
    'kotlin': 'Kotlin'
  }
  
  // Check for language-specific queries
  for (const [keyword, language] of Object.entries(languageMap)) {
    if (lowerQuestion.includes(keyword) && (lowerQuestion.includes('popular') || lowerQuestion.includes('best') || lowerQuestion.includes('top'))) {
      return `
        SELECT name,
               description,
               language,
               stars,
               forks,
               created_at,
               topics
        FROM repositories
        WHERE is_private = 0 
          AND language = '${language}'
        ORDER BY stars DESC
        LIMIT 25
      `.trim()
    }
  }
  
  // Most popular repositories (general)
  if (lowerQuestion.includes('most popular') || (lowerQuestion.includes('most') && lowerQuestion.includes('star'))) {
    return `
      SELECT name,
             description,
             language,
             stars,
             forks,
             created_at
      FROM repositories
      WHERE is_private = 0
      ORDER BY stars DESC
      LIMIT 20
    `.trim()
  }
  
  // Recent repositories
  if (lowerQuestion.includes('recent') || lowerQuestion.includes('latest')) {
    return `
      SELECT name,
             description,
             language,
             stars,
             updated_at,
             created_at
      FROM repositories
      WHERE is_private = 0
      ORDER BY updated_at DESC
      LIMIT 15
    `.trim()
  }
  
  // Languages used
  if (lowerQuestion.includes('language') || lowerQuestion.includes('programming')) {
    return `
      SELECT language,
             COUNT(*) as repo_count,
             ROUND(AVG(percentage), 2) as avg_percentage,
             SUM(bytes) as total_bytes
      FROM languages
      GROUP BY language
      ORDER BY repo_count DESC, total_bytes DESC
      LIMIT 15
    `.trim()
  }
  
  // Biggest projects
  if (lowerQuestion.includes('big') || lowerQuestion.includes('large') || lowerQuestion.includes('size')) {
    return `
      SELECT name,
             description,
             language,
             size_kb,
             stars,
             forks
      FROM repositories
      WHERE is_private = 0 AND size_kb > 0
      ORDER BY size_kb DESC
      LIMIT 15
    `.trim()
  }
  
  // Commits overview
  if (lowerQuestion.includes('commit')) {
    return `
      SELECT repo_name,
             COUNT(*) as commit_count,
             COUNT(DISTINCT author_name) as unique_authors,
             MAX(date) as latest_commit
      FROM commits
      GROUP BY repo_name
      ORDER BY commit_count DESC
      LIMIT 15
    `.trim()
  }
  
  // Overall summary
  if (lowerQuestion.includes('overview') || lowerQuestion.includes('summary') || lowerQuestion.includes('all')) {
    return `
      SELECT name,
             description,
             language,
             stars,
             forks,
             open_issues,
             created_at
      FROM repositories
      WHERE is_private = 0
      ORDER BY stars DESC
      LIMIT 25
    `.trim()
  }
  
  return null
}

// Generate AI insights using OpenRouter DeepSeek (free tier, reliable)
async function generateOpenRouterInsights(prompt) {
  try {
    console.log('🤖 Making request to OpenRouter DeepSeek...')
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'AI Data Explorer'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3.1:free',
        messages: [
          {
            role: 'system',
            content: 'You are a data analyst. Provide exactly 3 bullet points analyzing the specific GitHub repository results. Focus on actual numbers, repository names, and patterns shown in the data.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 200,
        top_p: 0.9
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const result = await response.json()
    console.log('🤖 OpenRouter response:', result)

    // Extract the generated text
    const insights = result.choices?.[0]?.message?.content?.trim() || ''
    
    if (!insights) {
      throw new Error('Empty response from OpenRouter DeepSeek')
    }

    return insights

  } catch (error) {
    console.error('❌ OpenRouter DeepSeek error:', error.message)
    
    // Fallback to analytical insights if OpenRouter fails
    console.log('🔄 Falling back to analytical insights...')
    throw error
  }
}

// Generate smart analytical insights based on real data (no AI needed)
function generateSmartAnalyticalInsights(question, topResults, totalResults) {
  if (!topResults || topResults.length === 0) {
    return '• No Data: Query returned no results to analyze'
  }

  const insights = []
  const lowerQuestion = question.toLowerCase()
  
  // Analyze top performer with specific details
  const topRepo = topResults[0]
  const name = topRepo.name || topRepo.repository_name || topRepo.full_name || 'Top repository'
  const stars = topRepo.stars || topRepo.star_count || 0
  const language = topRepo.language || topRepo.primary_language || 'Mixed'
  const commits = topRepo.total_commits || topRepo.commits || 'N/A'
  
  // Smart insight about the top result
  if (stars > 100000) {
    insights.push(`• Industry Leader: ${name} dominates with ${stars.toLocaleString()} stars in ${language}, representing a major open-source project with massive community adoption`)
  } else if (stars > 10000) {
    insights.push(`• Popular Project: ${name} leads with ${stars.toLocaleString()} stars in ${language}, showing strong developer community engagement`)
  } else if (stars > 1000) {
    insights.push(`• Growing Project: ${name} shows ${stars.toLocaleString()} stars in ${language}, indicating solid community interest and adoption`)
  } else {
    insights.push(`• Development Focus: ${name} (${language}) leads the results with ${commits} commits, showing active development work`)
  }
  
  // Technology and language analysis
  const languages = topResults.map(repo => repo.language || repo.primary_language || 'Unknown').filter(l => l !== 'Unknown')
  const uniqueLanguages = [...new Set(languages)]
  
  if (uniqueLanguages.length >= 3) {
    const langCounts = {}
    languages.forEach(lang => langCounts[lang] = (langCounts[lang] || 0) + 1)
    const topLang = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0]
    insights.push(`• Technology Stack: ${topLang[0]} appears most frequently (${topLang[1]}x) among top results, followed by ${uniqueLanguages.filter(l => l !== topLang[0]).slice(0, 2).join(' and ')}`)
  } else if (uniqueLanguages.length > 0) {
    insights.push(`• Technology Focus: Results are primarily ${uniqueLanguages[0]}-based projects, showing specialization in this technology stack`)
  }
  
  // Scale and comparison analysis  
  const allStars = topResults.map(repo => repo.stars || repo.star_count || 0).filter(s => s > 0)
  if (allStars.length > 1) {
    const totalStars = allStars.reduce((sum, s) => sum + s, 0)
    const avgStars = Math.round(totalStars / allStars.length)
    const maxStars = Math.max(...allStars)
    const minStars = Math.min(...allStars)
    
    if (maxStars > minStars * 10) {
      insights.push(`• Scale Diversity: Wide popularity range from ${minStars.toLocaleString()} to ${maxStars.toLocaleString()} stars (avg: ${avgStars.toLocaleString()}), showing mix of established and emerging projects`)
    } else {
      insights.push(`• Consistent Scale: Projects show similar popularity levels averaging ${avgStars.toLocaleString()} stars, indicating comparable community adoption across ${totalResults} total results`)
    }
  } else {
    insights.push(`• Dataset Overview: Analyzed ${totalResults} repositories focusing on ${lowerQuestion.includes('active') ? 'development activity' : lowerQuestion.includes('popular') ? 'community popularity' : 'repository characteristics'}`)
  }
  
  return insights.join('\n')
}

// Generate analytical insights based on actual data (more detailed than generic fallback)
function generateAnalyticalFallback(question, data) {
  if (!data || data.length === 0) {
    return '• No Data Found: Your query returned no results. Try exploring different aspects of your repository data.'
  }

  const resultCount = data.length
  const firstResult = data[0] || {}
  
  // Get top 3 results for specific analysis
  const topResults = data.slice(0, 3)
  
  let insights = []
  
  // Analyze top performer with specific details
  if (topResults.length > 0) {
    const topRepo = topResults[0]
    const name = topRepo.name || topRepo.repository_name || 'Top result'
    const stars = topRepo.stars || topRepo.star_count || 'N/A'
    const language = topRepo.language || 'Mixed'
    const commits = topRepo.total_commits || topRepo.commits || 'N/A'
    
    insights.push(`• Top Performer: ${name} leads with ${stars} stars in ${language}, showing ${commits} commits of development activity`)
  }
  
  // Language and technology analysis
  const languages = [...new Set(data.map(item => item.language || 'Unknown').filter(l => l !== 'Unknown'))]
  if (languages.length > 0) {
    const languageCount = {}
    data.forEach(item => {
      const lang = item.language || 'Unknown'
      if (lang !== 'Unknown') {
        languageCount[lang] = (languageCount[lang] || 0) + 1
      }
    })
    const topLanguage = Object.entries(languageCount).sort((a, b) => b[1] - a[1])[0]
    
    if (topLanguage) {
      insights.push(`• Technology Trends: ${topLanguage[0]} dominates with ${topLanguage[1]} repositories out of ${resultCount} total, followed by ${languages.slice(1, 3).join(' and ')}`)
    }
  }
  
  // Scale and popularity analysis
  if (firstResult.stars !== undefined || firstResult.star_count !== undefined) {
    const stars = data.map(repo => repo.stars || repo.star_count || 0)
    const totalStars = stars.reduce((sum, s) => sum + s, 0)
    const avgStars = Math.round(totalStars / data.length)
    const maxStars = Math.max(...stars)
    
    insights.push(`• Scale Analysis: These ${resultCount} repositories total ${totalStars.toLocaleString()} stars (avg: ${avgStars}), with the top project reaching ${maxStars.toLocaleString()} stars`)
  }
  
  // If we don't have 3 insights yet, add a general observation
  if (insights.length < 3) {
    insights.push(`• Dataset Overview: Found ${resultCount} matching repositories spanning ${languages.length} programming languages with diverse popularity and activity levels`)
  }
  
  return insights.join('\n')
}

// Generate insights for fallback queries (simplified version)
function generateFallbackInsights(question, data) {
  return generateAnalyticalFallback(question, data)
}