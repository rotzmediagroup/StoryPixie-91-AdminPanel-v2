import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAdminUserData } from '@/hooks/useAdminUser';
import { AdminUser } from '@/types';

const DebugAuthPage: React.FC = () => {
  const { firebaseUser, isLoading: authLoading, authError: contextAuthError } = useAuth();
  const [adminData, setAdminData] = useState<AdminUser | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (firebaseUser && !authLoading) {
        setIsFetching(true);
        setFetchError(null);
        try {
          console.log('[DebugAuth] Attempting to fetch admin data for UID:', firebaseUser.uid);
          const data = await getAdminUserData(firebaseUser.uid);
          console.log('[DebugAuth] Fetched admin data:', data);
          setAdminData(data);
        } catch (error) {
          console.error('[DebugAuth] Error fetching admin data directly:', error);
          setFetchError(error instanceof Error ? error.message : 'An unknown error occurred during fetch.');
        } finally {
          setIsFetching(false);
        }
      }
    };

    fetchData();
  }, [firebaseUser, authLoading]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Authentication Debug Information</h1>

      <div className="mb-4 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Auth Context Status</h2>
        <p><strong>Auth Loading:</strong> {authLoading ? 'Yes' : 'No'}</p>
        <p><strong>Firebase User UID:</strong> {firebaseUser ? firebaseUser.uid : 'Not logged in'}</p>
        <p><strong>Firebase User Email:</strong> {firebaseUser ? firebaseUser.email : 'N/A'}</p>
        <p><strong>Context Auth Error:</strong> {contextAuthError ? <span className="text-red-600">{contextAuthError}</span> : 'None'}</p>
      </div>

      <div className="p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Direct Admin Data Fetch</h2>
        <p><strong>Fetching Admin Data:</strong> {isFetching ? 'Yes' : 'No'}</p>
        {fetchError && (
          <p><strong>Fetch Error:</strong> <span className="text-red-600">{fetchError}</span></p>
        )}
        <h3 className="text-md font-semibold mt-3 mb-1">Fetched Admin Data:</h3>
        {adminData ? (
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(adminData, null, 2)}
          </pre>
        ) : (
          <p>No admin data fetched or user is not an admin.</p>
        )}
      </div>
    </div>
  );
};

export default DebugAuthPage;

