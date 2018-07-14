import api from './api';

export default {
  uploadImage,
};

function uploadImage(file) {
  const data = new FormData();
  data.append('file', file);
  data.append('filename', file.name);

  return api
    .post('/screenshot/upload-image', data)
    .then(res => res.data.result);
}
