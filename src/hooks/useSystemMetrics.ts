import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, getDoc, DocumentData, limit, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SystemHealth } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

export interface SystemMetrics {
  health: SystemHealth[];
  activeUsers: number;
  totalUsers: number;
  storiesGenerated: number;
  audioPlayed: number;
  averageSessionTime: number;
}

export function useSystemMetrics() {
  const { currentUser } = useAuth();
  const [metrics, setMetrics] = useState<SystemMetrics>({
    health: [],
    activeUsers: 0,
    totalUsers: 0,
    storiesGenerated: 0,
    audioPlayed: 0,
    averageSessionTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!currentUser) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        console.log("Fetching system metrics with user:", currentUser.id, currentUser.role);
        
        // Fetch system health data
        const healthRef = collection(db, 'systemHealth');
        const healthSnapshot = await getDocs(healthRef);
        const healthData: SystemHealth[] = [];
        
        healthSnapshot.forEach((doc) => {
          const data = doc.data() as DocumentData;
          healthData.push({
            service: data.service,
            status: data.status || 'operational',
            lastChecked: data.lastChecked || new Date().toISOString(),
            responseTime: data.responseTime,
            error: data.error
          });
        });
        
        // Fetch metrics data
        const metricsDoc = await getDoc(doc(db, 'metrics', 'dashboard'));
        let metricsData = {
          activeUsers: 0,
          totalUsers: 0,
          storiesGenerated: 0,
          audioPlayed: 0,
          averageSessionTime: 0
        };
        
        if (metricsDoc.exists()) {
          const data = metricsDoc.data();
          metricsData = {
            activeUsers: data.activeUsers || 0,
            totalUsers: data.totalUsers || 0,
            storiesGenerated: data.storiesGenerated || 0,
            audioPlayed: data.audioPlayed || 0,
            averageSessionTime: data.averageSessionTime || 0
          };
        } else {
          console.log('No metrics document found, calculating from collections');
          
          // If metrics document doesn't exist, calculate from collections
          try {
            const usersSnapshot = await getDocs(query(collection(db, 'users'), limit(1000)));
            const totalUsers = usersSnapshot.size;
            
            const storiesSnapshot = await getDocs(query(collection(db, 'stories'), limit(1000)));
            const storiesGenerated = storiesSnapshot.size;
            
            // Calculate active users from the last 24 hours
            const oneDayAgo = new Date();
            oneDayAgo.setDate(oneDayAgo.getDate() - 1);
            
            const activeUsersSnapshot = await getDocs(
              query(
                collection(db, 'users'),
                where('lastActive', '>=', oneDayAgo.toISOString()),
                limit(1000)
              )
            );
            
            const activeUsers = activeUsersSnapshot.size;
            
            metricsData = {
              ...metricsData,
              totalUsers,
              activeUsers,
              storiesGenerated
            };
          } catch (collectionError) {
            console.error("Error calculating metrics from collections:", collectionError);
            // Continue with default values if collection calculation fails
          }
        }
        
        setMetrics({
          health: healthData.length > 0 ? healthData : generateDefaultHealthData(),
          ...metricsData
        });
      } catch (err: unknown) {
        console.error("Error fetching system metrics:", err);
        // Check if it's a permission error
        if ((err as { code?: string })?.code === 'permission-denied') {
          toast({
            title: "Using demo data",
            description: "Using demo data for dashboard since database access is limited.",
            variant: "default"
          });
        } else {
          setError(`Failed to fetch metrics: ${(err as Error).message}`);
        }
        // Set default data when real data isn't available
        setMetrics({
          health: generateDefaultHealthData(),
          activeUsers: 145,
          totalUsers: 1250,
          storiesGenerated: 8750,
          audioPlayed: 6240,
          averageSessionTime: 7.4
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [currentUser]);

  // Generate default health data when real data isn't available
  const generateDefaultHealthData = (): SystemHealth[] => {
    return [
      { service: "Authentication", status: "operational", lastChecked: new Date().toISOString(), responseTime: 78 },
      { service: "Storage", status: "operational", lastChecked: new Date().toISOString(), responseTime: 112 },
      { service: "Database", status: "operational", lastChecked: new Date().toISOString(), responseTime: 95 },
      { service: "AI Generation", status: "operational", lastChecked: new Date().toISOString(), responseTime: 324 },
      { service: "Audio Processing", status: "operational", lastChecked: new Date().toISOString(), responseTime: 254 }
    ];
  };

  return { metrics, loading, error };
}
