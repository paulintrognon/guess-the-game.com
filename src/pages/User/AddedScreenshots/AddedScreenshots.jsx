import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import BarTitle from '../../../components/BarTitle/BarTitle';
import ScreenshotsGrid from '../../../components/ScreenshotsGrid/ScreenshotsGrid';
import userActions from '../../../actions/userActions';
import './AddedScreenshots.css';

function mapStoreToProps(store) {
  return {
    addedScreenshots: store.user.addedScreenshots || [],
  };
}
class AddedScreenshotsPage extends React.Component {
  constructor(props) {
    super(props);
    this.props.dispatch(userActions.loadUserAddedScreenshots());
  }

  render() {
    const { addedScreenshots } = this.props;
    return (
      <section className="section">
        <Helmet title="Screenshots Ajoutés" />
        <div className="AddedScreenshotsPage">
          <BarTitle onlyOnSmartphones>
            <h2>Screenshots Ajoutes</h2>
          </BarTitle>
          <ScreenshotsGrid screenshots={addedScreenshots}>
            <Link className="ScreenshotsGrid_item" to="/ajouter-un-screenshot">
              <div className="AddedScreenshotsPage_item_add">
                <svg
                  className="AddedScreenshotsPage_item_add_icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z" />
                </svg>
              </div>
              <div className="AddedScreenshotsPage_item_legend">
                <p>Ajouter un nouveau</p>
              </div>
            </Link>
          </ScreenshotsGrid>
        </div>
      </section>
    );
  }
}
export default connect(mapStoreToProps)(AddedScreenshotsPage);
