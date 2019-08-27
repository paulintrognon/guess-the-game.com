const initialState = {
  isLoading: false,
  hasMore: false,
  solvedScreenshots: null,
};

export default function reducer(state = initialState, action) {
  const newState = { ...state };
  const { type, payload } = action;

  if (type === 'USER-SOLVED_SCREENSHOTS-LOADING') {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (type === 'USER-SOLVED_SCREENSHOTS-LOADED') {
    return {
      ...state,
      solvedScreenshots: payload.map(screenshot => ({
        ...screenshot,
        createdAt: new Date(screenshot.createdAt),
        solvedAt: new Date(screenshot.solvedAt),
      })),
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
