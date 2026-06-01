// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Get these from Firebase Console -> Project Settings
  authDomain: "naguorg-82831.firebaseapp.com",
  projectId: "naguorg-82831",
  storageBucket: "naguorg-82831.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);