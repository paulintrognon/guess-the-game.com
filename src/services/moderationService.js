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

function fetchNonModerated(params) {
  return api.post('/moderation/non-moderated', params);
}

function fetchApproved(params) {
  return api.post('/moderation/approved', params);
}

function fetchRejected(params) {
  return api.post('/moderation/rejected', params);
}

function fetchModeratedByYou(params) {
  return api.post('/moderation/moderated-by-you', params);
}

function moderate({ screenshotId, newApprovalStatus, refusalReason }) {
  return api.post('/moderation/moderate', {
    screenshotId,
    newApprovalStatus,
    refusalReason,
  });
}
