import React from 'react';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import './StatCard.css';

const StatCard = ({ 
  title, 
  value, 
  trend, 
  isPositive, 
  icon: Icon, 
  subtext = "vs last period",
  color = "primary" // options: primary, blue, emerald, amber, rose, purple
}) => (
  <div className={`stat-card accent-${color}`}>
    <div className="stat-header">
      <span className="stat-title">{title}</span>
      {Icon && (
        <div className={`stat-icon-wrapper text-${color}`}>
          <Icon size={22} aria-hidden="true" stroke={1.5} />
        </div>
      )}
    </div>
    <div className={`stat-value text-${color}-dark`}>{value}</div>
    {trend ? (
      <div className={`stat-trend ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? <IconArrowUpRight size={16} /> : <IconArrowDownRight size={16} />}
        {trend}
        <span>{subtext}</span>
      </div>
    ) : (
      <div className="stat-subtext">{subtext}</div>
    )}
  </div>
);

export default StatCard;
