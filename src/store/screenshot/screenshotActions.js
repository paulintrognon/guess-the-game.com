import { push } from 'connected-react-router';
import screenshotService from '../../services/screenshotService';
import notificationService from '../../services/notificationService';
import store from '../index';

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
    dispatch({ type: 'SCREENSHOT-LOADING' });
    const screenshot = await screenshotService.getFromId(screenshotId);
    dispatch({ type: 'SCREENSHOT-LOAD', payload: screenshot });
    if (navigate) {
      dispatch(push(`/screenshot/${screenshot.id}`));
    }
    const prevAndNext = await screenshotService.getPrevAndNext({
      screenshotId,
    });
    dispatch({ type: 'SCREENSHOT-LOAD-PREV_AND_NEXT', payload: prevAndNext });
  };
}

function getUnsolvedScreenshot(exclude) {
  return async dispatch => {
    dispatch({ type: 'SCREENSHOT-LOADING' });
    const res = await screenshotService.getUnsolved(exclude);
    if (res.error && res.code === 'UNSOLVED_SCREENSHOT_NOT_FOUND') {
      dispatch(push('/la-fin'));
      return;
    }
    if (
      store.getState().screenshot.isViewingUnseenScreenshot &&
      !res.isUnseenScreenshot
    ) {
      notificationService.create({
        type: 'info',
        duration: 'long',
        text:
          'Vous avez fait le tour des nouvelles screenshots, vous voyez maintenant des screenshots que vous avez déjà vus.',
      });
    }

    dispatch(push(`/screenshot/${res.id}`));
    dispatch({ type: 'SCREENSHOT-LOAD', payload: res });
    const prevAndNext = await screenshotService.getPrevAndNext({
      screenshotId: res.id,
    });
    dispatch({ type: 'SCREENSHOT-LOAD-PREV_AND_NEXT', payload: prevAndNext });
  };
}

function tryProposal(screenshot, proposition) {
  return async dispatch => {
    dispatch({ type: 'SCREENSHOT-PROPOSAL-TRY' });
    const res = await screenshotService.guess(screenshot.id, proposition);
    if (res.jwt) {
      dispatch({ type: 'USER-LOG-IN', payload: { jwt: res.jwt } });
    }
    if (!res.correct) {
      dispatch({ type: 'SCREENSHOT-PROPOSAL-FAILURE' });
      return;
    }
    // We unfocus the guessing input to re-enable shortcuts (j,k,...)
    document.activeElement.blur();
    dispatch({ type: 'SCREENSHOT-PROPOSAL-SUCCESS', payload: res });
    if (!res.newRankingData) {
      return;
    }
    const { currentRanking, newRanking } = res.newRankingData;
    const isFirstOneToSolve = !screenshot.stats.firstSolvedBy;
    const hasNewRanking = newRanking < currentRanking;

    // If the user is the first one to solve the screenshot
    if (isFirstOneToSolve) {
      notificationService.create({
        slug: 'screenshotActions-firstToFind',
        text: '️Bravo, vous êtes le premier a avoir trouvé ce screenshot ! 💪',
      });
    }

    // If the user got a new ranking
    if (hasNewRanking) {
      if (newRanking === 1) {
        notificationService.create({
          slug: 'screenshotActions-newRanking',
          text: `C'est ouf !!! Vous passez à la première place ! 👑`,
        });
      } else if (newRanking === 2) {
        notificationService.create({
          slug: 'screenshotActions-newRanking',
          text: `Incroyable !! Vous passez à la deuxième place ! 🏆`,
        });
      } else if (newRanking === 3) {
        notificationService.create({
          slug: 'screenshotActions-newRanking',
          text: `Super ! Vous êtes sur le podium ! 🏅`,
        });
      } else if (newRanking === 10) {
        notificationService.create({
          slug: 'screenshotActions-newRanking',
          text: `Bravo ! Vous êtes dans le top 10 ! 💪`,
        });
      } else if ([50, 30, 20].includes(newRanking)) {
        notificationService.create({
          slug: 'screenshotActions-newRanking',
          text: `Bravo ! Vous êtes dans le top ${newRanking} ! 👏`,
        });
      } else {
        notificationService.create({
          slug: 'screenshotActions-newRanking',
          text: `Vous passez à la ${newRanking}ème place !`,
        });
      }
    }

    // If the user is registered, we stop here
    if (store.getState().user.username) {
      return;
    }
    // If the user has no achievements, we stop here
    if (!isFirstOneToSolve && !hasNewRanking) {
      return;
    }
    // If the user is not registered but has achieved something, we kindly suggest him to register
    let text;
    if (hasNewRanking && !isFirstOneToSolve) {
      text = '️Inscrivez-vous pour apparaitre dans le classement !';
    } else if (!hasNewRanking && isFirstOneToSolve) {
      text = 'Inscrivez-vous pour vous claim le screenshot !';
    } else {
      text =
        '️Inscrivez-vous pour apparaitre dans le classement et claim le screenshot !';
    }
    notificationService.create({
      slug: 'screenshotActions-pleaseRegister',
      text,
      type: 'info',
      timeout: 8000,
      callbacks: {
        onClick: () => {
          dispatch(push('/inscription'));
        },
      },
    });
  };
}

function resetGuess() {
  return { type: 'SCREENSHOT-PROPOSAL-RESET' };
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
