import React from 'react';

import './maintenance.css';

export default () => (
  <div className="MaintenancePage">
    <h1 className="MaintenancePage-title">
      <span className="MaintenancePage-title-gtg">Guess The Game!</span> est en
      maintenance.
    </h1>
    <p className="MaintenancePage-text">
      Veuillez revenir plus tard, le jeu site sera de retour dans quelques
      heures...
    </p>
    <p>
      <img
        className="MaintenancePage-img"
        src="https://i.giphy.com/media/WVVEAArznG71C/giphy.webp"
        alt="Dacing mario"
      />
    </p>
  </div>
);
