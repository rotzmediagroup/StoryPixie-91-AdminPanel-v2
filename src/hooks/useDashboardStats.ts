import { useState, useEffect } from 'react';
import { getUserCount, getTotalStoryCount, getStoriesGeneratedTodayCount } from '@/lib/firestoreUtils';

export interface DashboardStatsData {
  userCount: number | null;
  totalStoryCount: number | null;
  storiesTodayCount: number | null;
  // Add other stats as needed
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStatsData>({ 
    userCount: null,
    totalStoryCount: null,
    storiesTodayCount: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch stats in parallel
        const [userCount, totalStoryCount, storiesTodayCount] = await Promise.all([
          getUserCount(),
          getTotalStoryCount(),
          getStoriesGeneratedTodayCount(),
          // Add calls for other stats here
        ]);

        setStats({
          userCount: userCount >= 0 ? userCount : null,
          totalStoryCount: totalStoryCount >= 0 ? totalStoryCount : null,
          storiesTodayCount: storiesTodayCount >= 0 ? storiesTodayCount : null,
        });

      } catch (err: any) {
        console.error("Error fetching dashboard stats:", err);
        setError(err.message || 'Failed to load dashboard statistics');
        // Set stats to null or keep previous state on error?
        setStats({ userCount: null, totalStoryCount: null, storiesTodayCount: null }); 
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Optional: Set up real-time listeners if needed
    // const unsubscribe = onSnapshot(..., (snapshot) => { ... });
    // return () => unsubscribe();

  }, []); // Re-run if dependencies change (e.g., date range for stats)

  return { stats, loading, error };
};

