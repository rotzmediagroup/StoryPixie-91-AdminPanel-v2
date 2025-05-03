
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useSystemMetrics } from '@/hooks/useSystemMetrics';
import { useAuth } from '@/contexts/AuthContext';
import { ensureMetricsAccess } from '@/utils/databaseHelpers';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardCharts from '@/components/dashboard/DashboardCharts';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { metrics, loading, error } = useSystemMetrics();

  // Ensure metrics access when component mounts
  useEffect(() => {
    if (currentUser?.id) {
      ensureMetricsAccess(currentUser.id)
        .then(hasAccess => {
          console.log("User has metrics access:", hasAccess);
        })
        .catch(err => {
          console.error("Error checking metrics access:", err);
        });
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load dashboard data</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Dashboard" 
        description="Overview of Story Pixie platform metrics and status" 
      />
      
      {/* Stats Cards */}
      <DashboardStats metrics={metrics} />
      
      {/* Charts */}
      <DashboardCharts healthData={metrics.health} />
    </div>
  );
};

export default Dashboard;
