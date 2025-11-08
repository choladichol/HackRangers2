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

  // Comprehensive heart failure quiz content
  const quizzes: Record<string, {
    id: string
    title: string
    estimatedTime: number
    questions: Question[]
  }> = {
    "quiz-1": {
      id: "quiz-1",
      title: "Understanding Heart Failure Basics",
      estimatedTime: 8,
      questions: [
        {
          id: "q1",
          text: "What is heart failure?",
          type: "multiple-choice" as const,
          options: [
            "The heart has stopped working completely",
            "The heart muscle doesn't pump blood as well as it should",
            "A temporary condition that resolves on its own",
            "Only affects older adults",
          ],
          correctAnswer: 1,
          explanation: "Heart failure occurs when the heart muscle doesn't pump blood as effectively as it should. This doesn't mean the heart has stopped, but rather that it needs support to work better.",
        },
        {
          id: "q2",
          text: "True or False: Heart failure means your heart has stopped beating.",
          type: "true-false" as const,
          options: ["True", "False"],
          correctAnswer: 1,
          explanation: "False. Heart failure doesn't mean your heart has stopped. It means your heart needs support to pump blood more effectively.",
        },
        {
          id: "q3",
          text: "What are the two main types of heart failure?",
          type: "multiple-choice" as const,
          options: [
            "Left and right heart failure",
            "HFrEF and HFpEF",
            "Acute and chronic heart failure",
            "All of the above",
          ],
          correctAnswer: 3,
          explanation: "Heart failure can be classified in multiple ways: by location (left/right), by ejection fraction (HFrEF/HFpEF), and by duration (acute/chronic).",
        },
        {
          id: "q4",
          text: "Which of the following is a common early warning sign of heart failure?",
          type: "multiple-choice" as const,
          options: [
            "Sudden weight loss",
            "Shortness of breath during activity",
            "Increased appetite",
            "Clear skin with no swelling",
          ],
          correctAnswer: 1,
          explanation: "Shortness of breath during activity or when lying down is a common early warning sign of heart failure.",
        },
        {
          id: "q5",
          text: "What causes fluid to build up in the body with heart failure?",
          type: "multiple-choice" as const,
          options: [
            "Drinking too much water",
            "The heart can't pump blood effectively, causing fluid backup",
            "Eating too much salt",
            "Not exercising enough",
          ],
          correctAnswer: 1,
          explanation: "When the heart can't pump effectively, blood and fluid can back up, causing fluid to accumulate in the lungs, feet, ankles, and legs.",
        },
        {
          id: "q6",
          text: "True or False: Heart failure is always a terminal condition with no treatment options.",
          type: "true-false" as const,
          options: ["True", "False"],
          correctAnswer: 1,
          explanation: "False. While heart failure is a serious condition, many people successfully manage it with medications, lifestyle changes, and proper care, living full and active lives.",
        },
        {
          id: "q7",
          text: "Which stage of heart failure involves people with risk factors but no symptoms?",
          type: "multiple-choice" as const,
          options: [
            "Stage A",
            "Stage B",
            "Stage C",
            "Stage D",
          ],
          correctAnswer: 0,
          explanation: "Stage A includes people with risk factors for heart failure but no symptoms or structural heart disease.",
        },
        {
          id: "q8",
          text: "What is the most common cause of heart failure?",
          type: "multiple-choice" as const,
          options: [
            "High blood pressure",
            "Coronary artery disease and heart attacks",
            "Diabetes",
            "Obesity",
          ],
          correctAnswer: 1,
          explanation: "Coronary artery disease and heart attacks are the most common causes of heart failure, as they damage the heart muscle.",
        },
        {
          id: "q9",
          text: "True or False: Heart failure only affects the elderly.",
          type: "true-false" as const,
          options: ["True", "False"],
          correctAnswer: 1,
          explanation: "False. While heart failure is more common in older adults, it can affect people of any age, including children with congenital heart defects.",
        },
        {
          id: "q10",
          text: "Which symptom requires immediate medical attention in heart failure?",
          type: "multiple-choice" as const,
          options: [
            "Gaining 2-3 pounds in a day",
            "Severe shortness of breath at rest",
            "Chest pain",
            "All of the above",
          ],
          correctAnswer: 3,
          explanation: "All of these symptoms can indicate worsening heart failure and require immediate medical attention.",
        },
      ],
    },
    "quiz-2": {
      id: "quiz-2",
      title: "Heart Failure Medications",
      estimatedTime: 10,
      questions: [
        {
          id: "q1",
          text: "What is the primary purpose of ACE inhibitors in heart failure treatment?",
          type: "multiple-choice" as const,
          options: [
            "To increase heart rate",
            "To relax blood vessels and lower blood pressure",
            "To remove excess fluid",
            "To strengthen heart contractions",
          ],
          correctAnswer: 1,
          explanation: "ACE inhibitors help relax blood vessels and lower blood pressure, making it easier for the heart to pump blood.",
        },
        {
          id: "q2",
          text: "True or False: You should stop taking heart failure medications if you feel better.",
          type: "true-false" as const,
          options: ["True", "False"],
          correctAnswer: 1,
          explanation: "False. Never stop taking medications without consulting your doctor, even if you feel better. Medications are working to keep you feeling well.",
        },
        {
          id: "q3",
          text: "What do diuretics (water pills) do?",
          type: "multiple-choice" as const,
          options: [
            "Increase fluid retention",
            "Help eliminate excess fluid and sodium",
            "Slow the heart rate",
            "Increase blood pressure",
          ],
          correctAnswer: 1,
          explanation: "Diuretics help your body eliminate excess fluid and sodium through urine, reducing swelling and shortness of breath.",
        },
        {
          id: "q4",
          text: "Beta-blockers work by:",
          type: "multiple-choice" as const,
          options: [
            "Speeding up the heart rate",
            "Slowing heart rate and reducing blood pressure",
            "Removing fluid from the body",
            "Increasing heart contractions",
          ],
          correctAnswer: 1,
          explanation: "Beta-blockers slow your heart rate and reduce blood pressure, decreasing the workload on your heart.",
        },
        {
          id: "q5",
          text: "True or False: All heart failure medications have the same side effects.",
          type: "true-false" as const,
          options: ["True", "False"],
          correctAnswer: 1,
          explanation: "False. Different medications have different mechanisms of action and different potential side effects. Your doctor will monitor you for any issues.",
        },
        {
          id: "q6",
          text: "Why might your doctor start beta-blockers at a low dose?",
          type: "multiple-choice" as const,
          options: [
            "To save money",
            "To allow your body to adjust and minimize side effects",
            "Because they're less effective",
            "To test if you need them",
          ],
          correctAnswer: 1,
          explanation: "Doctors start with low doses and gradually increase to allow your body to adjust and minimize potential side effects like fatigue or dizziness.",
        },
        {
          id: "q7",
          text: "What should you do if you experience side effects from your medications?",
          type: "multiple-choice" as const,
          options: [
            "Stop taking the medication immediately",
            "Reduce the dose yourself",
            "Report it to your doctor immediately",
            "Ignore it and hope it goes away",
          ],
          correctAnswer: 2,
          explanation: "Always report any side effects to your doctor immediately. They can adjust your medication or dosage, but never stop or change medications on your own.",
        },
        {
          id: "q8",
          text: "True or False: SGLT2 inhibitors are newer medications that can help reduce hospitalizations in heart failure.",
          type: "true-false" as const,
          options: ["True", "False"],
          correctAnswer: 0,
          explanation: "True. SGLT2 inhibitors are newer medications that have shown benefits in reducing hospitalizations and improving outcomes for heart failure patients.",
        },
        {
          id: "q9",
          text: "What is the purpose of taking multiple medications for heart failure?",
          type: "multiple-choice" as const,
          options: [
            "Each medication serves a different purpose in your treatment",
            "Doctors want to make money",
            "One medication isn't enough",
            "It's just a precaution",
          ],
          correctAnswer: 0,
          explanation: "Each medication in your treatment plan serves a specific purpose - some reduce blood pressure, others remove fluid, some protect the heart. Together they work to manage your condition effectively.",
        },
        {
          id: "q10",
          text: "When should you take diuretics?",
          type: "multiple-choice" as const,
          options: [
            "Right before bed",
            "At appropriate times since you'll need to urinate more",
            "Only with meals",
            "Only in the morning",
          ],
          correctAnswer: 1,
          explanation: "Since diuretics increase urination, it's important to take them at appropriate times (usually morning/early afternoon) to avoid disrupting sleep.",
        },
        {
          id: "q11",
          text: "True or False: ARBs work similarly to ACE inhibitors and are used if you can't tolerate ACE inhibitors.",
          type: "true-false" as const,
          options: ["True", "False"],
          correctAnswer: 0,
          explanation: "True. ARBs (Angiotensin II Receptor Blockers) work similarly to ACE inhibitors and are often prescribed as an alternative if you experience side effects from ACE inhibitors.",
        },
        {
          id: "q12",
          text: "Why is medication adherence important in heart failure?",
          type: "multiple-choice" as const,
          options: [
            "Medications help prevent complications and hospitalizations",
            "It's required by law",
            "To avoid side effects",
            "All medications work the same way",
          ],
          correctAnswer: 0,
          explanation: "Taking medications exactly as prescribed is crucial for managing heart failure effectively, preventing complications, reducing symptoms, and avoiding hospitalizations.",
        },
      ],
    },
    "quiz-3": {
      id: "quiz-3",
      title: "Sodium and Fluid Management",
      estimatedTime: 7,
      questions: [
        {
          id: "q1",
          text: "Why is sodium restriction important for heart failure patients?",
          type: "multiple-choice" as const,
          options: [
            "Sodium causes fluid retention, increasing heart workload",
            "Sodium tastes bad",
            "Sodium is expensive",
            "Sodium has no effect on heart failure",
          ],
          correctAnswer: 0,
          explanation: "Sodium causes your body to retain water, which increases the workload on your heart and can worsen heart failure symptoms.",
        },
        {
          id: "q2",
          text: "True or False: Most people with heart failure should limit sodium to 2,000 milligrams per day.",
          type: "true-false" as const,
          options: ["True", "False"],
          correctAnswer: 0,
          explanation: "True. Most people with heart failure should limit sodium to 2,000 mg (2 grams) per day, though your doctor may recommend even less.",
        },
        {
          id: "q3",
          text: "Which food is typically highest in sodium?",
          type: "multiple-choice" as const,
          options: [
            "Fresh fruits and vegetables",
            "Processed meats and canned foods",
            "Fresh chicken breast",
            "Plain rice",
          ],
          correctAnswer: 1,
          explanation: "Processed meats, canned foods, and restaurant meals are typically very high in sodium. Fresh, whole foods contain less sodium.",
        },
        {
          id: "q4",
          text: "What does 'low sodium' mean on a food label?",
          type: "multiple-choice" as const,
          options: [
            "140mg or less per serving",
            "500mg or less per serving",
            "1000mg or less per serving",
            "There's no standard definition",
          ],
          correctAnswer: 0,
          explanation: "'Low sodium' means 140mg or less per serving. 'Sodium-free' means less than 5mg per serving.",
        },
        {
          id: "q5",
          text: "True or False: Fluid restriction typically means limiting all fluids to 1.5-2 liters (6-8 cups) per day.",
          type: "true-false" as const,
          options: ["True", "False"],
          correctAnswer: 0,
          explanation: "True. This includes all fluids: water, juice, coffee, tea, soup, and even foods with high water content like melons.",
        },
        {
          id: "q6",
          text: "If you gain more than how many pounds in a day should you contact your doctor?",
          type: "multiple-choice" as const,
          options: [
            "1 pound",
            "2-3 pounds",
            "5 pounds",
            "10 pounds",
          ],
          correctAnswer: 1,
          explanation: "If you gain more than 2-3 pounds in a day or 5 pounds in a week, contact your doctor as this may indicate fluid retention.",
        },
        {
          id: "q7",
          text: "Which is a good strategy for reducing sodium intake?",
          type: "multiple-choice" as const,
          options: [
            "Use herbs and spices instead of salt",
            "Eat more processed foods",
            "Add extra salt for flavor",
            "Only check labels sometimes",
          ],
          correctAnswer: 0,
          explanation: "Using herbs, spices, lemon juice, and vinegar instead of salt is an excellent way to add flavor without sodium.",
        },
        {
          id: "q8",
          text: "True or False: Reading nutrition labels is important for managing sodium intake.",
          type: "true-false" as const,
          options: ["True", "False"],
          correctAnswer: 0,
          explanation: "True. Learning to read nutrition labels helps you identify hidden sodium in processed foods and make informed choices.",
        },
        {
          id: "q9",
          text: "When eating out, what should you do to manage sodium?",
          type: "multiple-choice" as const,
          options: [
            "Order whatever looks good",
            "Ask for meals prepared without added salt and request sauces on the side",
            "Only eat at fast food restaurants",
            "Don't worry about sodium when eating out",
          ],
          correctAnswer: 1,
          explanation: "When eating out, ask for meals prepared without added salt, request sauces and dressings on the side, and read menus carefully.",
        },
        {
          id: "q10",
          text: "Why is daily weight monitoring important for fluid management?",
          type: "multiple-choice" as const,
          options: [
            "To track diet progress",
            "To monitor fluid retention, as sudden weight gain may indicate fluid buildup",
            "To see if you're losing weight",
            "It's not really important",
          ],
          correctAnswer: 1,
          explanation: "Daily weight monitoring helps detect fluid retention early. Sudden weight gain often indicates fluid buildup, which requires medical attention.",
        },
      ],
    },
  }

  // Get quiz content or default
  const quiz = quizzes[quizId] || {
    id: quizId,
    title: "Heart Failure Quiz",
    estimatedTime: 5,
    questions: [
      {
        id: "q1",
        text: "This quiz is being developed. Please check back soon for comprehensive heart failure questions.",
        type: "multiple-choice" as const,
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correctAnswer: 0,
        explanation: "This quiz content is being developed.",
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

            <h2 className="text-3xl font-bold text-[#140F4B] mb-2">Quiz Complete!</h2>
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
            <h1 className="text-2xl font-bold text-[#140F4B] mb-2">{quiz.title}</h1>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="font-semibold text-[#140F4B]">
                {currentQuestion + 1}/{quiz.questions.length}
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
          <h2 className="text-2xl font-bold text-[#140F4B] mb-8">{question.text}</h2>

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
