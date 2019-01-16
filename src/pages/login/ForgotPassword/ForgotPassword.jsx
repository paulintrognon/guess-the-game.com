import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import SmallContainer from '../../../components/SmallContainer/SmallContainer';
import LoginPagesSwitcher from '../../../components/LoginPagesSwitcher/LoginPagesSwitcher';
import Input from '../../../components/Form/Input/Input';
import Button from '../../../components/Form/Button/Button';
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

  handleEmailChange = event => {
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
        <Input
          id="username"
          label="Pas de problème, on va vous envoyer un lien pour le recréer."
          type="email"
          className="input"
          placeholder="Ex: noob59@gmail.com"
          value={email}
          onChange={this.handleEmailChange}
        />

        {error && <p className="login_form_error">{error}</p>}

        <Button
          color="dark"
          loading={submitting}
          disabled={!valid}
          type="submit"
        >
          Envoyer l&apos;email de reset
        </Button>
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
      <section className="ForgotPasswordPage">
        <Helmet title="Forgot password" />
        <LoginPagesSwitcher />
        <SmallContainer title="Il parait que vous avez oublié votre mot de passe...">
          {submitted ? this.renderSubmitted() : this.renderForm()}
        </SmallContainer>
      </section>
    );
  }
}
export default connect()(ForgotPasswordPage);
