import React from 'react';
import './BarTitle.css';

const BarTitle = ({
  children,
  className = '',
  showOnlyOnSmartphones = false,
}) => (
  <div
    className={`BarTitle ${className} ${
      showOnlyOnSmartphones ? '-showOnlyOnSmartphones' : ''
    }`}
  >
    <div className="BarTitle_text">{children}</div>
  </div>
);
export default BarTitle;
