const initialState = {
  jwt: localStorage.getItem('jwt'),
  username: localStorage.getItem('username'),
  userData: null,
};

export default function reducer(state = initialState, action) {
  const newState = { ...state };
  const { type, payload } = action;

  if (type === 'USER_LOG_IN') {
    localStorage.setItem('jwt', payload.jwt);
    if (payload.username) {
      localStorage.setItem('username', payload.username);
    }

    return {
      ...state,
      username: payload.username,
      jwt: payload.jwt,
    };
  }

  if (type === 'USER_LOG_OUT') {
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    return {
      ...state,
      username: '',
      jwt: '',
    };
  }

  if (type === 'USER_DATA_LOADING') {
    return {
      ...state,
      userData: null,
    };
  }

  if (type === 'USER_DATA_LOADED') {
    return {
      ...state,
      userData: payload,
    };
  }

  return newState;
}
