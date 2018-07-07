import React from 'react';

import './header.css';

export default function Layout() {
  return (
    <header className="Header">
      <nav
        className="navbar has-shadow is-spaced"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="column" />
        <div className="column">
          <h1 className="Header__title title">Guess the game!</h1>
        </div>
        <div className="column" />
      </nav>
    </header>
  );
}
