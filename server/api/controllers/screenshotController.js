const path = require('path');
const config = require('../../../config');
const screenshotManager = require('../managers/screenshotManager');
const cloudinaryService = require('../services/cloudinaryService');

module.exports = {
  uploadScreenshot,
  addScreenshot,
};

function uploadScreenshot(req) {
  const imageFile = req.files.file;
  const imageName = imageFile.name;
  const extention = path.extname(imageName);
  const localImageName = `${Date.now()}${extention}`;
  const localImagePath = getUploadedImageLocalPath(localImageName);
  imageFile.mv(localImagePath);

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
