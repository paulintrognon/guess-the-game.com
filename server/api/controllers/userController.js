const userManager = require('../managers/userManager');
const cloudinaryService = require('../services/cloudinaryService');

module.exports = {
  getScores,
  getUser,
  getSolvedScreenshots,
  getAddedScreenshots,
};

async function getScores() {
  return userManager.getScores();
}

async function getUser(req) {
  const { username } = req.user;
  return userManager.get(username);
}

async function getSolvedScreenshots(req) {
  const { id } = req.user;
  const screenshots = await userManager.getSolvedScreenshots(id);
  return screenshots.map(screenshot => ({
    ...screenshot,
    imageUrl: cloudinaryService.pathToUrl(screenshot.imagePath),
  }));
}

async function getAddedScreenshots(req) {
  const { id } = req.user;
  const screenshots = await userManager.getAddedScreenshots(id);
  return screenshots.map(screenshot => ({
    ...screenshot,
    imageUrl: cloudinaryService.pathToUrl(screenshot.imagePath),
  }));
}
