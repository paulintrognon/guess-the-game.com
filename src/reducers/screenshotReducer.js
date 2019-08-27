const initialState = {
  isLoading: false,
  id: null,
  username: null,
  url: null,
  name: null,
  year: null,
  isSolved: false,
  isOwn: false,
  solvedAt: null,
  createdAt: null,
  approvalStatus: false,
  rating: null,
  ownRating: null,
  prevScreenshotId: null,
  nextScreenshotId: null,
  stats: {},
  isGuessing: false,
  isProposalRight: false,
  isProposalWrong: false,
  isTryAnotherButtonClicked: false,
  error: null,
  isViewingUnseenScreenshot: false,
};

export default function reducer(state = initialState, action) {
  const { type, payload } = action;

  if (type === 'SCREENSHOT-LOADING') {
    return {
      ...state,
      isLoading: true,
      isTryAnotherButtonClicked: true,
      error: null,
      prevScreenshotId: null,
      nextScreenshotId: null,
    };
  }

  if (type === 'SCREENSHOT-LOAD') {
    if (payload.error) {
      if (payload.message) {
        return {
          ...state,
          error: payload.message,
          isLoading: false,
          isTryAnotherButtonClicked: false,
        };
      }
      return {
        ...state,
        error: true,
        isLoading: false,
        isTryAnotherButtonClicked: false,
      };
    }

    return {
      ...state,
      errorMessage: null,
      isLoading: false,
      id: payload.id,
      name: payload.name,
      addedBy: payload.addedBy,
      year: payload.year,
      url: payload.imageUrl,
      isSolved: payload.isSolved,
      isOwn: payload.isOwn,
      stats: payload.stats,
      solvedAt: new Date(payload.solvedAt),
      createdAt: new Date(payload.createdAt),
      approvalStatus: payload.approvalStatus,
      rating: payload.rating,
      ownRating: payload.ownRating,
      isViewingUnseenScreenshot: payload.isUnseenScreenshot,
      isTryAnotherButtonClicked: false,
      isGuessing: false,
      isProposalWrong: false,
      isProposalRight: false,
    };
  }

  if (type === 'SCREENSHOT-LOAD-PREV_AND_NEXT') {
    const { prev, next } = payload;
    return {
      ...state,
      prevScreenshotId: prev,
      nextScreenshotId: next,
    };
  }

  if (type === 'SCREENSHOT-LOAD-NEW_RATING') {
    const { averageRating, ownRating } = payload;
    return {
      ...state,
      rating: Number(averageRating),
      ownRating,
    };
  }

  if (type === 'SCREENSHOT-PROPOSAL-RESET') {
    return {
      ...state,
      isProposalWrong: false,
    };
  }

  if (type === 'SCREENSHOT-PROPOSAL-TRY') {
    return {
      ...state,
      isGuessing: true,
      isProposalRight: false,
      isProposalWrong: false,
    };
  }

  if (type === 'SCREENSHOT-PROPOSAL-SUCCESS') {
    return {
      ...state,
      isGuessing: false,
      isProposalRight: true,
      name: payload.screenshotName,
      year: payload.year,
    };
  }

  if (type === 'SCREENSHOT-PROPOSAL-FAILURE') {
    return {
      ...state,
      isGuessing: false,
      isProposalWrong: true,
    };
  }

  return { ...state };
}
