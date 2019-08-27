const initialState = {
  isLoading: false,
  hasMore: false,
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
    return {
      ...state,
      solvedScreenshots: payload.map(screenshot => ({
        ...screenshot,
        createdAt: new Date(screenshot.createdAt),
        solvedAt: new Date(screenshot.solvedAt),
      })),
    };
  }

  return newState;
}
