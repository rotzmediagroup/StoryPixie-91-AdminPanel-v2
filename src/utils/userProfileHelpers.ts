
import { db } from '@/lib/firebase';
import { collection, query, getDocs, doc, getDoc, updateDoc, where } from 'firebase/firestore';
import { User } from '@/types';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

// Get user profile data
export const getUserProfile = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        id: uid,
        email: userData.email || '',
        name: userData.name || userData.displayName || '',
        role: userData.role || 'user',
        platform: userData.platform || 'web',
        registrationDate: userData.registrationDate || userData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        lastLoginDate: userData.lastLoginDate || userData.lastLogin?.toDate?.()?.toISOString() || '',
        status: userData.status || 'active',
        credits: userData.credits || 0,
        profileImage: userData.profileImage || userData.photoURL || '',
        subscription: userData.subscription || null
      } as User;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (uid: string, profileData: Partial<User>): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return false;
  }
};

// Get user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      
      return {
        id: userDoc.id,
        email: userData.email || '',
        name: userData.name || userData.displayName || '',
        role: userData.role || 'user',
        platform: userData.platform || 'web',
        registrationDate: userData.registrationDate || userData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        lastLoginDate: userData.lastLoginDate || userData.lastLogin?.toDate?.()?.toISOString() || '',
        status: userData.status || 'active',
        credits: userData.credits || 0,
        profileImage: userData.profileImage || userData.photoURL || '',
        subscription: userData.subscription || null
      } as User;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
};

// Check if user exists
export const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    const user = await getUserByEmail(email);
    return user !== null;
  } catch (error) {
    console.error("Error checking if user exists:", error);
    return false;
  }
};

export const changeUserPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<boolean> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error('No user is currently logged in.');

    // Re-authenticate user
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);
    return true;
  } catch (error) {
    console.error('Error changing user password:', error);
    throw error;
  }
};
