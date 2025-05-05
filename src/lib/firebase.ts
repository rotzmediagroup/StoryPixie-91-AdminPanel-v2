// Firebase configuration for the admin panel
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration for StoryPixie V1 project
const firebaseConfig = {
  apiKey: "AIzaSyAWG04hMfpQjNNl347l-iDT2DTCknSDVbw",
  authDomain: "storypixie-v1.firebaseapp.com",
  projectId: "storypixie-v1",
  storageBucket: "storypixie-v1.appspot.com", // Corrected storageBucket value
  messagingSenderId: "390197904613",
  appId: "1:390197904613:web:8dc7c04b3ef467ea87c00c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app;
