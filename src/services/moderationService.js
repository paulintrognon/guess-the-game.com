import api from './api';

export default {
  fetchNonModerated,
  fetchApproved,
  fetchRejected,
  fetchModeratedByYou,
  moderate,
};

function fetchNonModerated() {
  return api.post('/moderation/non-moderated');
}

function fetchApproved() {
  return api.post('/moderation/approved');
}

function fetchRejected() {
  return api.post('/moderation/rejected');
}

function fetchModeratedByYou() {
  return api.post('/moderation/moderated-by-you');
}

function moderate({ screenshotId, newApprovalStatus }) {
  return api.post('/moderation/moderate', {
    screenshotId,
    newApprovalStatus,
  });
}
