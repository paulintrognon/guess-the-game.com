import React from 'react';
import { connect } from 'react-redux';
import screenshotActions from '../../actions/screenshotActions';
import './screenshot.css';

function mapStoreToProps(store) {
  return {
    screenshot: store.screenshot,
  };
}
class ScreenshotPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    console.log(props);

    if (!props.screenshot.id && props.match.params.id) {
      this.props.dispatch(
        screenshotActions.loadScreenshot(props.match.params.id)
      );
    }
  }

  render() {
    return (
      <section className="section">
        <div className="container">
          <div className="ScreenshotPage">
            <div className="ScreenshotPage__screenshot" />
          </div>
        </div>
      </section>
    );
  }
}
export default connect(mapStoreToProps)(ScreenshotPage);
