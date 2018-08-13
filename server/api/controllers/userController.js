const userManager = require('../managers/userManager');

module.exports = {
  getScores,
};

async function getScores() {
  return userManager.getScores();
}
