const db = require('./db');

db.Sequelize.sync().then(() => {
  db.Sequelize.close();
});
