import React from 'react';
import Helmet from 'react-helmet';

import './Account.css';

function AccountPage() {
  return (
    <section className="section">
      <Helmet title="My account" />
      <div className="container">
        <div className="AccountPage">My account</div>
      </div>
    </section>
  );
}
export default AccountPage;
