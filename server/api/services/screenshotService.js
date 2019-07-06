const emailService = require('./emailService');
const cloudinaryService = require('./cloudinaryService');
const moderationManager = require('../managers/moderationManager');
const { frontUrl } = require('../../../config');

module.exports = {
  notifyModeratorsOfNewScreenshot,
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
