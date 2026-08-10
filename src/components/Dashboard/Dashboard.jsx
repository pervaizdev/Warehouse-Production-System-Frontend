import { useState } from 'react';
import Table from '../../global-components/Table/Table';
import Badge from '../../global-components/Badge/Badge';
import Input from '../../global-components/Input/Input';
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
    { key: 'status', header: 'Status', render: (row) => {
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
          <span className="header-title">Management Console</span>
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
          <div className="stat-card">
            <span className="stat-label">Active AGVs (Forklifts)</span>
            <div className="stat-value">6 / 6</div>
            <div className="stat-sub">All automated guided vehicles operational</div>
          </div>
          <div className="stat-card">
            <span className="stat-label">Warehouse capacity</span>
            <div className="stat-value">78.4%</div>
            <div className="stat-sub">12,450 cubic meters remaining</div>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pending Shipments</span>
            <div className="stat-value">14</div>
            <div className="stat-sub">Ready in outbound bay C</div>
          </div>
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
