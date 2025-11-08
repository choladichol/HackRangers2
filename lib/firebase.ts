// Firebase configuration and utilities
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage" // <-- NEW: Import for Firebase Storage

// ADD THIS LINE FOR DEBUGGING:
console.log("My API Key is:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

// Export all initialized services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app) // <-- NEW: Initialize and Export Storage

// Note: I removed the 'export default app' for cleaner named exports, which your components were already using.
