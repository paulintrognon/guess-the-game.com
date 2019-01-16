import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { ReCaptcha } from 'react-recaptcha-google';
import _ from 'lodash';
import SmallContainer from '../../../components/SmallContainer/SmallContainer';
import LoginPagesSwitcher from '../../../components/LoginPagesSwitcher/LoginPagesSwitcher';
import Input from '../../../components/Form/Input/Input';
import Button from '../../../components/Form/Button/Button';
import loginService from '../../../services/loginService';
import loginActions from '../../../actions/loginActions';
import './Register.css';

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
      recaptchaToken: null,
    };
  }

  componentDidMount = () => {
    if (this.recaptchaElement) {
      this.recaptchaElement.reset();
    }
  };

  onLoadRecaptcha = () => {
    if (this.recaptchaElement) {
      this.recaptchaElement.reset();
    }
  };

  onRecaptchaTokenRetrieved = recaptchaToken => {
    this.setState({ recaptchaToken });
  };

  onRecaptchaExpired = () => {
    console.log('expired');
    this.setState({ recaptchaToken: null });
  };

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
            username.error = 'Le pseudo doit avoir au minimum 2 lettres.';
          } else if (!isAvailable) {
            username.ok = false;
            username.error = 'Ce pseudo est déjà pris.';
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
      state.password.error = 'Le mot de passe ne peut être vide.';
      return state;
    }
    if (prevState.passwordConfirm.value) {
      if (prevState.passwordConfirm.value !== value) {
        state.password.ok = false;
        state.password.error = 'Les mots de passes sont différents.';
        state.passwordConfirm.ok = false;
        state.passwordConfirm.error = 'Les mots de passes sont différents.';
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
      state.passwordConfirm.error = 'Les mots de passe sont différents.';
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
        email.error = "L'email est requis.";
      } else if (!value.match(/.+@.+/)) {
        email.ok = false;
        email.error = "L'email ne ressemble pas à un email.";
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
        recaptchaToken: this.state.recaptchaToken,
        jwt: this.props.user.jwt,
      })
      .then(res => {
        if (!res.error) {
          this.props.dispatch(loginActions.login(res));
          return;
        }
        let error = "Une erreur s'est produite.";
        if (res.errors && res.errors.length) {
          error = res.errors[0].message;
          if (res.errors[0].message === 'email must be unique') {
            error = 'Cet email est déjà utilisé.';
          }
        }
        this.setState({
          submitting: false,
          error,
        });
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
      recaptchaToken,
      submitting,
      error,
    } = this.state;

    const valid =
      username.ok &&
      password.ok &&
      passwordConfirm.ok &&
      email.ok &&
      recaptchaToken;

    return (
      <form className="RegisterPage_form" onSubmit={this.handleSubmit}>
        <Input
          id="username"
          label="Pseudo"
          placeholder="Ex: tartiflette73"
          value={username.value}
          onChange={this.handleUsernameChange}
          ok={username.ok && 'Ce pseudo est dispo ! Classe'}
          error={username.error}
        />
        <Input
          id="email"
          type="email"
          label="Email"
          labelExtraText="(c'est juste pour la récup du mot de passe en cas d'oubli)"
          placeholder="Ex: tartiflette73@email.com"
          value={email.value}
          onChange={this.handleEmailChange}
          ok={email.ok}
          error={email.error}
        />
        <Input
          id="password"
          type="password"
          label="Mot de passe"
          placeholder="Ex: ●●●●●●●●"
          value={password.value}
          onChange={this.handlePasswordChange}
          ok={password.ok}
          error={password.error}
        />
        <Input
          id="password_confirm"
          type="password"
          label="Confirmation du mot de passe"
          placeholder="Entrez à nouveau le même mot de passe"
          value={passwordConfirm.value}
          onChange={this.handlePasswordConfirmChange}
          ok={passwordConfirm.ok}
          error={passwordConfirm.error}
        />
        <ReCaptcha
          ref={el => {
            this.recaptchaElement = el;
          }}
          size="normal"
          render="explicit"
          style={{ width: '100%' }}
          sitekey="6LcQbmQUAAAAACyOdZhhEsUfUAO3TmUGqMMClngr"
          onloadCallback={this.onLoadRecaptcha}
          verifyCallback={this.onRecaptchaTokenRetrieved}
          expiredCallback={this.onRecaptchaExpired}
        />
        {error && <p className="RegisterPage_form_error">{error}</p>}
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
      <section className="RegisterPage">
        <Helmet title="Inscription" />
        <LoginPagesSwitcher />
        <SmallContainer title="Inscription">
          {!user.username && this.renderForm()}
          {user.username && (
            <p>
              Vous êtes déjà inscrit(e) et connecté(e) en tant que{' '}
              <b>{user.username}</b> !
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
export default connect(mapStoreToProps)(RegisterPage);
