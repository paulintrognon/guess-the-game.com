import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import BarTitle from '../../../components/BarTitle/BarTitle';
import ScreenshotsGrid from '../../../components/ScreenshotsGrid/ScreenshotsGrid';
import PagesSwitcher from '../../../components/PagesSwitcher/PagesSwitcher';
import moderationActions from '../../../store/moderation/moderationActions';
import './Moderation.css';

function mapStoreToProps(store) {
  return {
    isLoading: store.moderation.isLoading,
    hasMore: store.moderation.hasMore,
    screenshots: store.moderation.screenshots,
  };
}
class ModerationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: null,
    };
    this.pages = [
      {
        label: 'En attente de validation',
        to: '/moi/moderation/en-attente',
        action: moderationActions.fetchNonModeratedScreenshots,
        noScreenshotSentence: 'Tous les screens ont été modérés.',
      },
      {
        label: 'Modérée par vous',
        to: '/moi/moderation/par-moi',
        action: moderationActions.fetchModeratedByYouScreenshots,
        noScreenshotSentence: 'Aucun screenshot modérée par vous.',
      },
      {
        label: 'Tous les approuvés',
        to: '/moi/moderation/approuve',
        action: moderationActions.fetchApprovedScreenshots,
        noScreenshotSentence: 'Aucun screenshot approuvé trouvé.',
      },
      {
        label: 'Tous les rejetés',
        to: '/moi/moderation/rejete',
        action: moderationActions.fetchRejectedScreenshots,
        noScreenshotSentence: 'Aucun screenshot rejeté trouvé.',
      },
    ];
    const page = this.pages.find(p => p.to === props.location.pathname);
    this.state.currentPage = page;
    this.handleLoadMore();
  }

  switchPage = page => () => {
    this.props.dispatch(moderationActions.reset());
    this.setState({ currentPage: page }, () => {
      this.handleLoadMore();
    });
  };

  handleLoadMore = () => {
    const { screenshots } = this.props;
    const { currentPage, searchText } = this.state;
    this.props.dispatch(
      currentPage.action({
        searchText,
        limit: 12,
        offset: (screenshots && screenshots.length) || 0,
      })
    );
  };

  handleSearch = searchText => {
    this.setState({ searchText });
    this.props.dispatch(
      this.state.currentPage.action({
        searchText,
        limit: 12,
        offset: 0,
      })
    );
  };

  render() {
    const { isLoading, hasMore, screenshots } = this.props;

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
              <div>
                <ScreenshotsGrid
                  isLoading={isLoading}
                  hasMore={hasMore}
                  canModerateScreenshots
                  screenshots={screenshots}
                  handleLoadMore={this.handleLoadMore}
                  handleSearch={this.handleSearch}
                  noScreenshotSentence={
                    this.state.currentPage.noScreenshotSentence
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export default connect(mapStoreToProps)(ModerationPage);
