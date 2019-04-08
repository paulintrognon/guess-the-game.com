import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router';
import './User.css';
import Menu from './Menu/Menu';
import AccountPage from './Account/Account';
import ModerationPage from './Moderation/Moderation';
import SolvedScreenshotsPage from './SolvedScreenshots/SolvedScreenshots';
import AddedScreenshotsPage from './AddedScreenshots/AddedScreenshots';

function mapStoreToProps(store) {
  return {
    user: store.user,
  };
}
const UserPages = ({ user, match }) => {
  if (!user || !user.jwt) {
    return <Redirect to="/connexion" />;
  }
  return (
    <div className="UserPages">
      <Menu />
      <div className="UserPages_container">
        <Route path={`${match.url}/mon-compte`} component={AccountPage} />
        <Route path={`${match.url}/moderation`} component={ModerationPage} />
        <Route
          path={`${match.url}/resolus`}
          component={SolvedScreenshotsPage}
        />
        <Route path={`${match.url}/ajoutes`} component={AddedScreenshotsPage} />
      </div>
    </div>
  );
};
export default connect(mapStoreToProps)(UserPages);
