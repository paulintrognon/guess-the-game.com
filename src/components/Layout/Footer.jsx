import React from 'react';

import './Footer.css';

export default () => (
  <footer className="Footer">
    <div className="Footer_content">
      Réalisé par{' '}
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/paulintrognon/guess-the-game.com"
      >
        Paulin Trognon
      </a>{' '}
      - Un problème ? Contactez dev@guess-the-game.com
    </div>
  </footer>
);
