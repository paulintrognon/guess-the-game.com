import React from 'react';
import Helmet from 'react-helmet';

import './Moderation.css';
import BarTitle from '../../../components/BarTitle/BarTitle';

function ModerationPage() {
  return (
    <section className="section">
      <Helmet title="Moderation" />
      <div className="container">
        <div className="ModerationPage">
          <BarTitle hideOnSmall>
            <h2>Moderation</h2>
          </BarTitle>
        </div>
      </div>
    </section>
  );
}
export default ModerationPage;
