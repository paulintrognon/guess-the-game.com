const userManager = require('../managers/userManager');
const cloudinaryService = require('../services/cloudinaryService');

module.exports = {
  getScores,
  getUser,
  getScreenshotFound,
};

async function getScores() {
  return userManager.getScores();
}

async function getUser(req) {
  const { username } = req.user;
  return userManager.get(username);
}

async function getScreenshotFound(req) {
  const { id } = req.user;
  const screenshots = await userManager.getScreenshotFound(id);
  return screenshots.map(screenshot => ({
    ...screenshot,
    imageUrl: cloudinaryService.pathToUrl(screenshot.imagePath),
  }));
}
