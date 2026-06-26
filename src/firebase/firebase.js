import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration for Rafeeq App
const firebaseConfig = {
  apiKey: "AIzaSyCxsyRcSh7bweiKV-B1y54DUxnhIAvFVzw",
  authDomain: "rafeeq-app-5334d.firebaseapp.com",
  projectId: "rafeeq-app-5334d",
  storageBucket: "rafeeq-app-5334d.firebasestorage.app",
  messagingSenderId: "714578612584",
  appId: "1:714578612584:web:09d8c198fb385b4fa2c6dd",
  measurementId: "G-3Z7GRGHDT7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export default app;
