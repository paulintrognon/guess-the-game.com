import api from './api';

export default {
  uploadImage,
  addScreenshot,
};

function uploadImage(file) {
  const data = new FormData();
  data.append('file', file);
  data.append('filename', file.name);

  return api.post('/screenshot/upload-image', data);
}

function addScreenshot(data) {
  return api.post('/screenshot/add-screenshot', data);
}
