import React from 'react';
import { IconArrowUpRight, IconArrowDownRight, IconDots } from '@tabler/icons-react';
import BarChart from '../../global-components/Charts/BarChart';
import PieChart from '../../global-components/Charts/PieChart';
import './DashboardPlaceholder.css';

const StatCard = ({ title, value, trend, isPositive }) => (
  <div className="stat-card">

  </div>
);

// Dummy Data
const barData = [
  { name: 'Mon', value: 30 },
  { name: 'Tue', value: 45, color: 'var(--primary-blue)' }, // Accent color
  { name: 'Wed', value: 55, color: 'var(--secondary-blue)' }, // Highlight color
  { name: 'Thu', value: 45 },
  { name: 'Fri', value: 30 },
  { name: 'Sat', value: 45 },
  { name: 'Sun', value: 30 },
];

const pieData = [
  { name: 'Used', value: 45, color: 'var(--primary-blue)' },
  { name: 'Available', value: 35, color: 'var(--secondary-blue)' },
  { name: 'Reserved', value: 20, color: 'var(--border-light)' }
];

const DashboardPlaceholder = () => {
  return (
    <div className="dashboard-grid">
      {/* Row 1: 4 Stat Cards */}
      <div className="stats-row">
        <StatCard title="Total Inventory" value="24,562" trend="+12.5%" isPositive={true} />
        <StatCard title="Pending Orders" value="1,245" trend="-2.4%" isPositive={false} />
        <StatCard title="Storage Capacity" value="86%" trend="+4.1%" isPositive={true} />
        <StatCard title="Delivery Success" value="98.2%" trend="+0.8%" isPositive={true} />
      </div>

      {/* Row 2: Charts */}
      <div className="charts-row">
        <div className="chart-card main-chart">
          <div className="chart-header">
            <h3>Inventory Flow</h3>
            <select className="chart-select">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="chart-placeholder">
            <BarChart data={barData} xAxisKey="name" dataKey="value" height={220} />
          </div>
        </div>
        <div className="chart-card pie-chart">
          <div className="chart-header">
            <h3>Storage Usage</h3>
            <IconDots size={16} />
          </div>
          <div className="chart-placeholder pie-placeholder">
            <PieChart data={pieData} height={200} />
          </div>
        </div>
      </div>

      {/* Row 3: Table */}
      <div className="table-row">
        <div className="table-card">
          <div className="chart-header">
            <h3>Recent Deliveries</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="table-placeholder">
            <div className="table-header-mockup">
              <span>Order ID</span>
              <span>Status</span>
              <span>Date</span>
              <span>Amount</span>
            </div>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="table-row-mockup">
                <span className="mock-id">#ORD-{8492 + i}</span>
                <span className="mock-badge">Completed</span>
                <span>Oct {10 + i}, 2022</span>
                <span>${(450.00 * i).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPlaceholder;
