// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3JQDdnymSTYxNIxXyJmlWowOpcpbLGzc",
  authDomain: "house-market-app-45261.firebaseapp.com",
  projectId: "house-market-app-45261",
  storageBucket: "house-market-app-45261.appspot.com",
  messagingSenderId: "653723661801",
  appId: "1:653723661801:web:5f41536b7de286a8e3c778",
  measurementId: "G-SB64K5DNJD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore();
