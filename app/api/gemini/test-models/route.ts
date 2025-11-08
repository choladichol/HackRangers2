import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.NEXT_GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Try to list available models
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey)
    const data = await response.json()
    
    return NextResponse.json({ 
      models: data.models?.map((m: any) => m.name) || [],
      fullResponse: data 
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

