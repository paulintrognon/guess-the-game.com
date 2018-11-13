import React from 'react';
import { Route } from 'react-router';
import './User.css';
import Menu from './Menu/Menu';
import AccountPage from './Account/Account';
import ModerationPage from './Moderation/Moderation';
import ScreenshotsFoundPage from './ScreenshotsFound/ScreenshotsFound';

const UserPages = ({ match }) => (
  <div className="UserPages">
    <Menu />
    <div className="UserPages_container">
      <Route path={`${match.url}/account`} component={AccountPage} />
      <Route path={`${match.url}/moderation`} component={ModerationPage} />
      <Route path={`${match.url}/found`} component={ScreenshotsFoundPage} />
    </div>
  </div>
);
export default UserPages;
