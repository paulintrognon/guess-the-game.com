import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Account.css';
import BarTitle from '../../../components/BarTitle/BarTitle';
import Loading from '../../../components/Loading/Loading';
import Button from '../../../components/Form/Button/Button';
import loginActions from '../../../actions/loginActions';

function mapStoreToProps(store) {
  return store.user.userData || {};
}
const AccountPage = ({
  username,
  email,
  nbSolvedScreenshots,
  nbAddedScreenshots,
  dispatch,
}) => (
  <section className="section">
    <Helmet title="My account" />
    <div className="AccountPage">
      <BarTitle onlyOnSmartphones>
        <h2>Mon compte</h2>
      </BarTitle>
      <div className="AccountPage_content">
        <div className="AccountPage_data">
          <div className="AccountPage_data_line">
            <p className="AccountPage_data_line_left">Pseudo</p>
            <p className="AccountPage_data_line_right">{username}</p>
          </div>
          <div className="AccountPage_data_line">
            <p className="AccountPage_data_line_left">Email</p>
            <p className="AccountPage_data_line_right">{email}</p>
          </div>
          <div className="AccountPage_data_line">
            <p className="AccountPage_data_line_left">Mot de passe</p>
            <p className="AccountPage_data_line_right">
              <Link to="/forgot-password">Réinitialiser</Link>
            </p>
          </div>
          <hr />
          <div className="AccountPage_data_line">
            <p className="AccountPage_data_line_left">Screens résolus</p>
            <p className="AccountPage_data_line_right">
              {nbSolvedScreenshots !== undefined ? (
                nbSolvedScreenshots
              ) : (
                <Loading className="AccountPage_data_line_loading" />
              )}
            </p>
          </div>
          <div className="AccountPage_data_line">
            <p className="AccountPage_data_line_left">Screens ajoutés</p>
            <p className="AccountPage_data_line_right">
              {nbAddedScreenshots !== undefined ? (
                nbAddedScreenshots
              ) : (
                <Loading className="AccountPage_data_line_loading" />
              )}
            </p>
          </div>
          <hr />
          <div className="AccountPage_data_line -centered">
            <Button
              color="dark"
              onClick={() => dispatch(loginActions.logout())}
              className="AccountPage_data_line_logOutButton"
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);
export default connect(mapStoreToProps)(AccountPage);
