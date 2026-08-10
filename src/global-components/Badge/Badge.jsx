import './Badge.css';

const Badge = ({ children, variant = 'info', className = '' }) => {
  const finalClassName = `badge badge-${variant} ${className}`.trim();

  return (
    <span className={finalClassName}>
      {children}
    </span>
  );
};

export default Badge;
