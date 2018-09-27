import React from 'react';

import './SmallContainer.css';

export default function SmallContainer(props) {
  const { title, children } = props;
  return (
    <div className="SmallContainer">
      <h2 className="SmallContainer_title">{title}</h2>
      <div>{children}</div>
    </div>
  );
}
