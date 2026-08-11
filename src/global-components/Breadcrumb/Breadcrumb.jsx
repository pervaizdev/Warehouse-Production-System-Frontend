import { IconChevronRight, IconHome, IconLayoutDashboard } from '@tabler/icons-react';
import './Breadcrumb.css';

const Breadcrumb = ({ items = [] }) => (
<<<<<<< Updated upstream
  <nav className="breadcrumb" aria-label="Breadcrumb">
    <ol className="breadcrumb-list">
      <li className="breadcrumb-item breadcrumb-home">
        <IconHome size={16} aria-hidden="true" />
        <span>Workspace</span>
      </li>
      {items.map((item) => (
        <li className="breadcrumb-item" key={item.label}>
          <IconChevronRight size={14} aria-hidden="true" />
          <span className={item.current ? 'breadcrumb-current' : ''} aria-current={item.current ? 'page' : undefined}>
            {item.icon || <IconLayoutDashboard size={16} aria-hidden="true" />}
            {item.label}
          </span>
=======
  <nav className="global-breadcrumb" aria-label="Breadcrumb">
    <ol className="global-breadcrumb-list">
      <li className="global-breadcrumb-item global-breadcrumb-home">
        <span className="global-breadcrumb-home-icon"><IconHome size={13} aria-hidden="true" /></span>
        <span>Workspace</span>
      </li>
      {items.map((item) => (
        <li className="global-breadcrumb-item" key={item.label}>
          <IconChevronRight className="global-breadcrumb-separator" size={14} aria-hidden="true" />
          <span className={item.current ? 'global-breadcrumb-current' : ''} aria-current={item.current ? 'page' : undefined}>{item.label}</span>
>>>>>>> Stashed changes
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumb;
