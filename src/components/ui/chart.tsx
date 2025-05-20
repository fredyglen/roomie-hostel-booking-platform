
import React from 'react';
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  TooltipProps
} from 'recharts';

export interface ChartData {
  name: string;
  total: number;
}

interface BarChartProps {
  data: ChartData[];
  barColor?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, barColor = "#8884d8" }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #f0f0f0',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }} 
        />
        <Bar dataKey="total" fill={barColor} radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

interface LineChartProps {
  data: ChartData[];
  lineColor?: string;
}

export const LineChart: React.FC<LineChartProps> = ({ data, lineColor = "#8884d8" }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #f0f0f0',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }} 
        />
        <Line type="monotone" dataKey="total" stroke={lineColor} activeDot={{ r: 6 }} strokeWidth={2} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default { BarChart, LineChart };
