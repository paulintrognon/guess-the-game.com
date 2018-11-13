import api from './api';

export default {
  fetchScores,
  fetchUser,
};

async function fetchScores() {
  return api.get('/user/scores');
}

async function fetchUser() {
  return api.post('/user/get');
}
