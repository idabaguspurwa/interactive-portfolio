import { NextResponse } from 'next/server'
import { callPythonAPI, apiConfig } from '@/lib/python-api'

// Force dynamic rendering to prevent Vercel build errors
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('📈 Fetching GitHub timeline via Python API...')
    
    // Call Python backend
    const data = await callPythonAPI(apiConfig.endpoints.timeline)
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('❌ Error fetching GitHub timeline:', error.message)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch timeline data from backend',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
