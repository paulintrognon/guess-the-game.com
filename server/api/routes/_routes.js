module.exports = addRoutes;

const apiRoutes = require('./api');
const userRoutes = require('./userRoutes');

function addRoutes(app) {
  app.use('/', apiRoutes);

  app.use('/user', userRoutes);
}
