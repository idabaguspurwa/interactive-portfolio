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
    health: '/health'
  },
  timeout: 30000, // 30 seconds
}

// Helper function to make API calls to Python backend
export async function callPythonAPI(endpoint, options = {}) {
  const url = `${apiConfig.baseUrl}${endpoint}`
  
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
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log(`✅ Python API response: ${endpoint}`)
    
    return data
    
  } catch (error) {
    console.error(`❌ Python API error (${endpoint}):`, error.message)
    throw error
  }
}
