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
const Menu = ({ isMenuVisisble, dispatch, match }) => (
  <div className={`Menu ${isMenuVisisble ? '-visisble' : '-hidden'}`}>
    <button
      className="Menu_closeButton Menu_item"
      onClick={() => dispatch(layoutActions.toggleMenuAction())}
    >
      Close
    </button>
    <MenuItem to="/user/account" dispatch={dispatch}>
      {/* <svg
        className="Menu_item_icon"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M20.822 18.096c-3.439-.794-6.64-1.49-5.09-4.418 4.72-8.912 1.251-13.678-3.732-13.678-5.082 0-8.464 4.949-3.732 13.678 1.597 2.945-1.725 3.641-5.09 4.418-3.073.71-3.188 2.236-3.178 4.904l.004 1h23.99l.004-.969c.012-2.688-.092-4.222-3.176-4.935z" />
      </svg> */}
      <svg
        className="Menu_item_icon"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-3.123 0-5.914-1.441-7.749-3.69.259-.588.783-.995 1.867-1.246 2.244-.518 4.459-.981 3.393-2.945-3.155-5.82-.899-9.119 2.489-9.119 3.322 0 5.634 3.177 2.489 9.119-1.035 1.952 1.1 2.416 3.393 2.945 1.082.25 1.61.655 1.871 1.241-1.836 2.253-4.628 3.695-7.753 3.695z" />
      </svg>
      Account
    </MenuItem>
    <MenuItem to="/user/moderation" dispatch={dispatch}>
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
  </div>
);
export default connect(mapStoreToProps)(Menu);

function MenuItem({ to, dispatch, children }) {
  return (
    <Link
      key={to}
      className={`Menu_item ${
        window.location.pathname === to ? '-active' : ''
      }`}
      to={to}
      onClick={() => dispatch(layoutActions.toggleMenuAction())}
    >
      {children}
    </Link>
  );
}
