const bluebird = require('bluebird');
const userManager = require('../managers/userManager');
const screenshotManager = require('../managers/screenshotManager');

module.exports = {
  getScores,
  getSolvedScreenshots,
  getAddedScreenshots,
  getScreenshotRating,
};

async function getScores() {
  const totalNbScreenshots = await screenshotManager.getTotalNb();
  const scores = await userManager.getScores({ totalNbScreenshots });
  return {
    totalNbScreenshots,
    scores,
  };
}

async function getSolvedScreenshots(req) {
  const { id } = req.user;
  return userManager.getSolvedScreenshots(id);
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

  return userManager.getAddedScreenshots(id, {
    ...(approvalStatus && { approvalStatus }),
  });
}

async function getScreenshotRating(req) {
  const userId = req.user.id;
  const { screenshotId } = req.body;
  return userManager.getScreenshotRating({ screenshotId, userId });
}
