
/**
 * Service Account Authentication Utility
 * 
 * This file provides helper functions for Firebase Firestore authentication and operations.
 */

import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// Initialize Firebase with admin credentials if in development mode
const initAdminFirebase = () => {
  // In production, we rely on the regular Firebase config
  // In development, we could connect to emulators or use special credentials
  if (import.meta.env.DEV) {
    console.log("Running in development mode - enhanced permissions available");
    
    // Could connect to emulators here if needed
    // const db = getFirestore();
    // connectFirestoreEmulator(db, 'localhost', 8080);
    // 
    // const auth = getAuth();
    // connectAuthEmulator(auth, 'http://localhost:9099');
  }
};

// Call initialization
initAdminFirebase();

// Export all utility functions
export * from './databaseHelpers';
export * from './connectionHelpers';
export * from './userProfileHelpers';
export * from './adminUsersHelpers';
export * from './authHelpers';
