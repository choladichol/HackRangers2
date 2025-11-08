"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Award, ArrowRight, Clock } from "lucide-react"

interface Quiz {
  id: string
  title: string
  description: string
  lessonId: string
  questions: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  estimatedTime: number
  completed: boolean
  score?: number
}

const SAMPLE_QUIZZES: Quiz[] = [
  {
    id: "quiz-1",
    title: "Understanding Heart Failure Basics",
    description: "Test your knowledge on heart failure fundamentals: types, causes, and early warning signs.",
    lessonId: "1",
    questions: 10,
    difficulty: "Beginner",
    estimatedTime: 8,
    completed: false,
    score: undefined,
  },
  {
    id: "quiz-2",
    title: "Heart Failure Medications",
    description: "Evaluate your understanding of medications used to treat heart failure and their mechanisms.",
    lessonId: "2",
    questions: 12,
    difficulty: "Intermediate",
    estimatedTime: 10,
    completed: false,
    score: undefined,
  },
  {
    id: "quiz-3",
    title: "Sodium and Fluid Management",
    description: "Test your knowledge on managing sodium intake and fluid restrictions for heart failure.",
    lessonId: "3",
    questions: 10,
    difficulty: "Beginner",
    estimatedTime: 7,
    completed: false,
    score: undefined,
  },
  {
    id: "quiz-4",
    title: "Symptom Recognition and Monitoring",
    description: "Assess your ability to recognize heart failure symptoms and know when to seek help.",
    lessonId: "4",
    questions: 12,
    difficulty: "Intermediate",
    estimatedTime: 9,
    completed: false,
    score: undefined,
  },
  {
    id: "quiz-5",
    title: "Exercise and Lifestyle Management",
    description: "Test your knowledge on safe exercise guidelines and lifestyle modifications for heart failure.",
    lessonId: "5",
    questions: 10,
    difficulty: "Intermediate",
    estimatedTime: 8,
    completed: false,
    score: undefined,
  },
  {
    id: "quiz-6",
    title: "Advanced Heart Failure Concepts",
    description: "Challenge yourself with advanced topics including ejection fraction, advanced treatments, and complications.",
    lessonId: "8",
    questions: 15,
    difficulty: "Advanced",
    estimatedTime: 12,
    completed: false,
    score: undefined,
  },
]

export default function QuizBrowser({ onSelectQuiz }: { onSelectQuiz: (id: string) => void }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)

  const filteredQuizzes = selectedDifficulty
    ? SAMPLE_QUIZZES.filter((quiz) => quiz.difficulty === selectedDifficulty)
    : SAMPLE_QUIZZES

  const completedQuizzes = SAMPLE_QUIZZES.filter((q) => q.completed).length

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#140F4B]">Heart Failure Quizzes</h1>
              <p className="text-[#140F4B] mt-1">Test your knowledge of heart failure management and track your learning</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {completedQuizzes}/{SAMPLE_QUIZZES.length}
              </div>
              <p className="text-sm text-muted-foreground">Quizzes Completed</p>
            </div>
          </div>
          <Progress value={(completedQuizzes / SAMPLE_QUIZZES.length) * 100} className="h-2" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Difficulty Filter */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase">Filter by Difficulty</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedDifficulty === null ? "default" : "outline"}
              onClick={() => setSelectedDifficulty(null)}
              size="sm"
            >
              All Quizzes
            </Button>
            {["Beginner", "Intermediate", "Advanced"].map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? "default" : "outline"}
                onClick={() => setSelectedDifficulty(difficulty)}
                size="sm"
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </div>

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <Card key={quiz.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <div className="flex-1 p-6 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold text-primary uppercase">{quiz.difficulty}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{quiz.title}</h3>
                  </div>
                  {quiz.completed && quiz.score !== undefined && (
                    <div className="flex items-center gap-1 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded">
                      <Award className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">{quiz.score}%</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-4 flex-1">{quiz.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{quiz.questions} questions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{quiz.estimatedTime} min</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-border p-4">
                <Button
                  className="w-full"
                  onClick={() => onSelectQuiz(quiz.id)}
                  variant={quiz.completed ? "outline" : "default"}
                >
                  {quiz.completed ? "Retake Quiz" : "Start Quiz"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredQuizzes.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No quizzes found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
