"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Search } from "lucide-react"
import { GoogleGenerativeAI } from "@google/generative-ai"

export default function MedicalSearch() {
  const [term, setTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ term: string; meaning: string; why: string } | null>(null)
  const [error, setError] = useState("")

  const handleSearch = async () => {
    if (!term.trim()) return
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
    You are a helpful AI medical assistant.

    If the user input ("${term}") is a **medical term or short phrase**, respond strictly in JSON format:
    {
    "Term": "...",
    "Meaning": "...",
    "Why": "..."
    }

    If the input is a **question or general medical inquiry**, respond naturally in short paragraphs suitable for a patient or student.
    Keep responses concise and factual.
    `
      

      const response = await model.generateContent(prompt)
      const text = response.response.text()
      const clean = text.replace(/```json|```/g, "").trim()
      const parsed = JSON.parse(clean)

      setResult(parsed)
    } catch (err: any) {
      console.error(err)
      setError("Something went wrong fetching the definition.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Medical Term Search</h2>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Enter a medical term..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      {result && (
        <div className="space-y-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-4 rounded-lg">
          <p><strong>Term:</strong> {result.term}</p>
          <p><strong>Meaning:</strong> {result.meaning}</p>
          <p><strong>Why it matters:</strong> {result.why}</p>
        </div>
      )}
    </Card>
  )
}
