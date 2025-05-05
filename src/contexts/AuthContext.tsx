import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { AdminUser } from '@/types'; // Assuming UserRole is part of AdminUser or not needed for basic auth
import { auth } from '@/lib/firebase';
import { getAdminUserData } from '@/hooks/useAdminUser';
import { loginWithEmailAndPassword, logoutUser } from '@/lib/authOperations';

interface AuthContextType {
  currentUser: AdminUser | null;
  firebaseUser: FirebaseUser | null; // Keep track of the raw Firebase user
  isAuthenticated: boolean;
  isLoading: boolean; // Added loading state
  authError: string | null; // Added error state
  login: (email: string, password: string) => Promise<{success: boolean, requiresTwoFactor?: boolean, userId?: string | null, error?: string}>; // Adjusted return type
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading
  const [authError, setAuthError] = useState<string | null>(null); // Initialize error state

  // Listen for Firebase auth state changes
  useEffect(() => {
    console.log('[AuthContext] Setting up Firebase auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      console.log('[AuthContext] Auth state changed. Setting isLoading to true.');
      setIsLoading(true); // Set loading true while processing
      setAuthError(null); // Clear previous errors on new auth state change
      setFirebaseUser(fbUser); // Store the raw Firebase user
      let authenticated = false; // Track auth status locally
      let userToSet: AdminUser | null = null;
      let errorToSet: string | null = null;

      try { // Outer try to ensure finally block runs
        if (fbUser) {
          // User is signed in according to Firebase
          console.log('[AuthContext] Firebase user signed in:', fbUser.uid);
          try {
            console.log('[AuthContext] Attempting to fetch admin user data for UID:', fbUser.uid);
            // Fetch corresponding admin user data from Firestore
            const adminUserData = await getAdminUserData(fbUser.uid);
            console.log('[AuthContext] getAdminUserData returned:', adminUserData);

            // Check if admin user data exists AND has a valid admin role OR isAdmin flag
            // Use the role from getAdminUserData which already handles isAdmin: true logic
            if (adminUserData && adminUserData.role && ['admin', 'super_admin'].includes(adminUserData.role)) { 
              console.log('[AuthContext] Found valid admin user data:', adminUserData.email);
              userToSet = adminUserData;
              authenticated = true;
              console.log('[AuthContext] Authentication successful.');
            } else {
              // Firebase user exists, but no corresponding admin user found or role is invalid
              const reason = adminUserData ? `Invalid role ('${adminUserData.role}')` : 'Admin user data not found';
              console.warn(`[AuthContext] Firebase user exists but is not a valid admin user. Reason: ${reason}. Logging out.`);
              errorToSet = `Authentication failed: ${reason}. Ensure user exists in Firestore with 'admin' or 'super_admin' role, or 'isAdmin: true'.`; // Set error state
              await logoutUser(); // Log out the Firebase user
            }
          } catch (error) {
            console.error('[AuthContext] Error fetching admin user data:', error);
            errorToSet = error instanceof Error ? `Error fetching user data: ${error.message}` : 'An unknown error occurred fetching user data.'; // Set error state
            try {
              console.log('[AuthContext] Attempting logout due to fetch error.');
              await logoutUser(); // Attempt to log out on error
            } catch (logoutError) {
              console.error('[AuthContext] Error during logout after fetch error:', logoutError);
            }
          }
        } else {
          // User is signed out
          console.log('[AuthContext] Firebase user signed out.');
        }
      } finally {
        // Update state outside the try/catch to ensure isLoading is always set
        console.log('[AuthContext] Entering finally block. Updating state.');
        setCurrentUser(userToSet);
        setIsAuthenticated(authenticated);
        setAuthError(errorToSet);
        setIsLoading(false); // Finished processing, *always* set loading to false here
        console.log('[AuthContext] Finished processing auth state change. isLoading set to false.');
      }
    });

    // Cleanup listener on unmount
    return () => {
      console.log('[AuthContext] Cleaning up Firebase auth state listener');
      unsubscribe();
    };
  }, []);

  // Simplified Login function
  const login = async (email: string, password: string): Promise<{success: boolean, requiresTwoFactor?: boolean, userId?: string | null, error?: string}> => {
    try {
      // loginWithEmailAndPassword should ideally just handle the Firebase sign-in
      // The onAuthStateChanged listener will handle fetching user data and setting state
      const result = await loginWithEmailAndPassword(email, password);

      // The listener will automatically pick up the state change and update context
      // We might return success/failure/2FA requirement from the operation itself
      return { success: result.success, requiresTwoFactor: result.requiresTwoFactor, userId: result.userId };
    } catch (error: any) {
      console.error('[AuthContext] Login failed:', error);
      return { success: false, error: error.message };
    }
  };

  // Simplified Logout function
  const logout = async (): Promise<void> => {
    try {
      await logoutUser(currentUser?.id, currentUser?.email); // Pass user info for logging if available
      // Listener will handle setting state to unauthenticated
      console.log('[AuthContext] Logout successful.');
    } catch (error) {
      console.error('[AuthContext] Logout failed:', error);
      // Even if Firebase logout fails, clear local state
      setCurrentUser(null);
      setFirebaseUser(null);
      setIsAuthenticated(false);
      setIsLoading(false); // Ensure loading is false
      setAuthError(null); // Clear error on logout
    }
  };

  // Provide the context value
  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      firebaseUser,
      isAuthenticated, 
      isLoading, 
      authError, // Provide error state
      login, 
      logout 
    }}>
      {/* Render a global error message if authError is set */}
      {authError && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(220, 38, 38, 0.9)', color: 'white', padding: '10px', textAlign: 'center', zIndex: 9999, fontSize: '0.9rem' }}>
          Authentication Error: {authError}
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
