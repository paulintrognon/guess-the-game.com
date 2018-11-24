import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import BarTitle from '../../../components/BarTitle/BarTitle';
import ScreenshotsGrid from '../../../components/ScreenshotsGrid/ScreenshotsGrid';
import PagesSwitcher from '../../../components/PagesSwitcher/PagesSwitcher';
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
            <BarTitle onlyOnSmartphones>
              <h2>Moderation</h2>
            </BarTitle>
            <div>
              <PagesSwitcher
                links={[
                  {
                    label: 'Waiting for approval',
                    to: '/user/moderation/waiting',
                  },
                  { label: 'Moderated by you', to: '/user/moderation/by-you' },
                  { label: 'Approved', to: '/user/moderation/approved' },
                  { label: 'Rejected', to: '/user/moderation/rejected' },
                ]}
              />
              <ScreenshotsGrid
                screenshots={nonModeratedScreenshots}
                onModerate={this.handleModeration}
                noScreenshotSentence="All screenshots have been moderated."
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export default connect(mapStoreToProps)(ModerationPage);
