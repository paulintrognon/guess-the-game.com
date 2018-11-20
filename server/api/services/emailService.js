const bluebird = require('bluebird');
const mailgun = require('mailgun.js');
const config = require('../../../config/server').mailgun;

const { host } = config;
const client = mailgun.client({
  url: config.url,
  key: config.key,
  username: 'api',
});

const newPasswordEmail = require('../emails/newPassword');

module.exports = {
  sendRequestNewPasswordEmail,
};

async function sendRequestNewPasswordEmail({ email, username, link }) {
  const data = newPasswordEmail({ username, link });
  return sendEmail({
    to: email,
    ...data,
  });
}

async function sendEmail({ to, subject, text, html }) {
  return client.messages
    .create(host, {
      from: 'Guess The Game <no-reply@mg.guess-the-game.com>',
      to,
      subject,
      text,
      html,
    })
    .catch(() =>
      bluebird.reject({
        code: 'EMAIL_ERROR',
        message: 'Cannot send the email',
      })
    );
}
