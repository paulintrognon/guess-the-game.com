import userService from '../services/userService';

export default {
  loadUserData,
  loadUserSolvedScreenshots,
  loadUserAddedScreenshots,
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

function loadUserSolvedScreenshots() {
  return async dispatch => {
    const solvedScreenshots = await userService.fetchSolvedScreenshots();
    dispatch({
      type: 'USER_SCREENSHOTS-FOUND_LOADED',
      payload: solvedScreenshots,
    });
  };
}

function loadUserAddedScreenshots() {
  return async dispatch => {
    const addedScreenshots = await userService.fetchAddedScreenshots();
    dispatch({
      type: 'USER_SCREENSHOTS-ADDED_LOADED',
      payload: addedScreenshots,
    });
  };
}
