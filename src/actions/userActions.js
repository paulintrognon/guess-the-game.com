import userService from '../services/userService';

export default {
  loadUserData,
  loadUserScreenshotsFound,
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
