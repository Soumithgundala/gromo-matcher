// src/firebaseconfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJmLRwHMgij5M0L-i4lYUa2lw3N8OLA5w",
  authDomain: "gromoprototype.firebaseapp.com",
  projectId: "gromoprototype",
  storageBucket: "gromoprototype.firebasestorage.app",
  messagingSenderId: "1011917579848",
  appId: "1:1011917579848:web:e5431cea6925698ee89a7d",
  measurementId: "G-4ERHCFP8BP"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
