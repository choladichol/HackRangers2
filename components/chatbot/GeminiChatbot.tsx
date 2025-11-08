"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, Bot, X, Minimize2, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function GeminiChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your MedKit AI assistant powered by Gemini. I can provide educational information about heart health, symptoms, and conditions. I can explain and describe, but I cannot provide medical advice, diagnoses, or treatment recommendations. For any medical concerns, please consult with a qualified healthcare professional. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Build conversation history for context
      const history = messages
        .filter((msg) => msg.role !== "assistant" || msg.content !== messages[0].content)
        .map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        }))

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: history,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      console.error("Error sending message:", error)
      let errorMessage = "I'm sorry, I'm having trouble connecting right now. Please try again in a moment."
      
      if (error.message) {
        if (error.message.includes("API key")) {
          errorMessage = "Gemini API key is not configured. Please check your environment variables."
        } else if (error.message.includes("Failed to get response")) {
          errorMessage = "Failed to get response from the AI service. Please check your internet connection and try again."
        } else {
          errorMessage = `Error: ${error.message}`
        }
      }
      
      const errorMsg: Message = {
        role: "assistant",
        content: errorMessage,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-medtronic-vibrant-blue hover:bg-medtronic-vibrant-blue/90 text-white rounded-full h-20 w-20 shadow-2xl hover:scale-110 transition-transform animate-pulse"
          size="icon"
        >
          <Bot className="h-14 w-14" />
        </Button>
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-bounce">
          !
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card
        className={cn(
          "flex flex-col bg-white shadow-2xl border-2 border-medtronic-vibrant-blue transition-all duration-300",
          isMinimized ? "h-16 w-80" : "h-[700px] w-[500px]"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-medtronic-vibrant-blue text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <Bot className="h-10 w-10" />
            <h3 className="font-bold text-lg">MedKit AI Assistant</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3",
                      message.role === "user"
                        ? "bg-medtronic-vibrant-blue text-white"
                        : "bg-white border border-medtronic-light-gray text-medtronic-purple-indigo"
                    )}
                  >
                    <p className={`text-base whitespace-pre-wrap ${message.role === "user" ? "text-white" : "text-medtronic-purple-indigo"}`}>{message.content}</p>
                    <p className="text-sm text-medtronic-purple-indigo opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-medtronic-light-gray rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 bg-medtronic-vibrant-blue rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="h-2 w-2 bg-medtronic-vibrant-blue rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="h-2 w-2 bg-medtronic-vibrant-blue rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-medtronic-light-gray bg-white">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about heart health..."
                  disabled={isLoading}
                  className="flex-1 text-base"
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-medtronic-vibrant-blue hover:bg-medtronic-vibrant-blue/90 text-white"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                AI responses are for educational purposes only. Consult healthcare professionals for medical advice.
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

