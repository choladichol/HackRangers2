"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Clock, BookOpen, CheckCircle2, Bookmark, MessageSquare, Share2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface LessonDetailProps {
  lessonId: string
  onBack: () => void
}

export default function LessonDetail({ lessonId, onBack }: LessonDetailProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [notes, setNotes] = useState("")
  const [showNotes, setShowNotes] = useState(false)
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set())

  // Mock lesson content
  const lesson = {
    id: lessonId,
    title: "Understanding Diabetes",
    category: "Chronic Conditions",
    duration: 15,
    sections: [
      {
        title: "What is Diabetes?",
        content:
          "Diabetes is a chronic condition characterized by elevated blood sugar levels. The body either cannot produce enough insulin (Type 1) or cannot use insulin effectively (Type 2). Understanding diabetes is the first step toward managing your health.",
      },
      {
        title: "Types of Diabetes",
        content:
          "Type 1 Diabetes: An autoimmune condition where the pancreas cannot produce insulin. Usually develops in children and young adults. Type 2 Diabetes: The most common type, where the body becomes resistant to insulin. Often preventable through lifestyle changes.",
      },
      {
        title: "Symptoms and Risk Factors",
        content:
          "Common symptoms include increased thirst, frequent urination, fatigue, and blurred vision. Risk factors include family history, obesity, age, and sedentary lifestyle. Early detection and management can prevent serious complications.",
      },
      {
        title: "Management and Treatment",
        content:
          "Diabetes management involves blood sugar monitoring, medication, diet, and exercise. Regular check-ups with healthcare providers are essential. Many people successfully manage diabetes and live healthy, fulfilling lives with proper care.",
      },
    ],
  }

  const progress = ((currentSection + 1) / lesson.sections.length) * 100
  const completionPercentage = (completedSections.size / lesson.sections.length) * 100

  const handleNextSection = () => {
    const newCompleted = new Set(completedSections)
    newCompleted.add(currentSection)
    setCompletedSections(newCompleted)
    setCurrentSection(Math.min(lesson.sections.length - 1, currentSection + 1))
  }

  const handlePreviousSection = () => {
    setCurrentSection(Math.max(0, currentSection - 1))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Lessons</span>
          </button>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase">{lesson.category}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">{lesson.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{lesson.duration} minutes</span>
                  </div>
                  <div>
                    Section {currentSection + 1} of {lesson.sections.length}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={isBookmarked ? "text-primary" : ""}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Progress value={progress} className="h-2" />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">{lesson.sections[currentSection].title}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {lesson.sections[currentSection].content}
              </p>

              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4 mb-8">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 dark:text-blue-200">Key Takeaway</p>
                    <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                      Understanding the fundamentals of your condition empowers you to make better health decisions.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between mb-8">
              <Button variant="outline" onClick={handlePreviousSection} disabled={currentSection === 0}>
                Previous Section
              </Button>

              <div className="flex items-center gap-2">
                {lesson.sections.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSection(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSection
                        ? "bg-primary w-8"
                        : index < currentSection
                          ? "bg-green-600 w-2"
                          : "bg-muted w-2"
                    }`}
                  />
                ))}
              </div>

              <Button onClick={handleNextSection} disabled={currentSection === lesson.sections.length - 1}>
                Next Section
              </Button>
            </div>

            {currentSection === lesson.sections.length - 1 && (
              <div className="mt-8 p-6 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg text-center">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">Lesson Complete!</h3>
                <p className="text-green-800 dark:text-green-300 mb-4">Great work! You've finished this lesson.</p>
                <Button onClick={onBack} className="bg-green-600 hover:bg-green-700">
                  Return to Lessons
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Progress Card */}
            <Card className="p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-4">Your Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Lesson Progress</span>
                    <span className="text-sm font-semibold">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Sections Completed</span>
                    <span className="text-sm font-semibold">
                      {completedSections.size}/{lesson.sections.length}
                    </span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                </div>
              </div>
            </Card>

            {/* Notes Section */}
            <Card className="p-6">
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="flex items-center gap-2 w-full font-semibold text-foreground hover:text-primary transition-colors mb-4"
              >
                <MessageSquare className="h-4 w-4" />
                <span>My Notes</span>
              </button>

              {showNotes && (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Add personal notes about this section..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-24 resize-none"
                  />
                  <Button size="sm" className="w-full">
                    Save Notes
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
