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
          margin={layout === 'vertical' ? { top: 8, right: 24, left: 92, bottom: 8 } : { top: 12, right: 12, left: 0, bottom: 18 }}
          barCategoryGap="24%"
        >
          <defs>
            <pattern id="chart-bar-pattern" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
              <rect width="8" height="8" fill="var(--dashboard-primary-soft)" opacity="0.22" />
              <rect width="3" height="8" fill="var(--dashboard-primary)" opacity="0.75" />
            </pattern>
          </defs>
          <CartesianGrid className="chart-grid" strokeDasharray="0" vertical={false} horizontal stroke="var(--dashboard-border)" />
          
          {layout === 'horizontal' ? (
            <>
              <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} tick={{ fill: 'var(--dashboard-text-muted)', fontSize: 11 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--dashboard-text-muted)', fontSize: 11 }} tickFormatter={(v) => typeof v === 'number' && v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} width={34} />
            </>
          ) : (
            <>
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'var(--dashboard-text-muted)', fontSize: 11 }} tickFormatter={(v) => typeof v === 'number' && v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
              <YAxis type="category" dataKey={xAxisKey} axisLine={false} tickLine={false} tick={{ fill: 'var(--dashboard-text-muted)', fontSize: 11 }} width={88} />
            </>
          )}

          <Tooltip cursor={{ fill: 'transparent' }} wrapperClassName="custom-tooltip-wrapper" />
          {showLegend && <Legend />}
          
          {series ? (
            series.map((s) => (
              <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color || 'var(--dashboard-primary)'} radius={layout === 'vertical' ? [0, 8, 8, 0] : [8, 8, 0, 0]} maxBarSize={layout === 'vertical' ? 20 : 42} />
            ))
          ) : (
            <Bar dataKey={dataKey} radius={layout === 'vertical' ? [0, 8, 8, 0] : [8, 8, 0, 0]} maxBarSize={layout === 'vertical' ? 22 : 42}>
              {data?.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={
                    entry.color || 
                      (index % 2 === 0 ? 'url(#chart-bar-pattern)' : 'var(--dashboard-primary)')
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
