import Noty from 'noty';
import userService from '../services/userService';

export default {
  loadUserData,
  loadUserSolvedScreenshots,
  loadUserAddedScreenshots,
  updateUserAction,
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

function updateUserAction(values) {
  return async dispatch => {
    dispatch({ type: 'USER_UPDATING' });
    const res = await userService.updateUser(values);
    if (res.error) {
      new Noty({
        text: `Erreur lors de la mise à jour : ${res.message}`,
        type: 'error',
      }).show();
      dispatch({ type: 'USER_UPDATED', payload: {} });
    } else {
      dispatch({
        type: 'USER_UPDATED',
        payload: values,
      });
      new Noty({
        text: 'Modifié avec succès',
        type: 'success',
      }).show();
    }
  };
}
