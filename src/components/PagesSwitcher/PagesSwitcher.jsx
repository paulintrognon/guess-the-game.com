import React from 'react';
import { Link } from 'react-router-dom';
import './PagesSwitcher.css';

export default ({ links, className }) => (
  <div className={`PagesSwitcher ${className}`}>
    {links.map(link => (
      <Link
        key={link.label}
        className={`PagesSwitcher_link ${
          isPathActive(link.to) ? '-active' : ''
        }`}
        to={link.to}
        onClick={link.onClick}
      >
        {link.label}
      </Link>
    ))}
  </div>
);

function isPathActive(path) {
  return window.location.pathname === path;
}
