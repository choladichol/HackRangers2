"use client"

import type React from "react"

import { useState } from "react"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heart, Eye, EyeOff, Info } from "lucide-react"

export default function Login({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showUserInfo, setShowUserInfo] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!auth) {
        throw new Error("Firebase authentication is not available. Please check your configuration.")
      }
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      onLoginSuccess()
    } catch (err: any) {
      // Provide user-friendly error messages
      let errorMessage = "An error occurred. Please try again."
      
      if (err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address."
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again."
      } else if (err.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists."
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters."
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address."
      } else if (err.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection."
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-[#1010eb] to-[#140F4B] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-medtronic-vibrant-blue p-2 rounded-lg shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#140F4B] drop-shadow-lg bg-white px-4 py-2 rounded-lg">MedKit</h1>
          </div>
          <p className="text-white font-semibold">Heart Health Education & Management</p>
        </div>

        <Card className="p-8 bg-white shadow-2xl border-2 border-medtronic-vibrant-blue/20">
          <h2 className="text-2xl font-bold text-[#140F4B] mb-6 text-center">
            {isSignUp ? "Create Account" : "Sign In"}
          </h2>

          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-medtronic-navy mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="border-2 border-medtronic-vibrant-blue/30 focus:border-medtronic-vibrant-blue bg-white text-gray-900 placeholder:text-gray-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-medtronic-navy">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-medtronic-vibrant-blue hover:text-medtronic-purple-indigo transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="border-2 border-medtronic-vibrant-blue/30 focus:border-medtronic-vibrant-blue bg-white text-gray-900 placeholder:text-gray-500"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-400 rounded-lg text-red-800 text-sm font-medium shadow-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-medtronic-vibrant-blue hover:bg-medtronic-vibrant-blue/90 text-white font-semibold py-6 text-base shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-medtronic-navy hover:text-medtronic-vibrant-blue font-semibold transition-colors underline underline-offset-2"
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
            </div>
            
            {/* User Info Toggle */}
            <div className="border-t-2 border-medtronic-light-gray pt-4">
              <button
                type="button"
                onClick={() => setShowUserInfo(!showUserInfo)}
                className="flex items-center justify-center gap-2 w-full text-sm font-semibold text-medtronic-navy hover:text-medtronic-vibrant-blue transition-colors py-2"
              >
                <Info className="h-4 w-4" />
                {showUserInfo ? "Hide" : "Show"} Account Information
              </button>
              
              {showUserInfo && (
                <div className="mt-3 p-4 bg-medtronic-light-blue/20 border-2 border-medtronic-light-blue/50 rounded-lg text-sm space-y-3 shadow-sm">
                  <div>
                    <span className="font-bold text-medtronic-navy">Email:</span>
                    <p className="ml-2 text-gray-900 font-medium">{email || "Not entered"}</p>
                  </div>
                  <div>
                    <span className="font-bold text-medtronic-navy">Password:</span>
                    <p className="ml-2 text-gray-900 font-medium">
                      {password ? (showPassword ? password : "••••••••") : "Not entered"}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-medtronic-navy">Account Type:</span>
                    <p className="ml-2 text-gray-900 font-medium">{isSignUp ? "New Account" : "Existing Account"}</p>
                  </div>
                  <p className="text-xs text-gray-700 mt-3 pt-3 border-t border-gray-300 font-medium">
                    🔒 Your information is secure and only stored locally in your browser.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
