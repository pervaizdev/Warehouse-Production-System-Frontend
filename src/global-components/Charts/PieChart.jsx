import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './PieChart.css';

const CustomLegend = (props) => {
  const { payload } = props;
  
  // Calculate total to show percentages
  const total = payload.reduce((sum, entry) => sum + (entry.payload.value || 0), 0);
  const getLegendColorClass = (color) => {
    const colorClasses = {
      'var(--primary)': 'legend-dot-primary',
      'var(--primary-blue)': 'legend-dot-primary',
      'var(--primary-hover)': 'legend-dot-primary-hover',
      'var(--border-color)': 'legend-dot-border',
      'var(--secondary-color)': 'legend-dot-secondary',
      'var(--color-success)': 'legend-dot-success',
      'var(--color-danger)': 'legend-dot-danger',
    };

    return colorClasses[color] || 'legend-dot-default';
  };

  return (
    <ul className="custom-pie-legend">
      {payload.map((entry, index) => {
        const percentage = total > 0 ? ((entry.payload.value / total) * 100).toFixed(1) : 0;
        return (
          <li key={`item-${index}`} className="custom-pie-legend-item">
            <div className="legend-label-group">
              <span 
                className={`legend-dot ${getLegendColorClass(entry.color)}`}
              />
              <span className="legend-label">{entry.value}</span>
            </div>
            <span className="legend-value">{percentage}%</span>
          </li>
        );
      })}
    </ul>
  );
};

const PieChart = ({ 
  data, 
  innerRadius = 60, 
  outerRadius = 90, 
  paddingAngle = 4,
  showLegend = true
}) => {
  // A broader palette for pie charts matching the requested UI design
  const COLORS = [
    'var(--primary-blue)',
    'var(--secondary-color)',
    'var(--color-warning)',
    'var(--dashboard-primary-soft)',
    'var(--color-success)',
    'var(--color-danger)'
  ];

  return (
    <div className="pie-chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx={showLegend ? "35%" : "50%"}
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={paddingAngle}
            dataKey="value"
            nameKey="name"
            stroke="var(--dashboard-surface)"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            wrapperClassName="custom-pie-tooltip-wrapper"
          />
          {showLegend && (
            <Legend 
              content={<CustomLegend />} 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
