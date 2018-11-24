import api from './api';

export default {
  getNonModerated,
  moderate,
};

function getNonModerated() {
  return api.post('/moderation/non-moderated');
}

function moderate({ screenshotId, approve }) {
  return api.post('/moderation/moderate', {
    screenshotId,
    approve,
  });
}
