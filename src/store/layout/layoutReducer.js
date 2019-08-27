const initialState = {
  isMenuVisible: false,
};

export default function(state = initialState, action) {
  const { type } = action;

  if (type === 'LAYOUT-MENU-TOGGLE') {
    return {
      ...state,
      isMenuVisible: !state.isMenuVisible,
    };
  }

  return state;
}
