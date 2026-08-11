<<<<<<< Updated upstream
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { IconBell, IconChevronDown, IconMenu2, IconChecks, IconHome, IconCoin, IconClock } from '@tabler/icons-react';
import Sidebar from '../Sidebar/Sidebar';
import Breadcrumb from '../../global-components/Breadcrumb/Breadcrumb';
import Modal from '../../global-components/Modal/Modal';
import Toast from '../../global-components/Toast/Toast';
import Dropdown from '../../global-components/Dropdown/Dropdown';
import './Layout.css';
=======
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { IconBell, IconChevronDown, IconCheck, IconMenu2, IconSettings, IconLogout } from "@tabler/icons-react";
import Sidebar from "../Sidebar/Sidebar";
import Breadcrumb from "../../global-components/Breadcrumb/Breadcrumb";
import "./Layout.css";
>>>>>>> Stashed changes

const Layout = ({ user, onLogout }) => {
  const { pathname } = useLocation();
<<<<<<< Updated upstream
=======
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
>>>>>>> Stashed changes
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [notificationsRead, setNotificationsRead] = useState(false);
  const moduleTitles = {
<<<<<<< Updated upstream
    '/dashboard': 'Dashboard',
    '/analytics': 'Analytics',
    '/inventory': 'Inventory',
    '/orders': 'Orders',
    '/customers': 'Customers',
    '/delivery': 'Delivery',
    '/storage': 'Storage',
    '/settings': 'Settings',
=======
    "/dashboard": "Dashboard",
    "/analytics": "Analytics",
    "/inventory": "Inventory",
    "/orders": "Orders",
    "/customers": "Customers",
    "/delivery": "Delivery",
    "/storage": "Storage",
    "/settings": "Settings",
    "/machine-efficiency": "Machine Efficiency",
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
              {pathname !== "/machine-efficiency" && (
                <h1 className="header-title">{pageTitle}</h1>
              )}
>>>>>>> Stashed changes
              <Breadcrumb items={[{ label: pageTitle, current: true }]} />
            </div>
          </div>

          <div className="header-right">
<<<<<<< Updated upstream
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
=======

            <div className="header-action-wrap">
              <button
                type="button"
                className="icon-btn"
                aria-label="Show notifications"
                aria-expanded={showNotifications}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <IconBell size={19} />
                <span
                  className="notification-dot"
                  aria-label="3 unread notifications"
                ></span>
              </button>
              {showNotifications && (
                <div className="header-popover notification-popover" role="status">
                  <div className="popover-heading"><strong>Notifications</strong><button type="button"><IconCheck size={14} /> Mark read</button></div>
                  <div className="notification-item"><span className="notification-dot-inline" /><div><strong>Production sync completed</strong><small>Just now · Machine Efficiency</small></div></div>
                  <div className="notification-item"><span className="notification-dot-inline notification-dot-inline--warning" /><div><strong>Review low-utilization machines</strong><small>18 minutes ago · Operations</small></div></div>
                </div>
              )}
            </div>
            <div className="header-action-wrap">
              <button
                type="button"
                className="header-profile-block"
                aria-label="Open account menu"
                aria-expanded={showProfileMenu}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <span className="profile-avatar" aria-hidden="true">
                  {initials}
                </span>
                <div className="profile-info">
                  <span className="profile-name">{fullName}</span>
                  <span className="profile-role">{roleName}</span>
                </div>
                <IconChevronDown size={16} className="profile-chevron" />
              </button>
              {showProfileMenu && (
                <div className="header-popover profile-popover">
                  <div className="profile-popover-summary"><strong>{fullName}</strong><span>{roleName}</span></div>
                  <button type="button"><IconSettings size={16} /> Account settings</button>
                  <button type="button" className="profile-logout" onClick={logout}><IconLogout size={16} /> Log out</button>
                </div>
              )}
            </div>
>>>>>>> Stashed changes
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
