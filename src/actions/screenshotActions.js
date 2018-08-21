import { push } from 'connected-react-router';
import screenshotService from '../services/screenshotService';

export default {
  addScreenshotAction,
  loadScreenshot,
  getUnsolvedScreenshot,
  tryProposal,
  resetGuess,
};

function addScreenshotAction(screenshot) {
  return dispatch => {
    dispatch(push(`/shot/${screenshot.id}`));
  };
}

function loadScreenshot(screenshotId, navigate = false) {
  return dispatch => {
    dispatch({ type: 'SCREENSHOT_LOADING' });
    screenshotService.getFromId(screenshotId).then(screenshot => {
      dispatch({ type: 'SCREENSHOT_LOAD', payload: screenshot });
      if (navigate) {
        dispatch(push(`/shot/${screenshot.id}`));
      }
    });
  };
}

function getUnsolvedScreenshot(exclude) {
  return dispatch => {
    screenshotService.getUnsolved(exclude).then(res => {
      if (res.error && res.code === 'UNSOLVED_SCREENSHOT_NOT_FOUND') {
        dispatch(push('/the-end'));
      } else {
        dispatch({ type: 'SCREENSHOT_LOAD', payload: res });
        dispatch(push(`/shot/${res.id}`));
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
