import React from 'react';
import { IconInfoCircle } from '@tabler/icons-react';
import './EmptyState.css';

const EmptyState = ({ 
  title = "No Data Found", 
  message = "Try adjusting your filters or search query.", 
  icon: Icon = IconInfoCircle,
  action 
}) => {
  return (
    <div className="empty-state-wrapper">
      <div className="empty-state-icon">
        <Icon size={48} stroke={1.5} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {action && (
        <div className="empty-state-action">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
