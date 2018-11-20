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
    return <Redirect to="/login" />;
  }
  return (
    <div className="UserPages">
      <Menu />
      <div className="UserPages_container">
        <Route path={`${match.url}/account`} component={AccountPage} />
        <Route path={`${match.url}/moderation`} component={ModerationPage} />
        <Route path={`${match.url}/solved`} component={SolvedScreenshotsPage} />
        <Route path={`${match.url}/added`} component={AddedScreenshotsPage} />
      </div>
    </div>
  );
};
export default connect(mapStoreToProps)(UserPages);
