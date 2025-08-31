// Configuration for Python backend API
const PYTHON_API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://events-backend.fly.dev'  // Fly.io deployed Python backend
  : 'http://localhost:8000'

export const apiConfig = {
  baseUrl: PYTHON_API_BASE_URL,
  endpoints: {
    metrics: '/api/github-metrics',
    timeline: '/api/github-timeline', 
    repositories: '/api/github-repositories',
    executeSql: '/api/execute-sql',
    health: '/health'
  },
  timeout: 45000, // 45 seconds for SQL queries
}

// Helper function to make API calls to Python backend
export async function callPythonAPI(endpoint, options = {}) {
  const url = `${apiConfig.baseUrl}${endpoint}`
  const startTime = performance.now()
  
  try {
    console.log(`🔗 Calling Python API: ${url}`)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })
    
    if (!response.ok) {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // Track failed API calls
      if (window.playgroundPerformance) {
        window.playgroundPerformance.addApiCall(`${endpoint} (${response.status})`, duration, 'error')
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    const endTime = performance.now()
    const duration = endTime - startTime
    
    console.log(`✅ Python API response: ${endpoint} (${Math.round(duration)}ms)`)
    
    // Track successful API calls
    if (window.playgroundPerformance) {
      window.playgroundPerformance.addApiCall(endpoint, duration, 'success')
    }
    
    return data
    
  } catch (error) {
    const endTime = performance.now()
    const duration = endTime - startTime
    
    console.error(`❌ Python API error (${endpoint}):`, error.message)
    
    // Track errored API calls
    if (window.playgroundPerformance) {
      window.playgroundPerformance.addApiCall(`${endpoint} (Error)`, duration, 'error')
    }
    
    throw error
  }
}
