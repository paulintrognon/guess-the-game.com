import { applyMiddleware, compose, createStore } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

import reducers from './reducers';
import history from './history';

export default createStore(
  connectRouter(history)(reducers), // new root reducer with router state
  compose(
    applyMiddleware(
      routerMiddleware(history), // for dispatching history actions
      promise(),
      thunk
    )
  )
);
