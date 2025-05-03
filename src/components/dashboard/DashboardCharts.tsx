
import React from 'react';
import { Loader2 } from 'lucide-react';
import UsersChart from '@/components/dashboard/UsersChart';
import StoryGenerationChart from '@/components/dashboard/StoryGenerationChart';
import PlatformDistributionChart from '@/components/dashboard/PlatformDistributionChart';
import SystemStatusCard from '@/components/dashboard/SystemStatusCard';
import { useDashboardCharts } from '@/hooks/useDashboardCharts';
import { SystemHealth } from '@/types';

interface DashboardChartsProps {
  healthData: SystemHealth[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ healthData }) => {
  const { 
    dailyActiveUsers, 
    storyGenerationStats, 
    loading, 
    getPlatformData, 
    platformCategories 
  } = useDashboardCharts();

  if (loading) {
    return (
      <div className="text-center py-8 border rounded-lg bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
        <p className="text-muted-foreground">Loading chart data...</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UsersChart dailyActiveUsers={dailyActiveUsers} />
        <StoryGenerationChart storyGenerationStats={storyGenerationStats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PlatformDistributionChart 
          platformData={getPlatformData()} 
          platformCategories={platformCategories} 
        />
        <SystemStatusCard healthData={healthData} />
      </div>
    </>
  );
};

export default DashboardCharts;
