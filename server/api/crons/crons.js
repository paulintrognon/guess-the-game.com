const { CronJob } = require('cron');
const logger = require('../../logger');
const emailNewScreenshotUpdates = require('./emailNewScreenshotUpdates');

module.exports = {
  startCrons,
};

function startCrons() {
  logger.info('Starting the cron jobs...');

  /**
   * Email new screenshot updates
   */
  // Asap
  schedule('New Screenshots Asap update', '0 */12 * * * *', () => {
    emailNewScreenshotUpdates('asap');
  });
  // Daily
  schedule('New Screenshots Daily update', '0 0 8 * * *', () => {
    emailNewScreenshotUpdates('daily');
  });
  // Weekly
  schedule('New Screenshots Weekly update', '0 0 8 * * Sat', () => {
    emailNewScreenshotUpdates('weekly');
  });
}

function schedule(name, when, callback) {
  return new CronJob(
    when,
    () => {
      logger.info(`Start cron '${name}' (scheduled on ${when})`);
      callback();
    },
    null,
    true,
    'Europe/Paris'
  );
}
