import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'
import { queryTurso } from '@/lib/turso-client'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

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

const SQL_GENERATION_PROMPT = `
You are an expert SQL analyst specializing in GitHub repository data. Generate precise SQLite queries based on natural language questions.

IMPORTANT RULES:
1. ONLY query these 3 tables: repositories, commits, languages
2. Use standard SQLite syntax (not Snowflake or other databases)
3. Always include LIMIT clause for performance (default LIMIT 50, max LIMIT 100)
4. Use DATE() and datetime() functions for date filtering
5. Use descriptive column aliases for better readability
6. Handle text searches with LIKE and LOWER() for case-insensitive matching
7. Return ONLY valid SQL - no explanations or markdown formatting
8. Join tables using repo_name or name fields as appropriate

COMMON PATTERNS:
- "most popular" = ORDER BY stars DESC
- "most active" = ORDER BY commits or updates DESC  
- "recent" = ORDER BY updated_at DESC or created_at DESC
- "languages I use" = GROUP BY language from languages table
- "biggest projects" = ORDER BY size_kb DESC
- "this year" = WHERE date >= date('now', '-1 year')

SQLite Date Functions:
- date('now') = current date
- date('now', '-7 days') = 7 days ago
- datetime() for timestamp comparisons

Schema:
${TURSO_GITHUB_SCHEMA}

Generate SQL for this question: "{QUESTION}"

Context from previous conversation:
{CONTEXT}

Return only the SQL query:
`

export async function POST(request) {
  try {
    const { question, context = [] } = await request.json()

    if (!question?.trim()) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    // Use Gemini 2.5 Flash model for fast SQL generation
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.2, // Low temperature for consistent SQL
        maxOutputTokens: 300,
        topP: 0.8,
      }
    })

    // Build context from conversation history
    const contextText = context
      .slice(-3) // Last 3 exchanges
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n')

    const prompt = SQL_GENERATION_PROMPT
      .replace('{QUESTION}', question)
      .replace('{CONTEXT}', contextText || 'No previous context')

    console.log('🤖 Generating SQLite query for:', question)

    const result = await model.generateContent(prompt)
    const response = await result.response
    const generatedSQL = response.text().trim()

    // Clean up the SQL
    const cleanSQL = generatedSQL
      .replace(/```sql\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/^\n+|\n+$/g, '')
      .trim()

    // Basic SQL validation
    if (!cleanSQL.toLowerCase().includes('select')) {
      throw new Error('Generated response is not a valid SQL query')
    }

    // Security: Prevent dangerous operations
    const dangerousKeywords = ['drop', 'delete', 'update', 'insert', 'alter', 'create', 'truncate']
    const lowerSQL = cleanSQL.toLowerCase()
    
    for (const keyword of dangerousKeywords) {
      if (lowerSQL.includes(keyword)) {
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

    // Generate insights if we have data
    let insights = ''
    if (queryResult.data.length > 0) {
      try {
        const insightPrompt = `
Based on this GitHub repository data query result, provide 2-3 brief insights:

Query: ${finalSQL}
Results: ${JSON.stringify(queryResult.data.slice(0, 3))}
Total rows: ${queryResult.data.length}

Provide insights as bullet points about interesting patterns or standout values.
`
        const insightResult = await model.generateContent(insightPrompt)
        insights = insightResult.response.text().trim()
      } catch (error) {
        insights = 'Query executed successfully. Results show your GitHub repository data.'
      }
    }

    return NextResponse.json({
      success: true,
      question,
      sql: finalSQL,
      data: queryResult.data,
      count: queryResult.data.length,
      insights,
      model: 'gemini-2.5-flash',
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
          return NextResponse.json({
            success: true,
            question,
            sql: fallbackSQL,
            data: queryResult.data,
            count: queryResult.data.length,
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
  
  // Most popular repositories
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