import React, { useId } from 'react';
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import './LineChart.css';

const LineChart = ({
  data,
  xAxisKey = 'name',
  series = [],
  showLegend = true,
  curve = 'monotone',
  xAxisTickFormatter,
  yAxisTickFormatter,
}) => {
  const chartId = useId().replace(/:/g, '');

  return (
    <div className="line-chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 18, left: 18, bottom: 10 }}>
          <defs>
            {series.map((item, index) => (
              <linearGradient key={item.key} id={`${chartId}-gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={item.color || 'var(--dashboard-primary)'} stopOpacity={0.3} />
                <stop offset="100%" stopColor={item.color || 'var(--dashboard-primary)'} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid className="chart-grid" strokeDasharray="2 5" vertical={false} stroke="var(--line-chart-grid)" />
          <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} tick={{ fill: 'var(--line-chart-muted)', fontSize: 10 }} tickFormatter={xAxisTickFormatter} dy={8} minTickGap={18} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--line-chart-muted)', fontSize: 10 }} tickFormatter={yAxisTickFormatter} width={48} />
          <Tooltip wrapperClassName="custom-line-tooltip-wrapper" cursor={{ stroke: 'var(--line-chart-cursor)', strokeDasharray: '3 3' }} />
          {showLegend && <Legend />}
          {series.map((item, index) => (
            <Area
              key={item.key}
              type={curve}
              dataKey={item.key}
              name={item.name}
              stroke={item.color || 'var(--dashboard-primary)'}
              strokeWidth={2.5}
              fill={`url(#${chartId}-gradient-${index})`}
              fillOpacity={1}
              dot={false}
              activeDot={{ r: 5, stroke: 'var(--line-chart-panel)', strokeWidth: 2 }}
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
