import { IconChevronRight, IconHome } from '@tabler/icons-react';
import './Breadcrumb.css';

const Breadcrumb = ({ items = [] }) => (
  <nav className="breadcrumb" aria-label="Breadcrumb">
    <ol className="breadcrumb-list">
      <li className="breadcrumb-item">
        <IconHome size={15} aria-hidden="true" />
        <span>Workspace</span>
      </li>
      {items.map((item) => (
        <li className="breadcrumb-item" key={item.label}>
          <IconChevronRight size={14} aria-hidden="true" />
          <span aria-current={item.current ? 'page' : undefined}>{item.label}</span>
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumb;
