import React from 'react';
import { connect } from 'react-redux';

function mapStoreToProps(store) {
  return {
    user: store.user,
  };
}
class LogoutPage extends React.Component {
  componentWillMount() {
    if (this.props.user.jwt) {
      this.props.dispatch({ type: 'USER__LOG_OUT' });
    }
  }

  render() {
    const { user } = this.props;

    return (
      <div className="smallContainer">
        <div className="notification is-info">
          {user.username && <p>Logging you out...</p>}
          {!user.username && <p>You are logged out!</p>}
        </div>
      </div>
    );
  }
}
export default connect(mapStoreToProps)(LogoutPage);
