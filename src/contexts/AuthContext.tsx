
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { AdminUser, UserRole } from '@/types';
import { auth } from '@/lib/firebase';
import { hasPermission as checkPermission, hasAdminManagementPermission } from '@/hooks/usePermissions';
import { checkUserMfaStatus } from '@/utils/authHelpers';
import { getAdminUserData } from '@/hooks/useAdminUser';
import { loginWithEmailAndPassword, logoutUser } from '@/hooks/useAuthOperations';
import { logAdminActivity } from '@/utils/adminUsersHelpers';

interface AuthContextType {
  currentUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{success: boolean, requiresTwoFactor: boolean, userId: string | null}>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
  canManageAdmins: () => boolean;
  completeLogin: () => void;
  isFirstTimeLogin: boolean;
  setIsFirstTimeLogin: (value: boolean) => void;
  pendingUserId: string | null;
  pendingUserEmail: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORED_USER_KEY = 'pixie_admin_user';
const FIRST_TIME_LOGIN_KEY = 'pixie_admin_first_login_complete';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pendingUser, setPendingUser] = useState<AdminUser | null>(null);
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState<boolean>(false);

  // Listen for Firebase auth state changes
  useEffect(() => {
    console.log('Setting up Firebase auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        try {
          console.log('Firebase auth state changed: user signed in', user.uid);
          // Get user from Firestore
          const firestoreUser = await getAdminUserData(user.uid);
          
          if (firestoreUser) {
            console.log('Retrieved Firestore user data:', firestoreUser);
            // Check if user has pending 2FA
            const requiresMfa = await checkUserMfaStatus(user.uid);
            console.log('User MFA status:', requiresMfa);
            
            // Check if this is the first login
            const hasCompletedFirstLogin = localStorage.getItem(`${FIRST_TIME_LOGIN_KEY}_${user.uid}`);
            const isFirstLogin = !hasCompletedFirstLogin && firestoreUser.lastLogin === new Date().toISOString();
            
            if (isFirstLogin) {
              console.log('First time login detected');
              setIsFirstTimeLogin(true);
              setPendingUser(firestoreUser);
              setCurrentUser(null);
              setIsAuthenticated(false);
            } else if (requiresMfa) {
              console.log('User requires 2FA verification');
              // Store user in pending state, don't complete login yet
              setPendingUser(firestoreUser);
              // If no 2FA verification completed yet, don't set the current user
              setCurrentUser(null);
              setIsAuthenticated(false);
              localStorage.removeItem(STORED_USER_KEY);
            } else {
              console.log('User does not require 2FA, completing login');
              // No 2FA required, complete login
              setCurrentUser(firestoreUser);
              setIsAuthenticated(true);
              localStorage.setItem(STORED_USER_KEY, JSON.stringify(firestoreUser));
              
              // Mark first login as complete
              if (isFirstLogin) {
                localStorage.setItem(`${FIRST_TIME_LOGIN_KEY}_${user.uid}`, 'true');
              }
            }
          } else {
            // No valid admin user found
            console.warn("Authenticated user is not an admin user");
            await logoutUser(undefined, undefined);
            setCurrentUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem(STORED_USER_KEY);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // User is signed out
        console.log('Firebase auth state changed: user signed out');
        setCurrentUser(null);
        setIsAuthenticated(false);
        setPendingUser(null);
        setIsFirstTimeLogin(false);
        localStorage.removeItem(STORED_USER_KEY);
      }
      setIsLoading(false);
    });

    return () => {
      console.log('Cleaning up Firebase auth state listener');
      unsubscribe();
    };
  }, []);

  // Login function wrapper
  const login = async (email: string, password: string) => {
    const result = await loginWithEmailAndPassword(email, password);
    if (result.pendingUser) {
      setPendingUser(result.pendingUser);
      
      // Check if this is the first login
      const hasCompletedFirstLogin = localStorage.getItem(`${FIRST_TIME_LOGIN_KEY}_${result.userId}`);
      if (!hasCompletedFirstLogin && result.pendingUser.lastLogin === new Date().toISOString()) {
        setIsFirstTimeLogin(true);
      }
    }
    return {
      success: result.success,
      requiresTwoFactor: result.requiresTwoFactor,
      userId: result.userId
    };
  };

  // Complete login after 2FA verification
  const completeLogin = () => {
    if (pendingUser) {
      console.log('Completing login after 2FA for user:', pendingUser.email);
      setCurrentUser(pendingUser);
      setIsAuthenticated(true);
      localStorage.setItem(STORED_USER_KEY, JSON.stringify(pendingUser));
      
      // Log successful 2FA verification
      logAdminActivity(
        pendingUser.id,
        pendingUser.email,
        'login_2fa_completed',
        { success: true }
      );
      
      // Mark first login as complete
      if (isFirstTimeLogin) {
        localStorage.setItem(`${FIRST_TIME_LOGIN_KEY}_${pendingUser.id}`, 'true');
        setIsFirstTimeLogin(false);
      }
      
      setPendingUser(null);
    } else {
      console.error('No pending user to complete login for');
    }
  };

  const logout = async () => {
    await logoutUser(currentUser?.id, currentUser?.email);
    setCurrentUser(null);
    setIsAuthenticated(false);
    setPendingUser(null);
    setIsFirstTimeLogin(false);
    localStorage.removeItem(STORED_USER_KEY);
  };

  // Permission check wrapper
  const hasPermission = (requiredRole: UserRole): boolean => {
    return checkPermission(currentUser?.role, requiredRole);
  };

  // Check if user can manage admins
  const canManageAdmins = (): boolean => {
    return hasAdminManagementPermission(currentUser?.role);
  };

  if (isLoading) {
    // Loading spinner
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isAuthenticated, 
      login, 
      logout, 
      hasPermission,
      canManageAdmins,
      completeLogin,
      isFirstTimeLogin,
      setIsFirstTimeLogin,
      pendingUserId: pendingUser?.id || null,
      pendingUserEmail: pendingUser?.email || null
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
