import api from './api';

export default {
  fetchScores,
};

async function fetchScores() {
  return api.get('/user/scores');
}
