const initialState = {
  isLoading: false,
  id: null,
  username: null,
  url: null,
  isSolved: false,
};

export default function reducer(state = initialState, action) {
  const { type, payload } = action;

  if (type === 'SCREENSHOT_LOADING') {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (type === 'SCREENSHOT_LOAD') {
    return {
      ...state,
      isLoading: false,
      id: payload.id,
      username: payload.username,
      url: payload.url,
      isSolved: payload.isSolved,
    };
  }

  return { ...state };
}
