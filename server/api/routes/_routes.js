module.exports = addRoutes;

const apiRoutes = require('./api');
const userRoutes = require('./userRoutes');
const screenshotRoutes = require('./screenshotRoutes');

function addRoutes(app) {
  app.use('/', apiRoutes);

  app.use('/user', userRoutes);
  app.use('/screenshot', screenshotRoutes);
}
