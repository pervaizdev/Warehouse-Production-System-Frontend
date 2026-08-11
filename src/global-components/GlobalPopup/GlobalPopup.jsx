import { useEffect } from 'react';
import { IconX } from '@tabler/icons-react';
import './GlobalPopup.css';

const GlobalPopup = ({
  children,
  onClose,
  title = 'Details',
  className = '',
  showClose = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="global-popup-overlay" onMouseDown={onClose}>
      <section
        className={`global-popup ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {showClose && (
          <button
            type="button"
            className="global-popup-close"
            onClick={onClose}
            aria-label={`Close ${title}`}
          >
            <IconX size={20} stroke={2} />
          </button>
        )}
        {children}
      </section>
    </div>
  );
};

export default GlobalPopup;
