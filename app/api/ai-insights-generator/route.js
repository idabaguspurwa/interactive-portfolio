import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const INSIGHTS_GENERATION_PROMPT = `
You are a data analyst expert specializing in GitHub activity analysis. Generate insightful, actionable analysis based on query results.

IMPORTANT RULES:
1. Provide concise, business-relevant insights
2. Identify patterns, trends, and anomalies
3. Use specific numbers and percentages when available
4. Suggest actionable next steps
5. Keep language accessible to non-technical users
6. Focus on "why" and "what this means" not just "what"

ANALYSIS FRAMEWORK:
- Summary: High-level takeaway in 1-2 sentences
- Key Findings: 2-4 specific observations with data
- Notable Patterns: Interesting trends or anomalies
- Recommendations: 1-3 actionable next steps

Original Question: "{QUESTION}"
SQL Query: {SQL}
Data Size: {DATA_SIZE} records
Sample Data: {SAMPLE_DATA}

Generate insights in this format:
{
  "summary": "Brief high-level takeaway",
  "keyFindings": [
    "Finding 1 with specific data",
    "Finding 2 with context",
    "Finding 3 if relevant"
  ],
  "anomalies": [
    "Notable pattern or anomaly",
    "Another interesting observation"
  ],
  "recommendations": [
    "Actionable suggestion 1",
    "Actionable suggestion 2"
  ]
}

Focus on practical insights that help understand GitHub development patterns and project health.
`

export async function POST(request) {
  try {
    const { question, results, sql, dataSize = 0 } = await request.json()

    if (!question?.trim() || !results) {
      return NextResponse.json(
        { error: 'Question and results are required' },
        { status: 400 }
      )
    }

    // Use Gemini 2.0 Flash for fast insights generation
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.7, // Higher temperature for more creative insights
        maxOutputTokens: 800,
        topP: 0.9,
      }
    })

    // Prepare sample data (first few rows for context)
    const sampleData = results.slice(0, 5).map(row => {
      // Clean and simplify the data for AI context
      const cleanedRow = {}
      Object.entries(row).forEach(([key, value]) => {
        if (key !== '_id' && value != null) {
          cleanedRow[key] = value
        }
      })
      return cleanedRow
    })

    const prompt = INSIGHTS_GENERATION_PROMPT
      .replace('{QUESTION}', question)
      .replace('{SQL}', sql || 'N/A')
      .replace('{DATA_SIZE}', dataSize.toString())
      .replace('{SAMPLE_DATA}', JSON.stringify(sampleData, null, 2))

    console.log('🔍 Generating insights with Gemini 2.5 Flash for:', question)

    const result = await model.generateContent(prompt)
    const response = await result.response
    const generatedText = response.text().trim()

    // Try to parse as JSON first
    let insights
    try {
      // Clean up any markdown formatting
      const cleanText = generatedText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
      
      insights = JSON.parse(cleanText)
      
      // Validate structure
      if (typeof insights !== 'object' || !insights.summary) {
        throw new Error('Invalid insights structure')
      }
      
    } catch (parseError) {
      console.log('Failed to parse JSON insights, using text format')
      // Fall back to text format
      insights = generatedText
    }

    console.log('✅ Generated insights successfully')

    return NextResponse.json({
      success: true,
      insights: typeof insights === 'object' ? JSON.stringify(insights) : insights,
      model: 'gemini-2.0-flash-exp',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Insights generation error:', error)
    
    // Generate fallback insights
    const fallbackInsights = generateFallbackInsights(question, results, dataSize)
    
    return NextResponse.json({
      success: true,
      insights: fallbackInsights,
      model: 'fallback',
      fallback: true,
      timestamp: new Date().toISOString()
    })
  }
}

function generateFallbackInsights(question, results, dataSize) {
  const lowerQuestion = question.toLowerCase()
  
  if (!results || results.length === 0) {
    return "No data found for your query. Try adjusting your search criteria or time range."
  }

  // Basic insights based on data size and common patterns
  let insight = `Found ${dataSize} result${dataSize !== 1 ? 's' : ''} for your query. `
  
  // Analyze numeric columns
  const firstRow = results[0] || {}
  const numericColumns = Object.entries(firstRow)
    .filter(([key, value]) => typeof value === 'number' && !isNaN(value))
    .map(([key]) => key)

  if (numericColumns.length > 0) {
    const topColumn = numericColumns[0]
    const values = results.map(row => row[topColumn]).filter(v => v != null)
    const sum = values.reduce((a, b) => a + b, 0)
    const avg = sum / values.length
    const max = Math.max(...values)
    
    insight += `The highest ${topColumn} value is ${max.toLocaleString()}. `
    insight += `Average ${topColumn} is ${Math.round(avg).toLocaleString()}. `
  }

  // Query-specific insights
  if (lowerQuestion.includes('most active') || lowerQuestion.includes('top')) {
    insight += "This shows the most active items in your dataset. Consider investigating what makes these stand out."
  } else if (lowerQuestion.includes('trend') || lowerQuestion.includes('pattern')) {
    insight += "Look for patterns over time to understand development cycles and peak activity periods."
  } else if (lowerQuestion.includes('recent') || lowerQuestion.includes('latest')) {
    insight += "Recent activity can indicate current project health and development momentum."
  }

  return insight
}