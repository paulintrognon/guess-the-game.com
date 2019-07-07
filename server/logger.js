const winston = require('winston');
const config = require('../config/server').logger;

const { combine, timestamp, json } = winston.format;

const transports = [];

if (config.console) {
  const transport = new winston.transports.Console({
    level: config.console.level,
    timestamp: true,
  });
  transports.push(transport);
}

if (config.file) {
  const transport = new winston.transports.File({
    filename: config.file.filename,
    level: config.file.level,
    timestamp: true,
  });
  transports.push(transport);
}

const logger = winston.createLogger({
  transports,
  format: combine(timestamp(), json()),
});

module.exports = logger;
