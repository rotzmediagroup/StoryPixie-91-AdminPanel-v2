import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getAdminUserData } from '@/hooks/useAdminUser'; // Keep this if needed for logging or checks
import { logAdminActivity } from '@/utils/adminUsersHelpers'; // Keep this if needed for logging

/**
 * Attempts to sign in a user with email and password using Firebase Authentication.
 * Does not handle 2FA directly; assumes the onAuthStateChanged listener will manage state.
 */
export const loginWithEmailAndPassword = async (email: string, password: string): Promise<{success: boolean, userId?: string | null, error?: string}> => {
  try {
    console.log(`[authOperations] Attempting login for ${email}`);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    console.log(`[authOperations] Firebase sign-in successful for user ID: ${userId}`);
    
    // Optional: Log successful Firebase sign-in attempt (before admin check)
    // logAdminActivity(userId, email, 'login_attempt_firebase_success', { success: true });

    // The onAuthStateChanged listener in AuthContext will handle fetching admin data 
    // and setting the final authenticated state.
    return { success: true, userId: userId };

  } catch (error: any) {
    console.error(`[authOperations] Firebase sign-in failed for ${email}:`, error);
    // Optional: Log failed Firebase sign-in attempt
    // logAdminActivity(undefined, email, 'login_attempt_firebase_failed', { success: false, error: error.code });
    
    // Provide a user-friendly error message
    let errorMessage = 'Login failed. Please check your credentials.';
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Access temporarily disabled due to too many failed login attempts. Please try again later.';
    }
    return { success: false, error: errorMessage };
  }
};

/**
 * Signs out the current Firebase user.
 */
export const logoutUser = async (adminUserId?: string, adminUserEmail?: string): Promise<void> => {
  try {
    console.log('[authOperations] Attempting Firebase sign-out');
    await signOut(auth);
    console.log('[authOperations] Firebase sign-out successful.');
    
    // Optional: Log successful sign-out
    if (adminUserId && adminUserEmail) {
      // logAdminActivity(adminUserId, adminUserEmail, 'logout_success', { success: true });
    }

  } catch (error: any) {
    console.error('[authOperations] Firebase sign-out failed:', error);
    // Optional: Log failed sign-out attempt
    if (adminUserId && adminUserEmail) {
     // logAdminActivity(adminUserId, adminUserEmail, 'logout_failed', { success: false, error: error.code });
    }
    // Re-throw the error so the caller (AuthContext) can handle it if needed
    throw error;
  }
};

