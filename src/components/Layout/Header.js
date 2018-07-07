import React from 'react';
import { Link } from 'react-router-dom';

import './header.css';

export default function Layout() {
  return (
    <header className="Header">
      <nav className="navbar has-shadow is-spaced">
        <div className="column" />
        <div className="column">
          <Link to="/">
            <h1 className="Header__title title">Guess the game!</h1>
          </Link>
        </div>
        <div className="Header__right column">
          <Link to="/login" className="button is-primary">
            Login
          </Link>
          <Link to="/register" className="button is-primary">
            Register
          </Link>
        </div>
      </nav>
    </header>
  );
}
