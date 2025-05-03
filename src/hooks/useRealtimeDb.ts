import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface RealtimeDbOptions {
  path: string;
}

// This hook is now deprecated as we're using Firestore instead of Realtime Database
export const useRealtimeDb = ({ path }: RealtimeDbOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Show a warning toast that Realtime Database is not being used
  useState(() => {
    toast({
      title: "Realtime Database not in use",
      description: "This project uses Firestore instead of Realtime Database. Please use the useFirestore hook.",
      variant: "destructive"
    });
  });
  
  // All methods now return appropriate error responses
  const setData = async (): Promise<boolean> => {
    setError('Realtime Database is not configured. Using Firestore instead.');
    return false;
  };

  const pushData = async (): Promise<string | null> => {
    setError('Realtime Database is not configured. Using Firestore instead.');
    return null;
  };

  const getData = async (): Promise<Record<string, unknown> | null> => {
    setError('Realtime Database is not configured. Using Firestore instead.');
    return null;
  };

  const updateData = async (): Promise<boolean> => {
    setError('Realtime Database is not configured. Using Firestore instead.');
    return false;
  };

  const deleteData = async (): Promise<boolean> => {
    setError('Realtime Database is not configured. Using Firestore instead.');
    return false;
  };

  const subscribeToData = (): (() => void) => {
    setError('Realtime Database is not configured. Using Firestore instead.');
    return () => {};
  };

  return { 
    setData,
    pushData,
    getData, 
    updateData, 
    deleteData,
    subscribeToData,
    isLoading, 
    error 
  };
};
