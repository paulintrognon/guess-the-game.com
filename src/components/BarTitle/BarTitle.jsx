import React from 'react';
import './BarTitle.css';

const BarTitle = ({ children, className, hideOnSmall = false }) => (
  <div className={`BarTitle ${className} ${hideOnSmall ? '-hideOnSmall' : ''}`}>
    <div className="BarTitle_text">{children}</div>
  </div>
);
export default BarTitle;
