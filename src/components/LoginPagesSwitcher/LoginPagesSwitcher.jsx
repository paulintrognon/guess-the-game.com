import React from 'react';
import PageSwitcher from '../PagesSwitcher/PagesSwitcher';

export default () => (
  <PageSwitcher
    links={[
      { label: 'Connexion', to: '/login' },
      { label: 'Inscription', to: '/register' },
    ]}
  />
);
