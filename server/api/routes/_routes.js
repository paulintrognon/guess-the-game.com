module.exports = addRoutes;

const apiRoutes = require('./api');

function addRoutes(app) {
  // API ROUTES
  app.use('/', apiRoutes);
}
