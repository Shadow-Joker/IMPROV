// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCsa8TeJ8A3cF3ALdBKXokloFzLkSvBFz8",
  authDomain: "sentrak-f4333.firebaseapp.com",
  projectId: "sentrak-f4333",
  storageBucket: "sentrak-f4333.firebasestorage.app",
  messagingSenderId: "56799989918",
  appId: "1:56799989918:web:88734dfaaa0daf516d2b8f",
  measurementId: "G-ZBKMS43K15"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Enable offline persistence for Firestore
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('[Firebase] Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('[Firebase] The current browser does not support all of the features necessary to enable persistence.');
    }
  });
}

export { app, db, auth, storage, analytics };
