import React from 'react';
import './NotFound.css';

export default () => (
  <section className="NotFoundPage">
    <h2 className="NotFoundPage_title">404</h2>
    <p className="NotFoundPage_text">Désolé, cette page n&apos;éxiste pas.</p>
    <p>
      <img
        className="NotFoundPage_img"
        src="https://i.giphy.com/media/WVVEAArznG71C/giphy.webp"
        alt="Page non trouvée"
      />
    </p>
  </section>
);
