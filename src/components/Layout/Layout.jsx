import React from 'react';
import PropTypes from 'prop-types';

import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Header from './Header';
import Footer from './Footer';
import './layout.css';

export default function Layout(props) {
  const { children } = props;

  return (
    <div className="Layout">
      <Header />
      <ErrorBoundary>{children}</ErrorBoundary>
      <Footer />
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};
