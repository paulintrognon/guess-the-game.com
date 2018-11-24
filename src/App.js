import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import store from './store';
import history from './history';

import './App.css';

import Layout from './components/Layout/Layout';

// Basic components
import Homepage from './pages/Hompage/Hompage';
import EditScreenshotPage from './pages/EditScreenshot/EditScreenshot';
import ScreenshotPage from './pages/Screenshot/Screenshot';
import RankingPage from './pages/Ranking/Ranking';
import TheEnd from './pages/TheEnd/TheEnd';
import NotFound from './pages/NotFound/NotFound';

// login components
import LoginPage from './pages/login/Login/Login';
import RegisterPage from './pages/login/Register/Register';
import ForgotPasswordPage from './pages/login/ForgotPassword/ForgotPassword';
import NewPasswordPage from './pages/login/NewPassword/NewPassword';

// User components
import UserPages from './pages/User/User';

export default () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Layout>
        <Helmet
          defaultTitle="Guess The Game!"
          titleTemplate="%s - Guess The Game!"
        >
          <link rel="canonical" href="https://guess-the-game.com/" />
          <meta charSet="utf-8" />
          <meta
            name="description"
            content="Guess games from screenshots, post your own screenshots, and show off your gaming knowledge!"
          />
        </Helmet>
        <Switch>
          <Route path="/" exact component={Homepage} />
          <Route path="/shot/:id" exact component={ScreenshotPage} />
          <Route path="/ranking" exact component={RankingPage} />
          <Route path="/login" exact component={LoginPage} />
          <Route path="/register" exact component={RegisterPage} />
          <Route path="/forgot-password" exact component={ForgotPasswordPage} />
          <Route
            path="/new-password/:token"
            exact
            component={NewPasswordPage}
          />
          <Route path="/add-screenshot" exact component={EditScreenshotPage} />
          <Route path="/edit/:id" exact component={EditScreenshotPage} />
          <Route path="/the-end" exact component={TheEnd} />

          <Route path="/user" component={UserPages} />

          <Route component={NotFound} />
        </Switch>
      </Layout>
    </ConnectedRouter>
  </Provider>
);
