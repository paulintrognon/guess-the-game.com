import React from 'react';
import PageSwitcher from '../PagesSwitcher/PagesSwitcher';
import './LoginPagesSwitcher.css';

export default () => (
  <PageSwitcher
    className="LoginPageSwitcher"
    links={[
      { label: 'Inscription', to: '/inscription' },
      { label: 'Connexion', to: '/connexion' },
    ]}
  />
);
