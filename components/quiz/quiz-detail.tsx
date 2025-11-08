"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle2, XCircle, Clock } from "lucide-react"

interface QuizDetailProps {
  quizId: string
  onBack: () => void
}

interface Question {
  id: string
  text: string
  type: "multiple-choice" | "true-false"
  options: string[]
  correctAnswer: number
  explanation: string
}

export default function QuizDetail({ quizId, onBack }: QuizDetailProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const quiz = {
    id: quizId,
    title: "Understanding Diabetes Quiz",
    estimatedTime: 5,
    questions: [
      {
        id: "q1",
        text: "What is the primary difference between Type 1 and Type 2 diabetes?",
        type: "multiple-choice" as const,
        options: [
          "Type 1 affects children only",
          "Type 1 is an autoimmune condition, Type 2 is insulin resistance",
          "Type 2 is more serious",
          "There is no significant difference",
        ],
        correctAnswer: 1,
        explanation:
          "Type 1 diabetes is an autoimmune condition where the pancreas cannot produce insulin, while Type 2 involves insulin resistance.",
      },
      {
        id: "q2",
        text: "True or False: Diabetes can be completely cured with proper diet and exercise.",
        type: "true-false" as const,
        options: ["True", "False"],
        correctAnswer: 1,
        explanation:
          "While diet and exercise help manage diabetes, Type 1 requires insulin therapy and Type 2 is a chronic condition requiring ongoing management.",
      },
      {
        id: "q3",
        text: "Which of the following is NOT a common symptom of diabetes?",
        type: "multiple-choice" as const,
        options: ["Increased thirst", "Frequent urination", "Improved night vision", "Fatigue"],
        correctAnswer: 2,
        explanation:
          "Increased thirst, frequent urination, and fatigue are common symptoms. Improved night vision is not associated with diabetes.",
      },
    ],
  }

  const handleSelectAnswer = (optionIndex: number) => {
    if (!isSubmitted) {
      const newAnswers = [...selectedAnswers]
      newAnswers[currentQuestion] = optionIndex
      setSelectedAnswers(newAnswers)
    }
  }

  const handleSubmitAnswer = () => {
    setIsSubmitted(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setIsSubmitted(false)
    } else {
      setShowResults(true)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setIsSubmitted(false)
    }
  }

  const isCorrect = selectedAnswers[currentQuestion] === quiz.questions[currentQuestion].correctAnswer
  const score = selectedAnswers.filter((answer, index) => answer === quiz.questions[index].correctAnswer).length
  const scorePercentage = Math.round((score / quiz.questions.length) * 100)

  if (showResults) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Quizzes</span>
          </button>

          <Card className="p-8 text-center">
            <div
              className={`h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                scorePercentage >= 70 ? "bg-green-50 dark:bg-green-950/30" : "bg-orange-50 dark:bg-orange-950/30"
              }`}
            >
              {scorePercentage >= 70 ? (
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
              ) : (
                <Clock className="h-12 w-12 text-orange-600 dark:text-orange-400" />
              )}
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-2">Quiz Complete!</h2>
            <p className="text-muted-foreground mb-8">Here's how you performed:</p>

            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <div className="text-5xl font-bold text-primary mb-2">{scorePercentage}%</div>
              <p className="text-muted-foreground mb-4">
                You got {score} out of {quiz.questions.length} questions correct
              </p>
              <Progress value={scorePercentage} className="h-3" />
            </div>

            <div className="space-y-4">
              {scorePercentage >= 70 ? (
                <p className="text-lg text-green-600 dark:text-green-400 font-semibold">
                  Excellent work! You have a strong understanding of this material.
                </p>
              ) : (
                <p className="text-lg text-orange-600 dark:text-orange-400 font-semibold">
                  Good effort! Review the material and try again to improve your score.
                </p>
              )}
            </div>

            <div className="flex gap-4 mt-8">
              <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
                Back to Quizzes
              </Button>
              <Button
                onClick={() => {
                  setCurrentQuestion(0)
                  setSelectedAnswers([])
                  setShowResults(false)
                }}
                className="flex-1"
              >
                Retake Quiz
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]
  const isAnswered = selectedAnswers[currentQuestion] !== undefined && selectedAnswers[currentQuestion] !== null
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Quizzes</span>
          </button>

          <div className="mb-4">
            <h1 className="text-2xl font-bold text-foreground mb-2">{quiz.title}</h1>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {quiz.estimatedTime} min
              </span>
            </div>
          </div>

          <Progress value={progress} className="h-2" />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">{question.text}</h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === index
              const isCorrectOption = index === question.correctAnswer
              let buttonClass = "border-2 border-border hover:border-primary"

              if (isSubmitted) {
                if (isCorrectOption) {
                  buttonClass = "border-2 border-green-500 bg-green-50 dark:bg-green-950/30"
                } else if (isSelected && !isCorrectOption) {
                  buttonClass = "border-2 border-red-500 bg-red-50 dark:bg-red-950/30"
                }
              } else if (isSelected) {
                buttonClass = "border-2 border-primary bg-primary/5"
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={isSubmitted}
                  className={`w-full p-4 text-left rounded-lg transition-all ${buttonClass} ${
                    isSubmitted ? "cursor-default" : "cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSubmitted && isCorrectOption
                          ? "border-green-500 bg-green-500"
                          : isSubmitted && isSelected && !isCorrectOption
                            ? "border-red-500 bg-red-500"
                            : isSelected
                              ? "border-primary bg-primary"
                              : "border-muted"
                      }`}
                    >
                      {isSubmitted && isCorrectOption && <CheckCircle2 className="h-4 w-4 text-white" />}
                      {isSubmitted && isSelected && !isCorrectOption && <XCircle className="h-4 w-4 text-white" />}
                    </div>
                    <span className="text-lg text-foreground">{option}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {isSubmitted && (
            <div
              className={`p-4 rounded-lg mb-8 ${
                isCorrect
                  ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900"
                  : "bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900"
              }`}
            >
              <div className="flex gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p
                    className={`font-semibold mb-1 ${isCorrect ? "text-green-900 dark:text-green-200" : "text-orange-900 dark:text-orange-200"}`}
                  >
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </p>
                  <p
                    className={`text-sm ${isCorrect ? "text-green-800 dark:text-green-300" : "text-orange-800 dark:text-orange-300"}`}
                  >
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
            Previous
          </Button>

          {!isSubmitted ? (
            <Button onClick={handleSubmitAnswer} disabled={!isAnswered}>
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              {currentQuestion === quiz.questions.length - 1 ? "See Results" : "Next Question"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
