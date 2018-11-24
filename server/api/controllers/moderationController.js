const moderationManager = require('../managers/moderationManager');
const cloudinaryService = require('../services/cloudinaryService');

module.exports = {
  getNonModeratedScreenshots,
  getApprovedScreenshots,
  getRejectedScreenshots,
  getModeratedByYouScreenshots,
  moderateScreenshot,
};

async function getNonModeratedScreenshots() {
  const screenshots = await moderationManager.getScreenshots({
    approvalStatus: 0,
  });
  return screenshots.map(addImageUrlFromPath);
}

async function getApprovedScreenshots() {
  const screenshots = await moderationManager.getScreenshots({
    approvalStatus: 1,
  });
  return screenshots.map(addImageUrlFromPath);
}

async function getRejectedScreenshots() {
  const screenshots = await moderationManager.getScreenshots({
    approvalStatus: -1,
  });
  return screenshots.map(addImageUrlFromPath);
}

async function getModeratedByYouScreenshots(req) {
  const { user } = req;
  const screenshots = await moderationManager.getScreenshots({
    userId: user.id,
  });
  return screenshots.map(addImageUrlFromPath);
}

async function moderateScreenshot(req) {
  const { user } = req;
  const { screenshotId, newApprovalStatus } = req.body;
  return moderationManager.moderateScreenshot({
    screenshotId,
    user,
    newApprovalStatus,
  });
}

function addImageUrlFromPath(screenshot) {
  return {
    ...screenshot,
    imageUrl: cloudinaryService.pathToUrl(screenshot.imagePath),
  };
}
