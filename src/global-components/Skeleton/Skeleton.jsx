import React from 'react';
import './Skeleton.css';

const Skeleton = ({ className = '', type = 'text', width, height }) => {
  const sizeClasses = [
    width === '100%' ? 'skeleton-width-full' : '',
    height === '100%' ? 'skeleton-height-full' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={`skeleton ${type} ${sizeClasses} ${className}`.trim()}>
      <div className="gms-skeleton-shimmer"></div>
    </div>
  );
};

export default Skeleton;
