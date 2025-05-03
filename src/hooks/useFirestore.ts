
import { useState } from 'react';
import { 
  collection, 
  query, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  DocumentData,
  QueryConstraint,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface FirestoreOptions {
  collectionName: string;
}

export const useFirestore = ({ collectionName }: FirestoreOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all documents from a collection or with a query
  const getDocuments = async (queryConstraints?: QueryConstraint[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const collectionRef = collection(db, collectionName);
      let queryRef = query(collectionRef);
      
      if (queryConstraints && queryConstraints.length > 0) {
        queryRef = query(collectionRef, ...queryConstraints);
      }
      
      const querySnapshot = await getDocs(queryRef);
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setIsLoading(false);
      return documents;
    } catch (err) {
      setError('Failed to fetch documents: ' + (err as Error).message);
      setIsLoading(false);
      return [];
    }
  };

  // Add a new document to a collection
  const addDocument = async (data: DocumentData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Add timestamps for tracking
      const dataWithTimestamps = {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, dataWithTimestamps);
      
      setIsLoading(false);
      return { id: docRef.id, ...dataWithTimestamps };
    } catch (err) {
      setError('Failed to add document: ' + (err as Error).message);
      setIsLoading(false);
      return null;
    }
  };

  // Update an existing document
  const updateDocument = async (id: string, data: DocumentData) => {
    setIsLoading(true);
    setError(null);
    try {
      const dataWithTimestamp = {
        ...data,
        updatedAt: Timestamp.now()
      };
      
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, dataWithTimestamp);
      
      setIsLoading(false);
      return { id, ...dataWithTimestamp };
    } catch (err) {
      setError('Failed to update document: ' + (err as Error).message);
      setIsLoading(false);
      return null;
    }
  };

  // Delete a document
  const deleteDocument = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      
      setIsLoading(false);
      return true;
    } catch (err) {
      setError('Failed to delete document: ' + (err as Error).message);
      setIsLoading(false);
      return false;
    }
  };

  return { 
    getDocuments, 
    addDocument, 
    updateDocument, 
    deleteDocument, 
    isLoading, 
    error 
  };
};
