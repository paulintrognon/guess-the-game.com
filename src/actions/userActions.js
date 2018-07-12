import { push } from 'connected-react-router';

export default {
  login,
  logout,
};

function login(user) {
  return dispatch => {
    dispatch({ type: 'USER__LOG_IN', payload: user });
    dispatch(push('/'));
  };
}

function logout() {
  return dispatch => {
    dispatch({ type: 'USER__LOG_OUT' });
    dispatch(push('/login'));
  };
}
