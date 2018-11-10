import React from 'react';
import { Route } from 'react-router';
import './User.css';
import Menu from './Menu/Menu';
import AccountPage from './Account/Account';
import ModerationPage from './Moderation/Moderation';

const UserPages = ({ match }) => (
  <div className="UserPages">
    <Menu />
    <div className="UserPages_content">
      <Route path={`${match.url}/account`} component={AccountPage} />
      <Route path={`${match.url}/moderation`} component={ModerationPage} />
    </div>
  </div>
);
export default UserPages;
