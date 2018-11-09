import React from 'react';
import { Route } from 'react-router';

import AccountPage from './Account/Account';

const UserPages = ({ match }) => (
  <div className="UserPages">
    <Route path={`${match.url}/account`} component={AccountPage} />
  </div>
);
export default UserPages;
