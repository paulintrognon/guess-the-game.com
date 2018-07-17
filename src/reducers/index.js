import { combineReducers } from 'redux';

import userReducer from './userReducer';
import screenshotReducer from './screenshotReducer';

export default combineReducers({
  user: userReducer,
  screenshot: screenshotReducer,
});
