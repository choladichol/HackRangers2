// Firestore user data management
import { db } from "@/lib/firebase"
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore"

export interface UserProgress {
  completedLessons: string[]
  completedQuizzes: { [quizId: string]: number } // quizId -> score
  notes: { [lessonId: string]: string }
}

export async function initializeUser(userId: string) {
  const userRef = doc(db, "users", userId)
  const userDoc = await getDoc(userRef)

  if (!userDoc.exists()) {
    await setDoc(userRef, {
      createdAt: new Date(),
      completedLessons: [],
      completedQuizzes: {},
      notes: {},
    })
  }
}

export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  const userRef = doc(db, "users", userId)
  const userDoc = await getDoc(userRef)
  return userDoc.exists() ? (userDoc.data() as UserProgress) : null
}

export async function markLessonComplete(userId: string, lessonId: string) {
  const userRef = doc(db, "users", userId)
  const userDoc = await getDoc(userRef)
  const currentData = userDoc.data() as UserProgress

  await updateDoc(userRef, {
    completedLessons: Array.from(new Set([...currentData.completedLessons, lessonId])),
  })
}

export async function saveQuizScore(userId: string, quizId: string, score: number) {
  const userRef = doc(db, "users", userId)
  const userDoc = await getDoc(userRef)
  const currentData = userDoc.data() as UserProgress

  await updateDoc(userRef, {
    completedQuizzes: {
      ...currentData.completedQuizzes,
      [quizId]: score,
    },
  })
}

export async function saveNotes(userId: string, lessonId: string, notes: string) {
  const userRef = doc(db, "users", userId)
  const userDoc = await getDoc(userRef)
  const currentData = userDoc.data() as UserProgress

  await updateDoc(userRef, {
    notes: {
      ...currentData.notes,
      [lessonId]: notes,
    },
  })
}
