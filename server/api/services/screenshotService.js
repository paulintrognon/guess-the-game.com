const { frontUrl } = require('../../../config');

module.exports = {
  compileScreenshotNames,
  getScreenshotSiteUrl,
};

function getScreenshotSiteUrl(screenshot) {
  return `${frontUrl}/screenshot/${screenshot.id}`;
}

function compileScreenshotNames(screenshot) {
  const namesToCheck = [screenshot.gameCanonicalName].concat(
    screenshot.alternativeNames || []
  );
  const names = [];
  namesToCheck.forEach(name => {
    // Trim
    const trimmedName = name.trim();
    // If empty we skip
    if (!trimmedName) {
      return;
    }
    // Lowercase
    const lowercasedTrimmedName = trimmedName.toLowerCase();
    // If name is already present we skip
    if (names.indexOf(lowercasedTrimmedName) !== -1) {
      return;
    }
    names.push(lowercasedTrimmedName);
  });
  return names;
}
