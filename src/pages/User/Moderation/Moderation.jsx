import React from 'react';
import { Route } from 'react-router';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import BarTitle from '../../../components/BarTitle/BarTitle';
import ScreenshotsGrid from '../../../components/ScreenshotsGrid/ScreenshotsGrid';
import PagesSwitcher from '../../../components/PagesSwitcher/PagesSwitcher';
import moderationActions from '../../../actions/moderationActions';
import './Moderation.css';

function mapStoreToProps(store) {
  return {
    waitingScreenshots: store.moderation.waitingScreenshots,
    byYouScreenshots: store.moderation.byYouScreenshots,
    approvedScreenshots: store.moderation.approvedScreenshots,
    rejectedScreenshots: store.moderation.rejectedScreenshots,
  };
}
class ModerationPage extends React.Component {
  constructor(props) {
    super(props);
    this.fetchNonModeratedScreenshots();
    this.fetchModeratedByYouScreenshots();
    this.fetchApprovedScreenshots();
    this.fetchRejectedScreenshots();
  }

  fetchNonModeratedScreenshots = () => {
    this.props.dispatch(moderationActions.fetchNonModeratedScreenshots());
  };

  fetchModeratedByYouScreenshots = () => {
    this.props.dispatch(moderationActions.fetchModeratedByYouScreenshots());
  };

  fetchApprovedScreenshots = () => {
    this.props.dispatch(moderationActions.fetchApprovedScreenshots());
  };

  fetchRejectedScreenshots = () => {
    this.props.dispatch(moderationActions.fetchRejectedScreenshots());
  };

  render() {
    const {
      waitingScreenshots,
      byYouScreenshots,
      approvedScreenshots,
      rejectedScreenshots,
    } = this.props;
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
                    label: 'En attente de validation',
                    to: '/user/moderation/waiting',
                    onClick: this.fetchNonModeratedScreenshots,
                  },
                  {
                    label: 'Modérée par vous',
                    to: '/user/moderation/by-you',
                    onClick: this.fetchModeratedByYouScreenshots,
                  },
                  {
                    label: 'Tous les approuvés',
                    to: '/user/moderation/approved',
                    onClick: this.fetchApprovedScreenshots,
                  },
                  {
                    label: 'Tous les rejetés',
                    to: '/user/moderation/rejected',
                    onClick: this.fetchRejectedScreenshots,
                  },
                ]}
              />
              <Route
                path="/user/moderation/waiting"
                render={() => (
                  <ScreenshotsGrid
                    canModerateScreenshots
                    screenshots={waitingScreenshots}
                    noScreenshotSentence="Tous les screens ont été modérés."
                  />
                )}
              />
              <Route
                path="/user/moderation/by-you"
                render={() => (
                  <ScreenshotsGrid
                    canModerateScreenshots
                    screenshots={byYouScreenshots}
                    noScreenshotSentence="Vous n'avez modéré aucun screen."
                  />
                )}
              />
              <Route
                path="/user/moderation/approved"
                render={() => (
                  <ScreenshotsGrid
                    canModerateScreenshots
                    screenshots={approvedScreenshots}
                    noScreenshotSentence="Aucun screen apprové pour le moment."
                  />
                )}
              />
              <Route
                path="/user/moderation/rejected"
                render={() => (
                  <ScreenshotsGrid
                    canModerateScreenshots
                    screenshots={rejectedScreenshots}
                    noScreenshotSentence="Aucun screen rejeté pour le moment."
                  />
                )}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export default connect(mapStoreToProps)(ModerationPage);
