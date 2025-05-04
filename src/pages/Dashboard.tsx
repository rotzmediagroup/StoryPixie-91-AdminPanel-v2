import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats'; // Import real stats component
import DashboardCharts from '@/components/dashboard/DashboardCharts'; // Import real charts component

const Dashboard = () => {
  const { currentUser, isLoading } = useAuth(); // Use isLoading from auth context

  // Show loading state while auth is being checked
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Use real dashboard components
  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Dashboard" 
        description={`Welcome back, ${currentUser?.name || 'Admin'}!`}
      />
      
      {/* Real Stats Cards */}
      <DashboardStats />
      
      {/* Real Charts */}
      <DashboardCharts />

      {/* Remove or update the rebuild message */}
      {/* 
      <div className="border rounded-lg p-4 bg-card text-card-foreground shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Admin Panel Enhancements</h3>
        <p className="text-muted-foreground">
          Displaying real-time statistics and charts.
        </p>
      </div> 
      */}
    </div>
  );
};

export default Dashboard;

