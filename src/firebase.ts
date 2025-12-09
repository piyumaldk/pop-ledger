import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  Auth,
} from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Read Vite env vars (these may be undefined in non-Vite environments)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "",
};

const requiredKeys: (keyof typeof firebaseConfig)[] = [
  "apiKey",
  "authDomain",
  "projectId",
  "appId",
];

const missing = requiredKeys.filter((k) => !firebaseConfig[k]);
if (missing.length) {
  // eslint-disable-next-line no-console
  console.error("Firebase configuration missing required keys:", missing);
}

export const firebaseInitialized = missing.length === 0;

let app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (firebaseInitialized) {
  // Initialize Firebase app only once (useful for hot-reload / dev)
  app = getApps().length ? getApp() : initializeApp(firebaseConfig as any);
  _auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
}

export { _auth as auth, db, googleProvider };

// Sign-in helper: throws if Firebase not initialized
export const signInWithGoogle = async () => {
  if (!firebaseInitialized || !_auth || !googleProvider) {
    throw new Error("Firebase not configured. Please set VITE_FIREBASE_* env vars and restart the dev server.");
  }
  return signInWithPopup(_auth, googleProvider);
};

export const signOutUser = async () => {
  if (!_auth) return;
  return signOut(_auth);
};
