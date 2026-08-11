import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import './DashboardStatCard.css';

const DashboardStatCard = ({ label, value, sub, icon, trend, className = '', children }) => {
  return (
    <div className={`stat-card ${className}`.trim()}>
      <div className="stat-card-header">
        {label && <span className="stat-label">{label}</span>}
        {icon && <span className="stat-icon">{icon}</span>}
      </div>
      
      {value !== undefined && value !== null && <div className="stat-value">{value}</div>}
      
      {trend && (
        <div className="stat-sub">
          <span className={`stat-trend ${trend.direction === 'down' ? 'negative' : 'positive'}`}>
            {trend.direction === 'down' ? <IconArrowDownRight size={14} /> : <IconArrowUpRight size={14} />}
            {trend.value}
          </span>
          <span className="stat-trend-label">{trend.label || 'vs last period'}</span>
        </div>
      )}
      
      {!trend && sub && <div className="stat-sub">{sub}</div>}
      
      {children}
    </div>
  );
};

export default DashboardStatCard;
