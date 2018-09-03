import React from 'react';
import './Input.css';

export default ({
  id,
  label,
  labelExtraText,
  ok,
  error,
  children,
  ...props
}) => (
  <label
    htmlFor={id}
    className={`FormInput ${ok ? '-ok' : ''} ${error ? '-error' : ''}`}
  >
    <p className="FormInput_label">
      {label}
      {labelExtraText && (
        <span className="FormInput_label_extra"> {labelExtraText}</span>
      )}
    </p>
    <input id={id} className="FormInput_input" {...props} />
    {children}
    {ok && ok !== true && <p className="FormInput_output -ok">{ok}</p>}
    {error && <p className="FormInput_output -error">{error}</p>}
  </label>
);
