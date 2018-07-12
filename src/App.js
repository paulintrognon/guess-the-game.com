import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router';
import { Provider } from 'react-redux';

import store from './store';
import history from './history';

import Layout from './components/Layout/Layout';
import Homepage from './pages/Hompage/Hompage';
import LoginPage from './pages/Login/Login';
import RegisterPage from './pages/Register/Register';
import NotFound from './pages/NotFound/NotFound';

import 'bulma/css/bulma.css';
import './App.css';

export default () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Layout>
        <Switch>
          <Route path="/" exact component={Homepage} />
          <Route path="/login" exact component={LoginPage} />
          <Route path="/register" exact component={RegisterPage} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </ConnectedRouter>
  </Provider>
);
