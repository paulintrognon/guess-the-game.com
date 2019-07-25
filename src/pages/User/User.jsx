import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router';
import './User.css';
import loginActions from '../../actions/loginActions';
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
const UserPages = ({ user, match, dispatch }) => {
  if (!user || !user.username) {
    dispatch(loginActions.needToRegister());
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
        <Route
          path={`${match.url}/ajoutes`}
          component={AddedScreenshotsPage}
          exact
        />
        <Route
          path={`${match.url}/ajoutes/valides`}
          component={AddedScreenshotsPage}
          exact
        />
        <Route
          path={`${match.url}/ajoutes/refuses`}
          component={AddedScreenshotsPage}
          exact
        />
        <Route
          path={`${match.url}/ajoutes/en-attente`}
          component={AddedScreenshotsPage}
          exact
        />
      </div>
    </div>
  );
};
export default connect(mapStoreToProps)(UserPages);
