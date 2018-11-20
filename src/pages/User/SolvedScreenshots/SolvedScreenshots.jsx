import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import BarTitle from '../../../components/BarTitle/BarTitle';
import ScreenshotsGrid from '../../../components/ScreenshotsGrid/ScreenshotsGrid';
import userActions from '../../../actions/userActions';
import './SolvedScreenshots.css';

function mapStoreToProps(store) {
  return {
    solvedScreenshots: store.user.solvedScreenshots || [],
  };
}
class SolvedScreenshotsPage extends React.Component {
  constructor(props) {
    super(props);
    this.props.dispatch(userActions.loadUserSolvedScreenshots());
  }

  render() {
    const { solvedScreenshots } = this.props;
    return (
      <section className="section">
        <Helmet title="Screenshots Solved" />
        <div className="SolvedScreenshotsPage">
          <BarTitle hideOnSmall>
            <h2>Screenshots Solved</h2>
          </BarTitle>
          <ScreenshotsGrid
            screenshots={solvedScreenshots}
            noScreenshotSentence="You haven't solved any screenshots yet."
          />
        </div>
      </section>
    );
  }
}
export default connect(mapStoreToProps)(SolvedScreenshotsPage);
