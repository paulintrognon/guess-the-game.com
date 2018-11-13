import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import BarTitle from '../../../components/BarTitle/BarTitle';
import userActions from '../../../actions/userActions';

function mapStoreToProps(store) {
  return {
    screenshotsFound: store.user.screenshotsFound,
  };
}
class ScreenshotsFoundPage extends React.Component {
  constructor(props) {
    super(props);
    this.props.dispatch(userActions.loadUserScreenshotsFound());
  }

  render() {
    const { screenshotsFound } = this.props;
    return (
      <section className="section">
        <Helmet title="My account" />
        <div className="ScreenshotsFoundPage">
          <BarTitle hideOnSmall>
            <h2>My Account</h2>
          </BarTitle>
          <div className="ScreenshotsFoundPage_content">
            {screenshotsFound.map(screenshotFound => (
              <div key={screenshotFound.id}>{screenshotFound.imageUrl}</div>
            ))}
          </div>
        </div>
      </section>
    );
  }
}
export default connect(mapStoreToProps)(ScreenshotsFoundPage);
