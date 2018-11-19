import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPagesSwitcher.css';

const links = [
  { label: 'Login', to: '/login' },
  { label: 'Register', to: '/register' },
];

export default () => (
  <div className="LoginPagesSwitcher">
    {links.map(link => (
      <Link
        key={link.label}
        className={`LoginPagesSwitcher_link ${
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
