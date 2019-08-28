import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import SmallContainer from '../../../components/SmallContainer/SmallContainer';
import LoginPagesSwitcher from '../../../components/LoginPagesSwitcher/LoginPagesSwitcher';
import Input from '../../../components/Form/Input/Input';
import Button from '../../../components/Form/Button/Button';
import loginService from '../../../services/loginService';
import loginActions from '../../../store/login/loginActions';

class ForgotPasswordPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      passwordConfirmation: '',
      submitting: false,
      submitted: false,
      error: null,
    };
    this.token = props.match.params.token;
  }

  handlePasswordChange = event => {
    const password = event.target.value;
    let error = null;
    if (!password) {
      error = 'Mot de passe vide.';
    }
    this.setState({ password, error });
  };

  handlePasswordConfirmationChange = event => {
    let error = null;
    const { password } = this.state;
    const passwordConfirmation = event.target.value;
    if (!passwordConfirmation) {
      error = 'Vous devez remplir la confirmation du mot de passe.';
    } else if (passwordConfirmation !== password) {
      error = 'Les deux mots de passe doivent correspondre.';
    }
    this.setState({ passwordConfirmation, error });
  };

  submitHandler = event => {
    event.preventDefault();
    this.setState({ submitting: true });

    loginService
      .changePassword({
        password: this.state.password,
        token: this.token,
      })
      .then(res => {
        if (!res.error) {
          this.props.dispatch(loginActions.login(res));
        } else {
          const newState = { submitting: false };
          if (res.code === 'OUTDATED_TOKEN') {
            newState.error =
              "On dirait que le lien de regénération de votre mot de passe a éxpiré. Désolé mais vous devez tout recommencer :'(";
          } else {
            newState.error = res.message;
          }
          this.setState(newState);
        }
      });
  };

  renderForm() {
    const { password, passwordConfirmation, submitting, error } = this.state;
    const valid = password && passwordConfirmation && !error;
    return (
      <form className="ForgotPasswordPage__form" onSubmit={this.submitHandler}>
        <Input
          label="Nouveau mot de passe"
          id="password"
          type="password"
          className="input"
          placeholder="Entrez votre nouveau mot de passe"
          value={password}
          onChange={this.handlePasswordChange}
        />
        <Input
          label="Confirmer le mot de passe"
          id="passwordConfirmation"
          type="password"
          className="input"
          placeholder="Entrez la confirmation du mot de passe"
          value={passwordConfirmation}
          onChange={this.handlePasswordConfirmationChange}
        />

        {error && <p className="login_form_error">{error}</p>}

        <Button
          color="dark"
          loading={submitting}
          disabled={!valid}
          type="submit"
        >
          Valider le nouveau mot de passe
        </Button>
      </form>
    );
  }

  renderSubmitted() {
    const { email } = this.state;
    return (
      <p className="notification is-success">
        C&apos;est bon&nbsp;! Un email a été envoyé à {email}.
      </p>
    );
  }

  render() {
    const { submitted } = this.state;
    return (
      <section className="ForgotPasswordPage">
        <Helmet title="Réinitialiser son mot de passe" />
        <LoginPagesSwitcher />
        <SmallContainer title="Réinitialiser son mot de passe">
          {submitted ? this.renderSubmitted() : this.renderForm()}
        </SmallContainer>
      </section>
    );
  }
}
export default connect()(ForgotPasswordPage);
