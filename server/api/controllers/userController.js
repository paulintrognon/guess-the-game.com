const userManager = require('../managers/userManager');
const cloudinaryService = require('../services/cloudinaryService');

module.exports = {
  getScores,
  getUser,
  getScreenshotsFound,
  getScreenshotsAdded,
};

async function getScores() {
  return userManager.getScores();
}

async function getUser(req) {
  const { username } = req.user;
  return userManager.get(username);
}

async function getScreenshotsFound(req) {
  const { id } = req.user;
  const screenshots = await userManager.getScreenshotsFound(id);
  return screenshots.map(screenshot => ({
    ...screenshot,
    imageUrl: cloudinaryService.pathToUrl(screenshot.imagePath),
  }));
}

async function getScreenshotsAdded(req) {
  const { id } = req.user;
  const screenshots = await userManager.getScreenshotsAdded(id);
  return screenshots.map(screenshot => ({
    ...screenshot,
    imageUrl: cloudinaryService.pathToUrl(screenshot.imagePath),
  }));
}
