import { useState, useEffect } from 'react';
import { getDailyUserSignups, getDailyStoryGenerations } from '@/lib/firestoreUtils';

export interface ChartDataPoint {
  date: string;
  count: number;
}

export interface DashboardChartData {
  userSignups: ChartDataPoint[];
  storyGenerations: ChartDataPoint[];
  // Add other chart data arrays as needed
}

export const useDashboardCharts = (days: number = 7) => {
  const [chartData, setChartData] = useState<DashboardChartData>({ 
    userSignups: [],
    storyGenerations: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch chart data in parallel
        const [userSignups, storyGenerations] = await Promise.all([
          getDailyUserSignups(days),
          getDailyStoryGenerations(days),
          // Add calls for other chart data here
        ]);

        setChartData({
          userSignups,
          storyGenerations,
        });

      } catch (err: any) {
        console.error(`Error fetching dashboard chart data for last ${days} days:`, err);
        setError(err.message || 'Failed to load dashboard chart data');
        setChartData({ userSignups: [], storyGenerations: [] }); 
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();

    // Optional: Set up real-time listeners if needed

  }, [days]); // Re-run if the number of days changes

  return { chartData, loading, error };
};

