import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { term } = await request.json()

    if (!term) {
      return NextResponse.json(
        { error: 'Term is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.NEXT_GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Get available model
    let availableModel = 'gemini-pro'
    try {
      const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`)
      if (modelsResponse.ok) {
        const modelsData = await modelsResponse.json()
        const supportedModel = modelsData.models?.find((m: any) => 
          m.supportedGenerationMethods?.includes('generateContent') && 
          (m.name.includes('gemini') || m.name.includes('models/gemini'))
        )
        if (supportedModel) {
          availableModel = supportedModel.name.replace('models/', '')
        }
      }
    } catch (e) {
      console.log('Could not list models, using default')
    }
    
    const model = genAI.getGenerativeModel({ model: availableModel })

    const prompt = `You are a helpful AI assistant for MedKit, a heart failure education and management platform. The user wants to know about the term: "${term}".

Please provide a structured response. Return ONLY a valid JSON object with these exact keys:
{
  "term": "the exact term or word",
  "meaning": "A clear, concise explanation of what this term means (2-3 sentences). If it's a medical term, explain it in simple language.",
  "why": "Explain why this term is important, especially in the context of heart health or general health (2-3 sentences)."
}

Return ONLY the JSON object, no additional text, no markdown, no code blocks.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Try to parse JSON from the response
    let parsedResult
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0])
      } else {
        // If no JSON found, create structured response from text
        parsedResult = {
          term: term,
          meaning: text.split('\n').find(line => line.toLowerCase().includes('meaning')) || text,
          why: text.split('\n').find(line => line.toLowerCase().includes('why') || line.toLowerCase().includes('matter')) || 'This term is important for understanding heart health and medical information.'
        }
      }
    } catch (parseError) {
      // If parsing fails, create a structured response
      parsedResult = {
        term: term,
        meaning: text || `Information about ${term}`,
        why: 'This term is important for understanding heart health and medical information.'
      }
    }

    // Ensure all required fields are present
    const resultData = {
      term: parsedResult.term || term,
      meaning: parsedResult.meaning || `A term related to ${term}`,
      why: parsedResult.why || 'This term is relevant to heart health and medical understanding.'
    }

    return NextResponse.json(resultData)
  } catch (error: any) {
    console.error('Error calling Gemini API:', error)
    
    let errorMessage = 'Failed to get response from AI'
    if (error.message?.includes('API_KEY')) {
      errorMessage = 'Invalid or missing Gemini API key'
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      errorMessage = 'API quota exceeded. Please try again later.'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

