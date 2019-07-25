import React from 'react';

import './SmallContainer.css';

export default function SmallContainer(props) {
  const { title, subtitle, children } = props;
  return (
    <div className="SmallContainer">
      <h1 className="SmallContainer_title">{title}</h1>
      {subtitle && <h2 className="SmallContainer_subtitle">{subtitle}</h2>}
      <div>{children}</div>
    </div>
  );
}
