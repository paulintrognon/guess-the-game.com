const express = require('express');
const appPackage = require('../../../package.json');

const router = express.Router();

router.get('/', (req, res, next) =>
  next({
    name: appPackage.name,
    version: appPackage.version,
  })
);

module.exports = router;
