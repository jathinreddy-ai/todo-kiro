// Firebase client — used for realtime Firestore sync across tabs/devices.
// Credentials are loaded from .env (VITE_FIREBASE_*).
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Only initialize if credentials are present and not placeholder values
const isConfigured =
  firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("your-firebase");

let app = null;
let db = null;

if (isConfigured) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
}

export { db };
export const isFirebaseConfigured = isConfigured;

/* ─── Firestore structure ────────────────────────────────────────────────────

Collection: users/{userId}/tasks/{taskId}
Document fields mirror the Supabase tasks table.

Firestore security rules (paste in Firebase console → Firestore → Rules):

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}

──────────────────────────────────────────────────────────────────────────── */
