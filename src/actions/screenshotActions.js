import { push } from 'connected-react-router';

export default {
  addScreenshotAction,
};

function addScreenshotAction(screenshot) {
  return dispatch => {
    dispatch(push(`/shot/${screenshot.id}`));
  };
}
