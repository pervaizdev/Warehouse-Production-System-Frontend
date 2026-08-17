import { IconChevronRight, IconHome } from '@tabler/icons-react';
import './Breadcrumb.css';

const Breadcrumb = ({ items = [], homeLabel = 'Workspace', homeHref = '/dashboard' }) => {
  const renderLabel = (item) => {
    const label = <span className="breadcrumb-label">{item.label}</span>;

    if (!item.href && !item.onClick) {
      return label;
    }

    if (item.href) {
      return (
        <a className="breadcrumb-link" href={item.href}>
          {label}
        </a>
      );
    }

    return (
      <button className="breadcrumb-link breadcrumb-button" type="button" onClick={item.onClick}>
        {label}
      </button>
    );
  };

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item breadcrumb-home">
          <a className="breadcrumb-home-link" href={homeHref} aria-label={`Go to ${homeLabel}`}>
            <span className="breadcrumb-home-icon">
              <IconHome size={15} stroke={2.2} aria-hidden="true" />
            </span>
            <span className="breadcrumb-label">{homeLabel}</span>
          </a>
        </li>
        {items.map((item, index) => {
          const isCurrent = item.current ?? index === items.length - 1;

          return (
            <li
              className={`breadcrumb-item${isCurrent ? ' breadcrumb-current' : ''}`}
              key={`${item.label}-${index}`}
              aria-current={isCurrent ? 'page' : undefined}
            >
              <IconChevronRight className="breadcrumb-separator" size={16} stroke={1.8} aria-hidden="true" />
              {renderLabel(item)}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
