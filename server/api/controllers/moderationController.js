const bluebird = require('bluebird');
const moderationManager = require('../managers/moderationManager');

module.exports = {
  getNonModeratedScreenshots,
  getApprovedScreenshots,
  getRejectedScreenshots,
  getModeratedByYouScreenshots,
  moderateScreenshot,
};

async function getNonModeratedScreenshots(req) {
  return getScreenshots(req, {
    approvalStatus: 'waiting',
  });
}

async function getApprovedScreenshots(req) {
  return getScreenshots(req, {
    approvalStatus: 'approved',
  });
}

async function getRejectedScreenshots(req) {
  return getScreenshots(req, {
    approvalStatus: 'refused',
  });
}

async function getModeratedByYouScreenshots(req) {
  const { user } = req;
  return getScreenshots(req, {
    userId: user.id,
  });
}

async function getScreenshots(req, filters) {
  const { offset, limit, searchText } = req.body || {};

  const { screenshots, total } = await moderationManager.getScreenshots({
    offset,
    limit,
    searchText,
    ...filters,
  });

  // If we did not provide an offset, then we return only the screenshots (for backward compat reasons)
  if (offset === undefined) {
    return screenshots;
  }

  return {
    screenshots,
    total,
    offset,
    hasMore: offset + screenshots.length < total,
  };
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
        'scoreTooLow',
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
