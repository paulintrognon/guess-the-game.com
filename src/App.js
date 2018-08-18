import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router';
import { Provider } from 'react-redux';
import store from './store';
import history from './history';

import './App.css';

import Layout from './components/Layout/Layout';
import Homepage from './pages/Hompage/Hompage';
import LoginPage from './pages/login/Login/Login';
import RegisterPage from './pages/login/Register/Register';
import ForgotPasswordPage from './pages/login/ForgotPassword/ForgotPassword';
import NewPasswordPage from './pages/login/NewPassword/NewPassword';
import AddScreenshotPage from './pages/AddScreenshot/AddScreenshot';
import ScreenshotPage from './pages/Screenshot/Screenshot';
import TheEnd from './pages/TheEnd/TheEnd';
import NotFound from './pages/NotFound/NotFound';

export default () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Layout>
        <Switch>
          <Route path="/" exact component={Homepage} />
          <Route path="/shot/:id" exact component={ScreenshotPage} />
          <Route path="/login" exact component={LoginPage} />
          <Route path="/register" exact component={RegisterPage} />
          <Route path="/forgot-password" exact component={ForgotPasswordPage} />
          <Route
            path="/new-password/:token"
            exact
            component={NewPasswordPage}
          />
          <Route path="/add-screenshot" exact component={AddScreenshotPage} />
          <Route path="/the-end" exact component={TheEnd} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </ConnectedRouter>
  </Provider>
);
