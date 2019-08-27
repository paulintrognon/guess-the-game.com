import notificationService from '../services/notificationService';
import userService from '../services/userService';

export default {
  loadUserData,
  loadUserSolvedScreenshots,
  loadUserAddedScreenshots,
  updateUserAction,
};

function loadUserData() {
  return async dispatch => {
    dispatch({ type: 'USER-DATA-LOADING' });
    try {
      const userData = await userService.fetchUser();
      dispatch({ type: 'USER-DATA-LOADED', payload: userData });
    } catch (err) {
      console.warn(err.message);
      dispatch({ type: 'USER-DATA-ERROR', payload: err.message });
    }
  };
}

function loadUserSolvedScreenshots() {
  return async dispatch => {
    dispatch({
      type: 'USER-SOLVED_SCREENSHOTS-LOADING',
    });
    const solvedScreenshots = await userService.fetchSolvedScreenshots();
    dispatch({
      type: 'USER-SOLVED_SCREENSHOTS-LOADED',
      payload: solvedScreenshots,
    });
  };
}

function loadUserAddedScreenshots(filters) {
  return async dispatch => {
    const addedScreenshots = await userService.fetchAddedScreenshots(filters);
    dispatch({
      type: 'USER-ADDED_SCREENSHOTS-LOADED',
      payload: addedScreenshots,
    });
  };
}

function updateUserAction(values) {
  return async dispatch => {
    dispatch({ type: 'USER-UPDATING' });
    const res = await userService.updateUser(values);
    if (res.error) {
      notificationService.create({
        slug: 'userAction-update',
        text: `Erreur lors de la mise à jour : ${res.message}`,
        type: 'error',
      });
      dispatch({ type: 'USER-UPDATED', payload: {} });
    } else {
      dispatch({
        type: 'USER-UPDATED',
        payload: values,
      });
      notificationService.create({
        slug: 'userAction-update',
        text: 'Modifié avec succès',
        type: 'success',
      });
    }
  };
}
