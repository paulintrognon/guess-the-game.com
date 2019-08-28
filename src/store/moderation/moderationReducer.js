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

  if (type === 'MODERATION-LOADING') {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (type === 'MODERATION-WAITING-LOADED') {
    return {
      ...state,
      isLoading: false,
      waitingScreenshots: payload.map(parseScreenshot),
    };
  }

  if (type === 'MODERATION-APPROVED-LOADED') {
    return {
      ...state,
      isLoading: false,
      approvedScreenshots: payload.map(parseScreenshot),
    };
  }

  if (type === 'MODERATION-REJECTED-LOADED') {
    return {
      ...state,
      isLoading: false,
      rejectedScreenshots: payload.map(parseScreenshot),
    };
  }

  if (type === 'MODERATION-BY_YOU-LOADED') {
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
