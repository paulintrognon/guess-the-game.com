const initialState = {
  jwt: localStorage.getItem('jwt'),
  username: localStorage.getItem('username'),
  userData: null,
  addedScreenshots: null,
  canModerateScreenshots:
    localStorage.getItem('canModerateScreenshots') === '1',
  lastViewedRandomScreenshots: retrieveStoredLastViewedRandomScreenshots(),
  isUpdating: false,
};

export default function reducer(state = initialState, action) {
  const newState = { ...state };
  const { type, payload } = action;

  if (type === 'USER-LOG-IN') {
    localStorage.setItem('jwt', payload.jwt);
    if (payload.username) {
      localStorage.setItem('username', payload.username);
      localStorage.setItem(
        'canModerateScreenshots',
        payload.canModerateScreenshots
      );
    }

    return {
      ...state,
      username: payload.username,
      jwt: payload.jwt,
      canModerateScreenshots: payload.canModerateScreenshots,
    };
  }

  if (type === 'USER-LOG-OUT') {
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    return {
      ...state,
      username: '',
      jwt: '',
    };
  }

  if (type === 'USER-DATA-LOADING') {
    return {
      ...state,
      userData: null,
    };
  }

  if (type === 'USER-DATA-LOADED') {
    return {
      ...state,
      userData: payload,
    };
  }

  if (type === 'USER-ADDED_SCREENSHOTS-LOADED') {
    return {
      ...state,
      addedScreenshots: payload.map(screenshot => ({
        ...screenshot,
        createdAt: new Date(screenshot.createdAt),
      })),
    };
  }

  if (type === 'USER-UPDATING') {
    return {
      ...state,
      isUpdating: true,
    };
  }

  if (type === 'USER-UPDATED') {
    if (payload.username) {
      localStorage.setItem('username', payload.username);
    }
    return {
      ...state,
      username: payload.username || state.username,
      userData: {
        ...state.userData,
        ...payload,
      },
      isUpdating: false,
    };
  }

  if (type === 'SCREENSHOT-LOAD' && !payload.error) {
    const lastViewedRandomScreenshots = updateLastViewedRandomScreenshots({
      lastViewedRandomScreenshots: state.lastViewedRandomScreenshots,
      screenshotId: payload.id,
      reset: payload.needToResetExclusion,
    });
    storeLastViewedRandomScreenshots(lastViewedRandomScreenshots);
    return {
      ...state,
      lastViewedRandomScreenshots,
    };
  }

  return newState;
}

function updateLastViewedRandomScreenshots({
  lastViewedRandomScreenshots,
  screenshotId,
  reset,
}) {
  // Si on demande de reset, on recommance le tableau
  if (reset) {
    return [screenshotId];
  }
  // Si la screenshot est déjà, on ne fait rien
  if (lastViewedRandomScreenshots.indexOf(screenshotId) > -1) {
    return lastViewedRandomScreenshots;
  }
  // Si le nombre de screenshots dépasse la limite, on supprime la première avant de rajouter la nouvelle
  if (lastViewedRandomScreenshots.length > 5000) {
    return lastViewedRandomScreenshots.slice(1).concat([screenshotId]);
  }
  // Sinon, on ajoute la nouvelle screenshot à la liste des screenshots vues
  return lastViewedRandomScreenshots.concat([screenshotId]);
}

function storeLastViewedRandomScreenshots(newValue) {
  localStorage.setItem('lastViewedRandomScreenshots', newValue.join(','));
}

function retrieveStoredLastViewedRandomScreenshots() {
  const lastViewedRandomScreenshots = localStorage.getItem(
    'lastViewedRandomScreenshots'
  );
  if (!lastViewedRandomScreenshots) {
    return [];
  }
  return lastViewedRandomScreenshots
    .split(',')
    .map(n => Number.parseInt(n, 10));
}
