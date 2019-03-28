import React from 'react';
import './ErrorBoundary.css';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      message: '',
    };
  }

  componentDidCatch(err, errInfo) {
    console.error(err);
    console.error(errInfo);
    this.setState({
      error: true,
      message: errInfo.componentStack.toString(),
    });
  }

  render() {
    if (this.state.error) {
      return (
        <div className="ErrorBundary">
          <p>Oups ! On dirait que le site a crashé.</p>
          <p>
            <a className="ErrorBundary_reload" href=".">
              Cliquez ici pour recharger la page
            </a>
          </p>
          {process.env.NODE_ENV === 'production' ? (
            <details style={{ textAlign: 'center', fontSize: 8, padding: 10 }}>
              {this.state.message}
            </details>
          ) : null}
        </div>
      );
    }
    return this.props.children;
  }
}
