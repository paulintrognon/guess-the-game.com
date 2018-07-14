import api from './api';

export default {
  checkUsernameAvailability,
  register,
  login,
};

function checkUsernameAvailability(username) {
  return api
    .post('/user/check-username-availability', { username })
    .then(res => res.data.result.isFree);
}

function register(user) {
  return api.post('/user/register', user).then(
    res => ({
      ...res.data.result,
      error: false,
    }),
    err => err.response.data
  );
}

function login(credentials) {
  return api
    .post('/user/login', credentials)
    .then(res => res.data.result, err => err.response.data);
}
