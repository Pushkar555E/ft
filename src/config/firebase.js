// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDoYYNmvbaD6L7dWA5XFr_Ww8xHVpL2m5o",
  authDomain: "test-mode-be91f.firebaseapp.com",
  projectId: "test-mode-be91f",
  storageBucket: "test-mode-be91f.firebasestorage.app",
  messagingSenderId: "804961875673",
  appId: "1:804961875673:web:2f8dad71daa1f44fc070c8",
  measurementId: "G-S0N0Y7G88G"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
