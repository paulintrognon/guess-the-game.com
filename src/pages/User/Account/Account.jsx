import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import userActions from '../../../actions/userActions';
import './Account.css';
import BarTitle from '../../../components/BarTitle/BarTitle';

function mapStoreToProps(store) {
  return {
    userData: store.user.userData,
  };
}
class AccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.props.dispatch(userActions.loadUserData());
  }

  render() {
    const { userData } = this.props;
    return (
      <section className="section">
        <Helmet title="My account" />
        <div className="container">
          <div className="AccountPage">
            <BarTitle hideOnSmall>
              <h2>My Account</h2>
            </BarTitle>
            <div className="AccountPage_content">
              {userData ? (
                <div className="AccountPage_data">
                  <div className="AccountPage_data_line">
                    <p className="AccountPage_data_line_left">Username</p>
                    <p className="AccountPage_data_line_right">
                      {userData.username}
                    </p>
                  </div>
                  <div className="AccountPage_data_line">
                    <p className="AccountPage_data_line_left">Email</p>
                    <p className="AccountPage_data_line_right">
                      {userData.email}
                    </p>
                  </div>
                  <div className="AccountPage_data_line">
                    <p className="AccountPage_data_line_left">Password</p>
                    <p className="AccountPage_data_line_right">
                      <Link to="/forgot-password">reset it!</Link>
                    </p>
                  </div>
                  <hr />
                  <div className="AccountPage_data_line">
                    <p className="AccountPage_data_line_left">
                      Screenshots found
                    </p>
                    <p className="AccountPage_data_line_right">
                      {userData.screenshotsFound}
                    </p>
                  </div>
                  <div className="AccountPage_data_line">
                    <p className="AccountPage_data_line_left">
                      Screenshots posted
                    </p>
                    <p className="AccountPage_data_line_right">
                      {userData.screenshotsAdded}
                    </p>
                  </div>
                </div>
              ) : (
                <p>Chargement...</p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export default connect(mapStoreToProps)(AccountPage);
