const initialState = {
  isLoading: true,
  hasMore: false,
  screenshots: [],
};

export default function reducer(state = initialState, action) {
  const newState = { ...state };
  const { type, payload } = action;

  if (type === 'MODERATION-RESET') {
    return {
      ...state,
      screenshots: [],
      hasMore: false,
    };
  }

  if (type === 'MODERATION-LOADING') {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (type === 'MODERATION-LOADED') {
    const screenshots = payload.screenshots.map(parseScreenshot);
    return {
      ...state,
      isLoading: false,
      hasMore: payload.hasMore,
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

function parseScreenshot(screenshot) {
  return {
    ...screenshot,
    createdAt: screenshot.createdAt && new Date(screenshot.createdAt),
  };
}
