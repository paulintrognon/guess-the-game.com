import api from './api';

export default {
  checkUsernameAvailability,
  register,
  login,
  requestNewPassword,
  changePassword,
};

function checkUsernameAvailability(username) {
  return api
    .post('/user/check-username-availability', { username })
    .then(res => res.isFree);
}

function register(user) {
  return api.post('/user/register', user);
}

function login(credentials) {
  return api.post('/user/login', credentials);
}

function requestNewPassword({ email }) {
  return api.post('/user/request-password', { email });
}

function changePassword({ password, token }) {
  return api.post('/user/new-password', { password, token });
}
