import moderationService from '../services/moderationService';

export default {
  fetchNonModeratedScreenshots,
  fetchApprovedScreenshots,
  fetchRejectedScreenshots,
  fetchModeratedByYouScreenshots,
};

function fetchNonModeratedScreenshots() {
  return async dispatch => {
    dispatch({ type: 'MODERATION_LOADING' });
    const payload = await moderationService.fetchNonModerated();
    dispatch({
      type: 'MODERATION_WAITING_LOADED',
      payload,
    });
  };
}

function fetchApprovedScreenshots() {
  return async dispatch => {
    dispatch({ type: 'MODERATION_LOADING' });
    const payload = await moderationService.fetchApproved();
    dispatch({
      type: 'MODERATION_APPROVED_LOADED',
      payload,
    });
  };
}

function fetchRejectedScreenshots() {
  return async dispatch => {
    dispatch({ type: 'MODERATION_LOADING' });
    const payload = await moderationService.fetchRejected();
    dispatch({
      type: 'MODERATION_REJECTED_LOADED',
      payload,
    });
  };
}

function fetchModeratedByYouScreenshots() {
  return async dispatch => {
    dispatch({ type: 'MODERATION_LOADING' });
    const nonModeratedScreenshots = await moderationService.fetchModeratedByYou();
    dispatch({
      type: 'MODERATION_BY-YOU_LOADED',
      payload: nonModeratedScreenshots,
    });
  };
}
