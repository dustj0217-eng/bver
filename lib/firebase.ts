// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';

const firebaseConfig = { 
    apiKey: "AIzaSyCFJGhBsniHjCazJSo7XJW8IujPmsY9fYg", 
    authDomain: "bverhouse-13e0e.firebaseapp.com", 
    projectId: "bverhouse-13e0e", 
    storageBucket: "bverhouse-13e0e.firebasestorage.app", 
    messagingSenderId: "537167804501", 
    appId: "1:537167804501:web:002eded2583f4eff3abcdc", 
    measurementId: "G-5QXS7ERWJH" 
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);