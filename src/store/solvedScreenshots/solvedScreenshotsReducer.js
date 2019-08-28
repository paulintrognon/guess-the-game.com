const initialState = {
  isLoading: false,
  hasMore: false,
  total: null,
  screenshots: null,
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
      screenshots: payload.offset
        ? (state.screenshots || [])
            .concat(screenshots)
            .filter(
              (screenshot1, index, self) =>
                index ===
                self.findIndex(screenshot2 => screenshot2.id === screenshot1.id)
            )
        : screenshots,
    };
  }

  return newState;
}
