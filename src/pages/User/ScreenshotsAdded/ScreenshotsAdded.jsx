import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import BarTitle from '../../../components/BarTitle/BarTitle';
import userActions from '../../../actions/userActions';
import './ScreenshotsAdded.css';

function mapStoreToProps(store) {
  return {
    screenshotsAdded: store.user.screenshotsAdded || [],
  };
}
class ScreenshotsAddedPage extends React.Component {
  constructor(props) {
    super(props);
    this.props.dispatch(userActions.loadUserScreenshotsAdded());
  }

  render() {
    const { screenshotsAdded } = this.props;
    return (
      <section className="section">
        <Helmet title="Screenshots Solved" />
        <div className="ScreenshotsAddedPage">
          <BarTitle hideOnSmall>
            <h2>Screenshots Solved</h2>
          </BarTitle>
          <div className="ScreenshotsAddedPage_content">
            <Link className="ScreenshotsAddedPage_item" to="/add-screenshot">
              <div className="ScreenshotsAddedPage_item_add">
                <svg
                  className="ScreenshotsAddedPage_item_add_icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z" />
                </svg>
              </div>
              <div className="ScreenshotsAddedPage_item_legend">
                <p>Add new shot</p>
              </div>
            </Link>
            {screenshotsAdded.map(screenshotAdded => (
              <Link
                key={screenshotAdded.id}
                className="ScreenshotsAddedPage_item"
                to={`/shot/${screenshotAdded.id}`}
              >
                <img
                  alt={screenshotAdded.name}
                  src={screenshotAdded.imageUrl}
                  className="ScreenshotsAddedPage_item_image"
                />
                <div className="ScreenshotsAddedPage_item_legend">
                  <p className="ScreenshotsAddedPage_item_legend_name">
                    {screenshotAdded.name}{' '}
                    {screenshotAdded.year ? `(${screenshotAdded.year})` : null}
                  </p>
                  <p className="ScreenshotsAddedPage_item_legend_createdat">
                    Added the {screenshotAdded.createdAt.toLocaleDateString()}{' '}
                    at {screenshotAdded.createdAt.toLocaleTimeString()}
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
export default connect(mapStoreToProps)(ScreenshotsAddedPage);
