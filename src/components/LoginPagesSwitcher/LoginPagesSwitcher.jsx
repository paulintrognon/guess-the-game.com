import React from 'react';
import PageSwitcher from '../PagesSwitcher/PagesSwitcher';

export default () => (
  <PageSwitcher
    links={[
      { label: 'Inscription', to: '/inscription' },
      { label: 'Connexion', to: '/connexion' },
    ]}
  />
);
