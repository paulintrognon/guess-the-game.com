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
  return moderationManager.getScreenshots({
    approvalStatus: 0,
  });
}

async function getApprovedScreenshots() {
  return moderationManager.getScreenshots({
    approvalStatus: 1,
  });
}

async function getRejectedScreenshots() {
  return moderationManager.getScreenshots({
    approvalStatus: -1,
  });
}

async function getModeratedByYouScreenshots(req) {
  const { user } = req;
  return moderationManager.getScreenshots({
    userId: user.id,
  });
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
