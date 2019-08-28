import debounce from 'awesome-debounce-promise';
import userService from '../../services/userService';

export default {
  resetUserAddedScreenshots,
  loadUserAddedScreenshots,
};

function resetUserAddedScreenshots() {
  return { type: 'ADDED_SCREENSHOTS-RESET' };
}

const debouncedFetch = debounce(userService.fetchAddedScreenshots, 200);

function loadUserAddedScreenshots(params) {
  return async dispatch => {
    dispatch({
      type: 'ADDED_SCREENSHOTS-LOADING',
    });
    const solvedScreenshots = await debouncedFetch(params);
    dispatch({
      type: 'ADDED_SCREENSHOTS-LOADED',
      payload: solvedScreenshots,
    });
  };
}
