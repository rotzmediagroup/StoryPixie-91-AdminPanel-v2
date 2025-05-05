import { collection, collectionGroup, getDocs, query, limit, getCountFromServer, where, Timestamp, orderBy, doc, updateDoc, addDoc, deleteDoc, serverTimestamp, getDoc, setDoc } from 'firebase/firestore'; // Added getDoc, setDoc
import { db } from './firebase';
import { User, UserStatus, Story, AIModel, Profile, CharacterSet, AISettings, ChartDataPoint } from '@/types'; // Added AISettings, ChartDataPoint types

// --- User Functions ---

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

// Function to update a user's Pixie Dust balance
export const updateUserPixieDust = async (userId: string, purpleAmount: number, goldAmount: number): Promise<boolean> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    // Use dot notation to update nested fields
    await updateDoc(userDocRef, {
      'pixieDust.purple': purpleAmount,
      'pixieDust.gold': goldAmount
    });
    console.log(`User ${userId} Pixie Dust updated to Purple: ${purpleAmount}, Gold: ${goldAmount}`);
    return true;
  } catch (error) {
    console.error(`Error updating Pixie Dust for user ${userId}:`, error);
    return false;
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

// --- Profile & Character Set Functions ---

// Function to get ALL profiles using a collection group query
// Requires a Firestore index on the 'profiles' collection group
export const getAllProfiles = async (): Promise<Profile[]> => {
  console.log('[getAllProfiles] Attempting to fetch all profiles...');
  try {
    const profilesGroupRef = collectionGroup(db, 'profiles');
    // Simple query for now, might need ordering later
    const q = query(profilesGroupRef, orderBy('createdAt', 'desc')); // Assuming profiles have createdAt
    console.log('[getAllProfiles] Query created:', q);
    const querySnapshot = await getDocs(q);
    console.log(`[getAllProfiles] Query successful. Found ${querySnapshot.size} profiles.`);
    const profiles: Profile[] = [];
    querySnapshot.forEach((doc) => {
      profiles.push({ id: doc.id, ...doc.data() } as Profile);
    });
    console.log('[getAllProfiles] Profiles processed:', profiles);
    return profiles;
  } catch (error) {
    console.error(`[getAllProfiles] Error getting all profiles (collection group query):`, error);
    if (error instanceof Error && error.message.includes('indexes')) {
      console.error("[getAllProfiles] Firestore index required: Ensure you have a collection group index for 'profiles', potentially ordered by 'createdAt'.");
    }
    throw error;
  }
};

// Function to get ALL character sets from all profiles
// This leverages getAllProfiles and extracts character sets.
// Note: This might be inefficient for very large numbers of profiles/character sets.
export const getAllCharacterSets = async (): Promise<CharacterSet[]> => {
  console.log('[getAllCharacterSets] Attempting to fetch all character sets...');
  try {
    const profiles = await getAllProfiles();
    const allCharacterSets: CharacterSet[] = [];
    profiles.forEach(profile => {
      if (profile.characterSets && Array.isArray(profile.characterSets)) {
        // Add profileId and userId for context if needed later
        // For now, just collecting the sets
        allCharacterSets.push(...profile.characterSets);
      }
    });
    console.log(`[getAllCharacterSets] Extracted ${allCharacterSets.length} character sets from ${profiles.length} profiles.`);
    return allCharacterSets;
  } catch (error) {
    console.error(`[getAllCharacterSets] Error getting character sets:`, error);
    // Error likely originated in getAllProfiles, re-throw it
    throw error;
  }
};


// --- Story Functions ---

// Function to get ALL stories using a collection group query
// Requires a Firestore index on the 'stories' collection group, ordered by 'createdAt'
export const getAllStories = async (): Promise<Story[]> => {
  console.log('[getAllStories] Attempting to fetch all stories...');
  try {
    const storiesGroupRef = collectionGroup(db, 'stories');
    const q = query(storiesGroupRef, orderBy('createdAt', 'desc')); // Order by creation date, newest first
    console.log('[getAllStories] Query created:', q);
    const querySnapshot = await getDocs(q);
    console.log(`[getAllStories] Query successful. Found ${querySnapshot.size} documents.`);
    const stories: Story[] = [];
    querySnapshot.forEach((doc) => {
      // Extract parent path segments to get userId and profileId
      const pathSegments = doc.ref.path.split('/');
      // Expected path: users/{userId}/profiles/{profileId}/stories/{storyId}
      const userId = pathSegments.length >= 4 ? pathSegments[1] : 'unknown'; // Adjusted index
      const profileId = pathSegments.length >= 4 ? pathSegments[3] : 'unknown'; // Adjusted index
      
      stories.push({
        id: doc.id,
        userId: userId,
        profileId: profileId, 
        ...doc.data(),
      } as Story);
    });
    console.log('[getAllStories] Stories processed:', stories);
    return stories;
  } catch (error) {
    console.error(`[getAllStories] Error getting all stories (collection group query):`, error);
    if (error instanceof Error && error.message.includes('indexes')) {
      console.error("[getAllStories] Firestore index required: Ensure you have a collection group index for 'stories' ordered by 'createdAt' descending.");
    }
    throw error;
  }
};

// Function to get ALL sequels using a collection group query
// Requires a Firestore index on the 'stories' collection group, filtering by 'isSequel' and ordered by 'createdAt'
export const getAllSequels = async (): Promise<Story[]> => {
  console.log('[getAllSequels] Attempting to fetch all sequels...');
  try {
    const storiesGroupRef = collectionGroup(db, 'stories');
    // Query for stories where isSequel is true, order by creation date
    const q = query(storiesGroupRef, where('isSequel', '==', true), orderBy('createdAt', 'desc'));
    console.log('[getAllSequels] Query created:', q);
    const querySnapshot = await getDocs(q);
    console.log(`[getAllSequels] Query successful. Found ${querySnapshot.size} sequels.`);
    const sequels: Story[] = [];
    querySnapshot.forEach((doc) => {
      const pathSegments = doc.ref.path.split('/');
      const userId = pathSegments.length >= 4 ? pathSegments[1] : 'unknown';
      const profileId = pathSegments.length >= 4 ? pathSegments[3] : 'unknown';
      
      sequels.push({
        id: doc.id,
        userId: userId,
        profileId: profileId,
        ...doc.data(),
      } as Story);
    });
    console.log('[getAllSequels] Sequels processed:', sequels);
    return sequels;
  } catch (error) {
    console.error(`[getAllSequels] Error getting sequels (collection group query):`, error);
    if (error instanceof Error && error.message.includes('indexes')) {
      console.error("[getAllSequels] Firestore index required: Ensure you have a collection group index for 'stories' filtering by 'isSequel' and ordered by 'createdAt' descending.");
    }
    throw error;
  }
};

// Function to get stories with status 'flagged'
// Requires a Firestore index on the 'stories' collection group, filtering by 'status' and ordered by 'createdAt'
export const getFlaggedStories = async (): Promise<Story[]> => {
  console.log('[getFlaggedStories] DEBUG: Function called.'); // ADDED DEBUG LOG
  try {
    const storiesGroupRef = collectionGroup(db, 'stories');
    console.log('[getFlaggedStories] DEBUG: Collection group reference created.'); // ADDED DEBUG LOG
    // Query for stories where status is 'flagged', order by creation date
    const q = query(storiesGroupRef, where('status', '==', 'flagged'), orderBy('createdAt', 'desc'));
    console.log('[getFlaggedStories] DEBUG: Query created:', q); // ADDED DEBUG LOG
    
    console.log('[getFlaggedStories] DEBUG: Attempting getDocs(q)...'); // ADDED DEBUG LOG
    const querySnapshot = await getDocs(q);
    console.log(`[getFlaggedStories] DEBUG: getDocs successful. Found ${querySnapshot.size} documents.`); // ADDED DEBUG LOG
    
    const stories: Story[] = [];
    console.log('[getFlaggedStories] DEBUG: Processing documents...'); // ADDED DEBUG LOG
    querySnapshot.forEach((doc) => {
      console.log(`[getFlaggedStories] DEBUG: Processing doc ${doc.id}`); // ADDED DEBUG LOG
      const pathSegments = doc.ref.path.split('/');
      const userId = pathSegments.length >= 4 ? pathSegments[1] : 'unknown';
      const profileId = pathSegments.length >= 4 ? pathSegments[3] : 'unknown';
      
      stories.push({
        id: doc.id,
        userId: userId,
        profileId: profileId,
        ...doc.data(),
      } as Story);
    });
    console.log('[getFlaggedStories] DEBUG: Stories processed:', stories); // ADDED DEBUG LOG
    return stories;
  } catch (error: any) { // Explicitly type error as any
    console.error(`[getFlaggedStories] DEBUG: Error caught!`, error); // ADDED DEBUG LOG
    console.error(`[getFlaggedStories] Error Code: ${error.code}`); // ADDED DEBUG LOG
    console.error(`[getFlaggedStories] Error Message: ${error.message}`); // ADDED DEBUG LOG
    if (error instanceof Error && error.message.includes('indexes')) {
      console.error("[getFlaggedStories] Firestore index required: Ensure you have a collection group index for 'stories' filtering by 'status' and ordered by 'createdAt' descending.");
    }
    // Re-throw the error so the calling component knows something went wrong
    throw error; 
  } finally {
      console.log('[getFlaggedStories] DEBUG: Fetch attempt finished.'); // ADDED DEBUG LOG
  }
};

// Function to update a story's status
// Note: Requires knowing the full path to the story document (userId, profileId, storyId)
export const updateStoryStatus = async (userId: string, profileId: string, storyId: string, status: Story['status']): Promise<boolean> => {
  try {
    // Adjusted path based on schema: users/{userId}/profiles/{profileId}/stories/{storyId}
    const storyDocRef = doc(db, 'users', userId, 'profiles', profileId, 'stories', storyId);
    await updateDoc(storyDocRef, { status: status });
    console.log(`Story ${storyId} (User: ${userId}, Profile: ${profileId}) status updated to ${status}`);
    return true;
  } catch (error) {
    console.error(`Error updating status for story ${storyId}:`, error);
    return false;
  }
};


// Function to get the total count of stories across all users and profiles
// Uses collection group query - requires Firestore index
export const getTotalStoryCount = async (): Promise<number> => {
  try {
    const storiesGroupRef = collectionGroup(db, 'stories');
    const snapshot = await getCountFromServer(storiesGroupRef);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error getting total story count (collection group query):", error);
     if (error instanceof Error && error.message.includes('indexes')) {
      console.error("Firestore index required: Ensure you have a collection group index for 'stories'.");
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
    const storiesGroupRef = collectionGroup(db, 'stories');
    const qGroup = query(storiesGroupRef, where('createdAt', '>=', twentyFourHoursAgo));
    const snapshot = await getCountFromServer(qGroup);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error getting stories generated today count (collection group query):", error);
     if (error instanceof Error && error.message.includes('indexes')) {
      console.error("Firestore index required: Ensure you have a collection group index for 'stories' with 'createdAt' field.");
    }
    return -1; // Indicate failure
  }
};

// --- AI Model Functions ---

// Function to get all configured AI Models
export const getAllAIModels = async (): Promise<AIModel[]> => {
  try {
    const modelsCollection = collection(db, 'ai_models'); // Assuming collection name is 'ai_models'
    const q = query(modelsCollection, orderBy('name', 'asc')); // Order by name
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
export const addAIModel = async (modelData: Omit<AIModel, 'id'>): Promise<string | null> => {
  try {
    const modelsCollection = collection(db, 'ai_models');
    const docRef = await addDoc(modelsCollection, {
      ...modelData,
      createdAt: serverTimestamp() // Add createdAt timestamp
    });
    console.log(`AI Model added with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error(`Error adding AI model:`, error);
    return null;
  }
};

// Function to update an existing AI Model configuration
export const updateAIModel = async (modelId: string, updates: Partial<Omit<AIModel, 'id'>>): Promise<boolean> => {
  try {
    const modelDocRef = doc(db, 'ai_models', modelId);
    await updateDoc(modelDocRef, {
      ...updates,
      updatedAt: serverTimestamp() // Add updatedAt timestamp
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
    const modelDocRef = doc(db, 'ai_models', modelId);
    await deleteDoc(modelDocRef);
    console.log(`AI Model ${modelId} deleted successfully.`);
    return true;
  } catch (error) {
    console.error(`Error deleting AI model ${modelId}:`, error);
    return false;
  }
};

// --- AI Settings Functions (New) ---

// Function to get the current AI settings
// Assumes settings are stored in a single document named 'config' within the 'settings' collection
export const getAISettings = async (): Promise<AISettings | null> => {
  try {
    const settingsDocRef = doc(db, 'settings', 'config');
    const docSnap = await getDoc(settingsDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as AISettings;
    } else {
      console.log("AI settings document (settings/config) does not exist.");
      return null;
    }
  } catch (error) {
    console.error("Error getting AI settings:", error);
    return null;
  }
};

// Function to save or update the AI settings
// Uses setDoc with merge: true to create or update the 'config' document
export const saveAISettings = async (settings: Partial<AISettings>): Promise<boolean> => {
  try {
    const settingsDocRef = doc(db, 'settings', 'config');
    await setDoc(settingsDocRef, {
      ...settings,
      updatedAt: serverTimestamp()
    }, { merge: true });
    console.log("AI settings saved successfully.");
    return true;
  } catch (error) {
    console.error("Error saving AI settings:", error);
    return false;
  }
};

// --- Dashboard Chart Functions (Stubs Added) ---

// Stub function for daily user signups - Replace with actual implementation later
export const getDailyUserSignups = async (days: number = 7): Promise<ChartDataPoint[]> => {
  console.warn("[getDailyUserSignups] STUB FUNCTION: Returning empty data. Implement actual logic.");
  // In a real implementation, query 'users' collection, group by day, count signups
  // Example structure:
  // const data: ChartDataPoint[] = [];
  // for (let i = 0; i < days; i++) {
  //   const date = new Date();
  //   date.setDate(date.getDate() - i);
  //   const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
  //   // Fetch count for dateString
  //   data.push({ date: dateString, value: Math.floor(Math.random() * 10) }); // Replace with actual count
  // }
  // return data.reverse(); // Ensure chronological order
  return [];
};

// Stub function for daily story generations - Replace with actual implementation later
export const getDailyStoryGenerations = async (days: number = 7): Promise<ChartDataPoint[]> => {
  console.warn("[getDailyStoryGenerations] STUB FUNCTION: Returning empty data. Implement actual logic.");
  // In a real implementation, query 'stories' collection group, group by day, count stories
  // Similar logic to getDailyUserSignups, but querying 'stories'
  return [];
};

