import React from 'react';
import { connect } from 'react-redux';
import SmallContainer from '../../../components/SmallContainer/SmallContainer';
import Input from '../../../components/Form/Input/Input';
import Button from '../../../components/Form/Button/Button';
import loginService from '../../../services/loginService';
import loginActions from '../../../actions/loginActions';

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
      error = 'Empty password.';
    }
    this.setState({ password, error });
  };

  handlePasswordConfirmationChange = event => {
    let error = null;
    const { password } = this.state;
    const passwordConfirmation = event.target.value;
    if (!passwordConfirmation) {
      error = 'Empty password confirmation.';
    } else if (passwordConfirmation !== password) {
      error = 'The passwords need to match.';
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
              "Your new password's link have expired. Please start all over. Sorry about that.";
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
          label="Type your new password"
          id="password"
          type="password"
          className="input"
          placeholder="New password"
          value={password}
          onChange={this.handlePasswordChange}
        />
        <Input
          label="Confirm new password"
          id="passwordConfirmation"
          type="password"
          className="input"
          placeholder="Password confirmation"
          value={passwordConfirmation}
          onChange={this.handlePasswordConfirmationChange}
        />

        {error && <p className="notification is-danger">{error}</p>}

        <Button
          color="dark"
          loading={submitting}
          disabled={!valid}
          type="submit"
        >
          Set new password
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
        <SmallContainer title="New password form">
          {submitted ? this.renderSubmitted() : this.renderForm()}
        </SmallContainer>
      </section>
    );
  }
}
export default connect()(ForgotPasswordPage);
