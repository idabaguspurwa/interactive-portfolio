import { NextResponse } from 'next/server'
import { callPythonAPI, apiConfig } from '@/lib/python-api'

// Force dynamic rendering to prevent Vercel build errors
export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    console.log('🏆 Fetching GitHub repositories via Python API...')
    
    // Get limit from query parameters - use searchParams directly
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 10
    
    // Call Python backend with limit parameter
    const endpoint = `${apiConfig.endpoints.repositories}?limit=${limit}`
    const data = await callPythonAPI(endpoint)
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('❌ Error fetching GitHub repositories:', error.message)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch repositories data from backend',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
