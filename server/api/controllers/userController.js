const _ = require('lodash');
const userManager = require('../managers/userManager');

module.exports = {
  getUser,
  updateUser,
};

async function getUser(req) {
  const { username } = req.user;
  const user = await userManager.get(username);
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    nbSolvedScreenshots: user.solvedScreenshots,
    nbAddedScreenshots: user.addedScreenshots,
    emailUpdates: user.emailUpdates,
  };
}

async function updateUser(req) {
  const { id } = req.user;
  const values = {};

  if (req.body.values.emailUpdates) {
    const emailUpdatesValues = ['never', 'weekly', 'daily', 'asap'];
    if (emailUpdatesValues.indexOf(req.body.values.emailUpdates) === -1) {
      throw new Error(
        `emailUpdates must be one of ${emailUpdatesValues.join(', ')}`
      );
    } else {
      values.emailUpdates = req.body.values.emailUpdates;
    }
  }

  if (_.isEmpty(values)) {
    throw new Error('nothing to update');
  }

  await userManager.update(id, values);
  return {
    ok: true,
  };
}
