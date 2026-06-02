// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
 apiKey: "AIzaSyDgfSc7e-Sgpri8KImMJ5UC3HHC7fFQlgQ",
  authDomain: "naguorg-82831.firebaseapp.com",
  databaseURL: "https://naguorg-82831-default-rtdb.firebaseio.com",
  projectId: "naguorg-82831",
  storageBucket: "naguorg-82831.firebasestorage.app",
  messagingSenderId: "924827024871",
  appId: "1:924827024871:web:055ea63e971e03deea5142",
  measurementId: "G-2NP17QSXGE"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);