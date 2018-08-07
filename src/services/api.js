import axios from 'axios';
import config from 'config'; // eslint-disable-line import/no-extraneous-dependencies
import store from '../store';

const api = axios.create({
  baseURL: `${config.apiUrl}`,
});

export default {
  get,
  post,
  native: api,
};

function get(url) {
  return api.get(url).then(res => res.data.result, err => err.response.data);
}

function post(url, data, conf) {
  const dataWithJwt = addJwt(data);
  return api
    .post(url, dataWithJwt, conf)
    .then(res => res.data.result, err => err.response.data);
}

function addJwt(data) {
  if (data instanceof FormData) {
    return data;
  }
  const state = store.getState();
  console.log(state.user);
  return {
    jwt: state.user && state.user.jwt,
    ...data,
  };
}
