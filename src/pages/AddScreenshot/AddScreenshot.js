import React from 'react';
import { connect } from 'react-redux';

function mapStoreToProps(store) {
  return {
    user: store.user,
  };
}
class AddScreenshotPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container">
        <p>coucou</p>
      </div>
    );
  }
}
export default connect(mapStoreToProps)(AddScreenshotPage);
