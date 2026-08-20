import { IconDots, IconBox, IconShoppingCart, IconBuildingWarehouse, IconTruckDelivery } from '@tabler/icons-react';
import BarChart from '../../global-components/Charts/BarChart';
import PieChart from '../../global-components/Charts/PieChart';
import Spinner from '../../global-components/Spinner/Spinner';
import StatCard from '../../global-components/StatCard/StatCard';
import './DashboardPlaceholder.css';

const barData = [
  { name: 'Mon', value: 30 },
  { name: 'Tue', value: 45, color: 'var(--primary)' },
  { name: 'Wed', value: 55, color: 'var(--primary-hover)' },
  { name: 'Thu', value: 45 },
  { name: 'Fri', value: 30 },
  { name: 'Sat', value: 45 },
  { name: 'Sun', value: 30 },
];

const pieData = [
  { name: 'Used', value: 45, color: 'var(--primary)' },
  { name: 'Available', value: 35, color: 'var(--primary-hover)' },
  { name: 'Reserved', value: 20, color: 'var(--border-color)' }
];

const DataState = ({ loading, hasData, children }) => {
  if (loading) return (
    <div className="dashboard-state dashboard-state-empty">
      <Spinner size="md" />
      <span>Loading data...</span>
    </div>
  );
  if (!hasData) return <div className="dashboard-state dashboard-state-empty">No data available for this period.</div>;
  return children;
};

const DashboardPlaceholder = () => {
  const isLoading = false;

  return (
    <div className="dashboard-grid">
      <section className="stats-row" aria-label="Key performance indicators">
        <StatCard title="Total Inventory" value="24,562" trend="+12.5%" isPositive icon={IconBox} />
        <StatCard title="Pending Orders" value="1,245" trend="-2.4%" isPositive={false} icon={IconShoppingCart} />
        <StatCard title="Delivery Success" value="98.2%" trend="+0.8%" isPositive icon={IconTruckDelivery} />
      </section>

      <section className="charts-row" aria-label="Operations charts">
        <div className="chart-card main-chart">
          <div className="chart-header">
            <div>
              <span className="card-kicker">Movement</span>
              <h2>Inventory Flow</h2>
            </div>
            <span className="chart-period">This Week</span>
          </div>
          <div className="chart-placeholder" aria-busy={isLoading}>
            <DataState loading={isLoading} hasData={barData.length > 0} onAction={() => undefined}>
              <BarChart data={barData} xAxisKey="name" dataKey="value" height={220} />
            </DataState>
          </div>
        </div>
        <div className="chart-card pie-chart">
          <div className="chart-header">
            <div>
              <span className="card-kicker">Capacity</span>
              <h2>Storage Usage</h2>
            </div>
            <IconDots size={20} aria-hidden="true" className="chart-menu-icon" />
          </div>
          <div className="chart-placeholder pie-placeholder" aria-busy={isLoading}>
            <DataState loading={isLoading} hasData={pieData.length > 0} onAction={() => undefined}>
              <PieChart data={pieData} height={200} />
            </DataState>
          </div>
        </div>
      </section>

      <section className="table-row" aria-labelledby="deliveries-title">
        <div className="table-card">
          <div className="chart-header">
            <div>
              <h2 id="deliveries-title">Recent Deliveries</h2>
            </div>
          </div>
          <div className="table-placeholder" aria-busy={isLoading}>
            <DataState loading={isLoading} hasData={true}>
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
            </DataState>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPlaceholder;
