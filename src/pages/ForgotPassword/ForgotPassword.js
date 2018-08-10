import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import SmallContainer from '../../components/SmallContainer/SmallContainer';

class ForgotPasswordPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      submitting: false,
      valid: false,
    };
  }

  emailChangeHandler = event => {
    const valid = event.target.value.trim().match(/.+@.+/);
    this.setState({ email: event.target.value, valid });
  };

  submitHandler = event => {
    event.preventDefault();
    this.setState({ submitting: true });
  };

  renderForm() {
    const { email, submitting, valid } = this.state;
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

  render() {
    return (
      <SmallContainer>
        <section className="ForgotPasswordPage">
          <h2 className="title is-5">So you forgot your password...</h2>
          {this.renderForm()}
        </section>
      </SmallContainer>
    );
  }
}
export default connect()(ForgotPasswordPage);
