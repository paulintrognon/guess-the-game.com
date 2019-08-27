import moderationService from '../services/moderationService';

export default {
  fetchNonModeratedScreenshots,
  fetchApprovedScreenshots,
  fetchRejectedScreenshots,
  fetchModeratedByYouScreenshots,
};

function fetchNonModeratedScreenshots() {
  return async dispatch => {
    dispatch({ type: 'MODERATION-LOADING' });
    const payload = await moderationService.fetchNonModerated();
    dispatch({
      type: 'MODERATION-WAITING-LOADED',
      payload,
    });
  };
}

function fetchApprovedScreenshots() {
  return async dispatch => {
    dispatch({ type: 'MODERATION-LOADING' });
    const payload = await moderationService.fetchApproved();
    dispatch({
      type: 'MODERATION-APPROVED-LOADED',
      payload,
    });
  };
}

function fetchRejectedScreenshots() {
  return async dispatch => {
    dispatch({ type: 'MODERATION-LOADING' });
    const payload = await moderationService.fetchRejected();
    dispatch({
      type: 'MODERATION-REJECTED-LOADED',
      payload,
    });
  };
}

function fetchModeratedByYouScreenshots() {
  return async dispatch => {
    dispatch({ type: 'MODERATION-LOADING' });
    const nonModeratedScreenshots = await moderationService.fetchModeratedByYou();
    dispatch({
      type: 'MODERATION-BY_YOU-LOADED',
      payload: nonModeratedScreenshots,
    });
  };
}
