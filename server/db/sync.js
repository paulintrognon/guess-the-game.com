const db = require('./db');

db.sequelize.sync().then(() => {
  db.sequelize.close();
});
