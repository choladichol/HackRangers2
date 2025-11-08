"use client"

import type React from "react"

import { useState } from "react"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heart } from "lucide-react"

export default function Login({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      onLoginSuccess()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medtronic-navy to-medtronic-navy/90 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-white p-2 rounded-lg">
              <Heart className="h-8 w-8 text-medtronic-orange" />
            </div>
            <h1 className="text-3xl font-bold text-white">CarePath</h1>
          </div>
          <p className="text-medtronic-light-gray">Heart Health Education & Management</p>
        </div>

        <Card className="p-8 bg-white shadow-xl">
          <h2 className="text-2xl font-bold text-medtronic-navy mb-6 text-center">
            {isSignUp ? "Create Account" : "Sign In"}
          </h2>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-medtronic-navy mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="border-medtronic-light-gray"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-medtronic-navy mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="border-medtronic-light-gray"
              />
            </div>

            {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-medtronic-orange hover:bg-medtronic-orange/90 text-white"
            >
              {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-medtronic-navy hover:text-medtronic-orange font-medium transition-colors"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
