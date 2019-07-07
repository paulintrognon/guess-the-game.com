module.exports = addRoutes;

const apiRoutes = require('./api');
const userRoutes = require('./userRoutes');
const userScreenshotRoutes = require('./userScreenshotRoutes');
const loginRoutes = require('./loginRoutes');
const screenshotRoutes = require('./screenshotRoutes');
const moderationRoutes = require('./moderationRoutes');

function addRoutes(app) {
  app.use('/api', apiRoutes);

  app.use('/api/user', loginRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/user', userScreenshotRoutes);
  app.use('/api/screenshot', screenshotRoutes);
  app.use('/api/moderation', moderationRoutes);
}
