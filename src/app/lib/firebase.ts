import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAUKSugnOewRfVUggbtRW_MusIUCjPCVZU",
  authDomain: "aruk-beauty-line-601c1.firebaseapp.com",
  projectId: "aruk-beauty-line-601c1",
  storageBucket: "aruk-beauty-line-601c1.firebasestorage.app",
  messagingSenderId: "235319439231",
  appId: "1:235319439231:web:70e76234a49dd3e650b44a",
  measurementId: "G-081B4SVRG7"
};

// Initialise Firebase app (ensures single instance)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Export Firebase Client services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export default app;
