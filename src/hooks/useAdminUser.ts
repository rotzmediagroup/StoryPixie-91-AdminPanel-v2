
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AdminUser } from '@/types';

// Enhanced function for finding admin users across collections
export const getAdminUserData = async (userId: string): Promise<AdminUser | null> => {
  try {
    console.log('Getting admin user data for:', userId);
    
    // First try adminUsers collection
    try {
      const userDoc = await getDoc(doc(db, 'adminUsers', userId));
      if (userDoc.exists()) {
        console.log('Found user in adminUsers collection');
        const userData = userDoc.data();
        
        // Update last login
        try {
          await setDoc(doc(db, 'adminUsers', userId), {
            lastLogin: serverTimestamp()
          }, { merge: true });
        } catch (updateError) {
          console.log('Non-critical error updating lastLogin:', updateError);
        }
        
        return {
          id: userId,
          ...userData as Omit<AdminUser, 'id'>,
          email: userData.email || 'unknown@email.com', // Ensure email exists
          name: userData.name || userData.displayName || 'Admin User', // Ensure name exists
          role: userData.role || 'admin', // Ensure role exists
          lastLogin: new Date().toISOString()
        } as AdminUser;
      }
    } catch (adminError) {
      console.log('Error or not found in adminUsers collection:', adminError);
    }
    
    // Then try users collection
    try {
      const userDoc2 = await getDoc(doc(db, 'users', userId));
      if (userDoc2.exists()) {
        console.log('Found user in users collection');
        const userData = userDoc2.data();
        
        // Check if user has admin role - more flexible detection
        let isAdmin = false;
        let role = userData.role;
        
        // Check various ways admin status might be stored
        if (role === 'super_admin' || 
            role === 'admin' || 
            userData.isAdmin === true || 
            userData.admin === true || 
            userData.userType === 'admin') {
          isAdmin = true;
          
          // If no proper role but user is marked as admin, assign super_admin
          if (!role || role === 'user') {
            role = userData.isAdmin ? 'super_admin' : 'admin';
          }
        }
        
        if (isAdmin) {
          // Update last login
          try {
            await setDoc(doc(db, 'users', userId), {
              lastLogin: serverTimestamp()
            }, { merge: true });
          } catch (updateError) {
            console.log('Non-critical error updating lastLogin:', updateError);
          }
          
          return {
            id: userId,
            email: userData.email || 'unknown@email.com',
            name: userData.name || userData.displayName || userData.email || 'Admin User',
            role: role || 'admin',
            lastLogin: new Date().toISOString()
          } as AdminUser;
        }
      }
    } catch (userError) {
      console.log('Error or not found in users collection:', userError);
    }
    
    // Try email match as last resort if we know the email
    try {
      // Get user from Firebase Auth and see if we can find by email
      const authUserDoc = await getDoc(doc(db, 'users', userId));
      if (authUserDoc.exists()) {
        const userEmail = authUserDoc.data().email;
        
        if (userEmail) {
          // Check if email exists in adminUsers
          const adminQuery = query(collection(db, 'adminUsers'), where('email', '==', userEmail));
          const adminSnapshot = await getDocs(adminQuery);
          
          if (!adminSnapshot.empty) {
            const adminDoc = adminSnapshot.docs[0];
            const adminData = adminDoc.data();
            
            return {
              id: adminDoc.id,
              email: adminData.email,
              name: adminData.name || adminData.displayName || adminData.email || 'Admin User',
              role: adminData.role || 'admin',
              lastLogin: new Date().toISOString()
            } as AdminUser;
          }
        }
      }
    } catch (emailMatchError) {
      console.log('Error trying email match:', emailMatchError);
    }
    
    // No valid admin user found
    return null;
  } catch (error) {
    console.error("Error fetching admin user data:", error);
    return null;
  }
};
