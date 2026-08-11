import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import './BarChart.css';

const BarChart = ({ 
  data, 
  dataKey = 'value', 
  xAxisKey = 'name',
  series, // Array for multiple bars: [{ key: 'value1', name: 'Name', color: '#fff' }]
  layout = 'horizontal',
  showLegend = false,
}) => {
  return (
    <div className="bar-chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart 
          data={data} 
          layout={layout}
          margin={layout === 'vertical' ? { top: 10, right: 30, left: 100, bottom: 20 } : { top: 15, right: 20, left: 10, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={layout === 'vertical'} horizontal={layout === 'horizontal'} stroke="#e2e8f0" />
          
          {layout === 'horizontal' ? (
            <>
              <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} tickFormatter={(v) => typeof v === 'number' && v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
            </>
          ) : (
            <>
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} tickFormatter={(v) => typeof v === 'number' && v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
              <YAxis type="category" dataKey={xAxisKey} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
            </>
          )}

          <Tooltip cursor={{ fill: 'transparent' }} wrapperClassName="custom-tooltip-wrapper" />
          {showLegend && <Legend />}
          
          {series ? (
            series.map((s, index) => (
              <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={layout === 'vertical' ? [0, 4, 4, 0] : [4, 4, 0, 0]} barSize={20} />
            ))
          ) : (
            <Bar dataKey={dataKey} radius={layout === 'vertical' ? [0, 4, 4, 0] : [4, 4, 0, 0]} barSize={layout === 'vertical' ? 22 : 40}>
              {data?.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={
                    entry.color || 
                      (index % 2 === 0 ? 'var(--primary-light)' : 'var(--primary)')
                  } 
                />
              ))}
            </Bar>
          )}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
