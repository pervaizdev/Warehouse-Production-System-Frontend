import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import './LineChart.css';

const LineChart = ({ data, xAxisKey = 'name', series = [] }) => {
  return (
    <div className="line-chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 8, right: 20, left: 8, bottom: 68 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey={xAxisKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            interval={0}
            height={68}
            dy={8}
            padding={{ left: 8, right: 8 }}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
          <Tooltip wrapperClassName="custom-line-tooltip-wrapper" />
          {series.map((item) => (
            <Line
              key={item.dataKey}
              type="monotone"
              dataKey={item.dataKey}
              name={item.name || item.dataKey}
              stroke={item.color || 'var(--primary)'}
              strokeWidth={item.strokeWidth || 3}
              dot={{ r: 4, fill: item.color || 'var(--primary)' }}
              activeDot={{ r: 6 }}
            />
          ))}
          <Legend
            verticalAlign="top"
            height={30}
            wrapperStyle={{ paddingBottom: 4, fontSize: 13 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
