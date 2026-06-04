import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAUKSugnOewRfVUggbtRW_MusIUCjPCVZU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "aruk-beauty-line-601c1.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "aruk-beauty-line-601c1",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "aruk-beauty-line-601c1.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "235319439231",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:235319439231:web:70e76234a49dd3e650b44a",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-081B4SVRG7"
};

// Initialise Firebase app (ensures single instance)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Export Firebase Client services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export default app;
