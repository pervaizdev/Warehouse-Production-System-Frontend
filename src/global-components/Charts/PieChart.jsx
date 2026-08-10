import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './PieChart.css';

const PieChart = ({ data, innerRadius = 0, outerRadius = 80 }) => {
  // Palette driven by global.css variables
  const COLORS = ['var(--primary-blue)', 'var(--secondary-blue)', 'var(--border-light)', 'var(--accent-orange)'];

  return (
    <div className="pie-chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            wrapperClassName="custom-pie-tooltip-wrapper"
            itemStyle={{ color: '#0f172a' }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
