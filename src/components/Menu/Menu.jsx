import React from 'react';
import { connect } from 'react-redux';

import './Menu.css';

function mapStoreToProps(store) {
  return {
    isMenuVisisble: store.layout.isMenuVisible,
  };
}
const Menu = ({ isMenuVisisble }) => (
  <div className={`Menu ${isMenuVisisble ? '-visisble' : '-hidden'}`}>
    Bonjour !
  </div>
);
export default connect(mapStoreToProps)(Menu);
