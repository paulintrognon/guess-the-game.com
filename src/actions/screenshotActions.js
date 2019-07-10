import { push } from 'connected-react-router';
import Noty from 'noty';
import screenshotService from '../services/screenshotService';
import store from '../store';

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
    dispatch(push(`/screenshot/${screenshot.id}`));
  };
}

function loadScreenshot(screenshotId, navigate = false) {
  return async dispatch => {
    dispatch({ type: 'SCREENSHOT_LOADING' });
    const screenshot = await screenshotService.getFromId(screenshotId);
    dispatch({ type: 'SCREENSHOT_LOAD', payload: screenshot });
    if (navigate) {
      dispatch(push(`/screenshot/${screenshot.id}`));
    }
    const prevAndNext = await screenshotService.getPrevAndNext({
      screenshotId,
    });
    dispatch({ type: 'SCREENSHOT_LOAD_PREV_AND_NEXT', payload: prevAndNext });
  };
}

function getUnsolvedScreenshot(exclude) {
  return async dispatch => {
    dispatch({ type: 'SCREENSHOT_LOADING' });
    const res = await screenshotService.getUnsolved(exclude);
    if (res.error && res.code === 'UNSOLVED_SCREENSHOT_NOT_FOUND') {
      dispatch(push('/la-fin'));
    } else {
      dispatch(push(`/screenshot/${res.id}`));
      dispatch({ type: 'SCREENSHOT_LOAD', payload: res });
      const prevAndNext = await screenshotService.getPrevAndNext({
        screenshotId: res.id,
      });
      dispatch({ type: 'SCREENSHOT_LOAD_PREV_AND_NEXT', payload: prevAndNext });
    }
  };
}

function tryProposal(screenshotId, proposition) {
  return async dispatch => {
    dispatch({ type: 'SCREENSHOT_PROPOSAL_TRY' });
    const res = await screenshotService.guess(screenshotId, proposition);
    if (res.jwt) {
      dispatch({ type: 'USER_LOG_IN', payload: { jwt: res.jwt } });
    }
    if (!res.correct) {
      dispatch({ type: 'SCREENSHOT_PROPOSAL_FAILURE' });
      return;
    }
    dispatch({ type: 'SCREENSHOT_PROPOSAL_SUCCESS', payload: res });
    if (!res.newRankingData) {
      return;
    }
    const { currentRanking, newRanking } = res.newRankingData;
    if (newRanking < currentRanking) {
      new Noty({
        text: `Bravo !! Vous passez à la ${newRanking}${
          newRanking === 1 ? 'ère' : 'ème'
        } place !`,
        type: 'success',
        timeout: 10000,
      }).show();

      if (store.getState().user.username) {
        return;
      }
      new Noty({
        text: 'Inscrivez vous pour garder votre place dans le classement 😃',
        type: 'info',
        timeout: 10000,
      }).show();
    }
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
