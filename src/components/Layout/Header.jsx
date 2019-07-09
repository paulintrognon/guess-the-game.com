import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import loginActions from '../../actions/loginActions';
import screenshotActions from '../../actions/screenshotActions';
import layoutActions from '../../actions/layoutActions';

import './Header.css';

function mapStoreToProps(store) {
  return {
    username: store.user && store.user.username,
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
    const { username } = this.props;

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
                  isPathActive('/screenshot') ? '-active' : ''
                }`}
                onClick={this.playHandler}
              >
                Jouer
              </button>
              <Link
                to="/classement"
                className={`Header_nav_link ${
                  isPathActive('/classement') ? '-active' : ''
                }`}
              >
                Classement
              </Link>
              {username && (
                <Link
                  to="/ajouter-un-screenshot"
                  className={`Header_nav_link ${
                    isPathActive('/ajouter-un-screenshot') ? '-active' : ''
                  }`}
                >
                  Ajouter&nbsp;
                  <span className="-hideOnSmartphones">un screenshot</span>
                </Link>
              )}
            </nav>
            <div className="Header_nav_right">
              {username
                ? renderAccountMenuButton(username, this.accountButtonHandler)
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
    <Link key="navLoginLink" to="/connexion" className="Header_login_link">
      Login
    </Link>
  );
}

function renderAccountMenuButton(username, handleOnClick) {
  return (
    <Link
      to="/moi/mon-compte"
      className={`Header_nav_link -user ${
        window.location.pathname.indexOf('/moi') === 0 ? '-active' : null
      }`}
      onClick={handleOnClick}
    >
      <span className="-hideOnSmartphones">{username}</span>
      {renderUserIconSvg()}
    </Link>
  );
}

function renderUserIconSvg() {
  return (
    <svg
      className="Header_nav_right_menuIcon"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 17h-12v-2h12v2zm0-4h-12v-2h12v2zm0-4h-12v-2h12v2z" />
    </svg>
  );
}

function isPathActive(path) {
  return window.location.pathname.indexOf(path) === 0;
}
