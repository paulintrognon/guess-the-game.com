import React from 'react';
import queryString from 'qs';
import Loading from '../../../components/Loading/Loading';
import userService from '../../../services/userService';

export default class EmailUpdatesUnsubscribePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
    };
    const params = queryString.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    });
    userService
      .unsubscribeFromEmailUpdates({
        emailToken: params.token,
      })
      .then(res => {
        if (res.error) {
          this.setState({
            isLoading: false,
            isError: true,
          });
        } else {
          this.setState({
            isLoading: false,
            isError: false,
          });
        }
      });
  }

  renderContent() {
    if (this.state.isLoading) {
      return <Loading />;
    }
    if (this.state.isError) {
      return (
        <div style={{ margin: '50px' }}>
          <p style={{ margin: '10px', color: 'red' }}>
            <strong>
              Nous sommes vraiment désolé mais une erreur s&apos;est produite.
            </strong>
          </p>
          <p>
            Vous pouvez envoyer un email à{' '}
            <strong>dev@guess-the-game.com</strong> pour être retiré
            manuellement des emails.
          </p>
        </div>
      );
    }
    return (
      <div>
        <div style={{ margin: '50px 0' }}>
          <p>
            <strong>C&apos;est tout bon !</strong>
          </p>
          <p>
            Vous ne recevrez plus d&apos;emails concernant les nouveaux
            screenshots.
          </p>
        </div>
        <p>
          <img
            style={{ maxWidth: '100%' }}
            src="https://i.giphy.com/media/BeTUaB8UQjzhK/giphy.webp"
            alt="ok"
          />
        </p>
      </div>
    );
  }

  render() {
    return (
      <section style={{ textAlign: 'center' }}>{this.renderContent()}</section>
    );
  }
}
