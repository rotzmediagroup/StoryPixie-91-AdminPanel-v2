
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, query, limit, doc, getDoc, where, setDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from '@/components/ui/use-toast';

// Validate a user's admin rights - improved to check multiple collections
export const validateAdminUser = async (uid: string): Promise<boolean> => {
  try {
    console.log('Validating admin user with UID:', uid);
    
    // First check adminUsers collection
    try {
      const userDoc = await getDoc(doc(db, 'adminUsers', uid));
      if (userDoc.exists()) {
        console.log('Admin user validated successfully in adminUsers collection');
        const userData = userDoc.data();
        return !!userData.role; // Return true if role exists
      }
    } catch (error) {
      console.error('Error checking adminUsers collection:', error);
    }
    
    // Then check users collection with admin roles
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'super_admin' || userData.role === 'admin' || userData.isAdmin === true) {
          console.log('Admin user validated successfully in users collection');
          return true;
        }
      }
    } catch (error) {
      console.error('Error checking users collection:', error);
    }
    
    console.log('Admin user not validated in any collection');
    return false;
  } catch (error) {
    console.error('Error validating admin user:', error);
    return false;
  }
};

// Get admin user permissions
export const getAdminPermissions = async (uid: string): Promise<string[]> => {
  try {
    // Check adminUsers collection first
    const userDoc = await getDoc(doc(db, 'adminUsers', uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.permissions || [];
    }
    
    // Then check users collection
    const regularUserDoc = await getDoc(doc(db, 'users', uid));
    if (regularUserDoc.exists()) {
      const userData = regularUserDoc.data();
      if (userData.role === 'super_admin' || userData.role === 'admin' || userData.isAdmin === true) {
        // Default permissions for admins from users collection
        return ['view_dashboard', 'view_users', 'view_metrics'];
      }
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching admin permissions:', error);
    return [];
  }
};

// Ensure admin has access to metrics - improved to grant access to more roles
export const ensureMetricsAccess = async (uid: string): Promise<boolean> => {
  try {
    // Check if user has access to metrics in adminRights collection
    try {
      const rightsDoc = await getDoc(doc(db, 'adminRights', uid));
      if (rightsDoc.exists() && rightsDoc.data().hasMetricsAccess) {
        console.log('User has existing metrics access in adminRights');
        return true;
      }
    } catch (error) {
      console.log('Error checking adminRights:', error);
    }
    
    // If no explicit rights exist, check user role
    let userRole = null;
    
    // Check in adminUsers collection
    try {
      const userDoc = await getDoc(doc(db, 'adminUsers', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        userRole = userData.role;
      }
    } catch (error) {
      console.log('Error checking adminUsers for role:', error);
    }
    
    // If role not found, check users collection
    if (!userRole) {
      try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.isAdmin) {
            userRole = 'super_admin';
          } else {
            userRole = userData.role;
          }
        }
      } catch (error) {
        console.log('Error checking users collection for role:', error);
      }
    }
    
    // Grant access based on role
    if (['super_admin', 'admin', 'content_moderator', 'analytics_viewer'].includes(userRole || '')) {
      console.log('Granting metrics access based on role:', userRole);
      // Grant metrics access
      try {
        await setDoc(doc(db, 'adminRights', uid), {
          hasMetricsAccess: true,
          hasUsersAccess: true,
          updatedAt: serverTimestamp()
        }, { merge: true });
        return true;
      } catch (error) {
        console.log('Error granting metrics access:', error);
      }
    }
    
    console.log('User does not have sufficient role for metrics access');
    return false;
  } catch (error) {
    console.error('Error ensuring metrics access:', error);
    return false;
  }
};

// Debug function to list users from the database
export const listUsersFromDatabase = async (): Promise<
  { source: string; collection: string; data: Record<string, unknown>[] } |
  { error: string; checkedFirestoreCollections: string[] }
> => {
  try {
    console.log('Attempting to list StoryPixie users from Firestore...');
    
    // Try different Firestore collections
    const collections = ['adminUsers', 'users', 'Users', 'customers', 'accounts', 'profiles'];
    
    for (const collName of collections) {
      try {
        console.log(`Checking Firestore collection: ${collName}`);
        const querySnapshot = await getDocs(query(collection(db, collName), limit(10)));
        
        if (!querySnapshot.empty) {
          const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log(`Found ${users.length} users in Firestore collection '${collName}'`);
          return {
            source: 'firestore',
            collection: collName,
            data: users
          };
        } else {
          console.log(`No documents found in Firestore collection: ${collName}`);
        }
      } catch (collError) {
        console.log(`Error checking Firestore collection '${collName}':`, collError);
      }
    }
    
    console.log('No users found in common Firestore collections');
    return {
      error: 'No user data found in common Firestore collections',
      checkedFirestoreCollections: collections
    };
  } catch (error) {
    console.error('Error listing users from database:', error);
    return {
      error: (error as Error).message
    };
  }
};
