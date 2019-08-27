import debounce from 'awesome-debounce-promise';
import userService from '../../services/userService';

export default {
  loadUserSolvedScreenshots,
};

const debouncedFetch = debounce(userService.fetchSolvedScreenshots, 200);

function loadUserSolvedScreenshots(params) {
  return async dispatch => {
    dispatch({
      type: 'SOLVED_SCREENSHOTS-LOADING',
    });
    const solvedScreenshots = await debouncedFetch(params);
    dispatch({
      type: 'SOLVED_SCREENSHOTS-LOADED',
      payload: solvedScreenshots,
    });
  };
}
