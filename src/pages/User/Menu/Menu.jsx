import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import layoutActions from '../../../actions/layoutActions';

import './Menu.css';

function mapStoreToProps(store) {
  return {
    isMenuVisisble: store.layout.isMenuVisible,
  };
}
const Menu = ({ isMenuVisisble, dispatch }) => (
  <div className={`Menu ${isMenuVisisble ? '-visisble' : '-hidden'}`}>
    <button
      className="Menu_closeButton Menu_item"
      onClick={() => dispatch(layoutActions.toggleMenuAction())}
    >
      Close
    </button>
    <Link
      className="Menu_item"
      to="/user/account"
      onClick={() => dispatch(layoutActions.toggleMenuAction())}
    >
      Account
    </Link>
    <Link
      className="Menu_item"
      to="/user/moderation"
      onClick={() => dispatch(layoutActions.toggleMenuAction())}
    >
      Moderation
    </Link>
  </div>
);
export default connect(mapStoreToProps)(Menu);
