import { push } from 'connected-react-router';
import screenshotService from '../services/screenshotService';

export default {
  addScreenshotAction,
  loadScreenshot,
  getUnsolvedScreenshot,
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
