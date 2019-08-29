import moderationService from '../../services/moderationService';

export default {
  reset,
  fetchNonModeratedScreenshots,
  fetchApprovedScreenshots,
  fetchRejectedScreenshots,
  fetchModeratedByYouScreenshots,
};

function reset() {
  return { type: 'MODERATION-RESET' };
}

function fetchNonModeratedScreenshots(params) {
  return async dispatch => {
    dispatch({ type: 'MODERATION-LOADING' });
    const payload = await moderationService.fetchNonModerated(params);
    dispatch({
      type: 'MODERATION-LOADED',
      payload,
    });
  };
}

function fetchApprovedScreenshots(params) {
  return async dispatch => {
    dispatch({ type: 'MODERATION-LOADING' });
    const payload = await moderationService.fetchApproved(params);
    dispatch({
      type: 'MODERATION-LOADED',
      payload,
    });
  };
}

function fetchRejectedScreenshots(params) {
  return async dispatch => {
    dispatch({ type: 'MODERATION-LOADING' });
    const payload = await moderationService.fetchRejected(params);
    dispatch({
      type: 'MODERATION-LOADED',
      payload,
    });
  };
}

function fetchModeratedByYouScreenshots(params) {
  return async dispatch => {
    dispatch({ type: 'MODERATION-LOADING' });
    const nonModeratedScreenshots = await moderationService.fetchModeratedByYou(
      params
    );
    dispatch({
      type: 'MODERATION-LOADED',
      payload: nonModeratedScreenshots,
    });
  };
}
