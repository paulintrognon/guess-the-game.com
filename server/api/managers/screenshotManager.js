const db = require('../../db/db');

module.exports = {
  create,
};

function create(screenshotToCreate, user) {
  return db.Screenshot.create(screenshotToCreate).then(screenshot =>
    user.addScreenshot(screenshot).return(screenshot)
  );
}
