import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import BarTitle from '../../../components/BarTitle/BarTitle';
import ScreenshotsGrid from '../../../components/ScreenshotsGrid/ScreenshotsGrid';
import userActions from '../../../actions/userActions';
import './Moderation.css';

function mapStoreToProps(store) {
  return {
    nonModeratedScreenshots: store.user.nonModeratedScreenshots,
  };
}
class ModerationPage extends React.Component {
  constructor(props) {
    super(props);
    this.props.dispatch(userActions.loadNonModeratedScreenshots());
  }

  render() {
    const { nonModeratedScreenshots } = this.props;
    return (
      <section className="section">
        <Helmet title="Moderation" />
        <div className="container">
          <div className="ModerationPage">
            <BarTitle hideOnSmall>
              <h2>Moderation</h2>
            </BarTitle>
            <ScreenshotsGrid
              screenshots={nonModeratedScreenshots}
              onModerate={this.handleModeration}
            />
          </div>
        </div>
      </section>
    );
  }
}
export default connect(mapStoreToProps)(ModerationPage);
