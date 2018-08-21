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
    };
  }

  if (type === 'SCREENSHOT_TRY_ANOTHER') {
    return {
      ...state,
      isTryAnotherButtonClicked: true,
    };
  }

  if (type === 'SCREENSHOT_LOAD') {
    return {
      ...state,
      isLoading: false,
      id: payload.id,
      name: payload.name,
      username: payload.createdBy.username,
      year: payload.year,
      url: payload.imageUrl,
      isSolved: payload.isSolved,
      isOwn: payload.isOwn,
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
