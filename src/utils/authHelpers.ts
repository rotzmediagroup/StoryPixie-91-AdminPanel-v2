
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { AdminUser } from '@/types';
import { getAdminUserData } from '@/hooks/useAdminUser';

// Check if user has TOTP enabled
export const isTotpEnabled = async (userId: string): Promise<boolean> => {
  try {
    // Check in adminUsers collection first
    try {
      const userDoc = await getDoc(doc(db, 'adminUsers', userId));
      if (userDoc.exists() && userDoc.data().mfa?.enabled) {
        return true;
      }
    } catch (error) {
      console.log('Error checking adminUsers for TOTP:', error);
    }
    
    // Then check users collection
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists() && userDoc.data().mfa?.enabled) {
        return true;
      }
    } catch (error) {
      console.log('Error checking users for TOTP:', error);
    }
    
    // Then check specific TOTP collection if it exists
    try {
      const totpDoc = await getDoc(doc(db, 'userTOTP', userId));
      if (totpDoc.exists() && totpDoc.data().enabled) {
        return true;
      }
    } catch (error) {
      console.log('Error checking userTOTP collection:', error);
    }
    
    return false;
  } catch (error) {
    console.error('Error checking TOTP status:', error);
    return false;
  }
};

// Check if user has MFA enabled
export const checkUserMfaStatus = async (userId: string): Promise<boolean> => {
  // Use the existing TOTP check
  return isTotpEnabled(userId);
};

// Get current admin user data
export const getCurrentAdminUser = async (): Promise<AdminUser | null> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  return getAdminUserData(currentUser.uid);
};

// Verify if current user is an admin
export const verifyAdminAccess = async (): Promise<boolean> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;

    const adminUser = await getAdminUserData(currentUser.uid);
    return !!adminUser; // Return true if adminUser exists
  } catch (error) {
    console.error('Error verifying admin access:', error);
    return false;
  }
};

// Save TOTP secret for user
export const saveTotpSecret = async (
  userId: string,
  secret: string,
  verified: boolean = false
): Promise<boolean> => {
  try {
    // Try to save in adminUsers first
    try {
      const adminDocRef = doc(db, 'adminUsers', userId);
      const adminDoc = await getDoc(adminDocRef);
      
      if (adminDoc.exists()) {
        await setDoc(adminDocRef, {
          mfa: {
            enabled: verified,
            secret: secret,
            verified: verified,
            updatedAt: serverTimestamp()
          }
        }, { merge: true });
        return true;
      }
    } catch (adminError) {
      console.error('Error saving TOTP to adminUsers:', adminError);
    }
    
    // Then try users collection
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, {
        mfa: {
          enabled: verified,
          secret: secret,
          verified: verified,
          updatedAt: serverTimestamp()
        }
      }, { merge: true });
      return true;
    } catch (userError) {
      console.error('Error saving TOTP to users:', userError);
    }
    
    // Then try dedicated TOTP collection
    try {
      await setDoc(doc(db, 'userTOTP', userId), {
        secret,
        enabled: verified,
        verified,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (totpError) {
      console.error('Error saving to userTOTP:', totpError);
    }
    
    return false;
  } catch (error) {
    console.error('Error saving TOTP secret:', error);
    return false;
  }
};

// Disable TOTP for user
export const disableTotpForUser = async (userId: string): Promise<boolean> => {
  try {
    // Try to disable in all potential locations
    let success = false;
    
    // Disable in adminUsers
    try {
      const adminDocRef = doc(db, 'adminUsers', userId);
      const adminDoc = await getDoc(adminDocRef);
      
      if (adminDoc.exists()) {
        await setDoc(adminDocRef, {
          mfa: {
            enabled: false,
            verified: false,
            updatedAt: serverTimestamp()
          }
        }, { merge: true });
        success = true;
      }
    } catch (adminError) {
      console.error('Error disabling TOTP in adminUsers:', adminError);
    }
    
    // Disable in users
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        await setDoc(userDocRef, {
          mfa: {
            enabled: false,
            verified: false,
            updatedAt: serverTimestamp()
          }
        }, { merge: true });
        success = true;
      }
    } catch (userError) {
      console.error('Error disabling TOTP in users:', userError);
    }
    
    // Disable in dedicated TOTP collection
    try {
      const totpDocRef = doc(db, 'userTOTP', userId);
      const totpDoc = await getDoc(totpDocRef);
      
      if (totpDoc.exists()) {
        await setDoc(totpDocRef, {
          enabled: false,
          verified: false,
          updatedAt: serverTimestamp()
        }, { merge: true });
        success = true;
      }
    } catch (totpError) {
      console.error('Error disabling in userTOTP:', totpError);
    }
    
    return success;
  } catch (error) {
    console.error('Error disabling TOTP:', error);
    return false;
  }
};
