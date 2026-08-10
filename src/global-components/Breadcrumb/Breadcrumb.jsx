import { IconChevronRight, IconHome, IconLayoutDashboard } from '@tabler/icons-react';
import './Breadcrumb.css';

const Breadcrumb = ({ items = [] }) => (
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
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumb;
