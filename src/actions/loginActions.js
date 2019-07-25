import Noty from 'noty';
import { push } from 'connected-react-router';

export default {
  login,
  logout,
  needToRegister,
};

function login(user) {
  return dispatch => {
    dispatch({ type: 'USER_LOG_IN', payload: user });
    dispatch(push('/'));
  };
}

function logout() {
  return dispatch => {
    dispatch({ type: 'USER_LOG_OUT' });
    dispatch(push('/connexion'));
  };
}

function needToRegister() {
  return dispatch => {
    new Noty({
      text: 'Vous devez être inscrit pour accéder à cette partie du site.',
      type: 'error',
    }).show();
    dispatch(push('/inscription'));
  };
}
