import { collection, collectionGroup, getDocs, query, limit, getCountFromServer, where, Timestamp, orderBy, doc, updateDoc, addDoc, deleteDoc, serverTimestamp } from \'firebase/firestore\'; // Added addDoc, deleteDoc, serverTimestamp
import { db } from \'./firebase\';
import { User, UserStatus, Story, AIModel } from \'@/types\'; // Added AIModel type

// --- User Functions ---

// Function to get the total count of users in the \'users\' collection
export const getUserCount = async (): Promise<number> => {
  try {
    const usersCollection = collection(db, \'users\');
    const snapshot = await getCountFromServer(usersCollection);
    return snapshot.data().count;
  } catch (error) {
    console.error(\"Error getting user count:\", error);
    return -1; 
  }
};

// Function to get ALL users
// WARNING: Fetching all users can be inefficient and costly for large datasets.
// Consider implementing server-side pagination and filtering in the future.
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersCollection = collection(db, \'users\');
    const q = query(usersCollection, orderBy(\'createdAt\', \'desc\')); // Order by creation date, newest first
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

// Function to update a user\'s status
export const updateUserStatus = async (userId: string, status: UserStatus): Promise<boolean> => {
  try {
    const userDocRef = doc(db, \'users\', userId);
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
    const usersCollection = collection(db, \'users\');
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

// --- Story Functions ---

// Function to get ALL stories using a collection group query
// Requires a Firestore index on the \'stories\' collection group, ordered by \'createdAt\'
export const getAllStories = async (): Promise<Story[]> => {
  try {
    const storiesGroupRef = collectionGroup(db, \'stories\');
    const q = query(storiesGroupRef, orderBy(\'createdAt\', \'desc\')); // Order by creation date, newest first
    const querySnapshot = await getDocs(q);
    const stories: Story[] = [];
    querySnapshot.forEach((doc) => {
      // Extract parent path segments to get userId and kidId
      const pathSegments = doc.ref.path.split(\'/\');
      // Expected path: users/{userId}/kids/{kidId}/stories/{storyId}
      const userId = pathSegments.length >= 2 ? pathSegments[1] : \'unknown\';
      const kidId = pathSegments.length >= 4 ? pathSegments[3] : \'unknown\';
      
      stories.push({
        id: doc.id,
        userId: userId,
        kidId: kidId,
        ...doc.data(),
      } as Story);
    });
    return stories;
  } catch (error) {
    console.error(`Error getting all stories (collection group query):`, error);
    // Potentially suggest creating the index in the error message or logs
    if (error instanceof Error && error.message.includes(\'indexes\')) {
      console.error(\"Firestore index required: Ensure you have a collection group index for \'stories\' ordered by \'createdAt\' descending.\");
    }
    return [];
  }
};

// Function to get stories with status \'flagged\'
// Requires a Firestore index on the \'stories\' collection group, filtering by \'status\' and ordered by \'createdAt\'
export const getFlaggedStories = async (): Promise<Story[]> => {
  try {
    const storiesGroupRef = collectionGroup(db, \'stories\');
    // Query for stories where status is 'flagged', order by creation date
    const q = query(storiesGroupRef, where(\'status\', \'==\', \'flagged\'), orderBy(\'createdAt\', \'desc\'));
    const querySnapshot = await getDocs(q);
    const stories: Story[] = [];
    querySnapshot.forEach((doc) => {
      const pathSegments = doc.ref.path.split(\'/\');
      const userId = pathSegments.length >= 2 ? pathSegments[1] : \'unknown\';
      const kidId = pathSegments.length >= 4 ? pathSegments[3] : \'unknown\';
      
      stories.push({
        id: doc.id,
        userId: userId,
        kidId: kidId,
        ...doc.data(),
      } as Story);
    });
    return stories;
  } catch (error) {
    console.error(`Error getting flagged stories (collection group query):`, error);
    if (error instanceof Error && error.message.includes(\'indexes\')) {
      console.error(\"Firestore index required: Ensure you have a collection group index for \'stories\' filtering by \'status\' and ordered by \'createdAt\' descending.\");
    }
    return [];
  }
};

// Function to update a story\'s status
// Note: Requires knowing the full path to the story document (userId, kidId, storyId)
export const updateStoryStatus = async (userId: string, kidId: string, storyId: string, status: Story[\'status\']): Promise<boolean> => {
  try {
    const storyDocRef = doc(db, \'users\', userId, \'kids\', kidId, \'stories\', storyId);
    await updateDoc(storyDocRef, { status: status });
    console.log(`Story ${storyId} (User: ${userId}, Kid: ${kidId}) status updated to ${status}`);
    return true;
  } catch (error) {
    console.error(`Error updating status for story ${storyId}:`, error);
    return false;
  }
};


// Function to get the total count of stories across all users and kids
// Uses collection group query - requires Firestore index
export const getTotalStoryCount = async (): Promise<number> => {
  try {
    const storiesGroupRef = collectionGroup(db, \'stories\');
    const snapshot = await getCountFromServer(storiesGroupRef);
    return snapshot.data().count;
  } catch (error) {
    console.error(\"Error getting total story count (collection group query):\", error);
     if (error instanceof Error && error.message.includes(\'indexes\')) {
      console.error(\"Firestore index required: Ensure you have a collection group index for \'stories\'.\");
    }
    return -1; // Indicate failure
  }
};

// Function to get the count of stories generated in the last 24 hours
// Uses collection group query - requires Firestore index
export const getStoriesGeneratedTodayCount = async (): Promise<number> => {
  const now = Timestamp.now();
  const twentyFourHoursAgo = Timestamp.fromMillis(now.toMillis() - 24 * 60 * 60 * 1000);
  try {
    const storiesGroupRef = collectionGroup(db, \'stories\');
    const qGroup = query(storiesGroupRef, where(\'createdAt\', \'>=\', twentyFourHoursAgo));
    const snapshot = await getCountFromServer(qGroup);
    return snapshot.data().count;
  } catch (error) {
    console.error(\"Error getting stories generated today count (collection group query):\", error);
     if (error instanceof Error && error.message.includes(\'indexes\')) {
      console.error(\"Firestore index required: Ensure you have a collection group index for \'stories\' with \'createdAt\' field.\");
    }
    return -1; // Indicate failure
  }
};

// --- AI Model Functions ---

// Function to get all configured AI Models
export const getAllAIModels = async (): Promise<AIModel[]> => {
  try {
    const modelsCollection = collection(db, \'ai_models\'); // Assuming collection name is \'ai_models\'
    const q = query(modelsCollection, orderBy(\'name\', \'asc\')); // Order by name
    const querySnapshot = await getDocs(q);
    const models: AIModel[] = [];
    querySnapshot.forEach((doc) => {
      models.push({ id: doc.id, ...doc.data() } as AIModel);
    });
    return models;
  } catch (error) {
    console.error(`Error getting all AI models:`, error);
    return [];
  }
};

// Function to add a new AI Model configuration
export const addAIModel = async (modelData: Omit<AIModel, \'id\'>): Promise<string | null> => {
  try {
    const modelsCollection = collection(db, \'ai_models\');
    const docRef = await addDoc(modelsCollection, {
      ...modelData,
      // Add timestamps if needed, e.g., createdAt: serverTimestamp()
    });
    console.log(`AI Model added with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error(`Error adding AI model:`, error);
    return null;
  }
};

// Function to update an existing AI Model configuration
export const updateAIModel = async (modelId: string, updates: Partial<AIModel>): Promise<boolean> => {
  try {
    const modelDocRef = doc(db, \'ai_models\', modelId);
    await updateDoc(modelDocRef, {
      ...updates,
      // Add timestamps if needed, e.g., updatedAt: serverTimestamp()
    });
    console.log(`AI Model ${modelId} updated successfully.`);
    return true;
  } catch (error) {
    console.error(`Error updating AI model ${modelId}:`, error);
    return false;
  }
};

// Function to delete an AI Model configuration
export const deleteAIModel = async (modelId: string): Promise<boolean> => {
  try {
    const modelDocRef = doc(db, \'ai_models\', modelId);
    await deleteDoc(modelDocRef);
    console.log(`AI Model ${modelId} deleted successfully.`);
    return true;
  } catch (error) {
    console.error(`Error deleting AI model ${modelId}:`, error);
    return false;
  }
};

// --- Dashboard/Analytics Functions ---

// Function to get daily user signups for the last N days
export const getDailyUserSignups = async (days: number = 7): Promise<{ date: string; count: number }[]> => {
  const signupData: { [key: string]: number } = {};
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days + 1);
  startDate.setHours(0, 0, 0, 0);

  try {
    const usersCollection = collection(db, \'users\');
    // Assuming users have a \'createdAt\' field (Timestamp)
    const q = query(usersCollection, where(\'createdAt\', \'>=\', Timestamp.fromDate(startDate)), orderBy(\'createdAt\', \'asc\'));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.createdAt && data.createdAt.toDate) {
        const dateStr = data.createdAt.toDate().toISOString().split(\'T\')[0]; // YYYY-MM-DD
        signupData[dateStr] = (signupData[dateStr] || 0) + 1;
      }
    });

    // Fill in missing dates with 0 count
    const result = [];
    for (let d = 0; d < days; d++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + d);
      const dateStr = currentDate.toISOString().split(\'T\')[0];
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
    const storiesGroupRef = collectionGroup(db, \'stories\');
    const q = query(storiesGroupRef, where(\'createdAt\', \'>=\', Timestamp.fromDate(startDate)), orderBy(\'createdAt\', \'asc\'));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.createdAt && data.createdAt.toDate) {
        const dateStr = data.createdAt.toDate().toISOString().split(\'T\')[0]; // YYYY-MM-DD
        generationData[dateStr] = (generationData[dateStr] || 0) + 1;
      }
    });

    // Fill in missing dates with 0 count
    const result = [];
    for (let d = 0; d < days; d++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + d);
      const dateStr = currentDate.toISOString().split(\'T\')[0];
      result.push({ date: dateStr, count: generationData[dateStr] || 0 });
    }
    return result;

  } catch (error) {
    console.error(`Error getting daily story generations for last ${days} days:`, error);
     if (error instanceof Error && error.message.includes(\'indexes\')) {
      console.error(\"Firestore index required: Ensure you have a collection group index for \'stories\' with \'createdAt\' field.\");
    }
    return [];
  }
};


// Placeholder for fetching other dashboard stats (e.g., active users, revenue)
// export const getActiveUsersCount = async (): Promise<number> => { ... };
// export const getTotalRevenue = async (): Promise<number> => { ... };

