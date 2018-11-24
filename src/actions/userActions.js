import userService from '../services/userService';
import screenshotsService from '../services/screenshotService';
import moderationService from '../services/moderationService';

export default {
  loadUserData,
  loadUserSolvedScreenshots,
  loadUserAddedScreenshots,
  loadNonModeratedScreenshots,
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
      type: 'USER_SOLVED-SCREENSHOTS_LOADED',
      payload: solvedScreenshots,
    });
  };
}

function loadUserAddedScreenshots() {
  return async dispatch => {
    const addedScreenshots = await userService.fetchAddedScreenshots();
    dispatch({
      type: 'USER_ADDED-SCREENSHOTS_LOADED',
      payload: addedScreenshots,
    });
  };
}

function loadNonModeratedScreenshots() {
  return async dispatch => {
    const nonModeratedScreenshots = await moderationService.getNonModerated();
    dispatch({
      type: 'USER_NON-MODERATED-SCREENSHOTS_LOADED',
      payload: nonModeratedScreenshots,
    });
  };
}
