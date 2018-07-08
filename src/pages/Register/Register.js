import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import userService from '../../services/userService';

import './register.css';

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

  onUsernameChange = event => {
    const { value } = event.target;
    this.setState(prevState => ({
      username: { ...prevState.username, value },
    }));
    this.checkUsername();
  };

  checkUsername = _.debounce(() => {
    userService
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

  onPasswordChange = event => {
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

  onPasswordConfirmChange = event => {
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

  onEmailChange = event => {
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
    userService
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
          this.props.dispatch({ type: 'USER__LOG_IN', payload: res });
        }
      });
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
        <h2 className="subtitle">Registration form</h2>
        <div className="field">
          <label className="label" htmlFor="username">
            Username
            <input
              id="username"
              type="text"
              className={`input
                  ${username.ok && 'is-success'}
                  ${username.error && 'is-danger'}`}
              placeholder="Type your name"
              value={username.value}
              onChange={this.onUsernameChange}
            />
          </label>
          {username.ok && (
            <p className="help is-success">This username is available</p>
          )}
          {username.error && <p className="help is-danger">{username.error}</p>}
        </div>
        <div className="field">
          <label className="label" htmlFor="password">
            Password
            <input
              id="password"
              type="password"
              className={`input
                  ${password.ok && 'is-success'}
                  ${password.error && 'is-danger'}`}
              placeholder="Type your password"
              value={password.value}
              onChange={this.onPasswordChange}
            />
          </label>
          {password.error && <p className="help is-danger">{password.error}</p>}
        </div>
        <div className="field">
          <label className="label" htmlFor="password_confirm">
            Confirm Password
            <input
              id="password_confirm"
              type="password"
              className={`input
                  ${passwordConfirm.ok && 'is-success'}
                  ${passwordConfirm.error && 'is-danger'}`}
              placeholder="Type your password again"
              value={passwordConfirm.value}
              onChange={this.onPasswordConfirmChange}
            />
          </label>
          {passwordConfirm.error && (
            <p className="help is-danger">{passwordConfirm.error}</p>
          )}
        </div>
        <div className="field">
          <label className="label" htmlFor="email">
            Email
            <span className="RegisterPage__form__email__reassurance">
              (only used for password recovery)
            </span>
            <input
              id="email"
              type="email"
              className={`input
                  ${email.ok && 'is-success'}
                  ${email.error && 'is-danger'}`}
              placeholder="Type your password again"
              value={email.value}
              onChange={this.onEmailChange}
            />
          </label>
        </div>
        {error && <p className="notification is-danger">{error}</p>}
        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-link"
              disabled={!valid || submitting}
            >
              Submit{submitting && 'ting...'}
            </button>
          </div>
          <div className="control">
            <Link to="/login" className="button is-text">
              Login instead
            </Link>
          </div>
        </div>
      </form>
    );
  }

  render() {
    const { user } = this.props;

    return (
      <section className="RegisterPage">
        {!user.username && this.renderForm()}
        {user.username && (
          <div className="notification is-info">
            <p>
              You are registered! <Link to="/logout">Log out</Link>
            </p>
          </div>
        )}
      </section>
    );
  }
}
export default connect(mapStoreToProps)(RegisterPage);
