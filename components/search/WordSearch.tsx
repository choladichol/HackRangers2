"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Search, BookOpen } from "lucide-react"

interface SearchResult {
  term: string
  meaning: string
  why: string
}

export default function WordSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [error, setError] = useState("")
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/word-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          term: searchTerm.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to get response")
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setResult(data)
      
      // Add to search history
      if (!searchHistory.includes(searchTerm)) {
        setSearchHistory((prev) => [searchTerm, ...prev.slice(0, 4)])
      }
    } catch (err: any) {
      console.error(err)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-10 w-10 text-medtronic-vibrant-blue" />
            <h1 className="text-4xl font-bold text-[#140F4B]">Word Search</h1>
          </div>
          <p className="text-lg text-[#140F4B]">
            Search for definitions, explanations, and information about any word or term
          </p>
        </div>

        {/* Search Bar */}
        <Card className="p-6 mb-6 border-2 border-medtronic-vibrant-blue/20">
          <div className="flex gap-3">
            <Input
              placeholder="Enter a word or term to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="flex-1 text-lg border-2 border-medtronic-vibrant-blue/30 focus:border-medtronic-vibrant-blue"
            />
            <Button
              onClick={handleSearch}
              disabled={loading || !searchTerm.trim()}
              className="bg-medtronic-vibrant-blue hover:bg-medtronic-vibrant-blue/90 text-white px-8"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="p-4 mb-6 bg-red-50 border-2 border-red-400">
            <p className="text-red-800 font-medium">{error}</p>
          </Card>
        )}

        {/* Search Result */}
        {result && (
          <Card className="p-8 border-2 border-medtronic-vibrant-blue/20 shadow-lg">
            <div className="prose prose-lg max-w-none space-y-4">
              <p><strong>Term:</strong> {result.term}</p>
              <p><strong>Meaning:</strong> {result.meaning}</p>
              <p><strong>Why it matters:</strong> {result.why}</p>
            </div>
          </Card>
        )}

        {/* Search History */}
        {searchHistory.length > 0 && (
          <Card className="p-6 mt-6 border border-medtronic-light-gray">
            <h3 className="text-lg font-semibold text-medtronic-navy mb-4">Recent Searches</h3>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((term, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchTerm(term)
                    handleSearch()
                  }}
                  className="px-4 py-2 bg-medtronic-light-gray hover:bg-medtronic-vibrant-blue hover:text-white rounded-lg text-sm font-medium text-medtronic-navy transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Empty State */}
        {!result && !loading && !error && (
          <Card className="p-12 text-center border-2 border-dashed border-medtronic-light-gray">
            <Search className="h-16 w-16 text-medtronic-light-gray mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-medtronic-dark-gray mb-2">
              Start Searching
            </h3>
            <p className="text-medtronic-dark-gray">
              Enter a word or term above to get instant definitions and explanations
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}

