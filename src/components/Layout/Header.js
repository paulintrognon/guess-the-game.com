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
      <nav className="navbar is-spaced">
        <div className="container">
          <div className="navbar-brand">
            <Link class="navbar-item" to="/">
              <h1 className="title">Guess the game!</h1>
            </Link>
          </div>
          <div className="navbar-menu is-active">
            <div className="navbar-start">
              <Link to="/play" className="navbar-item">
                <span className="icon has-text-primary">
                  <i className="fas fa-play" />
                </span>
                <span>Play</span>
              </Link>
              {user.username && (
                <Link to="/add-screenshot" className="navbar-item">
                  <span className="icon has-text-grey">
                    <i className="fas fa-plus" />
                  </span>
                  <span>Add Screenshot</span>
                </Link>
              )}
            </div>

            {user.username && renderLogoutButtons(user.username)}
            {!user.username && renderLoginButtons()}
          </div>
        </div>
      </nav>
    </header>
  );
}
export default connect(mapStoreToProps)(Header);

function renderLogoutButtons(username) {
  return (
    <div className="navbar-end">
      <Link to={`/user/${username}`} className="navbar-item">
        {username}
      </Link>
      <Link to="/logout" className="navbar-item">
        <span className="icon has-text-grey">
          <i className="fas fa-power-off" />
        </span>
      </Link>
    </div>
  );
}

function renderLoginButtons() {
  return (
    <div className="navbar-end">
      <Link to="/login" className="button is-primary">
        Login
      </Link>
      <Link to="/register" className="button is-primary">
        Register
      </Link>
    </div>
  );
}
