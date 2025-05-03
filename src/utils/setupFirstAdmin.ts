import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, getDocs, limit, writeBatch } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';

/**
 * This script sets up the first admin user for the StoryPixie Admin Panel.
 */

// Check if any admin users already exist using a more resilient approach
const checkIfAdminUsersExists = async (): Promise<boolean> => {
  try {
    console.log('Checking if any admin users exist in the database...');
    
    // First try to check using admin users collection
    try {
      const querySnapshot = await getDocs(query(collection(db, 'adminUsers'), limit(1)));
      if (!querySnapshot.empty) {
        console.log('Admin users exist in adminUsers collection.');
        return true;
      }
    } catch (error) {
      console.log('Error checking adminUsers collection:', error);
      // Continue to try other methods
    }
    
    // Then try to check using users collection with admin role
    try {
      const usersSnapshot = await getDocs(query(collection(db, 'users'), limit(10)));
      if (!usersSnapshot.empty) {
        const adminExists = usersSnapshot.docs.some(doc => {
          const data = doc.data();
          return data.role === 'admin' || data.role === 'super_admin';
        });
        
        if (adminExists) {
          console.log('Admin users exist in users collection.');
          return true;
        }
      }
    } catch (error) {
      console.log('Error checking users collection:', error);
      // Continue with setup regardless
    }
    
    console.log('No admin users found in database.');
    return false;
  } catch (error) {
    console.error("Error checking admin users:", error);
    return false;
  }
};

// Create admin user document with more resilient approach
const createAdminUserDocument = async (uid: string, userData: Record<string, unknown>): Promise<boolean> => {
  try {
    console.log('Creating admin user document for UID:', uid);
    
    // Try creating in adminUsers collection first
    try {
      const adminDocRef = doc(db, 'adminUsers', uid);
      await setDoc(adminDocRef, {
        ...userData,
        role: "super_admin",
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
      console.log('Admin user document created successfully in adminUsers collection');
      return true;
    } catch (adminError: unknown) {
      console.error('Error creating admin document in adminUsers collection:', adminError);
      
      // Try creating in users collection as fallback
      try {
        const userDocRef = doc(db, 'users', uid);
        await setDoc(userDocRef, {
          ...userData,
          role: "super_admin",
          isAdmin: true,
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString()
        });
        console.log('Admin user document created successfully in users collection');
        return true;
      } catch (userError: unknown) {
        console.error('Error creating admin document in users collection:', userError);
        return false;
      }
    }
  } catch (error: unknown) {
    console.error('Error creating admin document:', error);
    return false;
  }
};

export const setupFirstAdmin = async (): Promise<boolean> => {
  try {
    const email = "jerome@storypixie.online";
    const password = "Welkom10!#";
    const name = "Jerome StoryPixie";
    
    console.log('Starting setup of first admin user with email:', email);
    
    let user;
    
    // First try to create a new user with Firebase Authentication
    try {
      console.log('Attempting to create new user with email:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      user = userCredential.user;
      console.log('New user created with UID:', user.uid);
    } catch (createError: unknown) {
      console.log('Error creating new user:', (createError as { code?: string })?.code, (createError as { message?: string })?.message);
      
      // If email already exists, try to sign in
      if ((createError as { code?: string })?.code === 'auth/email-already-in-use') {
        console.log('User already exists, attempting to sign in...');
        
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          user = userCredential.user;
          console.log('Successfully signed in as:', user.uid);
        } catch (signInError: unknown) {
          console.error('Error signing in:', (signInError as { code?: string })?.code, (signInError as { message?: string })?.message);
          toast({
            variant: "destructive",
            title: "Authentication failed",
            description: "The password may be incorrect for the existing account.",
          });
          return false;
        }
      } else {
        console.error('Error creating admin user:', (createError as { code?: string })?.code, (createError as { message?: string })?.message);
        toast({
          variant: "destructive",
          title: "Setup failed",
          description: (createError as { message?: string })?.message || "Failed to create admin user",
        });
        return false;
      }
    }
    
    if (!user) {
      console.error('User creation/sign-in failed without throwing an error');
      toast({
        variant: "destructive",
        title: "Setup error",
        description: "Failed to authenticate user",
      });
      return false;
    }
    
    // Create admin user record regardless of if it already exists
    console.log('Creating admin record for user:', user.uid);
    const success = await createAdminUserDocument(user.uid, {
      email: email,
      name: name,
    });
    
    if (success) {
      console.log('Admin record created or updated successfully');
      toast({
        title: "Admin account created",
        description: "The admin account has been created. You can now login.",
      });
      return true;
    } else {
      console.error('Failed to create admin record');
      toast({
        variant: "destructive",
        title: "Admin record creation failed",
        description: "Failed to create admin record in database.",
      });
      return false;
    }

  } catch (error: unknown) {
    console.error('Error setting up first admin:', error);
    toast({
      variant: "destructive",
      title: "Setup error",
      description: (error as { message?: string })?.message || "An unexpected error occurred",
    });
    return false;
  }
};
