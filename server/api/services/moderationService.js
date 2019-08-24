const emailService = require('./emailService');
const moderationManager = require('../managers/moderationManager');
const screenshotService = require('./screenshotService');
const { frontUrl } = require('../../../config');

module.exports = {
  notifyModeratorsOfNewScreenshot,
};

async function notifyModeratorsOfNewScreenshot(screenshot) {
  // Si la screenshot est déjà approuvée, pas besoin de notifier
  if (screenshot.approvalStatus === 'approved') {
    return;
  }
  const moderators = await moderationManager.getModerators();
  const screenshotSiteUrl = screenshotService.getScreenshotSiteUrl(screenshot);
  const moderationUrl = getModerationUrl();
  moderators.forEach(moderator => {
    emailService.sendModerationNewScreenshotEmail({
      email: moderator.email,
      emailData: {
        imageUrl: screenshot.imageUrl,
        screenshotSiteUrl,
        moderationUrl,
      },
    });
  });
}

function getModerationUrl() {
  return `${frontUrl}/moi/moderation/en-attente`;
}
