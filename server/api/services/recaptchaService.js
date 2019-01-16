const axios = require('axios');
const { secret } = require('../../../config/server').recaptcha;

module.exports = {
  verifyToken,
};

async function verifyToken(token) {
  const res = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?response=${token}&secret=${secret}`,
    {},
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
    }
  );
  return res.data.success;
}
