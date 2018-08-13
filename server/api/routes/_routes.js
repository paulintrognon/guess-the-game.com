module.exports = addRoutes;

const apiRoutes = require('./api');
const userRoutes = require('./userRoutes');
const loginRoutes = require('./loginRoutes');
const screenshotRoutes = require('./screenshotRoutes');

function addRoutes(app) {
  app.use('/', apiRoutes);

  app.use('/user', userRoutes);
  app.use('/user', loginRoutes);
  app.use('/screenshot', screenshotRoutes);
}
