import React from 'react';
import './Loading.css';

const Loading = ({ text = 'Loading...', size }) => {
  const spinnerStyle = size ? { width: `${size}px`, height: `${size}px` } : {};

  return (
    <div className="loading-wrapper" role="status">
      <div className="loading-spinner" style={spinnerStyle}></div>
      {text && <span>{text}</span>}
    </div>
  );
};

export default Loading;
