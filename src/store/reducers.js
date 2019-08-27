import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import layoutReducer from './layout/layoutReducer';
import screenshotReducer from './screenshot/screenshotReducer';
import userReducer from './user/userReducer';
import moderationReducer from './moderation/moderationReducer';

const createRootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    layout: layoutReducer,
    screenshot: screenshotReducer,
    user: userReducer,
    moderation: moderationReducer,
  });
export default createRootReducer;
