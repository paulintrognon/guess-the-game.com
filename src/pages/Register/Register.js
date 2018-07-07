import React from 'react';
import { Link } from 'react-router-dom';

import './register.css';

export default class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.setState({});
  }

  render() {
    return (
      <section className="RegisterPage container">
        <form className="RegisterPage__form">
          <h2 className="subtitle">Registration form</h2>
          <div className="field">
            <label className="label" htmlFor="nickname">
              Username
              <input
                id="nickname"
                type="text"
                className="input"
                placeholder="Type your name"
              />
            </label>
          </div>
          <div className="field">
            <label className="label" htmlFor="password">
              Password
              <input
                id="password"
                type="password"
                className="input"
                placeholder="Type your password"
              />
            </label>
          </div>
          <div className="field">
            <label className="label" htmlFor="password_confirm">
              Confirm Password
              <input
                id="password_confirm"
                type="password"
                className="input"
                placeholder="Type your password again"
              />
            </label>
          </div>
          <div className="field">
            <label className="label" htmlFor="email">
              Email{' '}
              <span className="RegisterPage__form__email__reassurance">
                (only used for password recovery)
              </span>
              <input
                id="email"
                type="password"
                className="input"
                placeholder="Type your password again"
              />
            </label>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button type="submit" className="button is-link">
                Submit
              </button>
            </div>
            <div className="control">
              <Link to="/login" className="button is-text">
                Login instead
              </Link>
            </div>
          </div>
        </form>
      </section>
    );
  }
}
