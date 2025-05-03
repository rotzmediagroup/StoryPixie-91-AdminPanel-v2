import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import { AdminUser } from '@/types';
import { getAdminUserData } from '@/hooks/useAdminUser';
import { logAdminActivity } from '@/utils/adminUsersHelpers';
import { checkUserMfaStatus } from '@/utils/authHelpers';

// Firebase login function with improved error handling
export const loginWithEmailAndPassword = async (email: string, password: string): Promise<{
  success: boolean; 
  requiresTwoFactor: boolean;
  userId: string | null;
  pendingUser: AdminUser | null;
}> => {
  try {
    console.log('Attempting login with:', email);
    
    // Try to sign in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('Firebase auth successful, getting user data');
    // Get user from Firestore
    const firestoreUser = await getAdminUserData(user.uid);
    
    if (firestoreUser) {
      console.log('Valid admin user found:', firestoreUser.id);
      
      // Check if user has 2FA enabled
      const hasMfa = await checkUserMfaStatus(user.uid);
      console.log('User has MFA enabled:', hasMfa);
      
      if (hasMfa) {
        console.log('User requires 2FA, storing pending state');
        
        // Log the admin login attempt
        await logAdminActivity(
          user.uid,
          email,
          'login_2fa_required',
          { success: true }
        );
        
        return {
          success: true,
          requiresTwoFactor: true,
          userId: user.uid,
          pendingUser: firestoreUser
        };
      }
      
      console.log('No 2FA required, completing login');
      
      // Log the admin login activity
      await logAdminActivity(
        user.uid,
        email,
        'login',
        { success: true }
      );
      
      return {
        success: true,
        requiresTwoFactor: false,
        userId: user.uid,
        pendingUser: firestoreUser
      };
    }
    
    console.log('No valid admin user found, signing out');
    // If no admin user found, sign out
    await signOut(auth);
    toast({
      variant: "destructive",
      title: "Unauthorized",
      description: "Your account does not have admin access."
    });

    return {
      success: false,
      requiresTwoFactor: false,
      userId: null,
      pendingUser: null
    };
  } catch (error: unknown) {
    console.error('Login error:', error);
    
    // Try to log failed login attempt if email is available
    if (email) {
      try {
        await logAdminActivity(
          'unknown',
          email,
          'login_failed',
          { 
            errorCode: (error as { code?: string })?.code,
            errorMessage: (error as { message?: string })?.message 
          }
        );
      } catch (logError) {
        console.error('Error logging failed login:', logError);
      }
    }
    
    // Provide more helpful error messages
    let errorMessage = "Invalid email or password";
    if ((error as { code?: string })?.code === 'auth/user-not-found' || (error as { code?: string })?.code === 'auth/wrong-password') {
      errorMessage = "Invalid email or password";
    } else if ((error as { code?: string })?.code === 'auth/too-many-requests') {
      errorMessage = "Too many failed login attempts. Please try again later.";
    } else if ((error as { code?: string })?.code === 'auth/network-request-failed') {
      errorMessage = "Network error. Please check your internet connection.";
    }
    
    toast({
      variant: "destructive",
      title: "Login failed",
      description: errorMessage
    });
    
    return {
      success: false,
      requiresTwoFactor: false,
      userId: null,
      pendingUser: null
    };
  }
};

// Logout function
export const logoutUser = async (userId: string | undefined, email: string | undefined): Promise<void> => {
  try {
    // Log the logout activity
    if (userId && email) {
      await logAdminActivity(
        userId,
        email,
        'logout',
        {}
      );
    }
    
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
  }
};
