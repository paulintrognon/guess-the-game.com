import React from 'react';

import './Footer.css';

export default () => (
  <footer className="Footer">
    <div className="Footer_content">
      <span className="-hideOnSmartphones">
        Réalisé par{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/paulintrognon/guess-the-game.com"
        >
          Paulin Trognon
        </a>{' '}
        -{' '}
      </span>
      Un problème ? Contactez dev@guess-the-game.com
    </div>
  </footer>
);
