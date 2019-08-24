import api from './api';

export default {
  fetchScreenshot,
  fetchNonModerated,
  fetchApproved,
  fetchRejected,
  fetchModeratedByYou,
  moderate,
};

function fetchScreenshot(id) {
  return api.post(`/moderation/get-screenshot/${id}`);
}

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

function moderate({ screenshotId, newApprovalStatus, refusalReason }) {
  return api.post('/moderation/moderate', {
    screenshotId,
    newApprovalStatus,
    refusalReason,
  });
}
