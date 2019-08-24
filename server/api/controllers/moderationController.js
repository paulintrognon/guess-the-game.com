const bluebird = require('bluebird');
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
  const { screenshotId, newApprovalStatus, refusalReason } = req.body;

  if (
    !Number.isInteger(screenshotId) ||
    !['waiting', 'approved', 'refused'].includes(newApprovalStatus) ||
    (!refusalReason ||
      [
        'alreadySubmitted',
        'badQuality',
        'existsInGoogleImage',
        'gameNotFamousEnough',
        'notAGame',
        'tooMuchOfThisGame',
        'spam',
        'other',
      ].includes(newApprovalStatus))
  ) {
    return bluebird.reject({
      code: 'INVALID_BODY',
    });
  }

  return moderationManager.moderateScreenshot({
    screenshotId,
    user,
    newApprovalStatus,
    refusalReason,
  });
}
