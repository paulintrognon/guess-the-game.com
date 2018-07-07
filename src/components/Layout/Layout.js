import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import './layout.css';

export default function Layout(props) {
  const { children } = props;

  return (
    <div className="Layout">
      <Header />
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
