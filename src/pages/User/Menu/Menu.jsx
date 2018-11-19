import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import userActions from '../../../actions/userActions';
import layoutActions from '../../../actions/layoutActions';

import './Menu.css';

function mapStoreToProps(store) {
  return {
    isMenuVisisble: store.layout.isMenuVisible,
    userData: store.user.userData || {},
    canModerateScreenshots: store.user.canModerateScreenshots,
  };
}
class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.props.dispatch(userActions.loadUserData());
  }

  render() {
    const { isMenuVisisble, canModerateScreenshots, dispatch } = this.props;
    const { solvedScreenshots, addedScreenshots } = this.props.userData;
    return (
      <div className={`Menu ${isMenuVisisble ? '-visisble' : '-hidden'}`}>
        <button
          className="Menu_closeButton Menu_item"
          onClick={() => dispatch(layoutActions.toggleMenuAction())}
        >
          Close
        </button>
        <MenuItem to="/user/account" dispatch={dispatch}>
          <svg
            className="Menu_item_icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-3.123 0-5.914-1.441-7.749-3.69.259-.588.783-.995 1.867-1.246 2.244-.518 4.459-.981 3.393-2.945-3.155-5.82-.899-9.119 2.489-9.119 3.322 0 5.634 3.177 2.489 9.119-1.035 1.952 1.1 2.416 3.393 2.945 1.082.25 1.61.655 1.871 1.241-1.836 2.253-4.628 3.695-7.753 3.695z" />
          </svg>
          My Account
        </MenuItem>
        {canModerateScreenshots ? (
          <MenuItem to="/user/moderation" dispatch={dispatch} className="-red">
            <svg
              className="Menu_item_icon"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.326 18.266l-4.326-2.314-4.326 2.313.863-4.829-3.537-3.399 4.86-.671 2.14-4.415 2.14 4.415 4.86.671-3.537 3.4.863 4.829z" />
            </svg>
            Moderation
          </MenuItem>
        ) : null}
        <MenuItem to="/user/solved" dispatch={dispatch}>
          <svg
            className="Menu_item_icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.25 17.292l-4.5-4.364 1.857-1.858 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.643z" />
          </svg>{' '}
          {solvedScreenshots} Solved Screenshots
        </MenuItem>
        <MenuItem to="/user/added" dispatch={dispatch}>
          <svg
            className="Menu_item_icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z" />
          </svg>
          {addedScreenshots} Added Screenshots
        </MenuItem>
      </div>
    );
  }
}
export default connect(mapStoreToProps)(Menu);

function MenuItem({ to, dispatch, children, className }) {
  return (
    <Link
      key={to}
      className={`Menu_item ${className} ${
        window.location.pathname === to ? '-active' : ''
      }`}
      to={to}
      onClick={() => dispatch(layoutActions.toggleMenuAction())}
    >
      {children}
    </Link>
  );
}
