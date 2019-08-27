import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import layoutReducer from './layout/layoutReducer';
import screenshotReducer from './screenshot/screenshotReducer';
import userReducer from './user/userReducer';
import solvedScreenshotsReducer from './solvedScreenshots/solvedScreenshotsReducer';
import moderationReducer from './moderation/moderationReducer';

const createRootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    layout: layoutReducer,
    screenshot: screenshotReducer,
    user: userReducer,
    solvedScreenshots: solvedScreenshotsReducer,
    moderation: moderationReducer,
  });
export default createRootReducer;
