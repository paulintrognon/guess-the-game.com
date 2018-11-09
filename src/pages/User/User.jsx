import React from 'react';
import { Route } from 'react-router';

import Menu from './Menu/Menu';
import AccountPage from './Account/Account';

const UserPages = ({ match }) => (
  <div className="UserPages">
    <Menu />
    <Route path={`${match.url}/account`} component={AccountPage} />
  </div>
);
export default UserPages;
