import { push } from 'connected-react-router';
import screenshotService from '../services/screenshotService';

export default {
  goToScreenshot,
  loadScreenshot,
  getUnsolvedScreenshot,
  tryProposal,
  resetGuess,
  removeOwnScreenshot,
};

function goToScreenshot(screenshot) {
  return dispatch => {
    dispatch(push(`/screen/${screenshot.id}`));
  };
}

function loadScreenshot(screenshotId, navigate = false) {
  return async dispatch => {
    dispatch({ type: 'SCREENSHOT_LOADING' });
    const screenshot = await screenshotService.getFromId(screenshotId);
    dispatch({ type: 'SCREENSHOT_LOAD', payload: screenshot });
    if (navigate) {
      dispatch(push(`/screen/${screenshot.id}`));
    }
    const prevAndNext = await screenshotService.getPrevAndNext({
      screenshotId,
    });
    dispatch({ type: 'SCREENSHOT_LOAD_PREV_AND_NEXT', payload: prevAndNext });
  };
}

function getUnsolvedScreenshot(exclude) {
  return dispatch => {
    dispatch({ type: 'SCREENSHOT_LOADING' });
    screenshotService.getUnsolved(exclude).then(res => {
      if (res.error && res.code === 'UNSOLVED_SCREENSHOT_NOT_FOUND') {
        dispatch(push('/la-fin'));
      } else {
        dispatch(push(`/screen/${res.id}`));
        dispatch({ type: 'SCREENSHOT_LOAD', payload: res });
      }
    });
  };
}

function tryProposal(screenshotId, proposition) {
  return dispatch => {
    dispatch({ type: 'SCREENSHOT_PROPOSAL_TRY' });
    screenshotService.guess(screenshotId, proposition).then(res => {
      if (res.jwt) {
        dispatch({ type: 'USER_LOG_IN', payload: { jwt: res.jwt } });
      }
      if (res.correct) {
        dispatch({ type: 'SCREENSHOT_PROPOSAL_SUCCESS', payload: res });
      } else {
        dispatch({ type: 'SCREENSHOT_PROPOSAL_FAILURE' });
      }
    });
  };
}

function resetGuess() {
  return { type: 'SCREENSHOT_PROPOSAL_RESET' };
}

function removeOwnScreenshot(screenshotId) {
  return dispatch => {
    screenshotService.removeOwn(screenshotId).then(res => {
      if (!res.error) {
        dispatch(push('/'));
      }
    });
  };
}
