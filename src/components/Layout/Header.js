import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import loginActions from '../../actions/loginActions';
import screenshotActions from '../../actions/screenshotActions';
import layoutActions from '../../actions/layoutActions';

import './Header.css';

function mapStoreToProps(store) {
  return {
    user: store.user,
  };
}
class Header extends React.Component {
  logoutHandler = () => {
    this.props.dispatch(loginActions.logout());
  };

  playHandler = () => {
    this.props.dispatch(screenshotActions.getUnsolvedScreenshot());
  };

  accountButtonHandler = () => {
    this.props.dispatch(layoutActions.toggleMenuAction());
  };

  render() {
    const { user } = this.props;

    return (
      <header className="Header">
        <div className="Header_container">
          <div className="Header_logo">
            <Link to="/">Guess The Game!</Link>
          </div>
          <div className="Header_nav">
            <nav className="Header_nav_left">
              <button
                type="button"
                className={`Header_nav_link ${
                  isPathActive('/shot') ? '-active' : ''
                }`}
                onClick={this.playHandler}
              >
                Play
              </button>
              <Link
                to="/ranking"
                className={`Header_nav_link ${
                  isPathActive('/ranking') ? '-active' : ''
                }`}
              >
                Ranking
              </Link>
              {user.username && (
                <Link
                  to="/add-screenshot"
                  className={`Header_nav_link ${
                    isPathActive('/add-screenshot') ? '-active' : ''
                  }`}
                >
                  Add&nbsp;<span className="-hideSmartphone">screenshot</span>
                </Link>
              )}
            </nav>
            <div className="Header_nav_right">
              {user.username
                ? renderAccountMenuButton(
                    user.username,
                    this.accountButtonHandler
                  )
                : renderLoginButtons()}
            </div>
          </div>
        </div>
      </header>
    );
  }
}
export default connect(mapStoreToProps)(Header);

function renderLoginButtons() {
  return (
    <Link key="navLoginLink" to="/login" className="Header_login_link">
      Login
    </Link>
  );
}

function renderAccountMenuButton(username, handleOnClick) {
  return (
    <Link
      to="/user/account"
      className="Header_nav_link -user"
      onClick={handleOnClick}
    >
      <span className="-hideSmartphone">{username}</span>
      {renderUserIconSvg()}
    </Link>
  );
}

function renderUserIconSvg() {
  return (
    <span className="Header_nav_right_userIcon">
      <svg
        version="1.1"
        x="0px"
        y="0px"
        width="30"
        height="30"
        viewBox="0 0 30 30"
      >
        <g transform="matrix(0.05910153,0,0,0.05910153,0.0112456,-0.04828975)">
          <path
            d="M 255,0 C 114.75,0 0,114.75 0,255 0,395.25 114.75,510 255,510 395.25,510 510,395.25 510,255 510,114.75 395.25,0 255,0 Z m 0,76.5 c 43.35,0 76.5,33.15 76.5,76.5 0,43.35 -33.15,76.5 -76.5,76.5 -43.35,0 -76.5,-33.15 -76.5,-76.5 0,-43.35 33.15,-76.5 76.5,-76.5 z m 0,362.1 c -63.75,0 -119.85,-33.149 -153,-81.6 0,-51 102,-79.05 153,-79.05 51,0 153,28.05 153,79.05 -33.15,48.45 -89.25,81.6 -153,81.6 z"
            id="path2"
          />
        </g>
      </svg>
    </span>
  );
}

function isPathActive(path) {
  return window.location.pathname.indexOf(path) === 0;
}
