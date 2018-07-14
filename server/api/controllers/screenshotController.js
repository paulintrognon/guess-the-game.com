// const screenshotManager = require('../managers/screenshotManager');
const path = require('path');
const config = require('../../../config');
// const cloudinaryService = require('../services/cloudinaryService');

module.exports = {
  uploadScreenshot,
};

function uploadScreenshot(req) {
  const imageFile = req.files.file;
  const imageName = imageFile.name;
  const extention = path.extname(imageName);
  const newName = `${Date.now()}${extention}`;
  const localPath = `${__dirname}/../../uploads/${newName}`;
  imageFile.mv(localPath);

  const url = `${config.apiUrl}/uploads/${newName}`;

  return { url, localPath };
}
