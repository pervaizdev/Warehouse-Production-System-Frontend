import { IconCheck, IconInfoCircle, IconX } from '@tabler/icons-react';
import './Toast.css';

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;
  const Icon = toast.type === 'success' ? IconCheck : IconInfoCircle;
  return (
    <div className={`toast toast-${toast.type || 'info'}`} role="status" aria-live="polite">
      <Icon size={18} aria-hidden="true" />
      <span>{toast.message}</span>
      <button type="button" aria-label="Dismiss notification" onClick={onClose}><IconX size={16} /></button>
    </div>
  );
};

export default Toast;
