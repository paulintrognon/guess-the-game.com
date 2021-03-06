import notificationService from '../../services/notificationService';
import userService from '../../services/userService';

export default {
  loadUserData,
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
