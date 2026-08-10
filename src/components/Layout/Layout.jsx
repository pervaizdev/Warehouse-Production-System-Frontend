import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import { IconBell, IconMessageCircle, IconChevronDown } from '@tabler/icons-react';
import './Layout.css';

const Layout = () => {
  return (
    <div className="dribbble-layout">
      <Sidebar />
      <div className="dribbble-main-wrapper">
        <header className="dribbble-top-header">
          <div className="header-left">
            <h1 className="header-title">Dashboard</h1>
            <div className="date-selector">
              <span className="date-text">Oct 14, 2022 - Nov 14, 2022</span>
              <IconChevronDown size={16} />
            </div>
          </div>

          <div className="header-right">


            <div className="header-profile-block">
              <img
                src="https://i.pravatar.cc/150?img=11"
                alt="Profile"
                className="profile-img"
              />
              <div className="profile-info">
                <span className="profile-name">Robert Fox</span>
                <span className="profile-role">Admin</span>
              </div>
              <IconChevronDown size={16} className="profile-chevron" />
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
