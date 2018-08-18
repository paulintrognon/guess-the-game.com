import React from 'react';
import Loading from '../../Loading/Loading';
import './Button.css';

export default ({
  loading,
  disabled,
  color = 'light',
  children,
  type = 'button',
  ...props
}) => (
  <button
    type={type}
    className={`
      FormButton
      -${color}
      ${loading ? '-loading' : ''}
      ${disabled ? '-disabled' : ''}
    `}
    disabled={disabled || loading}
    {...props}
  >
    {loading && <Loading />}
    {!loading && children}
  </button>
);
