import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import BarTitle from '../../../components/BarTitle/BarTitle';
import userActions from '../../../actions/userActions';
import './ScreenshotsFound.css';

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
        <Helmet title="Screenshots Solved" />
        <div className="ScreenshotsFoundPage">
          <BarTitle hideOnSmall>
            <h2>Screenshots Solved</h2>
          </BarTitle>
          <div className="ScreenshotsFoundPage_content">
            {screenshotsFound.map(screenshotFound => (
              <Link
                key={screenshotFound.id}
                className="ScreenshotsFoundPage_item"
                to={`/shot/${screenshotFound.id}`}
              >
                <img
                  alt={screenshotFound.name}
                  src={screenshotFound.imageUrl}
                  className="ScreenshotsFoundPage_item_image"
                />
                <div className="ScreenshotsFoundPage_item_legend">
                  <p className="ScreenshotsFoundPage_item_legend_name">
                    {screenshotFound.name}{' '}
                    {screenshotFound.year ? `(${screenshotFound.year})` : null}
                  </p>
                  <p className="ScreenshotsFoundPage_item_legend_createdat">
                    Solved the {screenshotFound.createdAt.toLocaleDateString()}{' '}
                    at {screenshotFound.createdAt.toLocaleTimeString()}
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
export default connect(mapStoreToProps)(ScreenshotsFoundPage);
