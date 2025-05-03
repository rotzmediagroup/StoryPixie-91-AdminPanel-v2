import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit, DocumentData } from 'firebase/firestore';

type DatabaseType = 'firestore';

interface UseDbExplorerOptions {
  initialPath?: string;
  initialDbType?: DatabaseType;
  limit?: number;
}

interface ExplorerResult {
  loading: boolean;
  error: string | null;
  data: Record<string, unknown>[] | null;
  pathExists: boolean;
  explore: (path: string, dbType: DatabaseType) => Promise<void>;
  paths: {
    firestore: string[];
  };
}

export const useDbExplorer = (options: UseDbExplorerOptions = {}): ExplorerResult => {
  const {
    initialPath = '',
    initialDbType = 'firestore',
    limit: queryLimit = 10
  } = options;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Record<string, unknown>[] | null>(null);
  const [pathExists, setPathExists] = useState(false);
  const [knownPaths, setKnownPaths] = useState<{
    firestore: string[];
  }>({
    firestore: ['users', 'stories', 'accounts', 'system', 'adminUsers']
  });
  
  const exploreFirestore = async (path: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const collectionRef = collection(db, path);
      const q = query(collectionRef, limit(queryLimit));
      const querySnapshot = await getDocs(q);
      
      console.log(`Exploring Firestore collection: ${path}`, !querySnapshot.empty);
      
      if (!querySnapshot.empty) {
        const docs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(docs);
        setPathExists(true);
        console.log('Firestore data:', docs);
      } else {
        setData([]);
        setPathExists(false);
        console.log(`No documents in Firestore collection: ${path}`);
      }
    } catch (err) {
      setError(`Failed to explore Firestore: ${(err as Error).message}`);
      setPathExists(false);
      console.error(`Firestore exploration error at ${path}:`, err);
    } finally {
      setLoading(false);
    }
  };
  
  const explore = useCallback(async (path: string, dbType: DatabaseType): Promise<void> => {
    if (dbType === 'firestore') {
      await exploreFirestore(path);
    }
  }, []);
  
  // Initial exploration
  useEffect(() => {
    if (initialPath) {
      explore(initialPath, initialDbType);
    }
  }, [initialPath, initialDbType, explore]);
  
  return {
    loading,
    error,
    data,
    pathExists,
    explore,
    paths: knownPaths
  };
};
