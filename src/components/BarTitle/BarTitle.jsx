import React from 'react';
import './BarTitle.css';

const BarTitle = ({
  children,
  className = '',
  onlyOnSmartphones = false,
}) => (
  <div
    className={`BarTitle ${className} ${
      onlyOnSmartphones ? '-onlyOnSmartphones' : ''
    }`}
  >
    <div className="BarTitle_text">{children}</div>
  </div>
);
export default BarTitle;
