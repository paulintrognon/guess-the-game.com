import React from 'react';

import './header.css';

export default function Layout() {
  return (
    <header className="Header">
      <nav className="navbar has-shadow is-spaced">
        <div className="column" />
        <div className="column">
          <h1 className="Header__title title">Guess the game!</h1>
        </div>
        <div className="Header__right column">
          <a className="button is-primary">Login</a>
          <a className="button is-primary">Register</a>
        </div>
      </nav>
    </header>
  );
}
