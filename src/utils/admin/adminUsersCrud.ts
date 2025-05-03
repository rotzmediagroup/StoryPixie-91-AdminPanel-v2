
import { collection, doc, setDoc, getDoc, getDocs, query, where, deleteDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { AdminUser, UserRole } from '@/types';
import { toast } from '@/hooks/use-toast';
import { logAdminActivity } from './adminLogsHelpers';

// Get all admin users
export const getAdminUsers = async (): Promise<AdminUser[]> => {
  try {
    const adminUsersSnapshot = await getDocs(collection(db, 'adminUsers'));
    return adminUsersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AdminUser));
  } catch (error) {
    console.error('Error fetching admin users:', error);
    toast({
      title: "Error",
      description: "Failed to fetch admin users.",
      variant: "destructive"
    });
    return [];
  }
};

// Create a new admin user
export const createAdminUser = async (
  email: string,
  password: string,
  name: string,
  role: UserRole,
  currentAdminId: string,
  currentAdminEmail: string
): Promise<AdminUser | null> => {
  try {
    // Create Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const newAdminUser: Omit<AdminUser, 'id'> = {
      email,
      name,
      role,
      lastLogin: new Date().toISOString()
    };
    
    // Add user to Firestore
    await setDoc(doc(db, 'adminUsers', user.uid), {
      ...newAdminUser,
      createdAt: serverTimestamp(),
      createdBy: currentAdminId
    });
    
    // Log the activity
    await logAdminActivity(
      currentAdminId,
      currentAdminEmail,
      'created_admin_user',
      { createdUserId: user.uid, userRole: role, userName: name }
    );
    
    return {
      id: user.uid,
      ...newAdminUser
    };
  } catch (error) {
    console.error('Error creating admin user:', error);
    toast({
      title: "Error",
      description: (error as Error).message || "Failed to create admin user.",
      variant: "destructive"
    });
    return null;
  }
};

// Update admin user role
export const updateAdminUserRole = async (
  userId: string,
  newRole: UserRole,
  currentAdminId: string,
  currentAdminEmail: string
): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'adminUsers', userId), {
      role: newRole,
      updatedAt: serverTimestamp()
    });
    
    await logAdminActivity(
      currentAdminId,
      currentAdminEmail,
      'updated_admin_role',
      { updatedUserId: userId, newRole }
    );
    
    return true;
  } catch (error) {
    console.error('Error updating admin role:', error);
    toast({
      title: "Error",
      description: "Failed to update user role.",
      variant: "destructive"
    });
    return false;
  }
};

// Remove admin user
export const removeAdminUser = async (
  userId: string,
  currentAdminId: string,
  currentAdminEmail: string
): Promise<boolean> => {
  try {
    // Get user data before deletion for logging
    const userDoc = await getDoc(doc(db, 'adminUsers', userId));
    const userData = userDoc.data();
    
    await deleteDoc(doc(db, 'adminUsers', userId));
    
    await logAdminActivity(
      currentAdminId,
      currentAdminEmail,
      'removed_admin_user',
      { 
        removedUserId: userId, 
        removedUserEmail: userData?.email,
        removedUserRole: userData?.role
      }
    );
    
    return true;
  } catch (error) {
    console.error('Error removing admin user:', error);
    toast({
      title: "Error",
      description: "Failed to remove admin user.",
      variant: "destructive"
    });
    return false;
  }
};
