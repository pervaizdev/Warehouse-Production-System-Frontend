import React from 'react';
import './Skeleton.css';

const Skeleton = ({ className = '', type = 'text', width, height }) => {
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div className={`skeleton ${type} ${className}`} style={style}>
      <div className="gms-skeleton-shimmer"></div>
    </div>
  );
};

export default Skeleton;
