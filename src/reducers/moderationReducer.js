const initialState = {
  isLoading: true,
  waitingScreenshots: [],
  approvedScreenshots: [],
  rejectedScreenshots: [],
  byYouScreenshots: [],
};

export default function reducer(state = initialState, action) {
  const newState = { ...state };
  const { type, payload } = action;

  if (type === 'MODERATION_LOADING') {
    return {
      ...state,
      isLoading: true,
    }
  }

  if (type === 'MODERATION_WAITING_LOADED') {
    return {
      ...state,
      isLoading: false,
      waitingScreenshots: payload.map(parseScreenshot),
    };
  }

  if (type === 'MODERATION_APPROVED_LOADED') {
    return {
      ...state,
      isLoading: false,
      approvedScreenshots: payload.map(parseScreenshot),
    };
  }

  if (type === 'MODERATION_REJECTED_LOADED') {
    return {
      ...state,
      isLoading: false,
      rejectedScreenshots: payload.map(parseScreenshot),
    };
  }

  if (type === 'MODERATION_BY-YOU_LOADED') {
    return {
      ...state,
      isLoading: false,
      byYouScreenshots: payload.map(parseScreenshot),
    };
  }

  return newState;
}

function parseScreenshot(screenshot) {
  return {
    ...screenshot,
    createdAt: screenshot.createdAt && new Date(screenshot.createdAt),
  };
}
