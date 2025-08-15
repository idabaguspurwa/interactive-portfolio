import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

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
    const { csvData, dataContext, cleaningStrategy, chunkSize = 1000 } = await request.json()
    
    const lines = csvData.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const dataLines = lines.slice(1)
    
    // Get AI-powered cleaning instructions
    const cleaningInstructions = await getAICleaningInstructions(
      headers, 
      dataLines.slice(0, 10), // Sample for AI analysis
      dataContext,
      cleaningStrategy
    )
    
    // Process in chunks with AI guidance
    const chunks = []
    for (let i = 0; i < dataLines.length; i += chunkSize) {
      chunks.push(dataLines.slice(i, i + chunkSize))
    }
    
    let processedData = []
    let processedChunks = 0
    let cleaningStats = {
      originalRows: dataLines.length,
      processedRows: 0,
      removedRows: 0,
      cleanedValues: 0,
      issuesFixed: []
    }
    
    // Process each chunk with AI-guided cleaning
    for (const chunk of chunks) {
      const chunkData = chunk.map((line, index) => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
        const row = { id: processedChunks * chunkSize + index + 1 }
        
        headers.forEach((header, i) => {
          if (header && values[i] !== undefined) {
            const value = values[i]
            if (value && !isNaN(value) && !isNaN(parseFloat(value))) {
              row[header] = parseFloat(value)
            } else {
              row[header] = value || ''
            }
          }
        })
        return row
      })
      
      // Apply AI-guided cleaning to chunk
      const cleanedChunk = await applyAICleaningToChunk(chunkData, cleaningInstructions, headers)
      
      // Update stats
      cleaningStats.cleanedValues += cleanedChunk.cleanedValues || 0
      cleaningStats.issuesFixed.push(...(cleanedChunk.issuesFixed || []))
      
      processedData = processedData.concat(cleanedChunk.data)
      processedChunks++
      
      // Yield control to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 0))
    }
    
    cleaningStats.processedRows = processedData.length
    cleaningStats.removedRows = cleaningStats.originalRows - cleaningStats.processedRows
    
    return NextResponse.json({
      success: true,
      data: processedData,
      cleaningStats,
      aiInstructions: cleaningInstructions,
      chunksProcessed: processedChunks
    })
    
  } catch (error) {
    console.error('Error in AI cleaning:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Failed to clean CSV with AI'
    let statusCode = 500
    
    if (error.message.includes('503') || error.message.includes('overloaded')) {
      errorMessage = 'AI cleaning service is temporarily overloaded. Please try again in a few minutes.'
      statusCode = 503
    } else if (error.message.includes('timeout')) {
      errorMessage = 'AI cleaning timed out. Please try with a smaller file or retry later.'
      statusCode = 408
    } else if (error.message.includes('JSON')) {
      errorMessage = 'Invalid request format. Please ensure the CSV data is properly formatted.'
      statusCode = 400
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        retryAdvice: 'You can try the basic cleaning option or retry in a few minutes when AI services are less busy.'
      },
      { status: statusCode }
    )
  }
}

async function getAICleaningInstructions(headers, sampleData, dataContext, strategy) {
  try {
    // Try Gemini 2.5 Flash first, fallback to 1.5 Flash if needed
    let model
    let modelUsed = "gemini-2.5-flash"
    
    try {
      model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2000,
        },
      })
    } catch (error) {
      console.log('Gemini 2.5 Flash not available for cleaning, using 1.5 Flash')
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
    
    const prompt = `
You are an expert data cleaning specialist. Create specific cleaning instructions for this dataset:

DATASET CONTEXT:
- Type: ${dataContext.type}
- Industry: ${dataContext.industry || 'Unknown'}
- Use Case: ${dataContext.useCase || 'General analysis'}

COLUMNS: ${headers.join(', ')}

SAMPLE DATA:
${sampleData.slice(0, 5).map(line => line.split(',').join(' | ')).join('\n')}

CLEANING STRATEGY: ${strategy}

CRITICAL: Respond with ONLY valid JSON. No markdown, no explanations, no code blocks, no additional text.

Expected JSON format:
{
  "columnRules": {
    "column_name": {
      "dataType": "text",
      "cleaningActions": ["remove_duplicates", "standardize_format"],
      "validationRules": ["check_format", "validate_range"],
      "transformations": ["trim_whitespace", "title_case"]
    }
  },
  "globalRules": {
    "duplicateHandling": "remove",
    "missingValueStrategy": "impute",
    "outlierHandling": "flag",
    "textNormalization": "title_case"
  },
  "businessLogic": {
    "industrySpecificRules": ["preserve_urls", "validate_emails"],
    "dataIntegrityChecks": ["check_completeness", "validate_types"],
    "qualityThresholds": {
      "minimumCompleteness": 80,
      "maximumOutliers": 5
    }
  },
  "processingNotes": ["Focus on ${dataContext.type} data patterns", "Preserve business value"]
}

Return ONLY the JSON object above, customized for ${dataContext.type} data. Do not include any markdown formatting or additional text.
`;

    // Get AI response with retry logic and model fallback
    let result
    let finalModelUsed = modelUsed
    
    try {
      result = await retryWithBackoff(async () => {
        return await Promise.race([
          model.generateContent(prompt),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('AI cleaning timeout')), 10000) // 10 second timeout
          )
        ])
      }, 2, 1000) // 2 retries with 1 second initial delay
    } catch (error) {
      // If Gemini 2.5 Flash fails with empty responses, try 1.5 Flash
      if (modelUsed === "gemini-2.5-flash" && (error.message.includes('Empty AI response') || error.message.includes('No JSON found'))) {
        console.log('Gemini 2.5 Flash failed for cleaning, trying 1.5 Flash')
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
              setTimeout(() => reject(new Error('AI cleaning timeout')), 10000)
            )
          ])
        }, 2, 1000)
      } else {
        throw error
      }
    }
    const response = await result.response
    const aiResponse = response.text()
    
    // Check if response is empty or null
    if (!aiResponse || aiResponse.trim().length === 0) {
      console.error('Empty response from Gemini 2.5 Flash')
      throw new Error('Empty AI response received')
    }
    
    // Parse AI response with enhanced error handling for Gemini 2.5 Flash
    try {
      console.log('Raw AI response length:', aiResponse.length)
      console.log('Raw AI response preview:', aiResponse.substring(0, 500))
      
      // Enhanced JSON extraction for different response formats
      let jsonStr = aiResponse.trim()
      
      // Remove markdown code blocks if present
      jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '')
      
      // Find the JSON object
      const jsonStart = jsonStr.indexOf('{')
      const jsonEnd = jsonStr.lastIndexOf('}')
      
      if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
        console.log('No valid JSON structure found in cleaning response')
        throw new Error('No JSON found in response')
      }
      
      jsonStr = jsonStr.substring(jsonStart, jsonEnd + 1)
      
      // Clean up common JSON issues step by step
      jsonStr = jsonStr
        .replace(/,\s*}/g, '}') // Remove trailing commas
        .replace(/,\s*]/g, ']') // Remove trailing commas in arrays
        .replace(/'/g, '"') // Replace single quotes with double quotes
      
      // More careful key quoting - only quote keys that aren't already quoted
      jsonStr = jsonStr.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
      
      // Fix any double-quoted keys that got double-quoted
      jsonStr = jsonStr.replace(/""/g, '"')
      
      // Handle truncated JSON - try to repair incomplete structures
      jsonStr = repairTruncatedJson(jsonStr)
      
      console.log('Cleaned JSON string preview:', jsonStr.substring(0, 300))
      
      const parsedJson = JSON.parse(jsonStr)
      console.log(`Successfully parsed cleaning instructions JSON using ${finalModelUsed}`)
      return { ...parsedJson, modelUsed: finalModelUsed }
      
    } catch (parseError) {
      console.error('Error parsing AI cleaning instructions:', parseError)
      console.log('Full raw AI response:', aiResponse)
    }
    
    // Fallback instructions
    return {
      columnRules: {},
      globalRules: {
        duplicateHandling: "remove",
        missingValueStrategy: "impute",
        outlierHandling: "flag",
        textNormalization: "title_case"
      },
      businessLogic: {
        industrySpecificRules: [],
        dataIntegrityChecks: [],
        qualityThresholds: { minimumCompleteness: 70, maximumOutliers: 5 }
      },
      processingNotes: ["Using fallback cleaning rules"]
    }
    
  } catch (error) {
    console.error('Error getting AI cleaning instructions:', error)
    
    // Provide better error context
    let errorMessage = 'Failed to get AI instructions'
    if (error.message.includes('503') || error.message.includes('overloaded')) {
      errorMessage = 'AI service temporarily overloaded - using fallback cleaning rules'
    } else if (error.message.includes('timeout')) {
      errorMessage = 'AI request timed out - using fallback cleaning rules'
    }
    
    return { 
      error: errorMessage,
      fallback: true,
      columnRules: {},
      globalRules: {
        duplicateHandling: "remove",
        missingValueStrategy: "impute",
        outlierHandling: "flag",
        textNormalization: "title_case"
      },
      businessLogic: {
        industrySpecificRules: [],
        dataIntegrityChecks: [],
        qualityThresholds: { minimumCompleteness: 70, maximumOutliers: 5 }
      },
      processingNotes: ["Using enhanced fallback cleaning rules due to AI service unavailability"]
    }
  }
}

async function applyAICleaningToChunk(chunkData, instructions, headers) {
  let cleanedData = [...chunkData]
  let cleanedValues = 0
  let issuesFixed = []
  
  try {
    // Apply column-specific rules
    if (instructions.columnRules) {
      cleanedData = cleanedData.map(row => {
        const cleanedRow = { ...row }
        
        headers.forEach(header => {
          const rules = instructions.columnRules[header]
          if (rules && cleanedRow[header] !== null && cleanedRow[header] !== undefined) {
            const originalValue = cleanedRow[header]
            let cleanedValue = originalValue
            
            // Apply data type specific cleaning
            if (rules.dataType === 'numeric') {
              cleanedValue = cleanNumericValue(originalValue)
            } else if (rules.dataType === 'text') {
              cleanedValue = cleanTextValue(originalValue, rules)
            } else if (rules.dataType === 'email') {
              cleanedValue = cleanEmailValue(originalValue)
            } else if (rules.dataType === 'url') {
              cleanedValue = cleanUrlValue(originalValue)
            } else if (rules.dataType === 'date') {
              cleanedValue = cleanDateValue(originalValue)
            }
            
            if (cleanedValue !== originalValue) {
              cleanedValues++
              issuesFixed.push(`${header}: cleaned value`)
            }
            
            cleanedRow[header] = cleanedValue
          }
        })
        
        return cleanedRow
      })
    }
    
    // Apply global rules
    if (instructions.globalRules) {
      // Remove duplicates if specified
      if (instructions.globalRules.duplicateHandling === 'remove') {
        const originalLength = cleanedData.length
        cleanedData = removeDuplicates(cleanedData)
        if (cleanedData.length < originalLength) {
          issuesFixed.push(`Removed ${originalLength - cleanedData.length} duplicates`)
        }
      }
      
      // Handle missing values
      if (instructions.globalRules.missingValueStrategy === 'impute') {
        cleanedData = imputeMissingValues(cleanedData, headers)
        issuesFixed.push('Imputed missing values')
      }
    }
    
    // Add quality scores
    cleanedData = cleanedData.map((row, index) => ({
      ...row,
      ai_cleaned: true,
      quality_score: calculateQualityScore(row, headers),
      processing_timestamp: new Date().toISOString()
    }))
    
  } catch (error) {
    console.error('Error applying AI cleaning to chunk:', error)
    issuesFixed.push('Error in AI cleaning - using basic cleaning')
  }
  
  return {
    data: cleanedData,
    cleanedValues,
    issuesFixed
  }
}

// Specialized cleaning functions
function cleanNumericValue(value) {
  if (value === null || value === undefined || value === '') return null
  
  const stringValue = String(value).trim()
  if (stringValue === '' || stringValue.toLowerCase() === 'null' || stringValue.toLowerCase() === 'n/a') {
    return null
  }
  
  // Remove currency symbols, commas, percentages
  const cleaned = stringValue.replace(/[$,€£¥%]/g, '').replace(/[^\d.-]/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : Math.round(num * 100) / 100
}

function cleanTextValue(value, rules) {
  if (!value || typeof value !== 'string') return value
  
  let cleaned = value.trim()
  
  // Apply normalization based on rules
  if (rules.transformations?.includes('remove_extra_spaces')) {
    cleaned = cleaned.replace(/\s+/g, ' ')
  }
  
  if (rules.transformations?.includes('remove_special_chars')) {
    // Preserve important patterns
    const preservePatterns = rules.preservePatterns || []
    if (!preservePatterns.some(pattern => cleaned.includes(pattern))) {
      cleaned = cleaned.replace(/[^\w\s.-]/g, '')
    }
  }
  
  // Apply text normalization
  const normalization = rules.textNormalization || 'title_case'
  if (normalization === 'title_case') {
    cleaned = cleaned.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  } else if (normalization === 'upper') {
    cleaned = cleaned.toUpperCase()
  } else if (normalization === 'lower') {
    cleaned = cleaned.toLowerCase()
  }
  
  return cleaned
}

function cleanEmailValue(value) {
  if (!value || typeof value !== 'string') return value
  
  const email = value.trim().toLowerCase()
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) ? email : null
}

function cleanUrlValue(value) {
  if (!value || typeof value !== 'string') return value
  
  let url = value.trim()
  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }
  
  return url
}

function cleanDateValue(value) {
  if (!value) return null
  
  const date = new Date(value)
  return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0]
}

function removeDuplicates(data) {
  const seen = new Set()
  return data.filter(row => {
    const key = JSON.stringify(row)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function imputeMissingValues(data, headers) {
  // Calculate column statistics for imputation
  const columnStats = {}
  
  headers.forEach(header => {
    const values = data.map(row => row[header]).filter(v => v !== null && v !== undefined && v !== '')
    const numericValues = values.filter(v => !isNaN(parseFloat(v)))
    
    if (numericValues.length > 0) {
      const nums = numericValues.map(v => parseFloat(v))
      columnStats[header] = {
        type: 'numeric',
        median: nums.sort((a, b) => a - b)[Math.floor(nums.length / 2)]
      }
    } else if (values.length > 0) {
      const counts = {}
      values.forEach(v => counts[v] = (counts[v] || 0) + 1)
      const mostCommon = Object.entries(counts).sort(([,a], [,b]) => b - a)[0]
      columnStats[header] = {
        type: 'text',
        mode: mostCommon ? mostCommon[0] : 'Unknown'
      }
    }
  })
  
  return data.map(row => {
    const filledRow = { ...row }
    headers.forEach(header => {
      if (row[header] === null || row[header] === undefined || row[header] === '') {
        const stats = columnStats[header]
        if (stats) {
          filledRow[header] = stats.type === 'numeric' ? stats.median : stats.mode
        }
      }
    })
    return filledRow
  })
}

function calculateQualityScore(row, headers) {
  const nonNullValues = Object.values(row).filter(v => v !== null && v !== undefined && v !== '')
  return Math.round((nonNullValues.length / headers.length) * 100)
}

// Function to repair truncated or malformed JSON
function repairTruncatedJson(jsonString) {
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
    
    // If we have an incomplete array element, try to close it properly
    repairedJson = repairedJson.replace(/,\s*$/, '')
    
    console.log('Attempted JSON repair, result preview:', repairedJson.substring(0, 300))
    
    try {
      JSON.parse(repairedJson)
      console.log('JSON repair successful')
      return repairedJson
    } catch (repairError) {
      console.log('JSON repair failed:', repairError.message)
      
      // Last resort: try to extract just the columnRules part if possible
      const columnRulesMatch = repairedJson.match(/"columnRules"\s*:\s*\{[^}]*\}/)
      if (columnRulesMatch) {
        const minimalJson = `{${columnRulesMatch[0]}}`
        try {
          JSON.parse(minimalJson)
          console.log('Extracted minimal columnRules JSON')
          return `{${columnRulesMatch[0]}, "globalRules": {}, "businessLogic": {}, "processingNotes": []}`
        } catch (minimalError) {
          console.log('Even minimal extraction failed')
        }
      }
      
      // If all else fails, return the original
      return jsonString
    }
  }
}