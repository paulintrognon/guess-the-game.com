const initialState = {
  isMenuVisible: false,
};

export default function(state = initialState, action) {
  const { type } = action;

  if (type === 'LAYOUT_MENU_TOGGLE') {
    return {
      ...state,
      isMenuVisible: !state.isMenuVisible,
    };
  }

  return state;
}
