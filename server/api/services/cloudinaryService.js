const cloudinary = require('cloudinary');
const config = require('../../../config/server.json');

const format = 'jpg';

cloudinary.config({
  cloud_name: 'dviwcrzx9',
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

module.exports = {
  uploadImage,
  pathToUrl,
};

function uploadImage(path) {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      path,
      {
        folder: config.cloudinary.folder,
        format,
        resource_type: 'image',
        use_filename: true,
        unique_filename: true,
        transformation: {
          width: 1024,
          height: 576,
          crop: 'fit',
          quality: 90,
        },
      },
      (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(getImagePath(response));
        }
      }
    );
  });
}

function getImagePath(response) {
  return `v${response.version}/${response.public_id}.${format}`;
}

function pathToUrl(path) {
  return `${config.cloudinary.imagesUrlPrefix}${path}`;
}
