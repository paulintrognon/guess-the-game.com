import api from './api';

export default {
  fetchScores,
  fetchUser,
  fetchScreenshotsFound,
};

async function fetchScores() {
  return api.get('/user/scores');
}

async function fetchUser() {
  return api.post('/user/get');
}

async function fetchScreenshotsFound() {
  return api.post('/user/screenshots-found');
}
