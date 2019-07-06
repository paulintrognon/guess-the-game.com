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
    isLoading: store.moderation.isLoading,
    waitingScreenshots: store.moderation.waitingScreenshots,
    byYouScreenshots: store.moderation.byYouScreenshots,
    approvedScreenshots: store.moderation.approvedScreenshots,
    rejectedScreenshots: store.moderation.rejectedScreenshots,
  };
}
class ModerationPage extends React.Component {
  constructor(props) {
    super(props);
    this.pages = [
      {
        label: 'En attente de validation',
        to: '/moi/moderation/en-attente',
        action: moderationActions.fetchNonModeratedScreenshots(),
      },
      {
        label: 'Modérée par vous',
        to: '/moi/moderation/par-moi',
        action: moderationActions.fetchModeratedByYouScreenshots(),
      },
      {
        label: 'Tous les approuvés',
        to: '/moi/moderation/approuve',
        action: moderationActions.fetchApprovedScreenshots(),
      },
      {
        label: 'Tous les rejetés',
        to: '/moi/moderation/rejete',
        action: moderationActions.fetchRejectedScreenshots(),
      },
    ];
    const page = this.pages.find(page => {
      return page.to === props.location.pathname;
    });
    this.props.dispatch(page.action);
  }

  switchPage = (page) => () => {
    if ((page.to === '/moi/moderation/en-attente' && this.props.waitingScreenshots.length > 0)
      || (page.to === '/moi/moderation/par-moi' && this.props.byYouScreenshots.length > 0)
      || (page.to === '/moi/moderation/approuve' && this.props.approvedScreenshots.length > 0)
      || (page.to === '/moi/moderation/rejete' && this.props.rejectedScreenshots.length > 0)
      ) {
      return;
    }
    this.props.dispatch(page.action);
  };

  render() {
    const {
      isLoading,
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
                links={this.pages.map(page => ({
                  ...page,
                  onClick: this.switchPage(page),
                }))}
              />
              {
                isLoading ? (
                  <p>Chargement...</p>
                ) : (
                  <div>
                    <Route
                      path="/moi/moderation/en-attente"
                      render={() => (
                        <ScreenshotsGrid
                          canModerateScreenshots
                          screenshots={waitingScreenshots}
                          noScreenshotSentence="Tous les screens ont été modérés."
                        />
                      )}
                    />
                    <Route
                      path="/moi/moderation/par-moi"
                      render={() => (
                        <ScreenshotsGrid
                          canModerateScreenshots
                          screenshots={byYouScreenshots}
                          noScreenshotSentence="Vous n'avez modéré aucun screen."
                        />
                      )}
                    />
                    <Route
                      path="/moi/moderation/approuve"
                      render={() => (
                        <ScreenshotsGrid
                          canModerateScreenshots
                          screenshots={approvedScreenshots}
                          noScreenshotSentence="Aucun screen apprové pour le moment."
                        />
                      )}
                    />
                    <Route
                      path="/moi/moderation/rejete"
                      render={() => (
                        <ScreenshotsGrid
                          canModerateScreenshots
                          screenshots={rejectedScreenshots}
                          noScreenshotSentence="Aucun screen rejeté pour le moment."
                        />
                      )}
                    />
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export default connect(mapStoreToProps)(ModerationPage);
