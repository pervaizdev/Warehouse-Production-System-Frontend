import './BrandLogo.css';

const BrandLogo = ({
  size = 'md',
  variant = 'default',
  showName = true,
  className = '',
}) => (
  <div
    className={`brand-logo brand-logo--${size} brand-logo--${variant} ${className}`.trim()}
    role="img"
    aria-label="WPS Warehouse Production System"
  >
    <svg className="brand-logo-mark" viewBox="0 0 40 40" aria-hidden="true">
      <rect className="brand-logo-mark-surface" x="1" y="1" width="38" height="38" rx="11" />
      <path className="brand-logo-mark-line" d="M9 29V17l11-7 11 7v12M14 29V20h12v9M9 29h22M14 16h12" />
      <path className="brand-logo-mark-line brand-logo-mark-detail" d="M20 20v9" />
    </svg>
    {showName && <span className="brand-logo-name">WPS</span>}
  </div>
);

export default BrandLogo;
