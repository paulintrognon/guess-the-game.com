import { combineReducers } from 'redux';

import layoutReducer from './layoutReducer';
import screenshotReducer from './screenshotReducer';
import userReducer from './userReducer';
import moderationReducer from './moderationReducer';

export default combineReducers({
  layout: layoutReducer,
  screenshot: screenshotReducer,
  user: userReducer,
  moderation: moderationReducer,
});
