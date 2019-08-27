import userService from '../../services/userService';

export default {
  loadUserSolvedScreenshots,
};

function loadUserSolvedScreenshots(params) {
  return async dispatch => {
    dispatch({
      type: 'SOLVED_SCREENSHOTS-LOADING',
    });
    const solvedScreenshots = await userService.fetchSolvedScreenshots(params);
    dispatch({
      type: 'SOLVED_SCREENSHOTS-LOADED',
      payload: solvedScreenshots,
    });
  };
}
