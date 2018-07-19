const initialState = {
  isLoading: false,
  id: null,
  username: null,
  url: null,
  isSolved: false,
  isOwn: false,
  solveDate: null,
  createdAt: null,
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
      username: payload.createdBy.username,
      url: payload.imageUrl,
      isSolved: payload.isSolved,
      isOwn: payload.isOwn,
      solveDate: new Date(payload.solveDate),
      createdAt: new Date(payload.createdAt),
    };
  }

  return { ...state };
}
