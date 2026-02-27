import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyACHCGDuYXUhut6_p3gluHKp9XrCVBvuG4",
  authDomain: "sitskillbridge.firebaseapp.com",
  projectId: "sitskillbridge",
  storageBucket: "sitskillbridge.firebasestorage.app",
  messagingSenderId: "311354448221",
  appId: "1:311354448221:web:5a22afcd099064437af0b4",
  measurementId: "G-GSC9919C0B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;