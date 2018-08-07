import api from './api';

export default {
  checkUsernameAvailability,
  register,
  login,
  fetchScores,
};

function checkUsernameAvailability(username) {
  return api
    .post('/user/check-username-availability', { username })
    .then(res => res.isFree);
}

function register(user) {
  return api.post('/user/register', user).then(res => ({
    ...res,
    error: false,
  }));
}

function login(credentials) {
  return api.post('/user/login', credentials);
}

async function fetchScores() {
  return api.get('/user/scores');
}
