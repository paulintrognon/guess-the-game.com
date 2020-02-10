const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const logger = require('../logger');
const config = require('../../config/server.json').database;

const db = {};

const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  port: config.port,
  logging: str => logger.debug(str),

  dialect: 'mysql',
  dialectOptions:
    config.dialectOptions === undefined
      ? {
          socketPath: '/var/run/mysqld/mysqld.sock',
        }
      : config.dialectOptions,

  define: {
    paranoid: true,
  },

  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});

fs.readdirSync(`${__dirname}/models`).forEach(file => {
  const modelPath = path.join(`${__dirname}/models`, file);
  const model = sequelize.import(modelPath);

  if (!model) {
    logger.error(
      `No model found in ${file}. Did you forget the return statement?`
    );
    throw new Error(`No model found at ${modelPath}`);
  }

  db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
