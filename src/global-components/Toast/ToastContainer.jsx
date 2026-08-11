import { useState, useEffect, useRef } from 'react';
import { IconCheck, IconAlertTriangle, IconInfoCircle, IconX, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import './Toast.css';

const ToastItem = ({ toast, removeToast }) => {
  const { id, title, message, type = 'info', duration = 5000, isExpandable = false } = toast;
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef(Date.now());
  const remainingTimeRef = useRef(duration);
  const timerRef = useRef(null);

  useEffect(() => {
    if (duration <= 0) return;

    if (!isPaused) {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const newRemaining = remainingTimeRef.current - elapsed;
        
        if (newRemaining <= 0) {
          clearInterval(timerRef.current);
          removeToast(id);
        } else {
          setProgress((newRemaining / duration) * 100);
        }
      }, 10);
    } else {
      clearInterval(timerRef.current);
      remainingTimeRef.current -= (Date.now() - startTimeRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isPaused, duration, id, removeToast]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const getIcon = () => {
    switch (type) {
      case 'success': return <IconCheck size={20} className="toast-icon success" />;
      case 'danger':
      case 'error': return <IconAlertTriangle size={20} className="toast-icon danger" />;
      case 'warning': return <IconAlertTriangle size={20} className="toast-icon warning" />;
      default: return <IconInfoCircle size={20} className="toast-icon info" />;
    }
  };

  const showExpand = isExpandable || message?.length > 60;

  return (
    <div 
      className={`toast-item ${type}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="toast-content-wrapper">
        <div className="toast-header">
          <div className="toast-icon-container">
            {getIcon()}
          </div>
          <div className="toast-text">
            <h4 className="toast-title">{title}</h4>
            {(!showExpand || isExpanded) && message && (
              <p className="toast-message">{message}</p>
            )}
            {showExpand && !isExpanded && message && (
              <p className="toast-message-truncated">{message}</p>
            )}
          </div>
          <div className="toast-actions">
            {showExpand && (
              <button 
                className="toast-action-btn" 
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label={isExpanded ? "Collapse details" : "Expand details"}
              >
                {isExpanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
              </button>
            )}
            <button 
              className="toast-action-btn close-btn" 
              onClick={() => removeToast(id)}
              aria-label="Close"
            >
              <IconX size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {duration > 0 && (
        <div className="toast-progress-bar-container">
          <div 
            className={`toast-progress-bar ${type}`} 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
