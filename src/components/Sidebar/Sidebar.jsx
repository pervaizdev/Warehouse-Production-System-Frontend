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
  IconLogout,
  IconCpu,
  IconTrendingUp
} from '@tabler/icons-react';
import './Sidebar.css';

const Sidebar = ({ onLogout, isOpen = false, onNavigate }) => {
  const topMenuItems = [
    { title: 'Dashboard', icon: <IconLayoutDashboard stroke={1.5} />, path: '/dashboard' },
    { title: 'Analytics', icon: <IconChartPie stroke={1.5} />, path: '/analytics' },
    { title: 'Production Trend', icon: <IconTrendingUp stroke={1.5} />, path: '/production-trend' },
    { title: 'Machine Efficiency', icon: <IconCpu stroke={1.5} />, path: '/machine-efficiency' },
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
          {/* Placeholder for the dark circle logo with orange accent */}
          <div className="logo-circle">
            <div className="logo-accent"></div>
          </div>
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
