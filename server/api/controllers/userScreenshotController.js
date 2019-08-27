const bluebird = require('bluebird');
const userScreenshotManager = require('../managers/userScreenshotManager');
const solvedScreenshotManager = require('../managers/solvedScreenshotManager');
const screenshotManager = require('../managers/screenshotManager');

module.exports = {
  getScores,
  getSolvedScreenshots,
  getAddedScreenshots,
};

async function getScores() {
  const totalNbScreenshots = await screenshotManager.getTotalNb();
  const scores = await userScreenshotManager.getScores({
    totalNbScreenshots,
  });
  return {
    totalNbScreenshots,
    scores,
  };
}

async function getSolvedScreenshots(req) {
  const { id } = req.user;
  const { offset, limit, searchText } = req.body || {};
  const {
    screenshots,
    total,
  } = await solvedScreenshotManager.getSolvedScreenshots(id, {
    offset,
    limit,
    searchText,
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

async function getAddedScreenshots(req) {
  const { id } = req.user;
  const { approvalStatus } = req.body;
  if (
    approvalStatus &&
    !['approved', 'refused', 'waiting'].includes(approvalStatus)
  ) {
    return bluebird.reject({
      code: 'INVALID_BODY',
      message: 'approvalStatus doit être égal à approved, refused ou waiting.',
    });
  }

  return userScreenshotManager.getAddedScreenshots(id, {
    ...(approvalStatus && { approvalStatus }),
  });
}
