"use client"

import { useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Login from "@/components/auth/login"
import UserNav from "@/components/auth/user-nav"
import LessonBrowser from "@/components/lessons/lesson-browser"
import LessonDetail from "@/components/lessons/lesson-detail"
import QuizBrowser from "@/components/quiz/quiz-browser"
import QuizDetail from "@/components/quiz/quiz-detail"
import { BookOpen, Award } from "lucide-react"

type AppView = "home" | "lessons" | "lesson-detail" | "quizzes" | "quiz-detail"

export default function Home() {
  const [currentView, setCurrentView] = useState<AppView>("home")
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

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
    return <Login onLoginSuccess={() => setUser(auth.currentUser)} />
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
              <div className="bg-medtronic-navy p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-medtronic-navy">CarePath</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setCurrentView("home")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  currentView === "home"
                    ? "bg-medtronic-navy text-white"
                    : "text-medtronic-navy hover:bg-medtronic-light-gray"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Home
              </button>
              <button
                onClick={() => setCurrentView("lessons")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  currentView === "lessons" || currentView === "lesson-detail"
                    ? "bg-medtronic-navy text-white"
                    : "text-medtronic-navy hover:bg-medtronic-light-gray"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Lessons
              </button>
              <button
                onClick={() => setCurrentView("quizzes")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  currentView === "quizzes" || currentView === "quiz-detail"
                    ? "bg-medtronic-navy text-white"
                    : "text-medtronic-navy hover:bg-medtronic-light-gray"
                }`}
              >
                <Award className="h-4 w-4" />
                Quizzes
              </button>
            </nav>
            {user && <UserNav userEmail={user.email} />}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen bg-background">
        {currentView === "home" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-medtronic-navy mb-4">Welcome to CarePath</h2>
              <p className="text-lg text-medtronic-dark-gray mb-8">
                Your personalized heart failure education and management platform
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <button
                  onClick={() => setCurrentView("lessons")}
                  className="bg-medtronic-navy text-white p-6 rounded-lg hover:bg-medtronic-navy/90 transition-colors text-left"
                >
                  <BookOpen className="h-8 w-8 mb-2" />
                  <h3 className="font-semibold mb-2">Learn</h3>
                  <p className="text-sm opacity-90">Explore heart failure lessons and education materials</p>
                </button>
                <button
                  onClick={() => setCurrentView("quizzes")}
                  className="bg-medtronic-orange text-white p-6 rounded-lg hover:bg-medtronic-orange/90 transition-colors text-left"
                >
                  <Award className="h-8 w-8 mb-2" />
                  <h3 className="font-semibold mb-2">Test Yourself</h3>
                  <p className="text-sm opacity-90">Take quizzes to assess your understanding</p>
                </button>
              </div>
            </div>
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
      </main>
    </div>
  )
}
