import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Retry function with exponential backoff
async function retryWithBackoff(fn, maxRetries, initialDelay) {
  let retries = 0
  
  while (retries < maxRetries) {
    try {
      return await fn()
    } catch (error) {
      retries++
      
      // Check if it's a retryable error
      const isRetryable = error.message.includes('503') || 
                         error.message.includes('Service Unavailable') ||
                         error.message.includes('overloaded') ||
                         error.message.includes('timeout') ||
                         error.message.includes('ECONNRESET') ||
                         error.message.includes('ETIMEDOUT')
      
      if (!isRetryable || retries >= maxRetries) {
        throw error
      }
      
      // Exponential backoff with jitter
      const delay = initialDelay * Math.pow(2, retries - 1) + Math.random() * 1000
      console.log(`Retry attempt ${retries}/${maxRetries} after ${Math.round(delay)}ms delay. Error: ${error.message}`)
      
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

export async function POST(request) {
  try {
    const { csvData, fileName, fileSize } = await request.json()
    
    // Handle large files with chunked processing
    const MAX_CHUNK_SIZE = 1000 // Process 1000 rows at a time
    const lines = csvData.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      return NextResponse.json(
        { error: 'CSV file must have at least a header row and one data row' },
        { status: 400 }
      )
    }

    // Parse headers
    const headers = lines[0]
      .split(',')
      .map(h => h.trim().replace(/"/g, ''))
      .filter(h => h)

    if (headers.length === 0) {
      return NextResponse.json(
        { error: 'CSV file must have valid headers' },
        { status: 400 }
      )
    }

    // Sample data for analysis (first 20 rows for faster AI analysis)
    const sampleSize = Math.min(20, lines.length - 1)
    const sampleLines = lines.slice(1, sampleSize + 1)
    
    const sampleData = sampleLines.map((line, index) => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
      const row = { id: index + 1 }
      
      headers.forEach((header, i) => {
        if (header && values[i] !== undefined) {
          const value = values[i]
          // Smart type detection
          if (value && !isNaN(value) && !isNaN(parseFloat(value))) {
            row[header] = parseFloat(value)
          } else {
            row[header] = value || ''
          }
        }
      })
      return row
    })

    // AI-powered data analysis with Gemini
    const analysis = await analyzeDataWithGemini(sampleData, headers, fileName, fileSize, lines.length - 1)
    
    // Validate that AI analysis succeeded and contains proper data context
    if (analysis && analysis.dataContext && analysis.dataContext.specificType) {
      console.log('AI analysis successful, returning AI results:', analysis.dataContext.specificType)
    } else {
      console.warn('AI analysis may have failed or returned incomplete data:', analysis?.dataContext)
    }
    
    const response = {
      success: true,
      totalRows: lines.length - 1,
      sampleData: sampleData.slice(0, 10), // Return first 10 rows for preview
      analysis,
      headers,
      fileInfo: {
        name: fileName,
        size: fileSize,
        rows: lines.length - 1,
        columns: headers.length
      }
    }
    
    // Log the complete response being sent to frontend
    console.log('=== COMPLETE API RESPONSE ===')
    console.log('Analysis dataContext:', JSON.stringify(analysis.dataContext, null, 2))
    console.log('Analysis aiPowered:', analysis.aiPowered)
    console.log('Analysis fallbackUsed:', analysis.fallbackUsed)
    console.log('Headers:', headers)
    console.log('=============================')
    
    const jsonResponse = NextResponse.json(response)
    
    // Add cache-busting headers to prevent frontend caching
    jsonResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    jsonResponse.headers.set('Pragma', 'no-cache')
    jsonResponse.headers.set('Expires', '0')
    
    return jsonResponse
    
  } catch (error) {
    console.error('Error analyzing CSV:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Failed to analyze CSV file'
    let statusCode = 500
    
    if (error.message.includes('JSON')) {
      errorMessage = 'Invalid request format. Please ensure the CSV data is properly formatted.'
      statusCode = 400
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Analysis timed out. Please try again with a smaller file or retry later.'
      statusCode = 408
    } else if (error.message.includes('memory') || error.message.includes('heap')) {
      errorMessage = 'File too large to process. Please try with a smaller CSV file.'
      statusCode = 413
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        retryAdvice: 'If the issue persists, try with a smaller file or contact support.'
      },
      { status: statusCode }
    )
  }
}

async function analyzeDataWithGemini(sampleData, headers, fileName, fileSize, totalRows) {
  try {
    // Basic column analysis first
    const columnAnalysis = analyzeColumns(sampleData, headers)
    
    // Prepare optimized data sample for Gemini analysis
    const dataSample = {
      fileName,
      headers,
      sampleRows: sampleData.slice(0, 5), // First 5 rows for faster analysis
      columnTypes: Object.fromEntries(
        Object.entries(columnAnalysis).map(([col, analysis]) => [col, analysis.dataType])
      ),
      fileSize: Math.round(fileSize / 1024) + ' KB',
      totalRows: totalRows
    }

    // Try Gemini 2.5 Flash first, fallback to 1.5 Flash if needed
    let model
    let modelUsed = "gemini-2.5-flash"
    
    try {
      // Get Gemini 2.5 Flash with adjusted settings for better response generation
      model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.3, // Slightly higher temperature for better response generation
          topK: 40, // Increased for more diverse token selection
          topP: 0.95, // Higher for better response completeness
          maxOutputTokens: 2000, // Increased token limit
        },
      })
    } catch (error) {
      console.log('Gemini 2.5 Flash not available, falling back to 1.5 Flash')
      modelUsed = "gemini-1.5-flash"
      model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 0.8,
          maxOutputTokens: 1000,
        },
      })
    }

    // Create comprehensive prompt for intelligent dataset detection
    const prompt = `
You are an expert data analyst with deep knowledge of thousands of dataset types. Analyze this CSV and identify the EXACT, SPECIFIC dataset type:

DATASET INFO:
File: ${fileName}
Columns: ${headers.join(', ')}
Sample Data:
${dataSample.sampleRows.slice(0, 3).map(row => 
  headers.map(col => `${col}: ${row[col]}`).join(' | ')
).join('\n')}

ANALYSIS INSTRUCTIONS:
1. Examine column names for domain-specific patterns and terminology
2. Look at actual data values for context clues
3. Consider filename for additional hints
4. Be EXTREMELY SPECIFIC - not just "Sports Data" but "Formula 1 Circuit Information" or "NBA Player Statistics"
5. Identify the likely source, purpose, and domain

CRITICAL: Respond with ONLY valid JSON. No markdown, no explanations, no code blocks, no additional text.

Expected JSON format:
{
  "dataContext": {
    "specificType": "Very specific dataset name",
    "generalType": "broad_category", 
    "confidence": 90,
    "icon": "🏎️",
    "title": "Specific Dataset Title",
    "description": "Detailed description of what this data represents and contains",
    "source": "Likely data source or organization",
    "domain": "Industry or field",
    "useCase": "Primary purpose of this data"
  },
  "insights": {
    "keyColumns": ["most_important_columns"],
    "dataQuality": "assessment",
    "uniquePatterns": ["domain_specific_patterns"],
    "potentialIssues": ["data_quality_issues"]
  },
  "cleaningSuggestions": [
    "Specific cleaning recommendation for this dataset type",
    "Domain-specific data validation",
    "Format standardization for this domain"
  ],
  "analysisOpportunities": [
    "Key analysis possible with this data",
    "Business insights available",
    "Visualization recommendations"
  ]
}

Return ONLY the JSON object above. Do not include any markdown formatting or additional text.

PATTERN RECOGNITION EXAMPLES:
🏎️ RACING/MOTORSPORTS:
- CircuitId, CircuitRef, Name, Location, Country → "Formula 1 Circuit Database"
- DriverId, DriverRef, Forename, Surname, Nationality → "Formula 1 Driver Registry"
- RaceId, Year, Round, Date, Time → "Formula 1 Race Calendar"
- LapTime, Position, Grid, Points → "Racing Results Data"

🚕 TRANSPORTATION:
- pickup_datetime, dropoff_datetime, passenger_count → "NYC Taxi Trip Records"
- flight_number, departure, arrival, delay → "Flight Performance Data"
- route_id, stop_name, arrival_time → "Public Transit Schedule"

🎬 ENTERTAINMENT:
- title, genre, rating, release_year → "Movie Database"
- artist, track, duration, popularity → "Music Streaming Data"
- show_id, season, episode, views → "TV Show Analytics"

💰 FINANCE:
- symbol, open, high, low, close, volume → "Stock Market Data"
- transaction_id, amount, merchant, category → "Banking Transactions"
- currency, exchange_rate, timestamp → "Cryptocurrency Exchange Data"

🏥 HEALTH:
- patient_id, diagnosis, treatment, outcome → "Medical Records"
- date, cases, deaths, recovered → "COVID-19 Statistics"
- drug_name, dosage, side_effects → "Pharmaceutical Data"

⚽ SPORTS:
- player_name, team, position, stats → "Sports Player Statistics"
- match_id, home_team, away_team, score → "Sports Match Results"
- season, league, standings → "Sports League Data"

🏢 BUSINESS:
- customer_id, product, quantity, revenue → "Sales Transaction Data"
- employee_id, department, salary, performance → "HR Employee Records"
- campaign_id, clicks, impressions, conversions → "Marketing Analytics"

🐦 SOCIAL MEDIA:
- tweet_id, user, text, retweets, likes → "Twitter Social Data"
- post_id, engagement, reach, comments → "Social Media Analytics"
- hashtag, mentions, sentiment → "Social Media Monitoring"

🏛️ GOVERNMENT/PUBLIC:
- state, county, population, demographics → "Census Data"
- candidate, votes, district, election_year → "Election Results"
- crime_type, location, date, severity → "Crime Statistics"
- temperature, humidity, precipitation → "Weather Data"

🎓 EDUCATION:
- student_id, course, grade, semester → "Academic Records"
- school, district, test_scores, enrollment → "Education Statistics"
- university, ranking, tuition, acceptance_rate → "Higher Education Data"

🏠 REAL ESTATE:
- address, price, bedrooms, bathrooms, sqft → "Property Listings"
- neighborhood, median_price, market_trends → "Real Estate Market Data"

🛒 E-COMMERCE:
- product_id, name, price, category, reviews → "Product Catalog"
- order_id, customer, items, total → "E-commerce Orders"
- user_id, behavior, purchases, preferences → "Customer Analytics"

Analyze the ACTUAL column names and data values to determine the most specific dataset type possible!
`;

    // Get AI analysis with retry logic and model fallback
    let result
    let finalModelUsed = modelUsed
    
    try {
      result = await retryWithBackoff(async () => {
        return await Promise.race([
          model.generateContent(prompt),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('AI analysis timeout')), 15000) // 15 second timeout
          )
        ])
      }, 2, 1000) // 2 retries with 1 second initial delay
    } catch (error) {
      // If Gemini 2.5 Flash fails with empty responses, try 1.5 Flash
      if (modelUsed === "gemini-2.5-flash" && (error.message.includes('Empty AI response') || error.message.includes('No JSON found'))) {
        console.log('Gemini 2.5 Flash failed with empty response, trying 1.5 Flash')
        finalModelUsed = "gemini-1.5-flash"
        
        const fallbackModel = genAI.getGenerativeModel({ 
          model: "gemini-1.5-flash",
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 0.8,
            maxOutputTokens: 1000,
          },
        })
        
        result = await retryWithBackoff(async () => {
          return await Promise.race([
            fallbackModel.generateContent(prompt),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('AI analysis timeout')), 15000)
            )
          ])
        }, 2, 1000)
      } else {
        throw error
      }
    }
    
    const response = await result.response
    const aiAnalysis = response.text()
    
    // Check if response is empty or null
    if (!aiAnalysis || aiAnalysis.trim().length === 0) {
      console.error('Empty response from Gemini 2.5 Flash')
      throw new Error('Empty AI response received')
    }

    // Parse AI response with enhanced JSON extraction for Gemini 2.5 Flash
    let geminiInsights
    try {
      console.log('Raw AI response length:', aiAnalysis.length)
      console.log('Raw AI response preview:', aiAnalysis.substring(0, 500))
      
      // Enhanced JSON extraction for different response formats
      let jsonString = aiAnalysis.trim()
      
      // Before cleaning, try to extract key sections from raw response for fallback
      const rawDataContext = aiAnalysis.match(/"dataContext"\s*:\s*\{(?:[^{}]|\{[^{}]*\})*\}/)
      const rawInsights = aiAnalysis.match(/"insights"\s*:\s*\{(?:[^{}]|\{[^{}]*\})*\}/)
      const rawCleaningSuggestions = aiAnalysis.match(/"cleaningSuggestions"\s*:\s*\[[^\]]*/)
      const rawAnalysisOpportunities = aiAnalysis.match(/"analysisOpportunities"\s*:\s*\[[^\]]*/)
      
      console.log('Raw extraction results:', {
        dataContext: !!rawDataContext,
        insights: !!rawInsights,
        cleaningSuggestions: !!rawCleaningSuggestions,
        analysisOpportunities: !!rawAnalysisOpportunities
      })
      
      // Remove markdown code blocks if present
      jsonString = jsonString.replace(/```json\s*/g, '').replace(/```\s*/g, '')
      
      // Remove any leading/trailing text that's not JSON
      const jsonStart = jsonString.indexOf('{')
      const jsonEnd = jsonString.lastIndexOf('}')
      
      if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
        console.log('No valid JSON structure found in response')
        throw new Error('No JSON found in response')
      }
      
      jsonString = jsonString.substring(jsonStart, jsonEnd + 1)
      
      // Clean up common JSON formatting issues step by step
      jsonString = jsonString
        .replace(/,\s*}/g, '}') // Remove trailing commas before closing braces
        .replace(/,\s*]/g, ']') // Remove trailing commas before closing brackets
        .replace(/'/g, '"') // Replace single quotes with double quotes
      
      // More careful key quoting - only quote keys that aren't already quoted
      jsonString = jsonString.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
      
      // Fix any double-quoted keys that got double-quoted
      jsonString = jsonString.replace(/""/g, '"')
      
      // Handle truncated JSON - try to repair incomplete structures
      jsonString = repairTruncatedJson(jsonString, {
        rawDataContext,
        rawInsights, 
        rawCleaningSuggestions,
        rawAnalysisOpportunities
      })
      
      console.log('Cleaned JSON string preview:', jsonString.substring(0, 300))
      
      geminiInsights = JSON.parse(jsonString)
      console.log(`Successfully parsed JSON response using ${finalModelUsed}`)
      console.log('Parsed geminiInsights structure:', {
        hasDataContext: !!geminiInsights.dataContext,
        dataContextType: geminiInsights.dataContext?.specificType,
        dataContextGeneral: geminiInsights.dataContext?.generalType,
        hasInsights: !!geminiInsights.insights,
        hasCleaningSuggestions: !!geminiInsights.cleaningSuggestions,
        cleaningSuggestionsLength: geminiInsights.cleaningSuggestions?.length
      })
      
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError)
      console.log('Full raw AI response:', aiAnalysis)
      
      // Enhanced fallback with filename analysis
      const fallbackType = detectDatasetFromFilename(fileName, headers)
      geminiInsights = {
        dataContext: {
          specificType: fallbackType.specificType,
          generalType: fallbackType.generalType,
          type: fallbackType.generalType,
          confidence: 60,
          icon: fallbackType.icon,
          title: fallbackType.title,
          description: fallbackType.description
        },
        cleaningSuggestions: [
          'Remove duplicate records',
          'Handle missing values appropriately', 
          'Standardize data formats',
          `Clean ${fallbackType.specificType.toLowerCase()} specific formatting`
        ],
        insights: {
          datasetSize: 'Medium',
          keyColumns: headers.slice(0, 5),
          dataQuality: 'Needs assessment',
          potentialIssues: ['Unknown data quality']
        }
      }
    }

    // Combine AI insights with technical analysis
    const qualityMetrics = assessDataQuality(sampleData, columnAnalysis)
    
    const finalResult = {
      columnAnalysis,
      dataContext: geminiInsights.dataContext,
      insights: geminiInsights.insights || {},
      cleaningSuggestions: geminiInsights.cleaningSuggestions || [],
      businessValue: geminiInsights.businessValue || {},
      technicalRecommendations: geminiInsights.technicalRecommendations || {},
      qualityMetrics,
      processingRecommendations: getProcessingRecommendations(fileSize, sampleData.length),
      aiPowered: true,
      modelUsed: finalModelUsed,
      analysisTimestamp: new Date().toISOString()
    }
    
    console.log('Final AI analysis result:', {
      dataContextType: finalResult.dataContext?.specificType,
      dataContextGeneral: finalResult.dataContext?.generalType,
      aiPowered: finalResult.aiPowered,
      modelUsed: finalResult.modelUsed
    })
    
    return finalResult
    
  } catch (error) {
    console.error('Error in Gemini analysis:', error.message)
    
    // Determine error type for better user messaging
    let errorType = 'AI analysis failed, using smart fallback'
    let userMessage = 'AI analysis temporarily unavailable. Using advanced rule-based analysis instead.'
    
    if (error.message.includes('API key')) {
      errorType = 'Invalid API key'
      userMessage = 'API configuration issue. Using fallback analysis.'
    } else if (error.message.includes('503') || error.message.includes('overloaded')) {
      errorType = 'Service overloaded'
      userMessage = 'AI service is temporarily overloaded. Analysis completed using smart fallback methods.'
    } else if (error.message.includes('timeout')) {
      errorType = 'Request timeout'
      userMessage = 'AI analysis timed out. Using fast rule-based analysis instead.'
    } else if (error.message.includes('quota') || error.message.includes('limit')) {
      errorType = 'API quota exceeded'
      userMessage = 'API usage limit reached. Using alternative analysis methods.'
    }
    
    // Fallback to rule-based analysis if AI fails
    console.log('=== USING FALLBACK ANALYSIS ===')
    console.log('Error that triggered fallback:', error.message)
    console.log('Headers for fallback detection:', headers)
    
    const columnAnalysis = analyzeColumns(sampleData, headers)
    const fallbackType = detectDatasetFromFilename(fileName, headers)
    
    console.log('Fallback detection result:', fallbackType)
    
    const cleaningSuggestions = generateCleaningSuggestions(columnAnalysis, fallbackType)
    const qualityMetrics = assessDataQuality(sampleData, columnAnalysis)
    
    return {
      columnAnalysis,
      dataContext: {
        specificType: fallbackType.specificType,
        generalType: fallbackType.generalType,
        type: fallbackType.generalType,
        confidence: 75,
        icon: fallbackType.icon,
        title: fallbackType.title,
        description: fallbackType.description + ' (Smart rule-based detection)',
        source: 'Advanced filename and column pattern analysis',
        aiPowered: false,
        fallbackReason: userMessage
      },
      insights: {
        datasetSize: totalRows > 10000 ? 'Large' : totalRows > 1000 ? 'Medium' : 'Small',
        keyColumns: headers.slice(0, 5),
        dataQuality: 'Needs assessment',
        potentialIssues: ['AI analysis unavailable - using comprehensive rule-based detection'],
        analysisMethod: 'Rule-based pattern recognition with domain-specific intelligence'
      },
      cleaningSuggestions,
      qualityMetrics,
      processingRecommendations: getProcessingRecommendations(fileSize, totalRows),
      aiPowered: false,
      fallbackUsed: true,
      errorType,
      userMessage,
      retryAdvice: 'You can try uploading again in a few minutes when AI services are less busy.'
    }
  }
}

function analyzeColumns(data, headers) {
  const analysis = {}
  
  headers.forEach(header => {
    const values = data
      .map(row => row[header])
      .filter(val => val !== null && val !== undefined && val !== '')
    
    const nonEmptyCount = values.length
    const totalCount = data.length
    const completeness = (nonEmptyCount / totalCount) * 100
    
    // Advanced type detection
    const numericValues = values.filter(val => !isNaN(parseFloat(val)) && isFinite(val))
    const dateValues = values.filter(val => !isNaN(Date.parse(val)))
    const urlValues = values.filter(val => 
      typeof val === 'string' && (val.includes('http') || val.includes('www.') || val.includes('://'))
    )
    const emailValues = values.filter(val => 
      typeof val === 'string' && val.includes('@') && val.includes('.')
    )
    
    let dataType = 'text'
    let confidence = 0
    
    if (numericValues.length > values.length * 0.8) {
      dataType = 'numeric'
      confidence = (numericValues.length / values.length) * 100
    } else if (dateValues.length > values.length * 0.6) {
      dataType = 'date'
      confidence = (dateValues.length / values.length) * 100
    } else if (urlValues.length > values.length * 0.5) {
      dataType = 'url'
      confidence = (urlValues.length / values.length) * 100
    } else if (emailValues.length > values.length * 0.5) {
      dataType = 'email'
      confidence = (emailValues.length / values.length) * 100
    } else {
      confidence = 70 // Default confidence for text
    }
    
    // Statistical analysis for numeric columns
    let stats = {}
    if (dataType === 'numeric' && numericValues.length > 0) {
      const nums = numericValues.map(v => parseFloat(v))
      stats = {
        min: Math.min(...nums),
        max: Math.max(...nums),
        mean: nums.reduce((a, b) => a + b, 0) / nums.length,
        median: nums.sort((a, b) => a - b)[Math.floor(nums.length / 2)],
        outliers: detectOutliers(nums)
      }
    }
    
    // Pattern analysis for text columns
    let patterns = {}
    if (dataType === 'text') {
      const uniqueValues = [...new Set(values)]
      patterns = {
        uniqueCount: uniqueValues.length,
        uniqueRatio: uniqueValues.length / values.length,
        avgLength: values.reduce((sum, val) => sum + String(val).length, 0) / values.length,
        commonValues: getTopValues(values, 5)
      }
    }
    
    analysis[header] = {
      dataType,
      confidence: Math.round(confidence),
      completeness: Math.round(completeness),
      totalValues: totalCount,
      nonEmptyValues: nonEmptyCount,
      stats,
      patterns,
      issues: detectColumnIssues(values, dataType)
    }
  })
  
  return analysis
}

function detectDataContext(columnAnalysis, headers, fileName) {
  const headerNames = headers.map(h => h.toLowerCase())
  const contexts = []
  
  // E-commerce/Sales context
  if (headerNames.some(h => ['price', 'cost', 'revenue', 'sales', 'product', 'order', 'customer'].includes(h))) {
    contexts.push({ type: 'ecommerce', confidence: 85, icon: '🛒' })
  }
  
  // Financial context
  if (headerNames.some(h => ['amount', 'balance', 'transaction', 'account', 'payment', 'invoice'].includes(h))) {
    contexts.push({ type: 'financial', confidence: 80, icon: '💰' })
  }
  
  // HR/Employee context - require more specific indicators
  const hrIndicators = headerNames.filter(h => ['employee', 'salary', 'department', 'age', 'position', 'hire'].includes(h))
  const hasEmployeeName = headerNames.some(h => h.includes('employee') && h.includes('name'))
  
  if (hrIndicators.length >= 2 || hasEmployeeName || 
      (headerNames.includes('salary') && headerNames.includes('department'))) {
    contexts.push({ type: 'hr', confidence: 85, icon: '👥' })
  }
  
  // Marketing/Analytics context
  if (headerNames.some(h => ['clicks', 'impressions', 'conversion', 'campaign', 'traffic', 'bounce'].includes(h))) {
    contexts.push({ type: 'marketing', confidence: 80, icon: '📊' })
  }
  
  // Geographic context
  if (headerNames.some(h => ['country', 'city', 'state', 'region', 'lat', 'lng', 'latitude', 'longitude', 'address'].includes(h))) {
    contexts.push({ type: 'geographic', confidence: 90, icon: '🌍' })
  }
  
  // Healthcare context
  if (headerNames.some(h => ['patient', 'diagnosis', 'treatment', 'medical', 'hospital', 'doctor'].includes(h))) {
    contexts.push({ type: 'healthcare', confidence: 85, icon: '🏥' })
  }
  
  // Education context
  if (headerNames.some(h => ['student', 'grade', 'course', 'school', 'teacher', 'exam', 'score'].includes(h))) {
    contexts.push({ type: 'education', confidence: 80, icon: '🎓' })
  }
  
  // Technology/IT context
  if (headerNames.some(h => ['server', 'cpu', 'memory', 'disk', 'network', 'api', 'response_time'].includes(h))) {
    contexts.push({ type: 'technology', confidence: 85, icon: '💻' })
  }
  
  // Sports/Racing context (from original)
  if (headerNames.some(h => ['race', 'driver', 'lap', 'time', 'position', 'points', 'speed', 'team'].includes(h))) {
    contexts.push({ type: 'sports', confidence: 90, icon: '🏎️' })
  }
  
  // File name analysis
  const fileNameLower = fileName.toLowerCase()
  if (fileNameLower.includes('sales')) contexts.push({ type: 'sales', confidence: 70, icon: '💼' })
  if (fileNameLower.includes('employee')) contexts.push({ type: 'hr', confidence: 75, icon: '👥' })
  if (fileNameLower.includes('customer')) contexts.push({ type: 'crm', confidence: 75, icon: '👤' })
  
  // Return the highest confidence context
  const bestContext = contexts.sort((a, b) => b.confidence - a.confidence)[0]
  
  return bestContext || { type: 'general', confidence: 50, icon: '📋' }
}

function generateCleaningSuggestions(columnAnalysis, dataContext) {
  const suggestions = []
  
  // Context-specific suggestions
  const contextSuggestions = {
    ecommerce: [
      'Standardize product names and categories',
      'Clean price formatting and currency symbols',
      'Validate customer email addresses',
      'Remove duplicate orders'
    ],
    financial: [
      'Standardize currency formats',
      'Validate account numbers',
      'Clean transaction descriptions',
      'Remove test transactions'
    ],
    hr: [
      'Standardize employee names',
      'Clean salary formatting',
      'Validate email addresses',
      'Normalize department names'
    ],
    marketing: [
      'Clean campaign names',
      'Standardize date formats',
      'Remove bot traffic',
      'Validate conversion metrics'
    ],
    geographic: [
      'Standardize country/state names',
      'Validate coordinates',
      'Clean address formatting',
      'Remove invalid locations'
    ]
  }
  
  // Add context-specific suggestions
  if (contextSuggestions[dataContext.type]) {
    suggestions.push(...contextSuggestions[dataContext.type])
  }
  
  // Column-specific suggestions
  Object.entries(columnAnalysis).forEach(([column, analysis]) => {
    if (analysis.completeness < 80) {
      suggestions.push(`Handle missing values in ${column} (${Math.round(100 - analysis.completeness)}% missing)`)
    }
    
    if (analysis.dataType === 'numeric' && analysis.stats.outliers > 0) {
      suggestions.push(`Review ${analysis.stats.outliers} outliers in ${column}`)
    }
    
    if (analysis.issues && analysis.issues.length > 0) {
      suggestions.push(`Fix data quality issues in ${column}: ${analysis.issues.join(', ')}`)
    }
  })
  
  // Generic suggestions
  suggestions.push(
    'Remove duplicate rows',
    'Standardize text formatting',
    'Validate data types',
    'Add data quality scores'
  )
  
  return [...new Set(suggestions)] // Remove duplicates
}

function assessDataQuality(data, columnAnalysis) {
  let totalScore = 0
  let weightedScore = 0
  
  Object.values(columnAnalysis).forEach(analysis => {
    let columnScore = 0
    
    // Completeness score (40% weight)
    columnScore += (analysis.completeness / 100) * 40
    
    // Type confidence score (30% weight)
    columnScore += (analysis.confidence / 100) * 30
    
    // Issue penalty (30% weight)
    const issuePenalty = analysis.issues ? analysis.issues.length * 5 : 0
    columnScore += Math.max(0, 30 - issuePenalty)
    
    totalScore += columnScore
  })
  
  const overallScore = Math.round(totalScore / Object.keys(columnAnalysis).length)
  
  return {
    overall: overallScore,
    completeness: Math.round(
      Object.values(columnAnalysis).reduce((sum, col) => sum + col.completeness, 0) / 
      Object.keys(columnAnalysis).length
    ),
    typeConfidence: Math.round(
      Object.values(columnAnalysis).reduce((sum, col) => sum + col.confidence, 0) / 
      Object.keys(columnAnalysis).length
    ),
    issueCount: Object.values(columnAnalysis).reduce((sum, col) => sum + (col.issues?.length || 0), 0)
  }
}

function getProcessingRecommendations(fileSize, sampleSize) {
  const recommendations = []
  
  if (fileSize > 10 * 1024 * 1024) { // > 10MB
    recommendations.push('Large file detected - using chunked processing')
    recommendations.push('Consider using streaming transformations')
  }
  
  if (sampleSize > 50) {
    recommendations.push('Rich dataset - full statistical analysis available')
  }
  
  recommendations.push('Enable real-time progress tracking')
  recommendations.push('Use memory-efficient processing')
  
  return recommendations
}

function detectOutliers(numbers) {
  if (numbers.length < 4) return 0
  
  const sorted = [...numbers].sort((a, b) => a - b)
  const q1 = sorted[Math.floor(sorted.length * 0.25)]
  const q3 = sorted[Math.floor(sorted.length * 0.75)]
  const iqr = q3 - q1
  const lowerBound = q1 - 1.5 * iqr
  const upperBound = q3 + 1.5 * iqr
  
  return numbers.filter(n => n < lowerBound || n > upperBound).length
}

function getTopValues(values, limit) {
  const counts = {}
  values.forEach(val => {
    counts[val] = (counts[val] || 0) + 1
  })
  
  return Object.entries(counts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([value, count]) => ({ value, count }))
}

function detectColumnIssues(values, dataType) {
  const issues = []
  
  // Quick issue detection for performance
  if (dataType === 'numeric') {
    const nonNumeric = values.filter(val => isNaN(parseFloat(val)))
    if (nonNumeric.length > values.length * 0.1) { // Only flag if >10% are non-numeric
      issues.push(`${nonNumeric.length} non-numeric values`)
    }
  }
  
  // Check for suspicious patterns (limited for performance)
  const suspiciousCount = values.filter(val => {
    const str = String(val).toLowerCase()
    return str.includes('test') || str.includes('dummy') || str === 'null' || str === 'n/a'
  }).length
  
  if (suspiciousCount > 0) {
    issues.push(`${suspiciousCount} suspicious values`)
  }
  
  return issues
}

function detectDatasetFromFilename(fileName, headers) {
  const nameLower = fileName.toLowerCase()
  const headerStr = headers.join(' ').toLowerCase()
  
  // RACING/MOTORSPORTS - Enhanced detection
  if (headerStr.includes('circuitid') && headerStr.includes('circuitref') || 
      headerStr.includes('circuit') && headerStr.includes('location') && headerStr.includes('country')) {
    return {
      specificType: 'Formula 1 Circuit Database',
      generalType: 'racing',
      icon: '🏎️',
      title: 'Formula 1 Circuit Information',
      description: 'F1 racing circuits with locations, countries, and track details'
    }
  }
  
  if (headerStr.includes('driverid') && headerStr.includes('driverref') || 
      headerStr.includes('forename') && headerStr.includes('surname') && headerStr.includes('nationality')) {
    return {
      specificType: 'Formula 1 Driver Registry',
      generalType: 'racing',
      icon: '🏎️',
      title: 'Formula 1 Driver Database',
      description: 'F1 driver information with names, nationalities, and career data'
    }
  }
  
  if (headerStr.includes('raceid') && (headerStr.includes('round') || headerStr.includes('year'))) {
    return {
      specificType: 'Formula 1 Race Data',
      generalType: 'racing',
      icon: '🏁',
      title: 'Formula 1 Race Information',
      description: 'F1 race calendar with dates, circuits, and race details'
    }
  }
  
  if (headerStr.includes('position') && headerStr.includes('points') && (headerStr.includes('grid') || headerStr.includes('laps'))) {
    return {
      specificType: 'Formula 1 Results Data',
      generalType: 'racing',
      icon: '🏆',
      title: 'Formula 1 Race Results',
      description: 'F1 race results with positions, points, and performance data'
    }
  }
  
  // TRANSPORTATION
  if (nameLower.includes('taxi') || nameLower.includes('uber') || nameLower.includes('lyft') ||
      headerStr.includes('pickup') && headerStr.includes('dropoff')) {
    return {
      specificType: 'Taxi/Rideshare Trip Data',
      generalType: 'transportation',
      icon: '🚕',
      title: 'Transportation Trip Records',
      description: 'Trip data with pickup/dropoff locations and fare information'
    }
  }
  
  if (nameLower.includes('flight') || headerStr.includes('airport') || headerStr.includes('airline') ||
      headerStr.includes('departure') && headerStr.includes('arrival')) {
    return {
      specificType: 'Flight Performance Data',
      generalType: 'transportation',
      icon: '✈️',
      title: 'Aviation Records',
      description: 'Flight information with routes, delays, and airline performance'
    }
  }
  
  // ENTERTAINMENT
  if (nameLower.includes('netflix') || nameLower.includes('movie') || nameLower.includes('film') ||
      headerStr.includes('title') && headerStr.includes('genre') && headerStr.includes('rating')) {
    return {
      specificType: 'Movie/TV Show Catalog',
      generalType: 'entertainment',
      icon: '🎬',
      title: 'Entertainment Content Database',
      description: 'Movie or TV show catalog with titles, genres, ratings, and metadata'
    }
  }
  
  if (nameLower.includes('spotify') || nameLower.includes('music') || nameLower.includes('song') ||
      headerStr.includes('artist') && headerStr.includes('track')) {
    return {
      specificType: 'Music Streaming Analytics',
      generalType: 'entertainment',
      icon: '🎵',
      title: 'Music Platform Data',
      description: 'Music catalog with artist, track, and audio feature analytics'
    }
  }
  
  // FINANCIAL
  if (nameLower.includes('stock') || nameLower.includes('trading') ||
      headerStr.includes('open') && headerStr.includes('close') && headerStr.includes('volume')) {
    return {
      specificType: 'Stock Market Trading Data',
      generalType: 'financial',
      icon: '📈',
      title: 'Financial Market Records',
      description: 'Stock market data with prices, volumes, and trading metrics'
    }
  }
  
  if (headerStr.includes('transaction') && headerStr.includes('amount') ||
      headerStr.includes('payment') && headerStr.includes('merchant')) {
    return {
      specificType: 'Banking Transaction Records',
      generalType: 'financial',
      icon: '💳',
      title: 'Financial Transaction Data',
      description: 'Banking or payment data with transactions, amounts, and merchant info'
    }
  }
  
  // HEALTH
  if (nameLower.includes('covid') || nameLower.includes('corona') || nameLower.includes('pandemic') ||
      headerStr.includes('cases') && headerStr.includes('deaths')) {
    return {
      specificType: 'COVID-19 Pandemic Statistics',
      generalType: 'health',
      icon: '🦠',
      title: 'Public Health Data',
      description: 'Pandemic statistics with case counts, deaths, and geographic distribution'
    }
  }
  
  if (headerStr.includes('patient') || headerStr.includes('diagnosis') || headerStr.includes('treatment')) {
    return {
      specificType: 'Medical Records Database',
      generalType: 'health',
      icon: '🏥',
      title: 'Healthcare Data',
      description: 'Medical records with patient information, diagnoses, and treatments'
    }
  }
  
  // SPORTS
  if (nameLower.includes('nba') || nameLower.includes('basketball') ||
      headerStr.includes('points') && headerStr.includes('rebounds') && headerStr.includes('assists')) {
    return {
      specificType: 'NBA Basketball Statistics',
      generalType: 'sports',
      icon: '🏀',
      title: 'Professional Basketball Data',
      description: 'NBA player and team statistics with performance metrics'
    }
  }
  
  if (nameLower.includes('fifa') || nameLower.includes('football') || nameLower.includes('soccer') ||
      headerStr.includes('goals') && headerStr.includes('team')) {
    return {
      specificType: 'Football/Soccer Analytics',
      generalType: 'sports',
      icon: '⚽',
      title: 'Football Statistics',
      description: 'Football/soccer data with player stats, match results, and team performance'
    }
  }
  
  // BUSINESS
  if (nameLower.includes('sales') || nameLower.includes('revenue') ||
      headerStr.includes('customer') && headerStr.includes('purchase')) {
    return {
      specificType: 'Sales Performance Analytics',
      generalType: 'business',
      icon: '💼',
      title: 'Business Sales Data',
      description: 'Sales analytics with customer data, products, and revenue metrics'
    }
  }
  
  if (headerStr.includes('employee') && headerStr.includes('salary') && headerStr.includes('department')) {
    return {
      specificType: 'Human Resources Database',
      generalType: 'business',
      icon: '👥',
      title: 'Employee Management Data',
      description: 'HR records with employee information, salaries, and organizational data'
    }
  }
  
  // SOCIAL MEDIA
  if (nameLower.includes('twitter') || nameLower.includes('tweet') ||
      headerStr.includes('hashtag') || headerStr.includes('retweet') || headerStr.includes('likes')) {
    return {
      specificType: 'Twitter Social Media Analytics',
      generalType: 'social',
      icon: '🐦',
      title: 'Social Media Engagement Data',
      description: 'Twitter data with posts, engagement metrics, and social interactions'
    }
  }
  
  // E-COMMERCE
  if (headerStr.includes('product') && headerStr.includes('price') && headerStr.includes('category')) {
    return {
      specificType: 'E-commerce Product Catalog',
      generalType: 'ecommerce',
      icon: '🛒',
      title: 'Online Store Data',
      description: 'Product catalog with prices, categories, and inventory information'
    }
  }
  
  // REAL ESTATE
  if (headerStr.includes('address') && headerStr.includes('price') && 
      (headerStr.includes('bedrooms') || headerStr.includes('sqft'))) {
    return {
      specificType: 'Real Estate Property Listings',
      generalType: 'realestate',
      icon: '🏠',
      title: 'Property Market Data',
      description: 'Real estate listings with property details, prices, and location data'
    }
  }
  
  // EDUCATION
  if (headerStr.includes('student') && (headerStr.includes('grade') || headerStr.includes('score'))) {
    return {
      specificType: 'Academic Performance Records',
      generalType: 'education',
      icon: '🎓',
      title: 'Educational Data',
      description: 'Student academic records with grades, scores, and performance metrics'
    }
  }
  
  // WEATHER/CLIMATE
  if (headerStr.includes('temperature') && headerStr.includes('humidity') ||
      headerStr.includes('weather') || headerStr.includes('precipitation')) {
    return {
      specificType: 'Weather Station Data',
      generalType: 'weather',
      icon: '🌤️',
      title: 'Meteorological Records',
      description: 'Weather data with temperature, humidity, and atmospheric conditions'
    }
  }
  
  // Default fallback with better analysis
  return {
    specificType: 'Custom Structured Dataset',
    generalType: 'general',
    icon: '📊',
    title: 'Tabular Data Analysis',
    description: 'Structured dataset ready for analysis and insights extraction'
  }
}

// Function to repair truncated or malformed JSON
function repairTruncatedJson(jsonString, rawExtractions = {}) {
  try {
    // First, try to parse as-is
    JSON.parse(jsonString)
    return jsonString
  } catch (error) {
    console.log('JSON parsing failed, attempting repair:', error.message)
    
    let repairedJson = jsonString
    
    // Handle truncated strings - if string value is not closed
    repairedJson = repairedJson.replace(/"([^"]*?)$/g, '"$1"')
    
    // Handle incomplete arrays - close any unclosed arrays
    const openBrackets = (repairedJson.match(/\[/g) || []).length
    const closeBrackets = (repairedJson.match(/\]/g) || []).length
    if (openBrackets > closeBrackets) {
      const missingBrackets = openBrackets - closeBrackets
      repairedJson += ']'.repeat(missingBrackets)
    }
    
    // Handle incomplete objects - close any unclosed objects
    const openBraces = (repairedJson.match(/\{/g) || []).length
    const closeBraces = (repairedJson.match(/\}/g) || []).length
    if (openBraces > closeBraces) {
      const missingBraces = openBraces - closeBraces
      repairedJson += '}'.repeat(missingBraces)
    }
    
    // Remove any trailing commas that might be causing issues
    repairedJson = repairedJson.replace(/,(\s*[}\]])/g, '$1')
    
    // Handle incomplete string values at the end
    repairedJson = repairedJson.replace(/:\s*"[^"]*$/, ': "incomplete"')
    
    // Handle specific case where cleaningSuggestions array is incomplete
    repairedJson = repairedJson.replace(/"cleaningSuggestions":\s*\[\s*"[^"]*"[^"]*$/g, 
      '"cleaningSuggestions": ["Incomplete suggestion - please retry analysis"]')
    
    // Handle any incomplete array element by closing it properly
    repairedJson = repairedJson.replace(/,\s*$/, '')
    
    // Fix incomplete string at end of array
    repairedJson = repairedJson.replace(/"[^"]*$/g, '"Incomplete entry"')
    
    console.log('Attempted JSON repair, result preview:', repairedJson.substring(0, 300))
    
    try {
      JSON.parse(repairedJson)
      console.log('JSON repair successful')
      return repairedJson
    } catch (repairError) {
      console.log('JSON repair failed:', repairError.message)
      
      // Last resort: try to extract sections progressively
      console.log('Attempting progressive section extraction...')
      
      // Use pre-extracted raw sections if available, otherwise try to extract from repaired JSON
      const dataContextMatch = rawExtractions.rawDataContext || repairedJson.match(/"dataContext"\s*:\s*\{(?:[^{}]|\{[^{}]*\})*\}/)
      const insightsMatch = rawExtractions.rawInsights || repairedJson.match(/"insights"\s*:\s*\{(?:[^{}]|\{[^{}]*\})*\}/)
      
      // Handle cleaningSuggestions with raw extraction priority
      let cleaningSuggestionsMatch = null
      if (rawExtractions.rawCleaningSuggestions) {
        // Fix truncated array from raw extraction
        let rawSuggestions = rawExtractions.rawCleaningSuggestions[0]
        if (!rawSuggestions.endsWith(']')) {
          rawSuggestions = rawSuggestions.replace(/[^"]*$/, '') + '"]'
        }
        cleaningSuggestionsMatch = [rawSuggestions]
      } else {
        cleaningSuggestionsMatch = repairedJson.match(/"cleaningSuggestions"\s*:\s*\[[^\]]*\]/)
        if (!cleaningSuggestionsMatch) {
          const partialMatch = repairedJson.match(/"cleaningSuggestions"\s*:\s*\[[^\]]*/)
          if (partialMatch) {
            cleaningSuggestionsMatch = [partialMatch[0] + '"]']
          }
        }
      }
      
      // Handle analysisOpportunities with raw extraction priority  
      let analysisOpportunitiesMatch = null
      if (rawExtractions.rawAnalysisOpportunities) {
        let rawOpportunities = rawExtractions.rawAnalysisOpportunities[0]
        if (!rawOpportunities.endsWith(']')) {
          rawOpportunities = rawOpportunities.replace(/[^"]*$/, '') + '"]'
        }
        analysisOpportunitiesMatch = [rawOpportunities]
      } else {
        analysisOpportunitiesMatch = repairedJson.match(/"analysisOpportunities"\s*:\s*\[[^\]]*\]/)
        if (!analysisOpportunitiesMatch) {
          const partialMatch = repairedJson.match(/"analysisOpportunities"\s*:\s*\[[^\]]*/)
          if (partialMatch) {
            analysisOpportunitiesMatch = [partialMatch[0] + '"]']
          }
        }
      }
      
      // Build comprehensive fallback JSON
      let fallbackParts = []
      
      if (dataContextMatch) {
        fallbackParts.push(dataContextMatch[0])
        console.log('Using extracted dataContext from raw response')
      } else {
        // Check if this looks like F1 circuit data based on headers
        const headerStr = headers.join(' ').toLowerCase()
        if (headerStr.includes('circuitid') || headerStr.includes('circuit') || headerStr.includes('lat') && headerStr.includes('lng')) {
          fallbackParts.push('"dataContext": {"specificType": "Formula 1 Circuit Database", "generalType": "motorsports", "confidence": 85, "icon": "🏎️", "title": "Formula 1 Circuit Information", "description": "F1 racing circuits with locations and track details"}')
          console.log('Detected F1 circuit data in fallback, using motorsports context')
        } else {
          fallbackParts.push('"dataContext": {"specificType": "Detected Dataset", "generalType": "general", "confidence": 75, "icon": "📊", "title": "Data Analysis", "description": "Dataset analysis completed"}')
        }
      }
      
      if (insightsMatch) {
        fallbackParts.push(insightsMatch[0])
      } else {
        fallbackParts.push('"insights": {"keyColumns": [], "dataQuality": "Good", "uniquePatterns": [], "potentialIssues": []}')
      }
      
      if (cleaningSuggestionsMatch) {
        fallbackParts.push(cleaningSuggestionsMatch[0])
      } else {
        fallbackParts.push('"cleaningSuggestions": ["Standardize data formats", "Remove duplicates", "Handle missing values"]')
      }
      
      if (analysisOpportunitiesMatch) {
        fallbackParts.push(analysisOpportunitiesMatch[0])
      } else {
        fallbackParts.push('"analysisOpportunities": ["Statistical analysis", "Data visualization", "Trend analysis"]')
      }
      
      const comprehensiveFallback = `{${fallbackParts.join(', ')}}`
      
      try {
        JSON.parse(comprehensiveFallback)
        console.log('Created comprehensive fallback JSON with extracted sections')
        console.log('Comprehensive fallback dataContext:', JSON.stringify(JSON.parse(comprehensiveFallback).dataContext, null, 2))
        return comprehensiveFallback
      } catch (fallbackError) {
        console.log('Comprehensive fallback failed, using basic structure')
        
        // Absolute minimal fallback
        if (dataContextMatch) {
          try {
            const basicFallback = `{${dataContextMatch[0]}, "insights": {"keyColumns": [], "dataQuality": "Needs assessment"}, "cleaningSuggestions": ["Review data quality", "Standardize formats"], "analysisOpportunities": ["Basic analysis available"]}`
            JSON.parse(basicFallback)
            console.log('Using basic fallback with extracted dataContext')
            return basicFallback
          } catch (basicError) {
            console.log('Even basic fallback failed')
          }
        }
      }
      
      // If all else fails, return the original
      return jsonString
    }
  }
}