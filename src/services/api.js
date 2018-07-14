import axios from 'axios';
import config from 'config'; // eslint-disable-line import/no-extraneous-dependencies

export default axios.create({
  baseURL: `${config.apiUrl}`,
});
