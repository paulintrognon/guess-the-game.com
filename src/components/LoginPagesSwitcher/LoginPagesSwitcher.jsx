import React from 'react';
import PageSwitcher from '../PagesSwitcher/PagesSwitcher';

export default () => (
  <PageSwitcher
    links={[
      { label: 'Login', to: '/login' },
      { label: 'Register', to: '/register' },
    ]}
  />
);
