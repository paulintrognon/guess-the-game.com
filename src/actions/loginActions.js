import { push } from 'connected-react-router';

export default {
  login,
  logout,
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
