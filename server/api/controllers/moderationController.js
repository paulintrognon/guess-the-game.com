const moderationManager = require('../managers/moderationManager');

module.exports = {
  getNonModeratedScreenshots,
  getApprovedScreenshots,
  getRejectedScreenshots,
  getModeratedByYouScreenshots,
  moderateScreenshot,
};

async function getNonModeratedScreenshots() {
  return moderationManager.getScreenshots({
    approvalStatus: 'waiting',
  });
}

async function getApprovedScreenshots() {
  return moderationManager.getScreenshots({
    approvalStatus: 'approved',
  });
}

async function getRejectedScreenshots() {
  return moderationManager.getScreenshots({
    approvalStatus: 'refused',
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
