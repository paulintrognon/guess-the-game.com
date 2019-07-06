const emailService = require('./emailService');
const cloudinaryService = require('./cloudinaryService');
const moderationManager = require('../managers/moderationManager');
const { frontUrl } = require('../../../config');

module.exports = {
  notifyModeratorsOfNewScreenshot,
  compileScreenshotNames,
};

async function notifyModeratorsOfNewScreenshot(screenshot) {
  // Si la screenshot est déjà approuvée, pas besoin de notifier
  if (screenshot.approvalStatus === 1) {
    return;
  }
  const moderators = await moderationManager.getModerators();
  const imageUrl = cloudinaryService.pathToUrl(screenshot.imagePath);
  const screenshotSiteUrl = getScreenshotSiteUrl(screenshot);
  const moderationUrl = getModerationUrl();
  moderators.forEach(moderator => {
    emailService.sendModerationNewScreenshotEmail({
      email: moderator.email,
      emailData: {
        imageUrl,
        screenshotSiteUrl,
        moderationUrl,
      },
    });
  });
}

function getScreenshotSiteUrl(screenshot) {
  return `${frontUrl}/screenshot/${screenshot.id}`;
}

function getModerationUrl() {
  return `${frontUrl}/moi/moderation/en-attente`;
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
