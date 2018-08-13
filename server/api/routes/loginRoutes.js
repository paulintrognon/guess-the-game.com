const express = require('express');
const loginController = require('../controllers/loginController');

const router = express.Router();

router.post('/check-username-availability', (req, res, next) =>
  next(loginController.checkUsernameAvailability(req))
);

router.get('/pre-log', (req, res, next) => next(loginController.preLog(req)));

router.post('/login', (req, res, next) => next(loginController.login(req)));

router.post('/register', (req, res, next) =>
  next(loginController.register(req))
);

router.post('/request-password', (req, res, next) =>
  next(loginController.requestNewPassword(req))
);

router.post('/new-password', (req, res, next) =>
  next(loginController.changePassword(req))
);

module.exports = router;
