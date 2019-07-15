const userManager = require('../managers/userManager');
const screenshotManager = require('../managers/screenshotManager');
const cloudinaryService = require('../services/cloudinaryService');

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
  return userManager.getAddedScreenshots(id);
}

async function getScreenshotRating(req) {
  const userId = req.user.id;
  const { screenshotId } = req.body;
  return userManager.getScreenshotRating({ screenshotId, userId });
}
