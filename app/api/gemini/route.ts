import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
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
    
    // First, try to get list of available models
    let availableModel = 'gemini-pro' // default fallback
    
    try {
      const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`)
      if (modelsResponse.ok) {
        const modelsData = await modelsResponse.json()
        // Find a model that supports generateContent
        const supportedModel = modelsData.models?.find((m: any) => 
          m.supportedGenerationMethods?.includes('generateContent') && 
          (m.name.includes('gemini') || m.name.includes('models/gemini'))
        )
        if (supportedModel) {
          // Extract model name (remove 'models/' prefix if present)
          availableModel = supportedModel.name.replace('models/', '')
        }
      }
    } catch (e) {
      // If listing models fails, continue with default
      console.log('Could not list models, using default')
    }
    
    const model = genAI.getGenerativeModel({ model: availableModel })

    // Build conversation history
    const chatHistory = history || []
    
    // Add system context for medical/healthcare focus
    const systemContext = "You are a helpful AI assistant for MedKit, a heart failure education and management platform. Your role is to be helpful, informative, and answer all user questions to the best of your ability. You should provide educational information, explain symptoms, conditions, and health topics clearly and accurately. You can answer questions about medical topics, explain terminology, describe conditions, and provide general health education. IMPORTANT: While you can provide information and explanations, you must always include a disclaimer that this is educational information only and users should consult with qualified healthcare professionals for personalized medical advice, diagnoses, or treatment decisions. Never refuse to answer a question - always provide helpful information while including appropriate medical disclaimers when relevant."
    
    // Start chat with history
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemContext }],
        },
        {
          role: 'model',
          parts: [{ text: 'Hello! I\'m your MedKit AI assistant. I\'m here to help answer your questions about heart health, symptoms, conditions, and any other topics you\'d like to learn about. I\'ll do my best to provide helpful and informative responses. For personalized medical advice, please consult with a qualified healthcare professional. How can I assist you today?' }],
        },
        ...chatHistory,
      ],
    })

    const result = await chat.sendMessage(message)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ message: text })
  } catch (error: any) {
    console.error('Error calling Gemini API:', error)
    
    // Provide more specific error messages
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

