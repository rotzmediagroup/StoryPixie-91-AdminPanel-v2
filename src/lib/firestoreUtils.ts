import { collection, getDocs, query, limit,getCountFromServer } from 'firebase/firestore';
import { db } from './firebase';

// Function to get the total count of users in the 'users' collection
export const getUserCount = async (): Promise<number> => {
  try {
    const usersCollection = collection(db, 'users');
    const snapshot = await getCountFromServer(usersCollection);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error getting user count:", error);
    // Return -1 or throw error to indicate failure
    return -1; 
  }
};

// Function to get a small sample of users (e.g., first 5)
export const getUserSample = async (count: number = 5): Promise<any[]> => {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, limit(count));
    const querySnapshot = await getDocs(q);
    const users: any[] = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    console.error(`Error getting user sample (limit ${count}):`, error);
    return [];
  }
};

