const bluebird = require('bluebird');
const moderationManager = require('../managers/moderationManager');
const cloudinaryService = require('../services/cloudinaryService');

module.exports = {
  getNonModeratedScreenshots,
  moderateScreenshot,
};

async function getNonModeratedScreenshots(req) {
  const { user } = req;
  if (!user) {
    return bluebird.reject({
      status: 401,
      code: 'MUST_BE_IDENTIFIED',
      message: "User must be identified to proove that he/she's a moderator.",
    });
  }
  if (!user.canModerateScreenshots) {
    return bluebird.reject({
      status: 403,
      code: 'CANNOT_MODERATE_SCREENSHOTS',
      message: 'User has no right to moderate screenshots.',
    });
  }
  const screenshots = await moderationManager.getNonModeratedScreenshots();
  return screenshots.map(addImageUrlFromPath);
}

async function moderateScreenshot(req) {
  const { user } = req;
  const { screenshotId, approve } = req.body;
  if (!user) {
    return bluebird.reject({
      status: 401,
      code: 'MUST_BE_IDENTIFIED',
      message: 'User must be identified to approve screenshots.',
    });
  }
  return moderationManager.moderateScreenshot({ screenshotId, user, approve });
}

function addImageUrlFromPath(screenshot) {
  return {
    ...screenshot,
    imageUrl: cloudinaryService.pathToUrl(screenshot.imagePath),
  };
}
