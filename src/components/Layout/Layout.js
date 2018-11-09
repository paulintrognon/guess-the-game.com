import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import Menu from '../Menu/Menu';
import './layout.css';

export default function Layout(props) {
  const { children } = props;

  return (
    <div className="Layout">
      <Header />
      <Menu />
      {children}
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};
