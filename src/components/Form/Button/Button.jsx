import React from 'react';
import Loading from '../../Loading/Loading';
import './Button.css';

export default ({
  loading,
  disabled,
  color = 'light',
  children,
  type = 'button',
  className,
  ...props
}) => (
  <button
    type={type}
    className={`
      FormButton
      -${color}
      ${loading ? '-loading' : ''}
      ${disabled ? '-disabled' : ''}
      ${className}
    `}
    disabled={disabled || loading}
    {...props}
  >
    {loading && <Loading />}
    {!loading && children}
  </button>
);
