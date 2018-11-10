import React from 'react';
import Helmet from 'react-helmet';

import './Account.css';
import BarTitle from '../../../components/BarTitle/BarTitle';

const AccountPage = () => (
  <section className="section">
    <Helmet title="My account" />
    <div className="container">
      <div className="AccountPage">
        <BarTitle hideOnSmall>
          <h2>My Account</h2>
        </BarTitle>
        <div className="AccountPage_content">
          <div className="AccountPage_data">
            <div className="AccountPage_data_line">
              <p className="AccountPage_data_line_left">Username</p>
              <p className="AccountPage_data_line_right">Le Tod</p>
            </div>
            <div className="AccountPage_data_line">
              <p className="AccountPage_data_line_left">Email</p>
              <p className="AccountPage_data_line_right">tod5@hotmail.com</p>
            </div>
            <div className="AccountPage_data_line">
              <p className="AccountPage_data_line_left">Password</p>
              <p className="AccountPage_data_line_right">
                <a href="/forgot-password">reset it!</a>
              </p>
            </div>
            <hr />
            <div className="AccountPage_data_line">
              <p className="AccountPage_data_line_left">Screenshots found</p>
              <p className="AccountPage_data_line_right">27</p>
            </div>
            <div className="AccountPage_data_line">
              <p className="AccountPage_data_line_left">Screenshots posted</p>
              <p className="AccountPage_data_line_right">12</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
export default AccountPage;
