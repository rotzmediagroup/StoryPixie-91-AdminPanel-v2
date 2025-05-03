import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface MetricChartProps {
  data: Record<string, number | string>[];
  categories?: {
    name: string;
    color: string;
  }[];
  index?: string;
  // New properties
  title?: string;
  description?: string;
  type?: 'bar' | 'line' | 'area' | 'pie';
  lines?: {
    dataKey: string;
    stroke: string;
    fill?: string;
  }[];
  xAxisDataKey?: string;
  height?: number;
}

const MetricChart: React.FC<MetricChartProps> = ({ 
  data, 
  categories, 
  index,
  title,
  description,
  type = 'bar',
  lines,
  xAxisDataKey,
  height = 300
}) => {
  // Choose chart type based on the type prop
  const renderChart = () => {
    switch(type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisDataKey || index} />
            <YAxis />
            <Tooltip />
            <Legend />
            {lines?.map((line, i) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.stroke}
              />
            ))}
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisDataKey || index} />
            <YAxis />
            <Tooltip />
            <Legend />
            {lines?.map((line, i) => (
              <Area
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.stroke}
                fill={line.fill || line.stroke}
                fillOpacity={0.3}
              />
            ))}
          </AreaChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey={lines?.[0]?.dataKey || 'value'}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={categories?.[index]?.color || `#${Math.floor(Math.random()*16777215).toString(16)}`} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      case 'bar':
      default:
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisDataKey || index} />
            <YAxis />
            <Tooltip />
            <Legend />
            {categories?.map((category) => (
              <Bar 
                key={category.name}
                dataKey={category.name}
                fill={category.color}
              />
            ))}
          </BarChart>
        );
    }
  };

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </CardHeader>
      )}
      <CardContent>
        <div style={{ width: '100%', height: height }}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricChart;
