const path = require('path');
const fs = require('fs');
const config = require('../../../config');
const screenshotManager = require('../managers/screenshotManager');
const cloudinaryService = require('../services/cloudinaryService');
const logger = require('../../logger');

module.exports = {
  getfromId,
  getUnsolvedScreenshot,
  // tryProposal,
  uploadScreenshot,
  addScreenshot,
};

async function getfromId(req) {
  const res = await screenshotManager.getFromId(req.body.id, req.user.id);

  const screenshot = {
    isSolved: false,
    id: res.id,
    imageUrl: res.imageUrl,
    createdAt: res.createdAt,
  };
  if (res.ScreenshotFounds && res.ScreenshotFounds.length) {
    screenshot.isSolved = true;
    screenshot.solveDate = res.ScreenshotFounds[0].createdAt;
    screenshot.name = res.gameCanonicalName;
  }
  return screenshot;
}

async function getUnsolvedScreenshot(req) {
  return screenshotManager.getUnsolved(req.user.id);
}

/* async function tryProposal(req) {
  const 
} */

function uploadScreenshot(req) {
  const imageFile = req.files.file;
  const imageName = imageFile.name;
  const extention = path.extname(imageName);
  const localImageName = `${Date.now()}${extention}`;
  const localImagePath = getUploadedImageLocalPath(localImageName);

  // We move the uploaded file to the uploads folder
  imageFile.mv(localImagePath);

  // The file will be deleted in 24h
  setTimeout(() => {
    logger.info(`Deleting ${localImagePath}`);
    fs.unlinkSync(localImagePath);
  }, 3600 * 1000 * 24);

  const url = `${config.apiUrl}/uploads/${localImageName}`;

  return { url, localImageName };
}

async function addScreenshot(req) {
  ['name', 'localImageName'].forEach(field => {
    if (!req.body[field]) {
      throw new Error(`User ${field} cannot be null`);
    }
  });

  const localImagePath = getUploadedImageLocalPath(req.body.localImageName);

  if (!fs.existsSync(localImagePath)) {
    throw new Error('Sorry, your image has been deleted, please re-upload it');
  }

  const cloudinaryResult = await cloudinaryService.uploadImage(localImagePath);

  return screenshotManager.create({
    gameCanonicalName: req.body.name,
    alternativeNames: req.body.alternativeNames,
    imageUrl: cloudinaryResult.secure_url,
    userId: req.user.id,
  });
}

function getUploadedImageLocalPath(imageName) {
  return `${__dirname}/../../uploads/${imageName}`;
}
