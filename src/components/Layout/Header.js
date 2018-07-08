import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import './header.css';

function mapStoreToProps(store) {
  return {
    user: store.user,
  };
}
function Header(props) {
  const { user } = props;

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
          {user.username && renderLogoutButtons(user.username)}
          {!user.username && renderLoginButtons()}
        </div>
      </nav>
    </header>
  );
}
export default connect(mapStoreToProps)(Header);

function renderLogoutButtons(username) {
  return (
    <div>
      <Link to={`/user/${username}`} className="button is-text">
        {username}
      </Link>
      <Link to="/logout" className="button is-primary">
        Logout
      </Link>
    </div>
  );
}

function renderLoginButtons() {
  return (
    <div>
      <Link to="/login" className="button is-primary">
        Login
      </Link>
      <Link to="/register" className="button is-primary">
        Register
      </Link>
    </div>
  );
}
