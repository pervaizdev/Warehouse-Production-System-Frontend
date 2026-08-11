import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './BarChart.css';

const BarChart = ({ data, dataKey = 'value', xAxisKey = 'name', series }) => {
  const chartSeries = series || [{ dataKey, name: dataKey, color: 'var(--primary)' }];

  return (
    <div className="bar-chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: chartSeries.length > 1 ? 24 : 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey={xAxisKey} 
            axisLine={false} 
            tickLine={false} 
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            wrapperClassName="custom-tooltip-wrapper"
          />
          {chartSeries.map((item) => (
            <Bar
              key={item.dataKey}
              dataKey={item.dataKey}
              name={item.name || item.dataKey}
              fill={item.color || 'var(--primary)'}
              radius={[4, 4, 0, 0]}
              barSize={chartSeries.length > 1 ? 24 : 40}
            />
          ))}
          <Legend verticalAlign="bottom" height={24} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
