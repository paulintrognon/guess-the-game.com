module.exports = addRoutes;

const apiRoutes = require('./api');
const userRoutes = require('./userRoutes');
const loginRoutes = require('./loginRoutes');
const screenshotRoutes = require('./screenshotRoutes');

function addRoutes(app) {
  app.use('/api', apiRoutes);

  app.use('/api/user', userRoutes);
  app.use('/api/user', loginRoutes);
  app.use('/api/screenshot', screenshotRoutes);
}
