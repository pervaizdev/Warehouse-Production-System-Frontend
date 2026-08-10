import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { IconBell, IconChevronDown, IconMenu2, IconChecks, IconHome, IconCoin, IconClock } from '@tabler/icons-react';
import Sidebar from '../Sidebar/Sidebar';
import Breadcrumb from '../../global-components/Breadcrumb/Breadcrumb';
import Modal from '../../global-components/Modal/Modal';
import Toast from '../../global-components/Toast/Toast';
import Dropdown from '../../global-components/Dropdown/Dropdown';
import './Layout.css';

const Layout = ({ user, onLogout }) => {
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [notificationsRead, setNotificationsRead] = useState(false);
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

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className="dribbble-layout">
      <Sidebar onLogout={onLogout} isOpen={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      {sidebarOpen && <button type="button" className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <div className="dribbble-main-wrapper">
        <header className="dribbble-top-header">
          <div className="header-left">
            <button type="button" className="mobile-menu-button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}>
              <IconMenu2 size={22} />
            </button>
            <div>
              <Breadcrumb items={[{ label: pageTitle, current: true }]} />
            </div>
          </div>

          <div className="header-right">
            <Dropdown trigger={<button type="button" className="icon-btn" aria-label="Show notifications">
              <IconBell size={19} />
              {!notificationsRead && <span className="notification-dot" aria-label="3 unread notifications"></span>}
            </button>}>
              <div className="notification-panel">
                <div className="notification-panel-header">
                  <h2>Notifications</h2>
                  <button type="button" className="mark-read-button" onClick={() => setNotificationsRead(true)}>
                    <IconChecks size={16} /> Mark all as read
                  </button>
                </div>
                <div className="notification-day">Today</div>
                <div className="notification-list">
                  <article className={`notification-item ${!notificationsRead ? 'notification-unread' : ''}`}>
                    <span className="notification-icon"><IconHome size={17} /></span>
                    <div className="notification-copy"><div><strong>Maintenance request update</strong><time>5h ago</time></div><p>The maintenance request for <b>John Doe</b> in <b>Apartment 301</b> has been <em>Completed</em>.</p></div>
                  </article>
                  <article className="notification-item notification-highlight">
                    <span className="notification-icon"><IconCoin size={17} /></span>
                    <div className="notification-copy"><div><strong>Rent Payment Confirmation</strong><time>7h ago</time></div><p>We have received the rent payment of <b>$1,200</b> for <b>Jane Smith</b>. Payment processed <em>successfully</em>.</p></div>
                  </article>
                  <article className="notification-item">
                    <span className="notification-icon"><IconClock size={17} /></span>
                    <div className="notification-copy"><div><strong>Lease Renewal Reminder</strong><time>7h ago</time></div><p>The lease for <b>Esther Howard</b> is set to <span className="notification-danger">expire soon</span>. Please take appropriate action.</p></div>
                  </article>
                </div>
              </div>
            </Dropdown>
            <Dropdown trigger={<button type="button" className="header-profile-block" aria-label="Open account menu">
              <span className="profile-avatar" aria-hidden="true">{initials}</span>
              <div className="profile-info">
                <span className="profile-name">{user.email}</span>
                <span className="profile-role">{user.role}</span>
              </div>
              <IconChevronDown size={16} className="profile-chevron" aria-hidden="true" />
            </button>}>
              <button type="button" className="profile-menu-item" onClick={() => setShowLogoutModal(true)}>Sign out</button>
            </Dropdown>
          </div>
        </header>
        <main className="dribbble-content">
          <Outlet />
        </main>
      </div>
      <Modal
        open={showLogoutModal}
        title="Sign out of WPS?"
        confirmLabel="Sign out"
        danger
        onClose={() => setShowLogoutModal(false)}
        onConfirm={onLogout}
      >
        Your current session will be ended and you will return to the sign-in screen.
      </Modal>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default Layout;
