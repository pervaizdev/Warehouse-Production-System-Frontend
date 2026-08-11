import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  IconLayoutDashboard, 
  IconChartPie, 
  IconBox, 
  IconClipboardList, 
  IconUsers, 
  IconTruckDelivery, 
  IconBuildingWarehouse,
  IconSettings,
  IconLogout
} from '@tabler/icons-react';
import './Sidebar.css';

const WpsLogo = () => (
  <svg viewBox="0 0 100 100" className="app-logo-image" style={{ width: '40px', height: '40px' }} xmlns="http://www.w3.org/2000/svg">
    <path d="M 5 40 L 50 25 L 95 40 L 95 45 L 50 30 L 5 45 Z" fill="var(--text-primary)" />
    <rect x="83" y="48" width="8" height="42" fill="var(--text-primary)" />
    <rect x="20" y="48" width="12" height="42" fill="var(--primary)" />
    <rect x="35" y="60" width="22" height="30" fill="var(--primary)" />
    <rect x="35" y="45" width="14" height="12" fill="var(--primary)" />
    <rect x="60" y="70" width="12" height="20" fill="var(--primary)" />
    <rect x="60" y="55" width="10" height="12" fill="var(--primary)" />
  </svg>
);

const Sidebar = ({ onLogout, isOpen = false, onNavigate }) => {
  const topMenuItems = [
    { title: 'Dashboard', icon: <IconLayoutDashboard stroke={1.5} />, path: '/dashboard' },
    { title: 'Analytics', icon: <IconChartPie stroke={1.5} />, path: '/analytics' },
    { title: 'Inventory', icon: <IconBox stroke={1.5} />, path: '/inventory' },
    { title: 'Orders', icon: <IconClipboardList stroke={1.5} />, path: '/orders' },
    { title: 'Customers', icon: <IconUsers stroke={1.5} />, path: '/customers' },
    { title: 'Delivery', icon: <IconTruckDelivery stroke={1.5} />, path: '/delivery' },
    { title: 'Storage', icon: <IconBuildingWarehouse stroke={1.5} />, path: '/storage' },
  ];

  const bottomMenuItems = [
    { title: 'Settings', icon: <IconSettings stroke={1.5} />, path: '/settings', isAction: false },
    { title: 'Logout', icon: <IconLogout stroke={1.5} />, path: '/logout', isAction: true },
  ];

  return (
    <aside className={`dribbble-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-logo-container">
        <div className="sidebar-logo">
          <WpsLogo />
        </div>
      </div>
      
      <nav className="sidebar-nav top-nav">
        {topMenuItems.map((item, index) => (
          <NavLink 
            key={index}
            to={item.path} 
            className={({ isActive }) => `nav-icon-link ${isActive ? 'active' : ''}`}
            title={item.title}
            aria-label={item.title}
            onClick={onNavigate}
          >
            {item.icon}
          </NavLink>
        ))}
      </nav>

      <nav className="sidebar-nav bottom-nav">
        {bottomMenuItems.map((item, index) => (
          item.isAction ? (
            <button key={index} type="button" className="nav-icon-link action-danger sidebar-logout" onClick={onLogout} title={item.title} aria-label={item.title}>
              {item.icon}
            </button>
          ) : (
            <NavLink key={index} to={item.path} className={({ isActive }) => `nav-icon-link ${isActive ? 'active' : ''}`} title={item.title} aria-label={item.title} onClick={onNavigate}>
              {item.icon}
            </NavLink>
          )
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
