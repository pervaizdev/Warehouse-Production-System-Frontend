import React, { useState } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector
} from 'recharts';
import './PieChart.css';

const DEFAULT_COLORS = [
  '#8338EC', // Purple
  '#FF007A', // Pink / Coral
  '#FFB800', // Amber / Gold
  '#1B47DB', // Brand Royal Blue
  '#10B981', // Success Green
  '#6997E4', // Soft Sky Blue
  '#FB5607', // Warm Orange
  '#798089'  // Muted Slate
];

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill
  } = props;

  return (
    <g className="pie-active-shape-group">
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={Math.max(0, innerRadius - 2)}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={5}
        stroke="var(--dashboard-surface)"
        strokeWidth={2}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload, valuePrefix = '', valueSuffix = '', formatValue }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const formattedVal = formatValue 
      ? formatValue(data.value) 
      : `${valuePrefix}${Number(data.value).toLocaleString()}${valueSuffix}`;

    return (
      <div className="custom-pie-tooltip">
        <div className="custom-pie-tooltip-header">
          <span 
            className="custom-pie-tooltip-dot"
            style={undefined} 
          />
          <span className="custom-pie-tooltip-title">{data.name}</span>
        </div>
        <div className="custom-pie-tooltip-body">
          <span className="custom-pie-tooltip-value">{formattedVal}</span>
          {data.payload?.percentage !== undefined && (
            <span className="custom-pie-tooltip-percentage">
              {data.payload.percentage}%
            </span>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const PieChart = ({
  data = [],
  dataKey = 'value',
  nameKey = 'name',
  innerRadius = 60,
  outerRadius = 86,
  paddingAngle = 4,
  cornerRadius = 5,
  showLegend = true,
  showCenterLabel = true,
  totalLabel = 'Total',
  totalValue = null,
  valuePrefix = '',
  valueSuffix = '',
  formatValue = null,
  height = '100%',
  className = ''
}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className={`pie-chart-empty ${className}`}>
        <span className="pie-chart-empty-text">No data available</span>
      </div>
    );
  }

  // Calculate total
  const total = data.reduce((sum, item) => sum + (Number(item[dataKey]) || 0), 0);

  // Enhance data with percentages and colors
  const enhancedData = data.map((item, index) => {
    const val = Number(item[dataKey]) || 0;
    const percentage = total > 0 ? ((val / total) * 100).toFixed(1) : '0.0';
    const color = item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
    return {
      ...item,
      [dataKey]: val,
      percentage,
      color
    };
  });

  const activeItem = activeIndex !== null ? enhancedData[activeIndex] : null;

  const displayCenterLabel = activeItem ? activeItem[nameKey] : totalLabel;
  const displayCenterValue = activeItem
    ? (formatValue 
        ? formatValue(activeItem[dataKey]) 
        : `${valuePrefix}${Number(activeItem[dataKey]).toLocaleString()}${valueSuffix}`)
    : (totalValue !== null 
        ? totalValue 
        : (formatValue 
            ? formatValue(total) 
            : `${valuePrefix}${Number(total).toLocaleString()}${valueSuffix}`));

  const displayCenterSubtext = activeItem 
    ? `${activeItem.percentage}%` 
    : `${enhancedData.length} items`;

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className={`pie-chart-wrapper ${className}`}>
      {/* Donut Chart Visual */}
      <div className="pie-chart-visual-container">
        <ResponsiveContainer width="100%" height={height || 240}>
          <RechartsPieChart>
            <Pie
              data={enhancedData}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={paddingAngle}
              cornerRadius={cornerRadius}
              dataKey={dataKey}
              nameKey={nameKey}
              stroke="var(--dashboard-surface)"
              strokeWidth={2}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              animationDuration={700}
              animationEasing="ease-out"
            >
              {enhancedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  className="pie-slice-cell"
                />
              ))}
            </Pie>
            <Tooltip
              content={
                <CustomTooltip 
                  valuePrefix={valuePrefix} 
                  valueSuffix={valueSuffix} 
                  formatValue={formatValue} 
                />
              }
            />
          </RechartsPieChart>
        </ResponsiveContainer>

        {/* Center Donut Label */}
        {showCenterLabel && (
          <div className="pie-center-content" aria-hidden="true">
            <span className="pie-center-label">{displayCenterLabel}</span>
            <span className="pie-center-value">{displayCenterValue}</span>
            <span className="pie-center-subtext">{displayCenterSubtext}</span>
          </div>
        )}
      </div>

      {/* Legend / Metrics List */}
      {showLegend && (
        <div className="pie-legend-container">
          <ul className="pie-legend-list">
            {enhancedData.map((entry, index) => {
              const isHovered = activeIndex === index;
              const formattedEntryVal = formatValue
                ? formatValue(entry[dataKey])
                : `${valuePrefix}${Number(entry[dataKey]).toLocaleString()}${valueSuffix}`;

              return (
                <li
                  key={`legend-${index}`}
                  className={`pie-legend-card ${isHovered ? 'active' : ''}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div className="pie-legend-badge-wrapper">
                    <span 
                      className={`pie-legend-badge pie-legend-color-${index % DEFAULT_COLORS.length}`}
                    >
                      <span className="pie-legend-badge-dot" />
                    </span>
                  </div>

                  <div className="pie-legend-info">
                    <span className="pie-legend-title">{entry[nameKey]}</span>
                    {entry.subtext && (
                      <span className="pie-legend-subtext">{entry.subtext}</span>
                    )}
                  </div>

                  <div className="pie-legend-metrics">
                    <span className="pie-legend-value">{formattedEntryVal}</span>
                    <span className="pie-legend-percentage">{entry.percentage}%</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PieChart;
