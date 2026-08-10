import './Spinner.css';

const Spinner = ({ size = 'md', className = '' }) => {
  const finalClass = size === 'sm' ? `spinner-sm ${className}`.trim() : `spinner ${className}`.trim();

  return (
    <div className={finalClass} aria-label="Loading" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
