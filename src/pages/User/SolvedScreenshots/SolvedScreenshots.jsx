import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import BarTitle from '../../../components/BarTitle/BarTitle';
import ScreenshotsGrid from '../../../components/ScreenshotsGrid/ScreenshotsGrid';
import solvedScreenshotsActions from '../../../store/solvedScreenshots/solvedScreenshotsActions';
import './SolvedScreenshots.css';

function mapStoreToProps(store) {
  return {
    solvedScreenshots: store.solvedScreenshots.solvedScreenshots,
    isLoading: store.solvedScreenshots.isLoading,
    hasMore: store.solvedScreenshots.hasMore,
  };
}
class SolvedScreenshotsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: null,
    };
    this.handleLoadMore();
  }

  handleLoadMore = () => {
    const { solvedScreenshots } = this.props;
    const { searchText } = this.state;
    this.props.dispatch(
      solvedScreenshotsActions.loadUserSolvedScreenshots({
        searchText,
        limit: 6,
        offset: (solvedScreenshots && solvedScreenshots.length) || 0,
      })
    );
  };

  handleSearch = searchText => {
    this.setState({ searchText });
    this.props.dispatch(
      solvedScreenshotsActions.loadUserSolvedScreenshots({
        searchText,
        limit: 6,
        offset: 0,
      })
    );
  };

  render() {
    const { solvedScreenshots, hasMore, isLoading } = this.props;
    return (
      <section className="section">
        <Helmet title="Screenshots Résolus" />
        <div className="SolvedScreenshotsPage">
          <BarTitle onlyOnSmartphones>
            <h2>Screens Resolus</h2>
          </BarTitle>
          <ScreenshotsGrid
            screenshots={solvedScreenshots}
            noScreenshotSentence="Vous n'avez encore résolu aucun screen."
            hasMore={hasMore}
            isLoading={isLoading}
            handleLoadMore={this.handleLoadMore}
            handleSearch={this.handleSearch}
          />
        </div>
      </section>
    );
  }
}
export default connect(mapStoreToProps)(SolvedScreenshotsPage);
