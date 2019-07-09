import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Account.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BarTitle from '../../../components/BarTitle/BarTitle';
import Loading from '../../../components/Loading/Loading';
import SimpleEdit from '../../../components/SimpleEdit/SimpleEdit';
import Button from '../../../components/Form/Button/Button';
import loginActions from '../../../actions/loginActions';
import userActions from '../../../actions/userActions';

function mapStoreToProps(store) {
  const userData = store.user.userData || {};
  return {
    ...userData,
    isUpdating: store.user.isUpdating,
  };
}
class AccountPage extends React.Component {
  handleUsernameChange = async username => {
    this.props.dispatch(userActions.updateUserAction({ username }));
  };

  handleEmailChange = async email => {
    this.props.dispatch(userActions.updateUserAction({ email }));
  };

  render() {
    const {
      username,
      email,
      nbSolvedScreenshots,
      nbAddedScreenshots,
      emailUpdates,
      isUpdating,
      dispatch,
    } = this.props;
    return (
      <section className="section">
        <Helmet title="Mon compte" />
        <div className="AccountPage">
          <BarTitle onlyOnSmartphones>
            <h2>Mon compte</h2>
          </BarTitle>
          <div className="AccountPage_content">
            <div className="AccountPage_data">
              <div className="AccountPage_data_line">
                <p className="AccountPage_data_line_left">Pseudo</p>
                <div className="AccountPage_data_line_right">
                  <SimpleEdit
                    value={username}
                    isLoading={isUpdating}
                    callback={this.handleUsernameChange}
                  />
                </div>
              </div>
              <div className="AccountPage_data_line">
                <p className="AccountPage_data_line_left">Email</p>
                <div className="AccountPage_data_line_right">
                  <SimpleEdit
                    value={email}
                    isLoading={isUpdating}
                    callback={this.handleEmailChange}
                  />
                </div>
              </div>
              <div className="AccountPage_data_line">
                <p className="AccountPage_data_line_left">Mot de passe</p>
                <p className="AccountPage_data_line_right">
                  <Link to="/mot-de-passe-oublie">Réinitialiser</Link>
                </p>
              </div>
              <hr />
              <div className="AccountPage_data_line">
                <p className="AccountPage_data_line_left">Screens résolus</p>
                <p className="AccountPage_data_line_right">
                  {nbSolvedScreenshots !== undefined ? (
                    nbSolvedScreenshots
                  ) : (
                    <Loading small />
                  )}
                </p>
              </div>
              <div className="AccountPage_data_line">
                <p className="AccountPage_data_line_left">Screens ajoutés</p>
                <p className="AccountPage_data_line_right">
                  {nbAddedScreenshots !== undefined ? (
                    nbAddedScreenshots
                  ) : (
                    <Loading small />
                  )}
                </p>
              </div>
              <hr />
              <div className="AccountPage_data_line">
                <p className="AccountPage_data_line_left">
                  <span className="-onlyOnTablets">Emails</span>
                  <span className="-hideOnTablets">
                    Quand souhaitez-vous recevoir un email à propos des nouveaux
                    screenshots ?
                  </span>
                </p>
                <p className="AccountPage_data_line_right">
                  {emailUpdates ? (
                    <select
                      value={emailUpdates}
                      onChange={e =>
                        dispatch(
                          userActions.updateUserAction({
                            emailUpdates: e.target.value,
                          })
                        )
                      }
                    >
                      {[
                        { label: 'Le plus vite possible', value: 'asap' },
                        { label: 'Une fois par jour', value: 'daily' },
                        { label: 'Une fois par semaine', value: 'weekly' },
                        { label: 'Jamais', value: 'never' },
                      ].map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Loading small />
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
  }
}
export default connect(mapStoreToProps)(AccountPage);
