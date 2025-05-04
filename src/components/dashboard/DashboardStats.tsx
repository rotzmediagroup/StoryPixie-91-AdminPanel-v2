import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, BookOpen, Activity } from 'lucide-react';
import { useDashboardStats, DashboardStatsData } from '@/hooks/useDashboardStats';

interface StatCardProps {
  title: string;
  value: number | string | null;
  description: string;
  icon: React.ElementType;
  loading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon: Icon, loading }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 animate-pulse">
            <div className="h-6 bg-muted rounded w-1/2"></div>
          </div>
        ) : (
          <div className="text-2xl font-bold">
            {value !== null && typeof value === 'number' ? value.toLocaleString() : value !== null ? value : 'N/A'}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

const DashboardStats = () => {
  const { stats, loading, error } = useDashboardStats();

  if (error) {
    return (
      <Card className="bg-destructive/10 border-destructive col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  // Define the stats to display
  const statItems = [
    {
      title: "Total Users",
      value: stats.userCount,
      description: "Total registered users",
      icon: Users,
    },
    {
      title: "Total Stories",
      value: stats.totalStoryCount,
      description: "Total stories generated",
      icon: BookOpen,
    },
    {
      title: "Stories Today",
      value: stats.storiesTodayCount,
      description: "Stories generated in last 24h",
      icon: Activity,
    },
    // Add more StatCard components as needed for other stats
    // Example placeholder:
    {
      title: "Active Users (24h)",
      value: null, // Replace with actual data when available
      description: "Users active in last 24h",
      icon: Users, // Placeholder icon
    },
    {
      title: "Revenue (Month)",
      value: null, // Replace with actual data when available
      description: "Estimated revenue this month",
      icon: Users, // Placeholder icon
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statItems.map((item, index) => (
        <StatCard
          key={index}
          title={item.title}
          value={item.value}
          description={item.description}
          icon={item.icon}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default DashboardStats;

