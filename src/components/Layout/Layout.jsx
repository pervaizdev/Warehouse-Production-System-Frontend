import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { IconBell, IconChevronDown, IconMenu2 } from '@tabler/icons-react';
import Sidebar from '../Sidebar/Sidebar';
import Breadcrumb from '../../global-components/Breadcrumb/Breadcrumb';
import './Layout.css';

const Layout = ({ user, onLogout }) => {
  const { pathname } = useLocation();
  const [selectedRange, setSelectedRange] = useState('Oct 14, 2022 - Nov 14, 2022');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const moduleTitles = {
    '/dashboard': 'Dashboard',
    '/analytics': 'Analytics',
    '/inventory': 'Inventory',
    '/orders': 'Orders',
    '/customers': 'Customers',
    '/delivery': 'Delivery',
    '/storage': 'Storage',
    '/settings': 'Settings',
  };

  const pageTitle = moduleTitles[pathname] || 'Dashboard';
  const initials = user.email.slice(0, 2).toUpperCase();

  return (
    <div className="dribbble-layout">
      <Sidebar onLogout={onLogout} isOpen={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      <div className="dribbble-main-wrapper">
        <header className="dribbble-top-header">
          <div className="header-left">
            <button type="button" className="mobile-menu-button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}>
              <IconMenu2 size={22} />
            </button>
            <div>
              <h1 className="header-title">{pageTitle}</h1>
              <Breadcrumb items={[{ label: pageTitle, current: true }]} />
            </div>
          </div>

          <div className="header-right">
            <label className="date-selector" htmlFor="date-range">
              <select id="date-range" value={selectedRange} onChange={(event) => setSelectedRange(event.target.value)}>
                <option>Oct 14, 2022 - Nov 14, 2022</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
              <IconChevronDown size={16} aria-hidden="true" />
            </label>
            <div className="header-action-wrap">
              <button type="button" className="icon-btn" aria-label="Show notifications" aria-expanded={showNotifications} onClick={() => setShowNotifications(!showNotifications)}>
                <IconBell size={19} />
                <span className="notification-dot" aria-label="3 unread notifications"></span>
              </button>
              {showNotifications && <div className="header-popover notification-popover">You have 3 unread notifications.</div>}
            </div>
            <div className="header-action-wrap">
              <button type="button" className="header-profile-block" aria-label="Open account menu" aria-expanded={showProfileMenu} onClick={() => setShowProfileMenu(!showProfileMenu)}>
                <span className="profile-avatar" aria-hidden="true">{initials}</span>
                <div className="profile-info">
                  <span className="profile-name">{user.email}</span>
                  <span className="profile-role">{user.role}</span>
                </div>
                <IconChevronDown size={16} className="profile-chevron" aria-hidden="true" />
              </button>
              {showProfileMenu && <div className="header-popover profile-popover"><button type="button" onClick={onLogout}>Sign out</button></div>}
            </div>
          </div>
        </header>
        <main className="dribbble-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
