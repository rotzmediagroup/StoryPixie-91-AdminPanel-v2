import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface DailyUserStats {
  date: string;
  web: number;
  ios: number;
  android: number;
}

export interface StoryGenerationStats {
  date: string;
  count: number;
}

export interface PlatformDistributionData {
  name: string;
  value: number;
}

export interface PlatformCategory {
  name: string;
  color: string;
}

export const useDashboardCharts = () => {
  const [dailyActiveUsers, setDailyActiveUsers] = useState<DailyUserStats[]>([]);
  const [storyGenerationStats, setStoryGenerationStats] = useState<StoryGenerationStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        // Fetch daily active users data
        const dailyStatsRef = collection(db, 'analytics', 'daily', 'userStats');
        const dailyStatsQuery = query(
          dailyStatsRef, 
          orderBy('date', 'desc'),
          limit(30)
        );
        
        const dailyStatsSnapshot = await getDocs(dailyStatsQuery);
        const dailyStats: DailyUserStats[] = [];
        
        dailyStatsSnapshot.forEach(doc => {
          const data = doc.data();
          dailyStats.push({
            date: data.date,
            web: data.platforms?.web || 0,
            ios: data.platforms?.ios || 0,
            android: data.platforms?.android || 0
          });
        });
        
        // If we have real data, use it. Otherwise, calculate placeholder data
        if (dailyStats.length > 0) {
          setDailyActiveUsers(dailyStats.reverse());
        } else {
          console.log("No daily active users data found, creating placeholder data");
          // Create placeholder data for chart display
          const placeholderData: DailyUserStats[] = [];
          const date = new Date();
          date.setDate(date.getDate() - 14);
          const currentDate = new Date(date);
          for (let i = 0; i < 14; i++) {
            const dateStr = currentDate.toISOString().split('T')[0];
            placeholderData.push({
              date: dateStr,
              web: Math.floor(Math.random() * 200) + 300,
              ios: Math.floor(Math.random() * 200) + 200,
              android: Math.floor(Math.random() * 150) + 150
            });
            currentDate.setDate(currentDate.getDate() + 1);
          }
          
          setDailyActiveUsers(placeholderData);
        }
        
        // Fetch story generation stats
        const storyStatsRef = collection(db, 'analytics', 'daily', 'storyStats');
        const storyStatsQuery = query(
          storyStatsRef, 
          orderBy('date', 'desc'),
          limit(30)
        );
        
        const storyStatsSnapshot = await getDocs(storyStatsQuery);
        const storyStats: StoryGenerationStats[] = [];
        
        storyStatsSnapshot.forEach(doc => {
          const data = doc.data();
          storyStats.push({
            date: data.date,
            count: data.generated || 0
          });
        });
        
        // If we have real data, use it. Otherwise, calculate placeholder data
        if (storyStats.length > 0) {
          setStoryGenerationStats(storyStats.reverse());
        } else {
          console.log("No story stats data found, creating placeholder data");
          // Create placeholder data for chart display
          const placeholderData: StoryGenerationStats[] = [];
          const date = new Date();
          date.setDate(date.getDate() - 14);
          const currentDate = new Date(date);
          for (let i = 0; i < 14; i++) {
            const dateStr = currentDate.toISOString().split('T')[0];
            placeholderData.push({
              date: dateStr,
              count: Math.floor(Math.random() * 200) + 500
            });
            currentDate.setDate(currentDate.getDate() + 1);
          }
          
          setStoryGenerationStats(placeholderData);
        }
      } catch (err) {
        console.error("Error fetching chart data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  // Platform distribution data
  const getPlatformData = (): PlatformDistributionData[] => {
    if (dailyActiveUsers.length === 0) return [];
    
    const lastDay = dailyActiveUsers[dailyActiveUsers.length - 1];
    return [
      { name: 'Web', value: lastDay.web },
      { name: 'iOS', value: lastDay.ios },
      { name: 'Android', value: lastDay.android }
    ];
  };

  // Platform categories for chart colors
  const platformCategories: PlatformCategory[] = [
    { name: 'Web', color: '#9b87f5' },
    { name: 'iOS', color: '#6E59A5' },
    { name: 'Android', color: '#D6BCFA' }
  ];

  return {
    dailyActiveUsers,
    storyGenerationStats,
    loading,
    getPlatformData,
    platformCategories
  };
};
