import userService from '../services/userService';

export default {
  register,
};

function register(user) {
  return dispatch => {
    userService.register(user).then(res => {
      dispatch({ type: 'USER__LOG_IN', payload: res });
    });
  };
}
