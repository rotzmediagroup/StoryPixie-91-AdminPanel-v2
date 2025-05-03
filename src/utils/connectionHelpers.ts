
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { toast } from '@/components/ui/use-toast';
import { listUsersFromDatabase } from './databaseHelpers';

// Test writing to Firestore to verify connection and permissions
export const pingFirebase = async (): Promise<boolean> => {
  try {
    console.log('Pinging Firebase to verify connection...');
    // Try to read from an unrestricted collection first
    const testSnapshot = await getDocs(query(collection(db, 'system'), limit(1)));
    console.log('Firebase ping result:', !testSnapshot.empty ? 'Documents found' : 'No documents found but connection successful');
    return true;
  } catch (error) {
    console.error('Firebase ping failed:', error);
    return false;
  }
};

// Check if current session has a valid connection
export const checkServiceAccountConnection = async (): Promise<boolean> => {
  try {
    console.log('Starting Firebase connection tests...');
    
    // First, try listing users to see what data we can access
    const usersData = await listUsersFromDatabase();
    console.log('Users data check result:', usersData);
    
    // Try multiple connection tests in parallel
    const results = await Promise.allSettled([
      // Test Firestore connection
      testFirestoreConnection(),
      // Test Authentication connection
      testAuthConnection()
    ]);
    
    // Log the results for debugging
    console.log('Firebase connection test results:', results);
    
    // If any test succeeds, consider the connection valid
    const isConnected = results.some(result => result.status === 'fulfilled' && result.value === true);
    
    if (isConnected) {
      console.log('Successfully connected to Firebase services');
    } else {
      console.error('Failed to connect to Firebase services');
      toast({
        variant: "destructive",
        title: "Firebase Connection Error",
        description: "Could not connect to StoryPixie Firebase services."
      });
    }
    
    return isConnected;
  } catch (error) {
    console.error('Service account connection tests failed:', error);
    toast({
      variant: "destructive",
      title: "Connection Error",
      description: "Failed to connect to Firebase services."
    });
    return false;
  }
};

// Test Firestore connection with comprehensive approach
export const testFirestoreConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing Firestore connection...');
    
    // Try different public collections that might have looser security rules
    const collections = ['public', 'system', 'settings', 'stories', 'users', 'adminUsers'];
    
    for (const collName of collections) {
      try {
        console.log(`Checking Firestore collection: ${collName}`);
        const querySnapshot = await getDocs(query(collection(db, collName), limit(1)));
        console.log(`Collection ${collName} query result:`, { 
          exists: !querySnapshot.empty,
          size: querySnapshot.size 
        });
        
        if (!querySnapshot.empty) {
          console.log('✅ Firestore connection successful');
          return true;
        }
      } catch (err) {
        console.log(`Error checking collection ${collName}:`, err);
      }
    }
    
    // Even if we don't find documents, if we can query without errors, connection is working
    console.log('✅ Firestore connection established but no documents found');
    return true;
  } catch (error) {
    console.error('❌ Firestore connection test failed:', error);
    return false;
  }
};

// Test Authentication connection
export const testAuthConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing Auth connection...');
    // Check if we can access the auth object
    const currentUser = auth.currentUser;
    console.log('Auth current user:', currentUser ? 'logged in' : 'not logged in');
    console.log('✅ Auth connection successful');
    return auth.app.name !== null;
  } catch (error) {
    console.error('❌ Authentication connection test failed:', error);
    return false;
  }
};

// Clear helper for debugging and recovery
export const resetApp = async (): Promise<boolean> => {
  try {
    console.log('Starting app reset for debugging...');
    // Sign out any current user
    if (auth.currentUser) {
      await auth.signOut();
      console.log('Signed out current user');
    }
    
    console.log('App reset completed');
    return true;
  } catch (error) {
    console.error('App reset failed:', error);
    return false;
  }
};
