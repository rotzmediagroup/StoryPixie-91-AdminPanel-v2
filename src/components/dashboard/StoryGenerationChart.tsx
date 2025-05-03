
import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';
import { StoryGenerationStats } from '@/hooks/useDashboardCharts';

interface StoryGenerationChartProps {
  storyGenerationStats: StoryGenerationStats[];
}

const StoryGenerationChart: React.FC<StoryGenerationChartProps> = ({ storyGenerationStats }) => {
  return (
    <MetricChart
      title="Daily Story Generation"
      description="Number of stories generated daily"
      data={storyGenerationStats.slice(-14)}
      type="line"
      lines={[{ dataKey: 'count', stroke: '#9b87f5' }]}
      xAxisDataKey="date"
    />
  );
};

export default StoryGenerationChart;
