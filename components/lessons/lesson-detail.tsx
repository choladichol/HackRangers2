"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Clock, BookOpen, CheckCircle2, Bookmark, MessageSquare, Share2, Check } from "lucide-react"
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
  const [notesSaved, setNotesSaved] = useState(false)

  // Load notes from localStorage when component mounts or section changes
  useEffect(() => {
    const savedNotes = localStorage.getItem(`lesson-${lessonId}-section-${currentSection}-notes`)
    if (savedNotes) {
      setNotes(savedNotes)
    } else {
      setNotes("")
    }
    setNotesSaved(false)
  }, [lessonId, currentSection])

  // Save notes to localStorage
  const handleSaveNotes = () => {
    const notesKey = `lesson-${lessonId}-section-${currentSection}-notes`
    localStorage.setItem(notesKey, notes)
    setNotesSaved(true)
    setTimeout(() => setNotesSaved(false), 2000) // Show saved confirmation for 2 seconds
  }

  // Auto-save notes after user stops typing (debounced)
  useEffect(() => {
    if (notes === "") return
    
    const timer = setTimeout(() => {
      const notesKey = `lesson-${lessonId}-section-${currentSection}-notes`
      localStorage.setItem(notesKey, notes)
    }, 1000) // Auto-save after 1 second of no typing

    return () => clearTimeout(timer)
  }, [notes, lessonId, currentSection])

  // Comprehensive lesson content
  const lessons: Record<string, {
    id: string
    title: string
    category: string
    duration: number
    sections: Array<{ title: string; content: string }>
  }> = {
    "1": {
      id: "1",
      title: "Understanding Heart Failure",
      category: "Cardiovascular",
      duration: 30,
      sections: [
        {
          title: "What is Heart Failure?",
          content: "Heart failure, also known as congestive heart failure, occurs when your heart muscle doesn't pump blood as well as it should. This doesn't mean your heart has stopped working, but rather that it needs support to work better. When the heart can't pump effectively, blood and fluid can back up into your lungs, and fluid can build up in your feet, ankles, and legs. Understanding this condition is the first step toward effective management and improved quality of life."
        },
        {
          title: "How the Heart Works",
          content: "Your heart is a powerful muscle that pumps blood throughout your body. It has four chambers: two upper chambers (atria) and two lower chambers (ventricles). The right side of your heart pumps blood to your lungs to pick up oxygen. The left side pumps oxygen-rich blood to the rest of your body. When heart failure occurs, the heart muscle becomes weakened or stiff, making it harder to pump blood effectively. This can happen gradually over time or suddenly after a heart attack or other cardiac event."
        },
        {
          title: "Types of Heart Failure",
          content: "There are two main types of heart failure: Heart Failure with Reduced Ejection Fraction (HFrEF) occurs when the left ventricle can't contract normally, so it pumps out less blood. Heart Failure with Preserved Ejection Fraction (HFpEF) happens when the left ventricle can't relax or fill properly, even though it may pump normally. Left-sided heart failure is most common and causes fluid to back up into the lungs. Right-sided heart failure causes fluid to build up in the abdomen, legs, and feet."
        },
        {
          title: "Common Causes",
          content: "Heart failure can result from conditions that damage or weaken the heart muscle. Coronary artery disease and heart attacks are the most common causes. High blood pressure forces the heart to work harder, which can lead to heart failure over time. Other causes include heart valve disease, cardiomyopathy (disease of the heart muscle), congenital heart defects, irregular heart rhythms (arrhythmias), diabetes, obesity, and certain medications. Understanding your specific cause helps guide your treatment plan."
        },
        {
          title: "Stages of Heart Failure",
          content: "Heart failure is classified into four stages: Stage A (High Risk) includes people with risk factors but no symptoms. Stage B (Structural Heart Disease) involves heart changes but no symptoms. Stage C (Symptomatic Heart Failure) includes people with current or previous symptoms. Stage D (Advanced Heart Failure) involves severe symptoms despite medical treatment. Early detection and treatment can slow progression and improve outcomes significantly."
        },
        {
          title: "Early Warning Signs",
          content: "Recognizing early symptoms is crucial for timely intervention. Common signs include shortness of breath during activity or when lying down, persistent coughing or wheezing, swelling in feet, ankles, legs, or abdomen, fatigue and weakness, rapid or irregular heartbeat, reduced ability to exercise, sudden weight gain from fluid retention, and difficulty concentrating or decreased alertness. If you experience these symptoms, contact your healthcare provider immediately."
        }
      ]
    },
    "2": {
      id: "2",
      title: "Heart Failure Medications",
      category: "Treatment",
      duration: 25,
      sections: [
        {
          title: "Why Medications Matter",
          content: "Medications are a cornerstone of heart failure treatment. They help your heart work more efficiently, reduce symptoms, prevent complications, and improve your quality of life. Taking medications exactly as prescribed is crucial for managing heart failure effectively. Never stop taking medications without consulting your doctor, even if you feel better."
        },
        {
          title: "ACE Inhibitors",
          content: "ACE inhibitors (Angiotensin-Converting Enzyme inhibitors) help relax blood vessels and lower blood pressure, making it easier for your heart to pump blood. Examples include lisinopril, enalapril, and captopril. These medications can reduce symptoms, improve exercise capacity, and decrease the risk of hospitalization. Common side effects include dry cough, dizziness, and elevated potassium levels. Your doctor will monitor your kidney function and potassium levels regularly."
        },
        {
          title: "Beta-Blockers",
          content: "Beta-blockers slow your heart rate and reduce blood pressure, which decreases the workload on your heart. Examples include metoprolol, carvedilol, and bisoprolol. These medications can improve heart function, reduce symptoms, and increase survival rates. They may initially cause fatigue or dizziness, but these effects usually improve over time. Your doctor will start with a low dose and gradually increase it."
        },
        {
          title: "Diuretics (Water Pills)",
          content: "Diuretics help your body eliminate excess fluid and sodium through urine, reducing swelling and shortness of breath. Examples include furosemide, hydrochlorothiazide, and spironolactone. These medications help manage fluid retention, a common problem in heart failure. You may need to urinate more frequently, so it's important to take them at appropriate times. Your doctor may adjust the dose based on your symptoms and weight."
        },
        {
          title: "Other Important Medications",
          content: "ARBs (Angiotensin II Receptor Blockers) work similarly to ACE inhibitors and are used if you can't tolerate ACE inhibitors. Digoxin helps the heart beat stronger and can control heart rate. SGLT2 inhibitors are newer medications that can help reduce hospitalizations and improve outcomes. Anticoagulants may be prescribed if you have atrial fibrillation to prevent blood clots. Each medication serves a specific purpose in your treatment plan."
        },
        {
          title: "Medication Safety",
          content: "Always take medications exactly as prescribed. Use a pill organizer to help you remember. Keep a list of all medications, including over-the-counter drugs and supplements. Inform all healthcare providers about your medications. Don't skip doses or double up if you miss one. Store medications properly and check expiration dates. Report any side effects to your doctor immediately. Regular monitoring helps ensure medications are working effectively and safely."
        }
      ]
    },
    "3": {
      id: "3",
      title: "Sodium and Fluid Management",
      category: "Lifestyle",
      duration: 20,
      sections: [
        {
          title: "Why Sodium Matters",
          content: "Sodium causes your body to retain water, which increases the workload on your heart. For people with heart failure, excess sodium can lead to fluid buildup, worsening symptoms, and increased risk of hospitalization. Most people with heart failure should limit sodium to 2,000 milligrams (2 grams) per day, though your doctor may recommend even less. Understanding sodium and learning to manage it is essential for controlling heart failure symptoms."
        },
        {
          title: "Reading Food Labels",
          content: "Learning to read nutrition labels is crucial for sodium management. Check the 'Sodium' line on the Nutrition Facts label. Look for 'low sodium' (140mg or less per serving) or 'sodium-free' (less than 5mg per serving) options. Be aware of serving sizes - if you eat more than one serving, multiply the sodium accordingly. Watch for hidden sodium in processed foods, canned goods, and restaurant meals. Fresh, whole foods typically contain less sodium than processed alternatives."
        },
        {
          title: "High-Sodium Foods to Avoid",
          content: "Many common foods are surprisingly high in sodium. Processed meats like deli meats, bacon, and sausage contain significant amounts. Canned soups, vegetables, and beans often have added salt. Fast food and restaurant meals are typically very high in sodium. Condiments like soy sauce, ketchup, and salad dressings can add up quickly. Frozen meals and packaged snacks are usually high in sodium. Cheese, pickles, and olives are also sodium-rich. Learning to identify and limit these foods helps manage your condition."
        },
        {
          title: "Low-Sodium Alternatives",
          content: "Fresh fruits and vegetables are naturally low in sodium and should be staples in your diet. Fresh meats, poultry, and fish without added salt are good choices. Use herbs and spices instead of salt for flavoring. Look for 'no salt added' or 'low sodium' versions of canned goods. Cook from scratch when possible to control sodium content. Use lemon juice, vinegar, or salt-free seasoning blends to enhance flavor. Gradually reducing salt helps your taste buds adjust."
        },
        {
          title: "Fluid Management",
          content: "Your doctor may recommend limiting fluids if you have heart failure, typically to 1.5-2 liters (6-8 cups) per day. This includes all fluids: water, juice, coffee, tea, soup, and even foods with high water content like melons. Weigh yourself daily at the same time each morning to monitor fluid retention. If you gain more than 2-3 pounds in a day or 5 pounds in a week, contact your doctor. Track your fluid intake throughout the day to stay within limits."
        },
        {
          title: "Practical Tips",
          content: "Plan meals ahead and prepare low-sodium options. Keep a food diary to track sodium intake. Drink small amounts of fluid throughout the day rather than large amounts at once. Use measuring cups to track fluid intake accurately. When eating out, ask for meals prepared without added salt. Request sauces and dressings on the side. Read menus carefully and ask about sodium content. Remember, managing sodium and fluids is a daily commitment that significantly impacts your heart health."
        }
      ]
    }
  }

  // Get lesson content or default
  const lesson = lessons[lessonId] || {
    id: lessonId,
    title: "Heart Failure Education",
    category: "Cardiovascular",
    duration: 20,
    sections: [
      {
        title: "Welcome",
        content: "This lesson is being developed. Please check back soon for comprehensive content."
      }
    ]
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
                <h1 className="text-3xl font-bold text-[#140F4B] mb-2">{lesson.title}</h1>
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
              <h2 className="text-2xl font-bold text-[#140F4B] mb-6">{lesson.sections[currentSection].title}</h2>
              <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed mb-8">
                {lesson.sections[currentSection].content}
              </p>

              <div className="bg-[#1010eb]/10 dark:bg-[#1010eb]/30 border border-[#1010eb]/30 dark:border-[#1010eb]/50 rounded-lg p-4 mb-8">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#1010eb] dark:text-[#1010eb] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#1010eb] dark:text-[#1010eb]">Key Takeaway</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
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
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={handleSaveNotes}
                    disabled={notesSaved}
                  >
                    {notesSaved ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Saved!
                      </>
                    ) : (
                      "Save Notes"
                    )}
                  </Button>
                  {notes && (
                    <p className="text-xs text-muted-foreground text-center">
                      Notes auto-save as you type
                    </p>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
