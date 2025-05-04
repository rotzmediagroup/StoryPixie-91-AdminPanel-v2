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
  login: (email: string, password: string) => Promise<{success: boolean, requiresTwoFactor?: boolean, userId?: string | null, error?: string}>; // Adjusted return type
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading

  // Listen for Firebase auth state changes
  useEffect(() => {
    console.log('[AuthContext] Setting up Firebase auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setIsLoading(true); // Set loading true while processing
      setFirebaseUser(fbUser); // Store the raw Firebase user
      if (fbUser) {
        // User is signed in according to Firebase
        try {
          console.log('[AuthContext] Firebase user signed in:', fbUser.uid);
          // Fetch corresponding admin user data from Firestore
          const adminUserData = await getAdminUserData(fbUser.uid);
          
          if (adminUserData) {
            console.log('[AuthContext] Found admin user data:', adminUserData.email);
            // TODO: Re-implement 2FA check here if needed in the future
            // For now, assume login is complete if admin user exists
            setCurrentUser(adminUserData);
            setIsAuthenticated(true);
            console.log('[AuthContext] Authentication successful.');
          } else {
            // Firebase user exists, but no corresponding admin user found in Firestore
            console.warn('[AuthContext] Firebase user exists but is not a valid admin user.');
            await logoutUser(); // Log out the Firebase user
            setCurrentUser(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('[AuthContext] Error fetching admin user data:', error);
          await logoutUser(); // Log out on error
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // User is signed out
        console.log('[AuthContext] Firebase user signed out.');
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false); // Finished processing
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
    }
  };

  // Provide the context value
  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      firebaseUser,
      isAuthenticated, 
      isLoading, 
      login, 
      logout 
    }}>
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

