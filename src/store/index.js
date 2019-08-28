import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

import createRootReducer from './reducers';
import history from './history';

export default createStore(
  createRootReducer(history), // new root reducer with router state
  compose(
    applyMiddleware(
      routerMiddleware(history), // for dispatching history actions
      promise(),
      thunk
    )
  )
);
