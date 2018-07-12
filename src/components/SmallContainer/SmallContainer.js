import React from 'react';

import './smallContainer.css';

export default function SmallContainer(props) {
  const { children } = props;
  return <div className="SmallContainer">{children}</div>;
}
