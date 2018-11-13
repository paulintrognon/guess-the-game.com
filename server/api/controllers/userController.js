const userManager = require('../managers/userManager');

module.exports = {
  getScores,
  getUser,
};

async function getScores() {
  return userManager.getScores();
}

async function getUser(req) {
  console.log(req.user);
  const { username } = req.user;
  return userManager.get(username);
}
