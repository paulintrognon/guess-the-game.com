const cloudinary = require('cloudinary');
const config = require('../../../config/server.json');

cloudinary.config({
  cloud_name: 'dviwcrzx9',
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

module.exports = {
  uploadImage,
};

function uploadImage(path) {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      path,
      {
        resource_type: 'image',
        use_filename: true,
        unique_filename: true,
        format: 'jpg',
        transformation: {
          width: 1024,
          height: 576,
          crop: 'fit',
          quality: 70,
        },
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}
