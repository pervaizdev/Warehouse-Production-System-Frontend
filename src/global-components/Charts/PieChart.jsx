import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './PieChart.css';

const CustomLegend = (props) => {
  const { payload } = props;
  
  // Calculate total to show percentages
  const total = payload.reduce((sum, entry) => sum + (entry.payload.value || 0), 0);

  return (
    <ul className="custom-pie-legend">
      {payload.map((entry, index) => {
        const percentage = total > 0 ? ((entry.payload.value / total) * 100).toFixed(1) : 0;
        return (
          <li key={`item-${index}`} className="custom-pie-legend-item">
            <div className="legend-label-group">
              <span 
                className="legend-dot" 
                style={{ backgroundColor: entry.color }}
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
    '#4285F4', // Blue
    '#2ECA7F', // Green
    '#F5A623', // Orange/Yellow
    '#9013FE', // Purple
    '#E91E63', // Pink
    '#00BCD4', // Cyan
    '#FF5722', // Deep Orange
    '#607D8B'  // Blue Grey
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
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            wrapperClassName="custom-pie-tooltip-wrapper"
            itemStyle={{ color: 'var(--text-primary)' }}
          />
          {showLegend && (
            <Legend 
              content={<CustomLegend />} 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              wrapperStyle={{ right: '5%' }}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
