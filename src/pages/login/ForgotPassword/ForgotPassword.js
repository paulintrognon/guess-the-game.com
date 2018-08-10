import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import SmallContainer from '../../../components/SmallContainer/SmallContainer';
import loginService from '../../../services/loginService';

class ForgotPasswordPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      valid: false,
      submitting: false,
      submitted: false,
      error: null,
    };
  }

  emailChangeHandler = event => {
    const valid = event.target.value.trim().match(/.+@.+/);
    this.setState({ email: event.target.value, valid });
  };

  submitHandler = event => {
    event.preventDefault();
    this.setState({ submitting: true });

    loginService
      .requestNewPassword({
        email: this.state.email,
      })
      .then(res => {
        const newState = {
          submitting: false,
        };
        if (!res.error) {
          newState.submitted = true;
        } else {
          newState.error = res.message;
        }
        this.setState(newState);
      });
  };

  renderForm() {
    const { email, submitting, valid, error } = this.state;
    return (
      <form className="ForgotPasswordPage__form" onSubmit={this.submitHandler}>
        <div className="field">
          <label className="label" htmlFor="username">
            No worries, we&apos;ll send you a link to re-create your password
            <input
              id="username"
              type="email"
              className="input"
              placeholder="Ex: careless_n00b@gmail.com"
              value={email}
              onChange={this.emailChangeHandler}
            />
          </label>
        </div>
        {error && <p className="notification is-danger">{error}</p>}
        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className={`button is-link ${submitting ? 'is-loading' : ''}`}
              disabled={!valid}
            >
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
    );
  }

  renderSubmitted() {
    const { email } = this.state;
    return (
      <p className="notification is-success">
        Done! An email is on its way to {email}.
      </p>
    );
  }

  render() {
    const { submitted } = this.state;
    return (
      <SmallContainer>
        <section className="ForgotPasswordPage">
          <h2 className="title is-5">So you forgot your password...</h2>
          {submitted ? this.renderSubmitted() : this.renderForm()}
        </section>
      </SmallContainer>
    );
  }
}
export default connect()(ForgotPasswordPage);
