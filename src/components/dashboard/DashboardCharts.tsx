import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  BarChart,
  Bar,
} from 'recharts';
import { useDashboardCharts, ChartDataPoint } from '@/hooks/useDashboardCharts';

interface ChartCardProps {
  title: string;
  data: ChartDataPoint[];
  dataKey: string;
  color: string;
  loading: boolean;
  error: string | null;
  chartType?: 'line' | 'bar';
}

const ChartCard: React.FC<ChartCardProps> = ({ title, data, dataKey, color, loading, error, chartType = 'line' }) => {
  if (error) {
    return (
      <Card className="bg-destructive/10 border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading {title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey={dataKey} 
                  stroke={color} 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              </LineChart>
            ) : (
              <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                />
                <Legend />
                <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-full text-muted-foreground">
            No data available for this period.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardCharts = () => {
  const { chartData, loading, error } = useDashboardCharts(7); // Fetch data for the last 7 days

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard
        title="Daily User Signups (Last 7 Days)"
        data={chartData.userSignups}
        dataKey="count"
        color="hsl(var(--primary))"
        loading={loading}
        error={error}
        chartType="bar" // Use bar chart for signups
      />
      <ChartCard
        title="Daily Story Generations (Last 7 Days)"
        data={chartData.storyGenerations}
        dataKey="count"
        color="hsl(var(--secondary))" // Use a different color
        loading={loading}
        error={error}
        chartType="line" // Use line chart for generations
      />
      {/* Add more ChartCard components for other data */}
    </div>
  );
};

export default DashboardCharts;

