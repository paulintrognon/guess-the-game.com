import api from './api';

export default {
  fetchScores,
  fetchUser,
  fetchSolvedScreenshots,
  fetchAddedScreenshots,
  updateUser,
  unsubscribeFromEmailUpdates,
};

async function fetchScores() {
  return api.get('/user/scores');
}

async function fetchUser() {
  return api.post('/user/get');
}

async function fetchSolvedScreenshots() {
  return api.post('/user/solved-screenshots');
}

async function fetchAddedScreenshots(filters) {
  return api.post('/user/added-screenshots', filters);
}

async function updateUser(values) {
  return api.post('/user/update', { values });
}

async function unsubscribeFromEmailUpdates({ emailToken }) {
  return api.post('/user/unsubscribe-from-email-updates', { emailToken });
}
