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
  const filters = {};
  if (approvalStatus === 'approved') {
    filters.approvalStatus = 1;
  } else if (approvalStatus === 'refused') {
    filters.approvalStatus = -1;
  } else if (approvalStatus === 'waiting') {
    filters.approvalStatus = 0;
  }
  return userManager.getAddedScreenshots(id, filters);
}

async function getScreenshotRating(req) {
  const userId = req.user.id;
  const { screenshotId } = req.body;
  return userManager.getScreenshotRating({ screenshotId, userId });
}
