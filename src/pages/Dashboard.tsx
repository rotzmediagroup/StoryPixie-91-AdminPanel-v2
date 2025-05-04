import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

// Placeholder components for stats and charts during rebuild
const PlaceholderStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="border rounded-lg p-4 bg-card text-card-foreground shadow-sm h-24 animate-pulse">
        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-muted rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

const PlaceholderCharts = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="border rounded-lg p-4 bg-card text-card-foreground shadow-sm h-64 animate-pulse">
      <div className="h-full bg-muted rounded"></div>
    </div>
    <div className="border rounded-lg p-4 bg-card text-card-foreground shadow-sm h-64 animate-pulse">
      <div className="h-full bg-muted rounded"></div>
    </div>
  </div>
);

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

  // Basic dashboard structure for rebuild
  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Dashboard" 
        description={`Welcome back, ${currentUser?.name || 'Admin'}!`}
      />
      
      {/* Placeholder Stats Cards */}
      <PlaceholderStats />
      
      {/* Placeholder Charts */}
      <PlaceholderCharts />

      {/* Add more core dashboard elements here as needed */}
      <div className="border rounded-lg p-4 bg-card text-card-foreground shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Admin Panel Rebuild</h3>
        <p className="text-muted-foreground">
          Core functionality is being rebuilt. More features will be added soon.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;

