import userService from '../services/userService';

export default {
  loadUserData,
  loadUserScreenshotsFound,
  loadUserScreenshotsAdded,
};

function loadUserData() {
  return async dispatch => {
    dispatch({ type: 'USER_DATA_LOADING' });
    try {
      const userData = await userService.fetchUser();
      dispatch({ type: 'USER_DATA_LOADED', payload: userData });
    } catch (err) {
      console.warn(err.message);
      dispatch({ type: 'USER_DATA_ERROR', payload: err.message });
    }
  };
}

function loadUserScreenshotsFound() {
  return async dispatch => {
    const screenshotsFound = await userService.fetchScreenshotsFound();
    dispatch({
      type: 'USER_SCREENSHOTS-FOUND_LOADED',
      payload: screenshotsFound,
    });
  };
}

function loadUserScreenshotsAdded() {
  return async dispatch => {
    const screenshotsAdded = await userService.fetchScreenshotsAdded();
    dispatch({
      type: 'USER_SCREENSHOTS-ADDED_LOADED',
      payload: screenshotsAdded,
    });
  };
}
