
import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';
import { PlatformDistributionData, PlatformCategory } from '@/hooks/useDashboardCharts';

interface PlatformDistributionChartProps {
  platformData: PlatformDistributionData[];
  platformCategories: PlatformCategory[];
}

const PlatformDistributionChart: React.FC<PlatformDistributionChartProps> = ({ 
  platformData, 
  platformCategories 
}) => {
  return (
    <MetricChart
      title="Platform Distribution"
      description="Current active users by platform"
      data={platformData}
      categories={platformCategories}
      type="pie"
      lines={[{ dataKey: 'value', stroke: '#9b87f5' }]}
      height={250}
    />
  );
};

export default PlatformDistributionChart;
