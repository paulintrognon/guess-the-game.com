import axios from 'axios';
import config from 'config'; // eslint-disable-line import/no-extraneous-dependencies

export default {
  checkUsernameAvailability,
  register,
};

const api = axios.create({
  baseURL: `${config.apiUrl}/user`,
});

function checkUsernameAvailability(username) {
  return api
    .post('/check-username-availability', { username })
    .then(res => res.data.result.isFree);
}

function register(user) {
  return api.post('/register', user).then(
    res => ({
      ...res.data.result,
      error: false,
    }),
    err => err.response.data
  );
}
