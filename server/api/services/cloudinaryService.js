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
          resolve({
            path: getImagePath(response),
            cloudId: response.public_id,
            version: response.version,
          });
        }
      }
    );
  });
}

function getImagePath(response) {
  return `v${response.version}/${response.public_id}.${format}`;
}

function pathToUrl(path, options) {
  const params = ['fl_progressive'];
  if (options && options.thumb) {
    params.push('w_320');
  }
  return `${config.cloudinary.imagesUrlPrefix}/${params.join(',')}/${path}`;
}
