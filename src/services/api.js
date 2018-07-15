import axios from 'axios';
import config from 'config'; // eslint-disable-line import/no-extraneous-dependencies

const api = axios.create({
  baseURL: `${config.apiUrl}`,
});

export default {
  get,
  post,
};

function get(url) {
  return api.get(url).then(res => res.data.result, err => err.response.data);
}

function post(url, data) {
  return api
    .post(url, data)
    .then(res => res.data.result, err => err.response.data);
}
