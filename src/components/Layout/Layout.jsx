import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { IconBell, IconChevronDown, IconMenu2 } from "@tabler/icons-react";
import Sidebar from "../Sidebar/Sidebar";
import Breadcrumb from "../../global-components/Breadcrumb/Breadcrumb";
import "./Layout.css";

const Layout = () => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [selectedRange, setSelectedRange] = useState(
    "Oct 14, 2022 - Nov 14, 2022",
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const moduleTitles = {
    "/dashboard": "Dashboard",
    "/analytics": "Analytics",
    "/production-trend": "Production Trend",
    "/machine-efficiency": "Machine Efficiency",
    "/inventory": "Inventory",
    "/orders": "Orders",
    "/customers": "Customers",
    "/delivery": "Delivery",
    "/storage": "Storage",
    "/settings": "Settings",
  };

  const pageTitle = moduleTitles[pathname] || "Dashboard";

  const firstName = user?.FirstName || "";
  const middleName = user?.MiddleName || "";
  const lastName = user?.LastName || "";

  const fullName = `${firstName} ${middleName}`.trim() || "Admin User";
  const roleName =
    user?.DesignationName || user?.RoleName || "Warehouse Manager";

  let initials = "AD";
  if (firstName) {
    initials = firstName.charAt(0).toUpperCase();
    if (lastName) {
      initials += lastName.charAt(0).toUpperCase();
    } else if (middleName) {
      initials += middleName.charAt(0).toUpperCase();
    }
  }

  return (
    <div className="dribbble-layout">
      <Sidebar
        onLogout={logout}
        isOpen={sidebarOpen}
        onNavigate={() => setSidebarOpen(false)}
      />
      <div className="dribbble-main-wrapper">
        <header className="dribbble-top-header">
          <div className="header-left">
            <button
              type="button"
              className="mobile-menu-button"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
            >
              <IconMenu2 size={22} />
            </button>
            <div>
              <Breadcrumb items={[{ label: pageTitle, current: true }]} />
            </div>
          </div>

          <div className="header-right">
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
                <div className="header-popover notification-popover">
                  You have 3 unread notifications.
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
              </button>
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
