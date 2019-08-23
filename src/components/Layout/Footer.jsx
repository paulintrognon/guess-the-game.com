import React from 'react';

import './Footer.css';

export default () => (
  <footer className="Footer">
    <div className="Footer_content">
      <p>Guess The Game, jeu réalisé par lazy_ogre</p>
      <p>
        Un problème<span className="-hideOnSmartphones">, une suggestion</span>{' '}
        ? Email&nbsp;:{' '}
        <span className="Footer_content_link">dev@guess-the-game.com</span> ·{' '}
        <a
          className="Footer_content_link"
          href="https://discord.gg/jW25Q67"
          target="_blank"
          rel="noopener noreferrer"
        >
          Discord
        </a>{' '}
        ·{' '}
        <a
          className="Footer_content_link"
          href="https://github.com/paulintrognon/guess-the-game.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Code source
        </a>
      </p>
    </div>
  </footer>
);
