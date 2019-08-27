import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import layoutReducer from './layoutReducer';
import screenshotReducer from './screenshotReducer';
import userReducer from './userReducer';
import moderationReducer from './moderationReducer';

const createRootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    layout: layoutReducer,
    screenshot: screenshotReducer,
    user: userReducer,
    moderation: moderationReducer,
  });
export default createRootReducer;
