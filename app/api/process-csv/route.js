import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { csvData, transformation, chunkSize = 1000 } = await request.json()
    
    const lines = csvData.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const dataLines = lines.slice(1)
    
    // Process in chunks to handle large files
    const chunks = []
    for (let i = 0; i < dataLines.length; i += chunkSize) {
      chunks.push(dataLines.slice(i, i + chunkSize))
    }
    
    let processedData = []
    let processedChunks = 0
    
    // Process each chunk
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
      
      // Apply transformation to chunk
      const transformedChunk = applyTransformation(chunkData, transformation, headers)
      processedData = processedData.concat(transformedChunk)
      processedChunks++
      
      // Yield control to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 0))
    }
    
    return NextResponse.json({
      success: true,
      data: processedData,
      originalRows: dataLines.length,
      processedRows: processedData.length,
      chunksProcessed: processedChunks
    })
    
  } catch (error) {
    console.error('Error processing CSV:', error)
    return NextResponse.json(
      { error: 'Failed to process CSV file' },
      { status: 500 }
    )
  }
}

function applyTransformation(data, transformationType, headers) {
  switch (transformationType) {
    case 'clean_data':
      return cleanData(data, headers)
    case 'remove_duplicates':
      return removeDuplicates(data)
    case 'handle_missing':
      return handleMissingValues(data, headers)
    case 'standardize_text':
      return standardizeText(data, headers)
    case 'remove_outliers':
      return removeOutliers(data, headers)
    case 'complete_clean':
      return completeClean(data, headers)
    default:
      return data
  }
}

function cleanData(data, headers) {
  return data.map((row, index) => {
    const cleanedRow = { ...row }
    
    headers.forEach(header => {
      const value = row[header]
      if (value !== null && value !== undefined) {
        const stringValue = String(value).trim()
        
        // Clean common issues
        if (stringValue === '' || stringValue.toLowerCase() === 'null' || stringValue.toLowerCase() === 'n/a') {
          cleanedRow[header] = null
        } else if (!isNaN(parseFloat(stringValue)) && isFinite(stringValue)) {
          // Clean numeric values
          const cleaned = stringValue.replace(/[$,€£¥%]/g, '').replace(/[^\d.-]/g, '')
          const num = parseFloat(cleaned)
          cleanedRow[header] = isNaN(num) ? null : Math.round(num * 100) / 100
        } else if (typeof value === 'string') {
          // Clean text values but preserve URLs
          if (stringValue.includes('http') || stringValue.includes('www.') || stringValue.includes('://')) {
            cleanedRow[header] = stringValue // Keep URLs intact
          } else {
            cleanedRow[header] = stringValue
              .replace(/\s+/g, ' ')
              .replace(/[^\w\s.,-@]/g, '')
              .trim()
          }
        }
      }
    })
    
    // Add quality metrics
    const nonNullValues = Object.values(cleanedRow).filter(v => v !== null && v !== '')
    cleanedRow.data_quality_score = Math.round((nonNullValues.length / headers.length) * 100)
    
    return cleanedRow
  })
}

function removeDuplicates(data) {
  const seen = new Set()
  return data.filter(row => {
    const key = JSON.stringify(row)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

function handleMissingValues(data, headers) {
  // Calculate column statistics for imputation
  const columnStats = {}
  
  headers.forEach(header => {
    const values = data.map(row => row[header]).filter(v => v !== null && v !== undefined && v !== '')
    const numericValues = values.filter(v => !isNaN(parseFloat(v)))
    
    if (numericValues.length > 0) {
      const nums = numericValues.map(v => parseFloat(v))
      columnStats[header] = {
        type: 'numeric',
        mean: nums.reduce((a, b) => a + b, 0) / nums.length,
        median: nums.sort((a, b) => a - b)[Math.floor(nums.length / 2)]
      }
    } else if (values.length > 0) {
      // For text columns, find most common value
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
          if (stats.type === 'numeric') {
            filledRow[header] = Math.round(stats.median * 100) / 100 // Use median for numeric
          } else {
            filledRow[header] = stats.mode // Use mode for text
          }
        }
      }
    })
    
    return filledRow
  })
}

function standardizeText(data, headers) {
  return data.map(row => {
    const standardizedRow = { ...row }
    
    headers.forEach(header => {
      const value = row[header]
      if (value && typeof value === 'string') {
        // Don't standardize URLs or emails
        if (value.includes('http') || value.includes('@') || value.includes('://')) {
          return
        }
        
        standardizedRow[header] = value
          .trim()
          .replace(/\s+/g, ' ')
          .toLowerCase()
          .replace(/\b\w/g, l => l.toUpperCase()) // Title case
      }
    })
    
    return standardizedRow
  })
}

function removeOutliers(data, headers) {
  // Identify numeric columns and their outlier bounds
  const outlierBounds = {}
  
  headers.forEach(header => {
    const values = data
      .map(row => parseFloat(row[header]))
      .filter(v => !isNaN(v))
    
    if (values.length > 3) {
      const sorted = [...values].sort((a, b) => a - b)
      const q1 = sorted[Math.floor(sorted.length * 0.25)]
      const q3 = sorted[Math.floor(sorted.length * 0.75)]
      const iqr = q3 - q1
      
      outlierBounds[header] = {
        lower: q1 - 1.5 * iqr,
        upper: q3 + 1.5 * iqr
      }
    }
  })
  
  return data.filter(row => {
    return headers.every(header => {
      const value = parseFloat(row[header])
      const bounds = outlierBounds[header]
      
      if (isNaN(value) || !bounds) return true
      
      return value >= bounds.lower && value <= bounds.upper
    })
  })
}

function completeClean(data, headers) {
  let result = data
  
  // Step 1: Clean data
  result = cleanData(result, headers)
  
  // Step 2: Remove duplicates
  result = removeDuplicates(result)
  
  // Step 3: Handle missing values
  result = handleMissingValues(result, headers)
  
  // Step 4: Standardize text
  result = standardizeText(result, headers)
  
  // Step 5: Add final processing metadata
  result = result.map((row, index) => ({
    ...row,
    record_id: index + 1,
    processed_date: new Date().toISOString().split('T')[0],
    processing_version: '2.0'
  }))
  
  return result
}