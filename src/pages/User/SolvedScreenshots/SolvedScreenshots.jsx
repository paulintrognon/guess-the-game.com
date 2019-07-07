import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import BarTitle from '../../../components/BarTitle/BarTitle';
import Loading from '../../../components/Loading/Loading';
import ScreenshotsGrid from '../../../components/ScreenshotsGrid/ScreenshotsGrid';
import userActions from '../../../actions/userActions';
import './SolvedScreenshots.css';

function mapStoreToProps(store) {
  return {
    solvedScreenshots: store.user.solvedScreenshots,
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
        <Helmet title="Screenshots Résolus" />
        <div className="SolvedScreenshotsPage">
          <BarTitle onlyOnSmartphones>
            <h2>Screens Resolus</h2>
          </BarTitle>
          {solvedScreenshots === null ? (
            <p style={{ textAlign: 'center' }}>
              <Loading />
            </p>
          ) : (
            <ScreenshotsGrid
              screenshots={solvedScreenshots}
              noScreenshotSentence="Vous n'avez encore résolu aucun screen."
            />
          )}
        </div>
      </section>
    );
  }
}
export default connect(mapStoreToProps)(SolvedScreenshotsPage);
