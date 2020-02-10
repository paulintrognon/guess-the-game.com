const bluebird = require('bluebird');
const userScreenshotManager = require('../managers/userScreenshotManager');
const solvedScreenshotManager = require('../managers/solvedScreenshotManager');
const screenshotManager = require('../managers/screenshotManager');
const userManager = require('../managers/userManager');

module.exports = {
  getScores,
  getSolvedScreenshots,
  getAddedScreenshots,
};

async function getScores() {
  const [totalNbScreenshots, totalNbUsers] = await Promise.all([
    screenshotManager.getTotalNb(),
    userManager.getTotalNb(),
  ]);
  const scores = await userScreenshotManager.getScores({
    totalNbScreenshots,
  });
  return {
    totalNbScreenshots,
    totalNbUsers,
    scores,
  };
}

function getSolvedScreenshots(req) {
  return getScreenshots(req, solvedScreenshotManager.getSolvedScreenshots);
}

function getAddedScreenshots(req) {
  return getScreenshots(req, userScreenshotManager.getAddedScreenshots);
}

async function getScreenshots(req, managerMethod) {
  const { id } = req.user;
  const { offset, limit, searchText, approvalStatus } = req.body || {};

  if (
    approvalStatus &&
    !['approved', 'refused', 'waiting'].includes(approvalStatus)
  ) {
    return bluebird.reject({
      code: 'INVALID_BODY',
      message: 'approvalStatus doit être égal à approved, refused ou waiting.',
    });
  }

  const { screenshots, total } = await managerMethod(id, {
    offset,
    limit,
    searchText,
    approvalStatus,
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
