const initialState = {
  isLoading: false,
  hasMore: false,
  total: null,
  solvedScreenshots: null,
};

export default function reducer(state = initialState, action) {
  const newState = { ...state };
  const { type, payload } = action;

  if (type === 'SOLVED_SCREENSHOTS-LOADING') {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (type === 'SOLVED_SCREENSHOTS-LOADED') {
    const { total, hasMore } = payload;
    const screenshots = payload.screenshots.map(screenshot => ({
      ...screenshot,
      createdAt: new Date(screenshot.createdAt),
      solvedAt: new Date(screenshot.solvedAt),
    }));

    return {
      ...state,
      hasMore,
      total,
      isLoading: false,
      solvedScreenshots: payload.offset
        ? state.solvedScreenshots.concat(screenshots)
        : screenshots,
    };
  }

  return newState;
}
