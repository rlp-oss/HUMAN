import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Environment-variable configuration to prevent leaking private credentials on GitHub.
// Ensure these variables are set in your local .env or hosting environment.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "your-mock-api-key-here",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "human-ethical-ai.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "human-ethical-ai",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "human-ethical-ai.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "mock-sender-id",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "mock-app-id"
};

// Initialize Firebase App instance securely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Provider instance for Google OAuth Sign-In flow
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Executes a popup-based Google Sign-In and returns the user's ID token.
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const idToken = await result.user.getIdToken();
    
    return {
      user: result.user,
      idToken,
      credential
    };
  } catch (error) {
    console.error("Google Authentication flow error: ", error);
    throw error;
  }
}

/**
 * Signs the user out of the active Google session.
 */
export async function logOut() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error: ", error);
    throw error;
  }
}

export default app;
