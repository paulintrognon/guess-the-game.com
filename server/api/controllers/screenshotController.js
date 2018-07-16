const path = require('path');
const fs = require('fs');
const config = require('../../../config');
const screenshotManager = require('../managers/screenshotManager');
const cloudinaryService = require('../services/cloudinaryService');
const logger = require('../../logger');

module.exports = {
  getUnsolvedScreenshot,
  uploadScreenshot,
  addScreenshot,
};

function getUnsolvedScreenshot(req) {
  return screenshotManager.getUnsolved(req.user.id);
}

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

function addScreenshot(req) {
  ['name', 'localImageName'].forEach(field => {
    if (!req.body[field]) {
      throw new Error(`User ${field} cannot be null`);
    }
  });

  const localImagePath = getUploadedImageLocalPath(req.body.localImageName);

  if (!fs.existsSync(localImagePath)) {
    throw new Error('Your image has been deleted, please re-upload it');
  }

  return cloudinaryService.uploadImage(localImagePath).then(cloudinaryResult =>
    screenshotManager.create({
      gameCanonicalName: req.body.name,
      alternativeNames: req.body.alternativeNames,
      imageUrl: cloudinaryResult.secure_url,
      userId: req.user.id,
    })
  );
}

function getUploadedImageLocalPath(imageName) {
  return `${__dirname}/../../uploads/${imageName}`;
}
