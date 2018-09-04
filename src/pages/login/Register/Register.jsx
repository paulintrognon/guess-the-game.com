import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import _ from 'lodash';
import SmallContainer from '../../../components/SmallContainer/SmallContainer';
import LoginPagesSwitcher from '../../../components/LoginPagesSwitcher/LoginPagesSwitcher';
import Input from '../../../components/Form/Input/Input';
import Button from '../../../components/Form/Button/Button';
import loginService from '../../../services/loginService';
import loginActions from '../../../actions/loginActions';

function mapStoreToProps(store) {
  return {
    user: store.user,
  };
}
class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      error: false,
      username: {
        value: '',
        ok: false,
        error: false,
      },
      password: {
        value: '',
        ok: false,
        error: false,
      },
      passwordConfirm: {
        value: '',
        ok: false,
        error: false,
      },
      email: {
        value: '',
        ok: false,
        error: false,
      },
    };
  }

  handleUsernameChange = event => {
    const { value } = event.target;
    this.setState(prevState => ({
      username: { ...prevState.username, value },
    }));
    this.checkUsername();
  };

  checkUsername = _.debounce(() => {
    loginService
      .checkUsernameAvailability(this.state.username.value)
      .then(isAvailable => {
        this.setState(prevState => {
          const username = { ...prevState.username };
          if (!username.value || username.value.length < 2) {
            username.ok = false;
            username.error = 'The username needs to be at least 2 letters long';
          } else if (!isAvailable) {
            username.ok = false;
            username.error = 'This username is already taken.';
          } else {
            username.ok = true;
            username.error = false;
          }
          return { username };
        });
      });
  }, 300);

  handlePasswordChange = event => {
    const { value } = event.target;
    this.setState(prevState => this.checkPassword(prevState, value));
  };

  checkPassword = (prevState, value) => {
    const state = {
      ...prevState,
      password: { ...prevState.password, value },
      passwordConfirm: { ...prevState.passwordConfirm },
    };
    if (!value) {
      state.password.ok = false;
      state.password.error = 'Password cannot be empty';
      return state;
    }
    if (prevState.passwordConfirm.value) {
      if (prevState.passwordConfirm.value !== value) {
        state.password.ok = false;
        state.password.error = 'Passwords do not match';
        state.passwordConfirm.ok = false;
        state.passwordConfirm.error = 'Passwords do not match';
        return state;
      }
      state.passwordConfirm.ok = true;
      state.passwordConfirm.error = false;
    }
    state.password.ok = true;
    state.password.error = false;
    return state;
  };

  handlePasswordConfirmChange = event => {
    const { value } = event.target;
    this.setState(prevState => this.checkPasswordConfirm(prevState, value));
  };

  checkPasswordConfirm = (prevState, value) => {
    const state = {
      ...prevState,
      password: { ...prevState.password },
      passwordConfirm: { ...prevState.passwordConfirm, value },
    };

    if (prevState.password.value !== value) {
      state.passwordConfirm.ok = false;
      state.passwordConfirm.error = 'Passwords do not match';
      return state;
    }
    if (prevState.password.value) {
      state.password.ok = true;
      state.password.error = false;
    }
    state.passwordConfirm.ok = true;
    state.passwordConfirm.error = false;
    return state;
  };

  handleEmailChange = event => {
    const { value } = event.target;
    this.setState(prevState => {
      const email = { ...prevState.email, value };
      if (!value) {
        email.ok = false;
        email.error = 'Email is required';
      } else if (!value.match(/.+@.+/)) {
        email.ok = false;
        email.error = 'Email is not valid';
      } else {
        email.ok = true;
        email.error = false;
      }
      return { email };
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({
      submitting: true,
      error: false,
    });
    loginService
      .register({
        username: this.state.username.value.trim(),
        password: this.state.password.value,
        email: this.state.email.value.trim(),
        jwt: this.props.user.jwt,
      })
      .then(res => {
        if (res.errors && res.errors.length) {
          let error = res.errors[0].message;
          if (res.errors[0].message === 'email must be unique') {
            error = 'This email is already in use';
          }
          this.setState({
            submitting: false,
            error,
          });
        } else {
          this.props.dispatch(loginActions.login(res));
        }
      });
  };

  logoutHandler = () => {
    this.props.dispatch(loginActions.logout());
  };

  renderForm() {
    const {
      username,
      password,
      passwordConfirm,
      email,
      submitting,
      error,
    } = this.state;

    const valid = username.ok && password.ok && passwordConfirm.ok && email.ok;

    return (
      <form className="RegisterPage__form" onSubmit={this.handleSubmit}>
        <Input
          id="username"
          label="Username"
          placeholder="Type your username"
          value={username.value}
          onChange={this.handleUsernameChange}
          ok={username.ok && 'This username is available'}
          error={username.error}
        />
        <Input
          id="email"
          type="email"
          label="Email"
          labelExtraText="(only for password recovery)"
          placeholder="Type your email"
          value={email.value}
          onChange={this.handleEmailChange}
          ok={email.ok}
          error={email.error}
        />
        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="Type your password"
          value={password.value}
          onChange={this.handlePasswordChange}
          ok={password.ok}
          error={password.error}
        />
        <Input
          id="password_confirm"
          type="password"
          label="Confirm Password"
          placeholder="Type the same password again"
          value={passwordConfirm.value}
          onChange={this.handlePasswordConfirmChange}
          ok={passwordConfirm.ok}
          error={passwordConfirm.error}
        />
        {error && <p>{error}</p>}
        <Button
          loading={submitting}
          disabled={!valid}
          color="dark"
          type="submit"
        >
          Submit
        </Button>
      </form>
    );
  }

  render() {
    const { user } = this.props;

    return (
      <section className="RegisterPage">
        <Helmet title="Register" />
        <LoginPagesSwitcher />
        <SmallContainer title="Register">
          {!user.username && this.renderForm()}
          {user.username && (
            <p>
              You are already registered and logged as <b>{user.username}</b>!
              <Button color="dark" onClick={this.logoutHandler}>
                Log out
              </Button>
            </p>
          )}
        </SmallContainer>
      </section>
    );
  }
}
export default connect(mapStoreToProps)(RegisterPage);
