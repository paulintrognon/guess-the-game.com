import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Input from '../../../components/Form/Input/Input';
import Button from '../../../components/Form/Button/Button';
import LoginPageSwitcher from '../../../components/LoginPagesSwitcher/LoginPagesSwitcher';
import loginService from '../../../services/loginService';
import loginActions from '../../../actions/loginActions';
import './Login.css';

import SmallContainer from '../../../components/SmallContainer/SmallContainer';

function mapStoreToProps(store) {
  return {
    user: store.user,
  };
}
class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      error: false,
      username: '',
      password: '',
    };
  }

  handleUsernameChange = event => {
    this.setState({
      username: event.target.value,
    });
  };

  handlePasswordChange = event => {
    this.setState({
      password: event.target.value,
    });
  };

  submitHandler = event => {
    event.preventDefault();
    this.setState({
      submitting: true,
      error: false,
    });
    loginService
      .login({
        username: this.state.username.trim(),
        password: this.state.password,
      })
      .then(res => {
        const newState = {
          submitting: false,
        };
        if (!res.error) {
          newState.username = '';
          newState.password = '';
          this.props.dispatch(loginActions.login(res));
        } else {
          newState.error = res.message;
        }
        this.setState(newState);
      });
  };

  logoutHandler = () => {
    this.props.dispatch(loginActions.logout());
  };

  renderForm() {
    const { username, password, submitting, error } = this.state;

    const valid = username && password;

    return (
      <form className="LoginPage_form" onSubmit={this.submitHandler}>
        <Input
          id="username"
          label="Pseudo ou email"
          placeholder="Entrez votre pseudo ou votre email"
          value={username}
          onChange={this.handleUsernameChange}
        />
        <Input
          id="password"
          label="Mot de passe"
          type="password"
          placeholder="Entrez votre mot de passe"
          value={password}
          onChange={this.handlePasswordChange}
        >
          <Link
            to="/mot-de-passe-oublie"
            className="LoginPage_form_forgotPassword"
          >
            oublié&nbsp;?
          </Link>
        </Input>
        {error && <p className="login_form_error">{error}</p>}
        <Button
          loading={submitting}
          disabled={!valid}
          color="dark"
          type="submit"
        >
          Valider
        </Button>
      </form>
    );
  }

  render() {
    const { user } = this.props;

    return (
      <section className="LoginPage">
        <Helmet title="Connexion" />
        <LoginPageSwitcher />
        <SmallContainer title="Connexion">
          {!user.username && this.renderForm()}
          {user.username && (
            <p>
              Vous êtes connecté(e) en tant que <b>{user.username}</b> !
              <Button color="dark" onClick={this.logoutHandler}>
                Déconnexion
              </Button>
            </p>
          )}
        </SmallContainer>
      </section>
    );
  }
}
export default connect(mapStoreToProps)(LoginPage);
