"use client"

import { useState } from "react"
import { Heart, BookOpen, Award, Search, ArrowRight, CheckCircle, Users, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import Login from "@/components/auth/login"

export default function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  const [showLogin, setShowLogin] = useState(false)

  if (showLogin) {
    return <Login onLoginSuccess={onGetStarted} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#140F4B] via-[#1a1a6e] to-[#140F4B]">
      {/* Hero Section - Takes up most of viewport */}
      <div className="min-h-[90vh] flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl shadow-2xl">
                <Heart className="h-16 w-16 md:h-20 md:w-20 text-[#1010eb]" />
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white drop-shadow-2xl tracking-tight">MedKit</h1>
            </div>
            <p className="text-3xl md:text-4xl lg:text-5xl text-white/95 mb-6 font-semibold">
              Your Personalized Heart Failure Education & Management Platform
            </p>
            <p className="text-xl md:text-2xl lg:text-3xl text-white/85 max-w-3xl mx-auto mb-12">
              Empowering patients with comprehensive heart health education, interactive lessons, 
              and AI-powered support to manage heart failure effectively.
            </p>
            <Button
              onClick={() => setShowLogin(true)}
              size="lg"
              className="bg-white text-[#1010eb] hover:bg-white/90 text-xl px-10 py-7 rounded-lg shadow-2xl font-bold transition-transform hover:scale-105"
            >
              Get Started
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid - Below the fold */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-[#1010eb]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Interactive Lessons</h3>
            <p className="text-white/80 text-lg">
              Learn about heart failure management through engaging, easy-to-understand educational content.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Award className="h-8 w-8 text-[#1010eb]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Test Your Knowledge</h3>
            <p className="text-white/80 text-lg">
              Take quizzes to assess your understanding and track your progress over time.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-[#1010eb]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">AI-Powered Support</h3>
            <p className="text-white/80 text-lg">
              Get instant answers to your questions with our intelligent chatbot and search features.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20 mt-16">
          <h2 className="text-4xl font-bold text-white text-center mb-8">Why Choose MedKit?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-7 w-7 text-white flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Comprehensive Education</h3>
                <p className="text-white/80 text-lg">Access a wide range of heart health topics and management strategies.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="h-7 w-7 text-white flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Personalized Learning</h3>
                <p className="text-white/80 text-lg">Track your progress and learn at your own pace.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="h-7 w-7 text-white flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">24/7 AI Assistance</h3>
                <p className="text-white/80 text-lg">Get answers to your questions anytime, anywhere.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="h-7 w-7 text-white flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Secure & Private</h3>
                <p className="text-white/80 text-lg">Your health information is protected with enterprise-grade security.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Take Control of Your Heart Health?</h2>
          <p className="text-xl text-white/80 mb-6">
            Join thousands of patients managing their heart failure with confidence.
          </p>
          <Button
            onClick={() => setShowLogin(true)}
            size="lg"
            className="bg-white text-[#1010eb] hover:bg-white/90 text-lg px-8 py-6 rounded-lg shadow-xl font-bold"
          >
            Start Your Journey Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

