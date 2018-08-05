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
    screenshotService.getUnsolved(exclude).then(screenshot => {
      dispatch({ type: 'SCREENSHOT_LOAD', payload: screenshot });
      dispatch(push(`/shot/${screenshot.id}`));
    });
  };
}
