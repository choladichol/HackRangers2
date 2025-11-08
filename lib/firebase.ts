// Firebase configuration and utilities
import { initializeApp, getApps, FirebaseApp } from "firebase/app"
import { getAuth, Auth } from "firebase/auth"
import { getFirestore, Firestore } from "firebase/firestore"
import { getStorage, FirebaseStorage } from "firebase/storage"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
}

// Validate configuration before initializing
const isConfigValid = 
  firebaseConfig.apiKey && 
  firebaseConfig.authDomain && 
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId

if (!isConfigValid && typeof window !== 'undefined') {
  // Only show error on client side, and make it less blocking
  console.warn("⚠️ Firebase configuration is incomplete!")
  console.warn("Missing environment variables. Please check your .env.local file.")
}

// Initialize Firebase (prevent multiple initializations)
let app: FirebaseApp | null = null
try {
  if (getApps().length === 0) {
    if (!isConfigValid) {
      // Don't throw, just log and return null app
      console.error("❌ Firebase configuration is incomplete. Cannot initialize Firebase.")
      console.error("Please ensure all NEXT_PUBLIC_FIREBASE_* environment variables are set in .env.local")
      console.error("Current values:", {
        hasApiKey: !!firebaseConfig.apiKey,
        hasAuthDomain: !!firebaseConfig.authDomain,
        hasProjectId: !!firebaseConfig.projectId,
      })
    } else {
      app = initializeApp(firebaseConfig)
      console.log("✅ Firebase initialized successfully")
    }
  } else {
    app = getApps()[0]
  }
} catch (error) {
  console.error("❌ Firebase initialization error:", error)
  // Don't throw - allow app to continue without Firebase
  app = null
}

// Export initialized services (only if app is initialized)
export const auth: Auth | null = app ? getAuth(app) : null
export const db: Firestore | null = app ? getFirestore(app) : null
export const storage: FirebaseStorage | null = app ? getStorage(app) : null

export default app
