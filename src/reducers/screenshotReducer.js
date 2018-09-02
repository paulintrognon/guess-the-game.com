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
  stats: {},
  isGuessing: false,
  isProposalRight: false,
  isProposalWrong: false,
  isTryAnotherButtonClicked: false,
};

export default function reducer(state = initialState, action) {
  const { type, payload } = action;

  if (type === 'SCREENSHOT_LOADING') {
    return {
      ...state,
      isLoading: true,
      isTryAnotherButtonClicked: true,
    };
  }

  if (type === 'SCREENSHOT_LOAD') {
    return {
      ...state,
      isLoading: false,
      id: payload.id,
      name: payload.name,
      postedBy: payload.postedBy,
      year: payload.year,
      url: payload.imageUrl,
      isSolved: payload.isSolved,
      isOwn: payload.isOwn,
      stats: payload.stats,
      solvedAt: new Date(payload.solvedAt),
      createdAt: new Date(payload.createdAt),
      isTryAnotherButtonClicked: false,
      isGuessing: false,
      isProposalWrong: false,
      isProposalRight: false,
    };
  }

  if (type === 'SCREENSHOT_PROPOSAL_RESET') {
    return {
      ...state,
      isProposalRight: false,
      isProposalWrong: false,
    };
  }

  if (type === 'SCREENSHOT_PROPOSAL_TRY') {
    return {
      ...state,
      isGuessing: true,
      isProposalRight: false,
      isProposalWrong: false,
    };
  }

  if (type === 'SCREENSHOT_PROPOSAL_SUCCESS') {
    return {
      ...state,
      isGuessing: false,
      isProposalRight: true,
      name: payload.screenshotName,
      year: payload.year,
    };
  }

  if (type === 'SCREENSHOT_PROPOSAL_FAILURE') {
    return {
      ...state,
      isGuessing: false,
      isProposalWrong: true,
    };
  }

  return { ...state };
}
