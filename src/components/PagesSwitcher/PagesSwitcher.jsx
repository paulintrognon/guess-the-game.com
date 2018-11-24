import React from 'react';
import { Link } from 'react-router-dom';
import './PagesSwitcher.css';

export default ({ links }) => (
  <div className="PagesSwitcher">
    {links.map(link => (
      <Link
        key={link.label}
        className={`PagesSwitcher_link ${
          isPathActive(link.to) ? '-active' : ''
        }`}
        to={link.to}
      >
        {link.label}
      </Link>
    ))}
  </div>
);

function isPathActive(path) {
  return window.location.pathname.indexOf(path) === 0;
}
