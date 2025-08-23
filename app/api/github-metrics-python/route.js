import { NextResponse } from 'next/server'
import { callPythonAPI, apiConfig } from '@/lib/python-api'

// Force dynamic rendering to prevent Vercel build errors
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('📊 Fetching GitHub metrics via Python API...')
    
    // Call Python backend
    const data = await callPythonAPI(apiConfig.endpoints.metrics)
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('❌ Error fetching GitHub metrics:', error.message)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch real-time data from backend',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { refresh } = await request.json()
    
    if (refresh) {
      // Force refresh by calling Python API
      const data = await callPythonAPI(apiConfig.endpoints.metrics)
      return NextResponse.json(data)
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Invalid request' 
    }, { status: 400 })
    
  } catch (error) {
    console.error('❌ Error in POST request:', error.message)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
