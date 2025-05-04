import { collection, collectionGroup, getDocs, query, limit, getCountFromServer, where, Timestamp, orderBy, doc, updateDoc } from 'firebase/firestore'; // Added doc, updateDoc
import { db } from './firebase';
import { User, UserStatus } from '@/types'; // Assuming User type is defined

// Function to get the total count of users in the 'users' collection
export const getUserCount = async (): Promise<number> => {
  try {
    const usersCollection = collection(db, 'users');
    const snapshot = await getCountFromServer(usersCollection);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error getting user count:", error);
    return -1; 
  }
};

// Function to get ALL users
// WARNING: Fetching all users can be inefficient and costly for large datasets.
// Consider implementing server-side pagination and filtering in the future.
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, orderBy('createdAt', 'desc')); // Order by creation date, newest first
    const querySnapshot = await getDocs(q);
    const users: User[] = [];
    querySnapshot.forEach((doc) => {
      // Ensure the data matches the User type, adding the id
      users.push({ id: doc.id, ...doc.data() } as User);
    });
    return users;
  } catch (error) {
    console.error(`Error getting all users:`, error);
    return [];
  }
};

// Function to update a user's status
export const updateUserStatus = async (userId: string, status: UserStatus): Promise<boolean> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { status: status });
    console.log(`User ${userId} status updated to ${status}`);
    return true;
  } catch (error) {
    console.error(`Error updating status for user ${userId}:`, error);
    return false;
  }
};


// Function to get a small sample of users (e.g., first 5)
// Kept for potential other uses, but getAllUsers is preferred for the table
export const getUserSample = async (count: number = 5): Promise<User[]> => {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, limit(count));
    const querySnapshot = await getDocs(q);
    const users: User[] = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() } as User);
    });
    return users;
  } catch (error) {
    console.error(`Error getting user sample (limit ${count}):`, error);
    return [];
  }
};

// Function to get the total count of stories across all users and kids
// WARNING: This function iterates through all users and kids, which can be inefficient and costly on large datasets.
// Consider implementing a distributed counter or using aggregation for better performance.
export const getTotalStoryCount = async (): Promise<number> => {
  let totalStories = 0;
  try {
    // Attempt collection group query first (requires index)
    console.log("Attempting collection group query for total story count...");
    const storiesGroupRef = collectionGroup(db, 'stories');
    const snapshot = await getCountFromServer(storiesGroupRef);
    console.log("Collection group query successful for total story count.");
    return snapshot.data().count;
  } catch (groupError) {
    console.warn("Collection group query for total story count failed, falling back to iteration:", groupError);
    // Fallback to iteration if collection group query fails
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      for (const userDoc of usersSnapshot.docs) {
        const kidsSnapshot = await getDocs(collection(db, 'users', userDoc.id, 'kids'));
        for (const kidDoc of kidsSnapshot.docs) {
          const storiesSnapshot = await getCountFromServer(collection(db, 'users', userDoc.id, 'kids', kidDoc.id, 'stories'));
          totalStories += storiesSnapshot.data().count;
        }
      }
      return totalStories;
    } catch (iterationError) {
      console.error("Error getting total story count via iteration:", iterationError);
      return -1;
    }
  }
};

// Function to get the count of stories generated in the last 24 hours
// Uses collection group query - requires Firestore index
export const getStoriesGeneratedTodayCount = async (): Promise<number> => {
  const now = Timestamp.now();
  const twentyFourHoursAgo = Timestamp.fromMillis(now.toMillis() - 24 * 60 * 60 * 1000);
  try {
    const storiesGroupRef = collectionGroup(db, 'stories');
    const qGroup = query(storiesGroupRef, where('createdAt', '>=', twentyFourHoursAgo));
    const snapshot = await getCountFromServer(qGroup);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error getting stories generated today count (collection group query):", error);
    return -1; // Indicate failure
  }
};

// Function to get daily user signups for the last N days
export const getDailyUserSignups = async (days: number = 7): Promise<{ date: string; count: number }[]> => {
  const signupData: { [key: string]: number } = {};
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days + 1);
  startDate.setHours(0, 0, 0, 0);

  try {
    const usersCollection = collection(db, 'users');
    // Assuming users have a 'createdAt' field (Timestamp)
    const q = query(usersCollection, where('createdAt', '>=', Timestamp.fromDate(startDate)), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.createdAt && data.createdAt.toDate) {
        const dateStr = data.createdAt.toDate().toISOString().split('T')[0]; // YYYY-MM-DD
        signupData[dateStr] = (signupData[dateStr] || 0) + 1;
      }
    });

    // Fill in missing dates with 0 count
    const result = [];
    for (let d = 0; d < days; d++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + d);
      const dateStr = currentDate.toISOString().split('T')[0];
      result.push({ date: dateStr, count: signupData[dateStr] || 0 });
    }
    return result;

  } catch (error) {
    console.error(`Error getting daily user signups for last ${days} days:`, error);
    return [];
  }
};

// Function to get daily story generations for the last N days
// Uses collection group query - requires Firestore index
export const getDailyStoryGenerations = async (days: number = 7): Promise<{ date: string; count: number }[]> => {
  const generationData: { [key: string]: number } = {};
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days + 1);
  startDate.setHours(0, 0, 0, 0);

  try {
    const storiesGroupRef = collectionGroup(db, 'stories');
    const q = query(storiesGroupRef, where('createdAt', '>=', Timestamp.fromDate(startDate)), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.createdAt && data.createdAt.toDate) {
        const dateStr = data.createdAt.toDate().toISOString().split('T')[0]; // YYYY-MM-DD
        generationData[dateStr] = (generationData[dateStr] || 0) + 1;
      }
    });

    // Fill in missing dates with 0 count
    const result = [];
    for (let d = 0; d < days; d++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + d);
      const dateStr = currentDate.toISOString().split('T')[0];
      result.push({ date: dateStr, count: generationData[dateStr] || 0 });
    }
    return result;

  } catch (error) {
    console.error(`Error getting daily story generations for last ${days} days:`, error);
    return [];
  }
};


// Placeholder for fetching other dashboard stats (e.g., active users, revenue)
// export const getActiveUsersCount = async (): Promise<number> => { ... };
// export const getTotalRevenue = async (): Promise<number> => { ... };

