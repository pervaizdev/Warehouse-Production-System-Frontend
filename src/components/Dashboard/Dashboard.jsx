import { useState } from 'react';
import Table from '../../global-components/Table/Table';
import Badge from '../../global-components/Badge/Badge';
import Input from '../../global-components/Input/Input';
import DashboardStatCard from '../../global-components/DashboardStatCard/DashboardStatCard';
import { IconBox, IconShoppingCart, IconBuildingWarehouse, IconTruck } from '@tabler/icons-react';
import './Dashboard.css';


const Dashboard = ({ user, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data representing warehouse production inventory
  const [inventory] = useState([
    { id: 'SKU-7821', name: 'Industrial Hydraulic Press', qty: 12, bin: 'A-12', status: 'In Stock' },
    { id: 'SKU-0943', name: 'Lithium Battery Pack 48V', qty: 45, bin: 'B-04', status: 'Low Stock' },
    { id: 'SKU-1102', name: 'Micro-Controller Unit (MCU)', qty: 350, bin: 'C-01', status: 'In Stock' },
    { id: 'SKU-5491', name: 'Steel Support Brackets', qty: 0, bin: 'D-08', status: 'Out of Stock' },
    { id: 'SKU-3329', name: 'Pneumatic Actuator Valve', qty: 89, bin: 'B-11', status: 'In Stock' },
    { id: 'SKU-8840', name: 'Fiber-Optic Sensor Wire', qty: 15, bin: 'E-03', status: 'Low Stock' },
  ]);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.bin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'id', header: 'SKU Code', render: (row) => <span className="sku-code">{row.id}</span> },
    { key: 'name', header: 'Item Name', render: (row) => <span className="item-name">{row.name}</span> },
    { key: 'qty', header: 'Quantity', render: (row) => `${row.qty} units` },
    { key: 'bin', header: 'Bin Location', render: (row) => <span className="bin-badge">{row.bin}</span> },
    {
      key: 'status', header: 'Status', render: (row) => {
        let badgeVariant = 'info';
        if (row.status === 'In Stock') badgeVariant = 'success';
        if (row.status === 'Low Stock') badgeVariant = 'warning';
        if (row.status === 'Out of Stock') badgeVariant = 'danger';
        return <Badge variant={badgeVariant}>{row.status}</Badge>;
      }
    },
  ];

  return (
    <div className="dashboard-layout">
      {/* Top Navigation Bar */}
      <header className="dashboard-header">
        <div className="header-logo-section">
          <span className="header-logo">WPS</span>
          <span className="header-divider">|</span>
        </div>
        <div className="header-user-section">
          <div className="user-info">
            <span className="user-role">{user.role}</span>
            <span className="user-email">{user.email}</span>
          </div>
          <button onClick={onLogout} className="logout-btn">
            Logout Console
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="dashboard-content">
        {/* Welcome Section */}
        <section className="welcome-banner">
          <h2 className="welcome-title">Terminal Node Active</h2>
          <p className="welcome-desc">Real-time status overview of active production and logistics systems.</p>
        </section>

        {/* Stats Grid */}
        <section className="stats-grid">
          <DashboardStatCard 
            label="Total Inventory"
            value="24,562"
            icon={<IconBox size={20} />}
            trend={{ value: '+12.5%', direction: 'up', label: 'vs last period' }}
          />
          <DashboardStatCard 
            label="Pending Orders"
            value="1,245"
            icon={<IconShoppingCart size={20} />}
            trend={{ value: '-2.4%', direction: 'down', label: 'vs last period' }}
          />
          <DashboardStatCard 
            label="Storage Capacity"
            value="86%"
            icon={<IconBuildingWarehouse size={20} />}
            trend={{ value: '+4.1%', direction: 'up', label: 'vs last period' }}
          />
          <DashboardStatCard 
            label="Delivery Success"
            value="98.2%"
            icon={<IconTruck size={20} />}
            trend={{ value: '+0.8%', direction: 'up', label: 'vs last period' }}
          />
        </section>

        {/* Inventory Control Table */}
        <section className="inventory-section">
          <div className="inventory-header">
            <h3 className="inventory-title">Active Bin Inventory Log</h3>
            <div className="search-bar-container">
              <Input
                id="search"
                placeholder="Search SKU, item name, or bin location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <Table
              data={filteredInventory}
              columns={columns}
              showPagination={false}
              showActions={true}
              onActionClick={(action, row) => console.log('Action:', action, 'Row:', row)}
            />
          </div>
        </section>
      </main>

      <footer className="dashboard-footer">
        <p>WPS Logistics Tech Group Node Console. Connected to Node AP-EAST-02.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
