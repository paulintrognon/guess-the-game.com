import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './IconButton.css';

export default ({ type, icon, onClick, children, className, ...props }) => (
  <button
    type={type || 'button'}
    onClick={onClick}
    className={`IconButton ${className}`}
    {...props}
  >
    {children}
    <FontAwesomeIcon className="-onlyOnSmartphones" icon={icon} size="lg" />
    <FontAwesomeIcon className="-hideOnSmartphones" icon={icon} />
  </button>
);
