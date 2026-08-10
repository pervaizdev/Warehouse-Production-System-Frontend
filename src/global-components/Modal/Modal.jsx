import { useEffect } from 'react';
import { IconX } from '@tabler/icons-react';
import './Modal.css';

const Modal = ({ open, title, children, confirmLabel = 'Confirm', onConfirm, onClose, danger = false }) => {
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button type="button" className="modal-close" aria-label="Close dialog" onClick={onClose}><IconX size={19} /></button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-actions">
          <button type="button" className="modal-button modal-button-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className={`modal-button ${danger ? 'modal-button-danger' : 'modal-button-primary'}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </section>
    </div>
  );
};

export default Modal;
