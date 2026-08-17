import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import './LineChart.css';

const LineChart = ({ data, xAxisKey = 'name', series = [], showLegend = true, curve = 'stepAfter' }) => (
  <div className="line-chart-container">
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid className="chart-grid" strokeDasharray="0" vertical={false} stroke="var(--dashboard-border)" />
        <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} tick={{ fill: 'var(--dashboard-text-muted)', fontSize: 11 }} dy={8} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--dashboard-text-muted)', fontSize: 11 }} width={34} />
        <Tooltip wrapperClassName="custom-line-tooltip-wrapper" />
        {showLegend && <Legend />}
        {series.map((item) => (
          <Line key={item.key} type={curve} dataKey={item.key} name={item.name} stroke={item.color || 'var(--dashboard-primary)'} strokeWidth={3} dot={{ r: 2.5, strokeWidth: 2 }} activeDot={{ r: 5 }} />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  </div>
);

export default LineChart;
