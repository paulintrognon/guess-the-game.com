import api from './api';

export default {
  fetchScores,
  fetchUser,
  fetchSolvedScreenshots,
  fetchAddedScreenshots,
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

async function fetchAddedScreenshots() {
  return api.post('/user/added-screenshots');
}
