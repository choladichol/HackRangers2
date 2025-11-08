"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, CheckCircle2, Clock, BookOpen, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Lesson {
  id: string
  title: string
  category: string
  description: string
  duration: number
  completed: boolean
  progress: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
}

const SAMPLE_LESSONS: Lesson[] = [
  {
    id: "1",
    title: "Understanding Diabetes",
    category: "Chronic Conditions",
    description: "Learn about Type 1 and Type 2 diabetes, causes, symptoms, and management strategies.",
    duration: 15,
    completed: true,
    progress: 100,
    difficulty: "Beginner",
  },
  {
    id: "2",
    title: "Heart Health Basics",
    category: "Cardiovascular",
    description: "Explore cardiovascular health, risk factors, and preventive measures for heart disease.",
    duration: 20,
    completed: false,
    progress: 65,
    difficulty: "Beginner",
  },
  {
    id: "3",
    title: "Medication Management",
    category: "Treatment",
    description: "Master proper medication administration, dosage schedules, and potential side effects.",
    duration: 18,
    completed: false,
    progress: 0,
    difficulty: "Intermediate",
  },
  {
    id: "4",
    title: "Nutrition and Diet Planning",
    category: "Wellness",
    description: "Comprehensive guide to balanced nutrition and creating personalized meal plans.",
    duration: 25,
    completed: true,
    progress: 100,
    difficulty: "Intermediate",
  },
  {
    id: "5",
    title: "Exercise and Physical Activity",
    category: "Wellness",
    description: "Safe exercise routines tailored for various health conditions and fitness levels.",
    duration: 22,
    completed: false,
    progress: 40,
    difficulty: "Beginner",
  },
]

export default function LessonBrowser({ onSelectLesson }: { onSelectLesson: (id: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [...new Set(SAMPLE_LESSONS.map((l) => l.category))]
  const filteredLessons = SAMPLE_LESSONS.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || lesson.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const completedCount = SAMPLE_LESSONS.filter((l) => l.completed).length
  const overallProgress = (completedCount / SAMPLE_LESSONS.length) * 100

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Health Lessons</h1>
              <p className="text-muted-foreground mt-1">Learn and master healthcare topics</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{Math.round(overallProgress)}%</div>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
            </div>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              size="sm"
            >
              All Topics
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <Card key={lesson.id} className="flex flex-col hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex-1 p-6 flex flex-col" onClick={() => onSelectLesson(lesson.id)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold text-primary uppercase">{lesson.category}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{lesson.title}</h3>
                  </div>
                  {lesson.completed && <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 ml-2" />}
                </div>

                <p className="text-sm text-muted-foreground mb-4 flex-1">{lesson.description}</p>

                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">Progress</span>
                      <span className="text-xs font-semibold text-foreground">{lesson.progress}%</span>
                    </div>
                    <Progress value={lesson.progress} className="h-2" />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{lesson.duration} min</span>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-muted text-muted-foreground">
                    {lesson.difficulty}
                  </span>
                </div>
              </div>

              <div className="border-t border-border p-4">
                <Button className="w-full" onClick={() => onSelectLesson(lesson.id)}>
                  {lesson.completed ? "Review" : "Continue"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredLessons.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No lessons found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
