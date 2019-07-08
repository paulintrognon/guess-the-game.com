const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/get', (req, res, next) => next(userController.getUser(req)));

router.post('/update', (req, res, next) =>
  next(userController.updateUser(req))
);

router.post('/unsubscribe-from-email-updates', (req, res, next) =>
  next(userController.unsubscribeFromEmailUpdates(req))
);

module.exports = router;
