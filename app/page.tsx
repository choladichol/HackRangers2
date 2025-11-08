"use client"

import { useState, useEffect, useRef } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Login from "@/components/auth/login"
import UserNav from "@/components/auth/user-nav"
import LandingPage from "@/components/landing/LandingPage"
import LessonBrowser from "@/components/lessons/lesson-browser"
import LessonDetail from "@/components/lessons/lesson-detail"
import QuizBrowser from "@/components/quiz/quiz-browser"
import QuizDetail from "@/components/quiz/quiz-detail"
import FileUploadButton from "@/components/FileUploadButton"
import GeminiChatbot from "@/components/chatbot/GeminiChatbot"
import WordSearch from "@/components/search/WordSearch"
import HeroBackground from "@/components/home/HeroBackground"
import { Card } from "@/components/ui/card"
import { BookOpen, Award, Search, Phone, Plus, Upload } from "lucide-react"

type AppView = "home" | "lessons" | "lesson-detail" | "quizzes" | "quiz-detail" | "search"

export default function Home() {
  const [currentView, setCurrentView] = useState<AppView>("home")
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showPhoneNumber, setShowPhoneNumber] = useState(false)
  const phoneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!auth) {
      console.error("Firebase auth is not initialized")
      setLoading(false)
      return
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // Close phone number popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (phoneRef.current && !phoneRef.current.contains(event.target as Node)) {
        setShowPhoneNumber(false)
      }
    }

    if (showPhoneNumber) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showPhoneNumber])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LandingPage onGetStarted={() => setUser(auth?.currentUser || null)} />
  }

  const handleSelectLesson = (id: string) => {
    setSelectedLessonId(id)
    setCurrentView("lesson-detail")
  }

  const handleSelectQuiz = (id: string) => {
    setSelectedQuizId(id)
    setCurrentView("quiz-detail")
  }

  const handleBackFromLesson = () => {
    setCurrentView("lessons")
    setSelectedLessonId(null)
  }

  const handleBackFromQuiz = () => {
    setCurrentView("quizzes")
    setSelectedQuizId(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-medtronic-light-gray shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-medtronic-vibrant-blue p-0.5 rounded-lg">
                <Plus className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-xl font-bold text-[#140F4B]">MedKit</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setCurrentView("home")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  currentView === "home"
                    ? "bg-medtronic-vibrant-blue text-white"
                    : "text-medtronic-vibrant-blue hover:bg-medtronic-light-gray"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Home
              </button>
              <button
                onClick={() => setCurrentView("lessons")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  currentView === "lessons" || currentView === "lesson-detail"
                    ? "bg-medtronic-vibrant-blue text-white"
                    : "text-medtronic-vibrant-blue hover:bg-medtronic-light-gray"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Lessons
              </button>
              <button
                onClick={() => setCurrentView("quizzes")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  currentView === "quizzes" || currentView === "quiz-detail"
                    ? "bg-medtronic-vibrant-blue text-white"
                    : "text-medtronic-vibrant-blue hover:bg-medtronic-light-gray"
                }`}
              >
                <Award className="h-4 w-4" />
                Quizzes
              </button>
              <button
                onClick={() => setCurrentView("search")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  currentView === "search"
                    ? "bg-medtronic-vibrant-blue text-white"
                    : "text-medtronic-vibrant-blue hover:bg-medtronic-light-gray"
                }`}
              >
                <Search className="h-4 w-4" />
                Search
              </button>
              <button
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.onchange = (e: any) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      console.log('File selected:', file.name)
                      // You can add file handling logic here
                    }
                  }
                  input.click()
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-medtronic-vibrant-blue hover:bg-medtronic-light-gray"
                title="Upload file"
              >
                <Upload className="h-4 w-4" />
              </button>
              <div className="relative" ref={phoneRef}>
                <button
                  onClick={() => setShowPhoneNumber(!showPhoneNumber)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-medtronic-vibrant-blue hover:bg-medtronic-light-gray"
                  title="Click to view phone number"
                >
                  <Phone className="h-4 w-4" />
                </button>
                {showPhoneNumber && (
                  <div className="absolute right-0 top-full mt-2 bg-white border-2 border-medtronic-vibrant-blue rounded-lg shadow-lg p-3 z-50 min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-medtronic-vibrant-blue" />
                      <span className="text-sm font-semibold text-[#140F4B]">Phone:</span>
                    </div>
                    <a 
                      href="tel:8575871755" 
                      className="text-lg font-bold text-medtronic-vibrant-blue hover:underline mt-1 block"
                    >
                      857-587-1755
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("8575871755")
                        setShowPhoneNumber(false)
                      }}
                      className="text-xs text-medtronic-dark-gray hover:text-medtronic-vibrant-blue mt-2"
                    >
                      Click to copy
                    </button>
                  </div>
                )}
              </div>
            </nav>
            {user && <UserNav userEmail={user.email} />}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen bg-background">
        {currentView === "home" && (
          <div className="w-full">
            {/* Hero Section - Apple Style with Background */}
            <section className="relative pt-24 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[600px]">
              {/* Background Image/Video - To use video, add videoUrl prop */}
              <HeroBackground 
                imageUrl="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              />
              
              {/* Content */}
              <div className="relative z-10 max-w-4xl mx-auto text-center">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-medtronic-vibrant-blue mb-6 tracking-tight drop-shadow-lg">
                  MedKit
                </h1>
                <p className="text-2xl md:text-3xl text-medtronic-vibrant-blue/90 mb-12 font-light drop-shadow-md">
                  Your heart health companion.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  <button
                    onClick={() => setCurrentView("lessons")}
                    className="px-8 py-3 bg-medtronic-vibrant-blue text-white rounded-full text-lg font-medium hover:bg-medtronic-vibrant-blue/90 transition-all hover:scale-105 shadow-xl"
                  >
                    Start Learning
                  </button>
                  <button
                    onClick={() => setCurrentView("quizzes")}
                    className="px-8 py-3 bg-white/90 backdrop-blur-sm border-2 border-medtronic-vibrant-blue text-medtronic-vibrant-blue rounded-full text-lg font-medium hover:bg-white transition-all hover:scale-105 shadow-xl"
                  >
                    Take a Quiz
                  </button>
                </div>
              </div>
            </section>

            {/* Features Section - Apple Style */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-20">
                  <h2 className="text-5xl md:text-6xl font-bold text-medtronic-vibrant-blue mb-4">
                    Everything you need.
                  </h2>
                  <p className="text-xl text-medtronic-vibrant-blue/70 max-w-2xl mx-auto">
                    Comprehensive heart health education at your fingertips.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="text-center">
                    <div className="mb-6">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-medtronic-vibrant-blue/10">
                        <BookOpen className="h-10 w-10 text-medtronic-vibrant-blue" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-medtronic-vibrant-blue mb-3">Learn</h3>
                    <p className="text-lg text-medtronic-vibrant-blue/70 leading-relaxed">
                      Interactive lessons designed to help you understand heart health.
                    </p>
                    <button
                      onClick={() => setCurrentView("lessons")}
                      className="mt-6 text-medtronic-vibrant-blue font-medium hover:underline"
                    >
                      Explore lessons →
                    </button>
                  </div>

                  <div className="text-center">
                    <div className="mb-6">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-medtronic-vibrant-blue/10">
                        <Award className="h-10 w-10 text-medtronic-vibrant-blue" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-medtronic-vibrant-blue mb-3">Test Yourself</h3>
                    <p className="text-lg text-medtronic-vibrant-blue/70 leading-relaxed">
                      Assess your knowledge with interactive quizzes and track your progress.
                    </p>
                    <button
                      onClick={() => setCurrentView("quizzes")}
                      className="mt-6 text-medtronic-vibrant-blue font-medium hover:underline"
                    >
                      Take a quiz →
                    </button>
                  </div>

                  <div className="text-center">
                    <div className="mb-6">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-medtronic-vibrant-blue/10">
                        <Search className="h-10 w-10 text-medtronic-vibrant-blue" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-medtronic-vibrant-blue mb-3">AI Assistant</h3>
                    <p className="text-lg text-medtronic-vibrant-blue/70 leading-relaxed">
                      Get instant answers to your questions about heart health and medical terms.
                    </p>
                    <button
                      onClick={() => setCurrentView("search")}
                      className="mt-6 text-medtronic-vibrant-blue font-medium hover:underline"
                    >
                      Try search →
                    </button>
                  </div>
                </div>
              </div>
            </section>

          </div>
        )}
        {currentView === "lessons" && <LessonBrowser onSelectLesson={handleSelectLesson} />}
        {currentView === "lesson-detail" && selectedLessonId && (
          <LessonDetail lessonId={selectedLessonId} onBack={handleBackFromLesson} />
        )}
        {currentView === "quizzes" && <QuizBrowser onSelectQuiz={handleSelectQuiz} />}
        {currentView === "quiz-detail" && selectedQuizId && (
          <QuizDetail quizId={selectedQuizId} onBack={handleBackFromQuiz} />
        )}
        {currentView === "search" && <WordSearch />}
      </main>
      {/* Gemini Chatbot - Fixed position */}
      <GeminiChatbot />
    </div>
  )
}
