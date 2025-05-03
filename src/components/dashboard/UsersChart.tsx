
import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';
import { DailyUserStats } from '@/hooks/useDashboardCharts';

interface UsersChartProps {
  dailyActiveUsers: DailyUserStats[];
}

const UsersChart: React.FC<UsersChartProps> = ({ dailyActiveUsers }) => {
  return (
    <MetricChart
      title="Daily Active Users"
      description="User activity across platforms over the last 30 days"
      data={dailyActiveUsers.slice(-14)}
      type="area"
      lines={[
        { dataKey: 'web', stroke: '#9b87f5', fill: '#9b87f5' },
        { dataKey: 'ios', stroke: '#6E59A5', fill: '#6E59A5' },
        { dataKey: 'android', stroke: '#D6BCFA', fill: '#D6BCFA' }
      ]}
      xAxisDataKey="date"
    />
  );
};

export default UsersChart;
