
import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, orderBy, limit, DocumentData, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from '@/types';

interface UseUsersOptions {
  limitCount?: number;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  filterByPlatform?: string;
  filterByStatus?: string;
  searchQuery?: string;
}

export function useUsers({
  limitCount = 50,
  orderByField = 'registrationDate',
  orderDirection = 'desc',
  filterByPlatform,
  filterByStatus,
  searchQuery,
}: UseUsersOptions = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const usersRef = collection(db, 'users');
        const constraints: QueryConstraint[] = [];
        
        // Add ordering
        constraints.push(orderBy(orderByField, orderDirection));
        
        // Add filters if specified
        if (filterByPlatform && filterByPlatform !== 'all') {
          constraints.push(where('platform', 'array-contains', filterByPlatform));
        }
        
        if (filterByStatus && filterByStatus !== 'all') {
          constraints.push(where('status', '==', filterByStatus));
        }
        
        // Add limit
        constraints.push(limit(limitCount));
        
        const userQuery = query(usersRef, ...constraints);
        const querySnapshot = await getDocs(userQuery);
        
        // Get total count (this is a simple approach, for large collections you'd use a counter document)
        const countQuery = query(collection(db, 'users'));
        const countSnapshot = await getDocs(countQuery);
        setTotalCount(countSnapshot.size);
        
        // Process results
        let results: User[] = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data() as DocumentData;
          results.push({
            id: doc.id,
            email: userData.email || '',
            name: userData.name || userData.displayName || '',
            role: userData.role || 'user',
            platform: userData.platform || 'web',
            registrationDate: userData.registrationDate || userData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            lastLoginDate: userData.lastLoginDate || userData.lastLogin?.toDate?.()?.toISOString() || '',
            status: userData.status || 'active',
            credits: userData.credits || 0,
            profileImage: userData.profileImage || userData.photoURL || '',
            subscription: userData.subscription || null,
          });
        });
        
        // Filter by search query client-side (for more complex search, consider Firebase extensions or Algolia)
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          results = results.filter(user => 
            user.name.toLowerCase().includes(query) || 
            user.email.toLowerCase().includes(query)
          );
        }
        
        setUsers(results);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(`Failed to fetch users: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [limitCount, orderByField, orderDirection, filterByPlatform, filterByStatus, searchQuery]);

  return { users, loading, error, totalCount };
}
