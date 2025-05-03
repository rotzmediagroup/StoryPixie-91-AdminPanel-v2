
import React from 'react';
import { Users, BookOpen, Play, Clock } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { SystemMetrics } from '@/hooks/useSystemMetrics';

interface DashboardStatsProps {
  metrics: SystemMetrics;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title="Total Users"
        value={metrics.totalUsers.toLocaleString()}
        icon={Users}
        description="Across all platforms"
      />
      <StatCard
        title="Active Users"
        value={metrics.activeUsers.toLocaleString()}
        icon={Users}
        description="Currently online"
      />
      <StatCard
        title="Stories Generated"
        value={metrics.storiesGenerated.toLocaleString()}
        icon={BookOpen}
      />
      <StatCard
        title="Audio Played"
        value={metrics.audioPlayed.toLocaleString()}
        icon={Play}
      />
      <StatCard
        title="Avg. Session Time"
        value={`${metrics.averageSessionTime} min`}
        icon={Clock}
      />
    </div>
  );
};

export default DashboardStats;
