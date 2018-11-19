import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import BarTitle from '../../../components/BarTitle/BarTitle';
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
          <div className="SolvedScreenshotsPage_content">
            {solvedScreenshots.map(solvedScreenshot => (
              <Link
                key={solvedScreenshot.id}
                className="SolvedScreenshotsPage_item"
                to={`/shot/${solvedScreenshot.id}`}
              >
                <div
                  style={{
                    backgroundImage: `url(${solvedScreenshot.imageUrl})`,
                  }}
                  className="SolvedScreenshotsPage_item_image"
                />
                <div className="SolvedScreenshotsPage_item_legend">
                  <p className="SolvedScreenshotsPage_item_legend_name">
                    {solvedScreenshot.name}{' '}
                    {solvedScreenshot.year
                      ? `(${solvedScreenshot.year})`
                      : null}
                  </p>
                  <p className="SolvedScreenshotsPage_item_legend_createdat">
                    Solved the {solvedScreenshot.createdAt.toLocaleDateString()}{' '}
                    at {solvedScreenshot.createdAt.toLocaleTimeString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }
}
export default connect(mapStoreToProps)(SolvedScreenshotsPage);
